#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
AGENTS=(b8xrebal b8xgrid b8xyield)

echo "Checking BNB managed-platform login."
if ! bag platform whoami >/dev/null 2>&1; then
  echo "Not logged in. Run: bag platform login" >&2
  echo "Then re-run this script after completing the device-code flow." >&2
  exit 1
fi

for agent in "${AGENTS[@]}"; do
  echo "== $agent: deploy to BNB managed platform =="
  (cd "$ROOT/agents/$agent" && bag deploy --provider bnb --backend aws --yes --accept-risk)
  echo "== $agent: verify runtime =="
  (cd "$ROOT/agents/$agent" && bag deploy verify --provider bnb --skip-register)
  echo "== $agent: ERC-8004 record =="
  (cd "$ROOT/agents/$agent/app/agent" && bag erc8004 show || true)
done

cat <<'MSG'
== b8xhealth ==
The BNB managed trial account currently accepts only three active agents.
b8xhealth is served by the Vercel fallback endpoint:
https://b8xmarket-repo.vercel.app/api/agents/b8xhealth

Retry full ERC-8004 reconciliation later with:
  bag deploy verify --provider bnb
MSG
