#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT="$ROOT/docs/LIVE_AGENT_EVIDENCE.md"
AGENTS=(b8xrebal b8xgrid b8xyield b8xhealth)

endpoint_for() {
  case "$1" in
    b8xrebal) echo "https://b8xmarket-repo.vercel.app/api/agents/b8xrebal/.well-known/agent-card.json" ;;
    b8xgrid) echo "https://b8xmarket-repo.vercel.app/api/agents/b8xgrid/.well-known/agent-card.json" ;;
    b8xyield) echo "https://b8xmarket-repo.vercel.app/api/agents/b8xyield/.well-known/agent-card.json" ;;
    b8xhealth) echo "https://b8xmarket-repo.vercel.app/api/agents/b8xhealth/.well-known/agent-card.json" ;;
  esac
}

runtime_for() {
  case "$1" in
    b8xrebal|b8xgrid|b8xyield) echo "Vercel public A2A + BNB managed proof" ;;
    b8xhealth) echo "Vercel public A2A" ;;
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
  echo "## ERC-8004 Endpoint Updates"
  echo
  echo "| Agent | Transaction | Registered endpoint |"
  echo "| --- | --- | --- |"
  echo "| \`b8xrebal\` | \`0x65ad13c43ade32b50cca58dfb147b9b3fd7d7739e0649669151ec0fd13f9c7b8\` | \`https://b8xmarket-repo.vercel.app/api/agents/b8xrebal/.well-known/agent-card.json\` |"
  echo "| \`b8xgrid\` | \`0x2ba3737d23ced9b4ec073067fb6931585d755798c1d637fe322b1e4c3771ab98\` | \`https://b8xmarket-repo.vercel.app/api/agents/b8xgrid/.well-known/agent-card.json\` |"
  echo "| \`b8xyield\` | \`0x844b8f87261e265ae001152cfe3c6b5bf732e90cc5c5d9a1481bed7865bd6e37\` | \`https://b8xmarket-repo.vercel.app/api/agents/b8xyield/.well-known/agent-card.json\` |"
  echo
  echo "The public ERC-8004 endpoints are Vercel-hosted so the submission does not depend on the 48-hour BNB managed trial window. The BNB managed trial proof for the first three agents expires at \`2026-09-06T04:25:17Z\`."
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
      bag wallet balance --network bsc-testnet 2>/dev/null || true
      bag erc8004 show 2>/dev/null || true
    )
    echo '```'
    echo
  done
  echo "## Managed Platform Note"
  echo
  echo '- `b8xrebal`, `b8xgrid` and `b8xyield` were deployed to the BNB Agent Studio managed trial and reconciled with `bag deploy verify --provider bnb`.'
  echo "- The managed trial account rejected the fourth active runtime with \`Agent quota reached (max 3)\`, so all four ERC-8004 service endpoints are kept on durable Vercel public A2A routes."
  echo "- No private wallet key is stored in Vercel. The public routes run in zero-price quote mode; signer-backed seller delivery should move to permanent BNB managed or owned AWS hosting before charging users."
} > "$OUT"

echo "Wrote $OUT"
