#!/usr/bin/env bash
set -euo pipefail

echo "==> Lint"
pnpm lint

echo "==> Typecheck"
pnpm -s tsc -p tsconfig.json --noEmit

echo "==> Build"
pnpm build

echo "✅ All gates passed"
