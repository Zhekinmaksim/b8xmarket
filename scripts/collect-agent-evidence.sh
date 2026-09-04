#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT="$ROOT/docs/LIVE_AGENT_EVIDENCE.md"
AGENTS=(b8xrebal b8xgrid b8xyield b8xhealth)

endpoint_for() {
  case "$1" in
    b8xrebal) echo "https://bnbagent-api.bnbchain.world/v1/rt/01M1NAJVWYHJ8KK6XR11GA3F8P/.well-known/agent-card.json" ;;
    b8xgrid) echo "https://bnbagent-api.bnbchain.world/v1/rt/01M1NARJST7D5E5H3DS5N41RRT/.well-known/agent-card.json" ;;
    b8xyield) echo "https://bnbagent-api.bnbchain.world/v1/rt/01M1NAT4RE4N6ZJK862PJ0GJTM/.well-known/agent-card.json" ;;
    b8xhealth) echo "https://b8xmarket-repo.vercel.app/api/agents/b8xhealth" ;;
  esac
}

runtime_for() {
  case "$1" in
    b8xrebal|b8xgrid|b8xyield) echo "BNB Agent Studio managed trial" ;;
    b8xhealth) echo "Vercel API fallback" ;;
  esac
}

category_for() {
  case "$1" in
    b8xrebal) echo "Rebalancing" ;;
    b8xgrid) echo "Grid trading" ;;
    b8xyield) echo "Yield optimisation" ;;
    b8xhealth) echo "Health factor monitoring" ;;
  esac
}

{
  echo "# Live Agent Evidence"
  echo
  echo "Generated: $(date -u '+%Y-%m-%d %H:%M:%S UTC')"
  echo
  echo "This file records public wallet, endpoint and reconciliation evidence only. Secrets are excluded."
  echo
  echo "## Funding"
  echo
  echo "| Transfer | Transaction |"
  echo "| --- | --- |"
  echo "| \`b8xrebal -> b8xyield\`, \`0.05 tBNB\` | \`0xf4d6cc63937e8a74903a0dacb2d78155266da203e727bcdb347b963928242853\` |"
  echo "| \`b8xgrid -> b8xhealth\`, \`0.05 tBNB\` | \`0xd881750be5331f7c5376a5e4d9017b563ed54905bf0fdc0760dc16a91abaa23a\` |"
  echo
  echo "The BNB managed trial expires at \`2026-09-06T04:25:17Z\`."
  echo
  echo "## Live Endpoints"
  echo
  echo "| Category | Agent | Runtime | Endpoint |"
  echo "| --- | --- | --- | --- |"
  for agent in "${AGENTS[@]}"; do
    echo "| $(category_for "$agent") | \`$agent\` | $(runtime_for "$agent") | \`$(endpoint_for "$agent")\` |"
  done
  echo
  echo "## Wallet And Registry Checks"
  echo
  for agent in "${AGENTS[@]}"; do
    echo "### $agent"
    echo
    echo '```txt'
    (
      cd "$ROOT/agents/$agent/app/agent"
      bag wallet show | sed -n 's/^address:[[:space:]]*/address: /p' || true
      bag wallet balance --network bsc-testnet || true
      bag erc8004 show || true
    )
    echo '```'
    echo
  done
  echo "## Known Current Blockers"
  echo
  echo "- BNB managed trial rejected the fourth active runtime with \`Agent quota reached (max 3)\`; \`b8xhealth\` uses the Vercel fallback endpoint."
  echo "- Managed-project ERC-8004 reconciliation must run through \`bag deploy verify --provider bnb\`; direct self-paid \`bag erc8004 register\` is blocked by the CLI for \`destination = \"platform\"\` projects."
  echo "- The latest full verify attempt failed at the external scanner step: \`8004scan API request failed: 500\`."
} > "$OUT"

echo "Wrote $OUT"
