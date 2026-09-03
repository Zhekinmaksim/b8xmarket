#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT="$ROOT/docs/LIVE_AGENT_EVIDENCE.md"
AGENTS=(b8xrebal b8xgrid b8xyield b8xhealth)

{
  echo "# Live Agent Evidence"
  echo
  echo "Generated: $(date -u '+%Y-%m-%d %H:%M:%S UTC')"
  echo
  echo "Paste the final public endpoints, wallet addresses, registration records and transaction links here before submission."
  echo
  for agent in "${AGENTS[@]}"; do
    echo "## $agent"
    echo
    echo '```txt'
    (
      cd "$ROOT/agents/$agent/app/agent"
      bag wallet show | sed -n 's/^address:[[:space:]]*/address: /p' || true
      bag wallet balance || true
      bag erc8004 show || true
    )
    echo '```'
    echo
  done
} > "$OUT"

echo "Wrote $OUT"
