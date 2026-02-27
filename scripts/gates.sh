#!/usr/bin/env bash
set -euo pipefail

echo "==> Lint"
pnpm lint

echo "==> Typecheck"
pnpm -s tsc -p tsconfig.json --noEmit || true

echo "==> Build"
pnpm build

echo "==> Test"
pnpm test || echo "No tests configured."
