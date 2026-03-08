#!/usr/bin/env bash
set -euo pipefail

TICKET_KEY="${1:-}"
BASE_BRANCH="${BASE_BRANCH:-dev}"

if [[ -z "$TICKET_KEY" ]]; then
  echo "Usage: $0 <JIRA_TICKET_KEY>"
  exit 1
fi

require_cmd() {
  command -v "$1" >/dev/null 2>&1 || {
    echo "Missing required command: $1"
    exit 1
  }
}

require_cmd git
require_cmd gh
require_cmd jq
require_cmd pnpm
require_cmd curl
require_cmd opencode

: "${JIRA_BASE_URL:?Missing JIRA_BASE_URL}"
: "${JIRA_EMAIL:?Missing JIRA_EMAIL}"
: "${JIRA_API_TOKEN:?Missing JIRA_API_TOKEN}"

SUMMARY="$(curl -sS \
  -u "$JIRA_EMAIL:$JIRA_API_TOKEN" \
  -H "Accept: application/json" \
  "$JIRA_BASE_URL/rest/api/3/issue/${TICKET_KEY}?fields=summary" \
  | jq -r '.fields.summary // ""')"

if [[ -z "${SUMMARY:-}" || "$SUMMARY" == "null" ]]; then
  echo "Failed to extract Jira summary for $TICKET_KEY"
  exit 1
fi

echo "==> Scope check"
./scripts/agent_scope_check.sh "origin/$BASE_BRANCH"

echo "==> Local gates"
./scripts/gates.sh

echo "==> Staging scoped files"
git add features/records/clients/

if git diff --cached --quiet; then
  echo "❌ No staged changes found."
  exit 1
fi

CURRENT_BRANCH="$(git branch --show-current)"

echo "==> Commit"
git commit -m "$TICKET_KEY: implement $SUMMARY"

echo "==> Push"
git push -u origin "$CURRENT_BRANCH"

echo "==> Create or reuse draft PR"
set +e
PR_URL="$(gh pr view --json url -q '.url' 2>/dev/null)"
VIEW_RC=$?
set -e

if [[ $VIEW_RC -ne 0 || -z "${PR_URL:-}" ]]; then
  PR_BODY_FILE="$(mktemp)"
  cat > "$PR_BODY_FILE" <<PRBODY
## Summary
Implemented ticket $TICKET_KEY

## Jira
- $TICKET_KEY

## Local validation
- lint ✅
- typecheck ✅
- build ✅
- scope check ✅
PRBODY

  PR_URL="$(gh pr create \
    --base "$BASE_BRANCH" \
    --head "$CURRENT_BRANCH" \
    --title "$TICKET_KEY: $SUMMARY" \
    --body-file "$PR_BODY_FILE" \
    --draft)"
  rm -f "$PR_BODY_FILE"
fi

echo "==> PR URL: $PR_URL"

PR_NUMBER="$(gh pr view --json number -q '.number')"

wait_for_checks() {
  local pr_number="$1"
  local max_polls="${2:-40}"
  local sleep_seconds="${3:-20}"

  for ((i=1; i<=max_polls; i++)); do
    echo "==> Checking PR #$pr_number status ($i/$max_polls)"
    OUTPUT="$(gh pr checks "$pr_number" 2>&1 || true)"
    echo "$OUTPUT"

    if echo "$OUTPUT" | grep -q "no pending checks" || echo "$OUTPUT" | grep -q "0 pending checks"; then
      if echo "$OUTPUT" | grep -q "FE PR Pipeline Check/Lint, Test and Build"; then
        if echo "$OUTPUT" | grep -q "^✓  FE PR Pipeline Check/Lint, Test and Build"; then
          if echo "$OUTPUT" | grep -q "^X  Sonarqube/Build and analyze" || echo "$OUTPUT" | grep -q "^X  CI/Quality Gates"; then
            echo "PR_NON_CODE_FAILURE"
            return 4
          fi
          echo "PR_GREEN"
          return 0
        fi
      fi

      if echo "$OUTPUT" | grep -q "^X  "; then
        echo "PR_FAILED"
        return 2
      fi
    fi

    sleep "$sleep_seconds"
  done

  echo "PR_TIMEOUT"
  return 3
}

repair_failed_checks_once() {
  local pr_number="$1"

  echo "==> Reading failed PR checks"
  OUTPUT="$(gh pr checks "$pr_number" 2>&1 || true)"
  echo "$OUTPUT"

  if echo "$OUTPUT" | grep -q "^X  Sonarqube/Build and analyze" || echo "$OUTPUT" | grep -q "^X  CI/Quality Gates"; then
    echo "Detected non-code workflow failures (Sonarqube / Quality Gates). Skipping code repair."
    return 10
  fi

  if ! echo "$OUTPUT" | grep -q "^X  "; then
    echo "No failed checks found."
    return 1
  fi

  mkdir -p .agent
  if [[ ! -f ".agent/current-ticket.md" ]]; then
    ./scripts/jira_read_issue.sh "$TICKET_KEY" > .agent/current-ticket.md
  fi

  PROMPT_FILE="$(mktemp)"
  cat > "$PROMPT_FILE" <<PROMPT
Repair CI failures for Jira ticket ${TICKET_KEY}: ${SUMMARY}

Ticket details:
$(cat .agent/current-ticket.md)

Failed PR checks:
${OUTPUT}

Instructions:
- Only fix code-related issues
- Only modify files under features/records/clients/
- Do not modify workflows, lockfiles, Docker files, env files
- Keep changes minimal and targeted to the CI failure
PROMPT

  PROMPT_TEXT="$(cat "$PROMPT_FILE")"
  rm -f "$PROMPT_FILE"

  echo "==> Running OpenCode CI repair"
  opencode run "$PROMPT_TEXT"

  echo "==> Scope check after repair"
  ./scripts/agent_scope_check.sh "origin/$BASE_BRANCH"

  echo "==> Gates after repair"
  ./scripts/gates.sh

  echo "==> Staging repair changes"
  git add features/records/clients/

  if git diff --cached --quiet; then
    echo "No staged repair changes found."
    return 1
  fi

  echo "==> Commit repair"
  git commit -m "$TICKET_KEY: repair PR CI failures"

  echo "==> Push repair"
  git push
}

echo "==> Waiting for PR to go green"
set +e
wait_for_checks "$PR_NUMBER"
WAIT_RC=$?
set -e

if [[ "$WAIT_RC" -eq 0 ]]; then
  echo "✅ PR is green"
  exit 0
fi

if [[ "$WAIT_RC" -eq 4 ]]; then
  echo "⚠️ Feature pipeline is green, but PR is blocked by non-code workflows (Sonarqube / Quality Gates)."
  exit 0
fi

if [[ "$WAIT_RC" -eq 2 ]]; then
  echo "==> PR failed, trying one code repair pass"
  set +e
  repair_failed_checks_once "$PR_NUMBER"
  REPAIR_RC=$?
  set -e

  if [[ "$REPAIR_RC" -eq 10 ]]; then
    echo "⚠️ PR failure is non-code related. No repair attempted."
    exit 0
  fi

  echo "==> Waiting again after repair"
  set +e
  wait_for_checks "$PR_NUMBER"
  WAIT_RC=$?
  set -e

  if [[ "$WAIT_RC" -eq 0 ]]; then
    echo "✅ PR is green after repair"
    exit 0
  fi

  if [[ "$WAIT_RC" -eq 4 ]]; then
    echo "⚠️ Feature pipeline is green after repair, but non-code workflows are still failing."
    exit 0
  fi

  echo "❌ PR is still not green after repair"
  exit 1
fi

echo "❌ PR checks did not complete successfully"
exit 1
