#!/usr/bin/env bash
set -euo pipefail

QUEUE_FILE="${1:-.agent/ticket-queue.json}"
STATUS_FILE=".agent/queue-status.json"

if [[ ! -f "$QUEUE_FILE" ]]; then
  echo "Queue file not found: $QUEUE_FILE"
  exit 1
fi

if ! command -v jq >/dev/null 2>&1; then
  echo "jq is required but not installed."
  exit 1
fi

mkdir -p .agent
RUN_ID="$(date +"%Y-%m-%dT%H-%M-%S")"
echo "{\"runId\":\"$RUN_ID\",\"tickets\":[]}" > "$STATUS_FILE"

mapfile -t TICKETS < <(jq -r '.[]' "$QUEUE_FILE")

for TICKET in "${TICKETS[@]}"; do
  echo "Processing $TICKET ..."
  TMP_FILE="$(mktemp)"
  jq --arg key "$TICKET" '.tickets += [{"key":$key,"status":"in_progress"}]' "$STATUS_FILE" > "$TMP_FILE" && mv "$TMP_FILE" "$STATUS_FILE"

  set +e
  OUTPUT="$(./scripts/agent_execute_ticket.sh "$TICKET" 2>&1)"
  RC=$?
  set -e

  echo "$OUTPUT"

  BRANCH="$(printf '%s\n' "$OUTPUT" | awk -F': ' '/^Branch: /{print $2}' | tail -n1)"
  PR_URL="$(printf '%s\n' "$OUTPUT" | awk -F': ' '/^PR: /{print $2}' | tail -n1)"

  if [[ $RC -eq 0 ]]; then
    TMP_FILE="$(mktemp)"
    jq --arg key "$TICKET" --arg branch "$BRANCH" --arg pr "$PR_URL" '
      .tickets |= map(
        if .key == $key
        then . + {"status":"completed","branch":$branch,"pr":$pr}
        else .
        end
      )
    ' "$STATUS_FILE" > "$TMP_FILE" && mv "$TMP_FILE" "$STATUS_FILE"
    echo "$TICKET completed"
  else
    TMP_FILE="$(mktemp)"
    jq --arg key "$TICKET" --arg branch "$BRANCH" --arg reason "$OUTPUT" '
      .tickets |= map(
        if .key == $key
        then . + {"status":"failed","branch":$branch,"reason":$reason}
        else .
        end
      )
    ' "$STATUS_FILE" > "$TMP_FILE" && mv "$TMP_FILE" "$STATUS_FILE"
    echo "$TICKET failed"
    exit 1
  fi
done

echo "Queue execution finished."
