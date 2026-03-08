#!/usr/bin/env bash
set -euo pipefail

PR_NUMBER="${1:-}"
MAX_POLLS="${MAX_POLLS:-40}"
SLEEP_SECONDS="${SLEEP_SECONDS:-20}"

if [[ -z "$PR_NUMBER" ]]; then
  echo "Usage: $0 <PR_NUMBER>"
  exit 1
fi

for ((i=1; i<=MAX_POLLS; i++)); do
  echo "==> Checking PR #$PR_NUMBER status (attempt $i/$MAX_POLLS)"

  STATUS_JSON="$(gh pr checks "$PR_NUMBER" --json name,state,link 2>/dev/null || echo '[]')"

  if [[ "$STATUS_JSON" == "[]" ]]; then
    echo "No PR checks found yet. Waiting..."
    sleep "$SLEEP_SECONDS"
    continue
  fi

  echo "$STATUS_JSON" | jq .

  FAILED_COUNT="$(echo "$STATUS_JSON" | jq '[.[] | select(.state == "FAILURE" or .state == "ERROR" or .state == "CANCELLED")] | length')"
  PENDING_COUNT="$(echo "$STATUS_JSON" | jq '[.[] | select(.state == "PENDING" or .state == "QUEUED" or .state == "IN_PROGRESS" or .state == "STARTUP_FAILURE")] | length')"
  SUCCESS_COUNT="$(echo "$STATUS_JSON" | jq '[.[] | select(.state == "SUCCESS")] | length')"

  if [[ "$FAILED_COUNT" -gt 0 ]]; then
    echo "PR_FAILED"
    exit 2
  fi

  if [[ "$PENDING_COUNT" -eq 0 && "$SUCCESS_COUNT" -gt 0 ]]; then
    echo "PR_GREEN"
    exit 0
  fi

  sleep "$SLEEP_SECONDS"
done

echo "PR_TIMEOUT"
exit 3
