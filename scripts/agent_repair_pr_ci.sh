#!/usr/bin/env bash
set -euo pipefail

TICKET_KEY="${1:-}"
PR_NUMBER="${2:-}"
BASE_BRANCH="${BASE_BRANCH:-dev}"
ISSUE_FILE=".agent/current-ticket.md"

if [[ -z "$TICKET_KEY" || -z "$PR_NUMBER" ]]; then
  echo "Usage: $0 <TICKET_KEY> <PR_NUMBER>"
  exit 1
fi

echo "==> Reading failing PR checks for PR #$PR_NUMBER"
CHECKS_JSON="$(gh pr checks "$PR_NUMBER" --json name,state,link 2>/dev/null || echo '[]')"

FAILED_CHECKS="$(echo "$CHECKS_JSON" | jq -r '.[] | select(.state == "FAILURE" or .state == "ERROR" or .state == "CANCELLED") | "\(.name) | \(.link)"')"

if [[ -z "$FAILED_CHECKS" ]]; then
  echo "No failed checks found."
  exit 0
fi

echo "==> Failed checks"
echo "$FAILED_CHECKS"

SUMMARY="$(curl -sS \
  -u "$JIRA_EMAIL:$JIRA_API_TOKEN" \
  -H "Accept: application/json" \
  "$JIRA_BASE_URL/rest/api/3/issue/${TICKET_KEY}?fields=summary" \
  | jq -r '.fields.summary // ""')"

PROMPT_FILE="$(mktemp)"
cat > "$PROMPT_FILE" <<PROMPT
Repair CI failures for Jira ticket ${TICKET_KEY}: ${SUMMARY}

Ticket details:
${ISSUE_FILE}

Failed PR checks:
${FAILED_CHECKS}

Instructions:
- Only fix code-related issues
- Only modify files under features/records/clients/
- Do not modify workflows, lockfiles, Docker files, env files
- Reuse existing implementation patterns
- Keep changes minimal and targeted to the CI failure
PROMPT

echo "==> Running OpenCode CI repair"
PROMPT_TEXT="$(cat "$PROMPT_FILE")"
opencode run "$PROMPT_TEXT"
rm -f "$PROMPT_FILE"

echo "==> Scope check after CI repair"
./scripts/agent_scope_check.sh "origin/$BASE_BRANCH"

echo "==> Gates after CI repair"
./scripts/gates.sh

echo "==> Staging CI repair changes"
git add features/records/clients/

if git diff --cached --quiet; then
  echo "No staged repair changes found."
  exit 1
fi

echo "==> Commit CI repair"
git commit -m "$TICKET_KEY: repair PR CI failures"

echo "==> Push CI repair"
git push

echo "CI_REPAIR_PUSHED"
