#!/usr/bin/env bash
set -euo pipefail

ISSUE_KEY="${1:-}"
COMMENT_FILE="${2:-}"

if [[ -z "$ISSUE_KEY" || -z "$COMMENT_FILE" ]]; then
  echo "Usage: $0 <ISSUE_KEY> <COMMENT_FILE>"
  exit 1
fi

: "${JIRA_BASE_URL:?Missing JIRA_BASE_URL}"
: "${JIRA_EMAIL:?Missing JIRA_EMAIL}"
: "${JIRA_API_TOKEN:?Missing JIRA_API_TOKEN}"

COMMENT_BODY="$(cat "$COMMENT_FILE" | jq -Rs .)"

curl -sS \
  -u "$JIRA_EMAIL:$JIRA_API_TOKEN" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -X POST \
  "$JIRA_BASE_URL/rest/api/3/issue/${ISSUE_KEY}/comment" \
  --data "{
    \"body\": {
      \"type\": \"doc\",
      \"version\": 1,
      \"content\": [
        {
          \"type\": \"paragraph\",
          \"content\": [
            {
              \"type\": \"text\",
              \"text\": $(cat "$COMMENT_FILE" | python3 -c 'import json,sys; print(json.dumps(sys.stdin.read()))')
            }
          ]
        }
      ]
    }
  }" >/dev/null

echo "Jira comment posted on $ISSUE_KEY"
