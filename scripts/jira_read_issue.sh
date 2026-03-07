#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "Usage: $0 <ISSUE_KEY>   (e.g., SCRUM-5)"
  exit 1
fi

: "${JIRA_BASE_URL:?Missing JIRA_BASE_URL}"
: "${JIRA_EMAIL:?Missing JIRA_EMAIL}"
: "${JIRA_API_TOKEN:?Missing JIRA_API_TOKEN}"

ISSUE_KEY="$1"

json=$(curl -sS \
  -u "$JIRA_EMAIL:$JIRA_API_TOKEN" \
  -H "Accept: application/json" \
  "$JIRA_BASE_URL/rest/api/3/issue/${ISSUE_KEY}?fields=summary,description,status,issuetype,priority" )

summary=$(echo "$json" | jq -r '.fields.summary // ""')
type=$(echo "$json" | jq -r '.fields.issuetype.name // ""')
status=$(echo "$json" | jq -r '.fields.status.name // ""')
priority=$(echo "$json" | jq -r '.fields.priority.name // ""')

# Best-effort ADF -> plain text
desc=$(echo "$json" | jq -r '
  def walktext:
    if type=="object" and has("text") then .text
    elif type=="object" and has("content") then (.content | map(walktext) | join(""))
    elif type=="array" then (map(walktext) | join("\n"))
    else "" end;
  (.fields.description // {} ) | walktext
' | sed '/^[[:space:]]*$/d')

cat <<EOF
## ${ISSUE_KEY}
Type: ${type}
Status: ${status}
Priority: ${priority}

### Summary
${summary}

### Description
${desc}
EOF
