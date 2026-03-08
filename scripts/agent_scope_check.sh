#!/usr/bin/env bash
set -euo pipefail

BASE_REF="${1:-origin/dev}"
ALLOWED_PREFIX="features/records/clients/"
FORBIDDEN_REGEX='(^pnpm-lock\.yaml$|^package-lock\.json$|^yarn\.lock$|^\.github/workflows/|^docker/|^Dockerfile$|^\.env)'

collect_changed_files() {
  {
    git diff --name-only "$BASE_REF...HEAD" || true
    git diff --name-only || true
    git diff --cached --name-only || true
  } | sed '/^[[:space:]]*$/d' | sort -u
}

changed="$(collect_changed_files)"

if [[ -z "${changed}" ]]; then
  echo "No changes detected."
  exit 0
fi

echo "Changed files:"
echo "${changed}"

if echo "${changed}" | grep -E "${FORBIDDEN_REGEX}" -q; then
  echo "❌ Forbidden file/path changed."
  exit 1
fi

bad="$(echo "${changed}" | awk -v pfx="${ALLOWED_PREFIX}" 'index($0,pfx)!=1 {print $0}')"
if [[ -n "${bad}" ]]; then
  echo "❌ Out-of-scope changes detected. Allowed only under ${ALLOWED_PREFIX}:"
  echo "${bad}"
  exit 1
fi

echo "✅ Scope check passed."
