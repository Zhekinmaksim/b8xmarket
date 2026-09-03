#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
AGENTS=(b8xrebal b8xgrid b8xyield b8xhealth)

for agent in "${AGENTS[@]}"; do
  echo "== $agent: doctor =="
  (cd "$ROOT/agents/$agent" && bag doctor)
done
