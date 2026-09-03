#!/usr/bin/env bash
set -euo pipefail
set +x

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="${1:-"$ROOT/.env.local"}"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Missing env file: $ENV_FILE" >&2
  echo "Copy .env.example to .env.local and fill burner wallet keys locally." >&2
  exit 1
fi

chmod 600 "$ENV_FILE" 2>/dev/null || true
set -a
# shellcheck disable=SC1090
source "$ENV_FILE"
set +a

if [[ -z "${WALLET_PASSWORD:-}" ]]; then
  echo "WALLET_PASSWORD is required in $ENV_FILE so bag can encrypt imported keys." >&2
  exit 1
fi

import_wallet() {
  local agent="$1"
  local var_name="$2"
  local private_key="${!var_name:-}"

  if [[ -z "$private_key" ]]; then
    echo "skip $agent: $var_name is empty"
    return
  fi

  if [[ ! "$private_key" =~ ^0x[0-9a-fA-F]{64}$ && ! "$private_key" =~ ^[0-9a-fA-F]{64}$ ]]; then
    echo "invalid key format for $agent ($var_name)" >&2
    exit 1
  fi

  echo "importing burner wallet for $agent"
  printf '%s' "$private_key" | (
    cd "$ROOT/agents/$agent/app/agent"
    bag wallet new --private-key -
  )

  echo "wallet for $agent"
  (
    cd "$ROOT/agents/$agent/app/agent"
    bag wallet show
  )
}

import_wallet "b8xrebal" "B8X_REBALANCER_PRIVATE_KEY"
import_wallet "b8xgrid" "B8X_GRID_PRIVATE_KEY"
import_wallet "b8xyield" "B8X_YIELD_PRIVATE_KEY"
import_wallet "b8xhealth" "B8X_HEALTH_PRIVATE_KEY"
