#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
AGENTS=(b8xrebal b8xgrid b8xyield b8xhealth)

for agent in "${AGENTS[@]}"; do
  echo "== $agent: install =="
  (cd "$ROOT/agents/$agent" && CI=true pnpm install)
  echo "== $agent: build =="
  (cd "$ROOT/agents/$agent/app/agent" && pnpm build)
done
