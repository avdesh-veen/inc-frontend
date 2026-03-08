#!/usr/bin/env bash
set -euo pipefail

TICKET_KEY="${1:-}"
BASE_BRANCH="${BASE_BRANCH:-dev}"
ISSUE_FILE=".agent/current-ticket.md"
STATUS_DIR=".agent"
OPEN_CODE_CMD="${OPEN_CODE_CMD:-}"

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

slugify() {
  tr '[:upper:]' '[:lower:]' \
  | sed 's/[^a-z0-9]/-/g' \
  | sed 's/-\{2,\}/-/g' \
  | sed 's/^-//; s/-$//' \
  | cut -c1-50
}

cleanup_issue_file() {
  rm -f "$ISSUE_FILE"
}

trap cleanup_issue_file EXIT

require_cmd git
require_cmd jq
require_cmd gh
require_cmd pnpm
require_cmd curl

mkdir -p "$STATUS_DIR"

echo "==> Fetching Jira issue: $TICKET_KEY"
ISSUE_CONTENT="$(./scripts/jira_read_issue.sh "$TICKET_KEY")"
printf '%s\n' "$ISSUE_CONTENT" > "$ISSUE_FILE"

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

BRANCH_SLUG="$(printf '%s' "$SUMMARY" | slugify)"
BRANCH_NAME="agent/${TICKET_KEY}-${BRANCH_SLUG}"

echo "==> Preparing git state"
git fetch origin "$BASE_BRANCH"
git checkout "$BASE_BRANCH"
git pull --ff-only origin "$BASE_BRANCH"

if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "❌ Working tree is not clean. Commit, stash, or restore changes first."
  git status --short
  exit 1
fi

if git show-ref --verify --quiet "refs/heads/$BRANCH_NAME"; then
  echo "==> Switching to existing local branch: $BRANCH_NAME"
  git checkout "$BRANCH_NAME"
else
  echo "==> Creating branch: $BRANCH_NAME"
  git checkout -b "$BRANCH_NAME"
fi

PROMPT_FILE="$(mktemp)"
cat > "$PROMPT_FILE" <<PROMPT
Implement Jira ticket ${TICKET_KEY}: ${SUMMARY}

Read ticket details from:
${ISSUE_FILE}

Strict rules:
- Follow AGENT_RULES.md
- Only modify files under features/records/clients/
- Do not modify lockfiles, workflows, Docker files, env files
- Stop after implementation

Implementation expectations:
- Reuse existing client detail components/patterns where possible
- Keep changes scoped and minimal
- Use mock/static data only if required by existing screen patterns
- Do not refactor unrelated code
- After implementation, stop and return control
PROMPT

if [[ -z "$OPEN_CODE_CMD" ]]; then
  echo "❌ OPEN_CODE_CMD is not set."
  echo "Set it to the exact command you use to run OpenCode non-interactively."
  echo 'Example shape only: export OPEN_CODE_CMD='\''opencode run --model opencode/trinity-large-preview-free'\'''
  rm -f "$PROMPT_FILE"
  exit 1
fi

echo "==> Running OpenCode"
echo "Command: $OPEN_CODE_CMD"
sh -c "$OPEN_CODE_CMD < \"$PROMPT_FILE\""

rm -f "$PROMPT_FILE"

echo "==> Verifying changes exist"
if git diff --quiet && git diff --cached --quiet; then
  echo "❌ No code changes detected for $TICKET_KEY"
  exit 1
fi

echo "==> Scope check"
./scripts/agent_scope_check.sh "origin/$BASE_BRANCH"

echo "==> Local gates"
./scripts/gates.sh

echo "==> Staging scoped files"
git add features/records/clients/

if git diff --cached --quiet; then
  echo "❌ No staged changes found after git add."
  exit 1
fi

echo "==> Commit"
git commit -m "$TICKET_KEY: implement $SUMMARY"

echo "==> Push"
git push -u origin "$BRANCH_NAME"

echo "==> Create draft PR"
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
  --head "$BRANCH_NAME" \
  --title "$TICKET_KEY: $SUMMARY" \
  --body-file "$PR_BODY_FILE" \
  --draft)"

rm -f "$PR_BODY_FILE"

COMMENT_FILE="$(mktemp)"
cat > "$COMMENT_FILE" <<COMMENT
PR created for $TICKET_KEY

Branch: $BRANCH_NAME
PR: $PR_URL
Local gates: lint/typecheck/build/scope passed
COMMENT

./scripts/jira_comment_on_issue.sh "$TICKET_KEY" "$COMMENT_FILE" || true
rm -f "$COMMENT_FILE"

echo "==> Resolving PR number"
PR_NUMBER="$(gh pr view --json number -q '.number')"

echo "==> Waiting for PR checks"
set +e
./scripts/agent_wait_pr_green.sh "$PR_NUMBER"
WAIT_RC=$?
set -e

if [[ "$WAIT_RC" -eq 0 ]]; then
  echo "✅ PR is green"
elif [[ "$WAIT_RC" -eq 2 ]]; then
  echo "==> PR checks failed, attempting code repair"
  ./scripts/agent_repair_pr_ci.sh "$TICKET_KEY" "$PR_NUMBER"

  echo "==> Waiting again after repair"
  set +e
  ./scripts/agent_wait_pr_green.sh "$PR_NUMBER"
  WAIT_RC=$?
  set -e

  if [[ "$WAIT_RC" -ne 0 ]]; then
    echo "❌ PR still not green after repair attempt"
    exit 1
  fi
else
  echo "❌ PR checks did not complete successfully"
  exit 1
fi

echo "✅ Ticket execution completed for $TICKET_KEY"
echo "Branch: $BRANCH_NAME"
echo "PR: $PR_URL"
