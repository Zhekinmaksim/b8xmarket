#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
AGENTS=(b8xrebal b8xgrid b8xyield b8xhealth)

echo "Checking BNB managed-platform login."
if ! bag platform whoami >/dev/null 2>&1; then
  echo "Not logged in. Run: bag platform login" >&2
  echo "Then re-run this script after completing the device-code flow." >&2
  exit 1
fi

for agent in "${AGENTS[@]}"; do
  echo "== $agent: deploy to BNB managed platform =="
  (cd "$ROOT/agents/$agent" && bag deploy --provider bnb)
  echo "== $agent: verify deployment =="
  (cd "$ROOT/agents/$agent" && bag deploy verify --provider bnb)
  echo "== $agent: ERC-8004 record =="
  (cd "$ROOT/agents/$agent/app/agent" && bag erc8004 show || true)
done
