# Submission Checklist

Use this before sending the project to the hackathon form.

## Links

- Live site: https://b8xmarket-repo.vercel.app
- Repository: https://github.com/Zhekinmaksim/b8xmarket
- Official brief: https://www.bnbchain.org/en/hackathons/smart-money-era
- Submission form: https://forms.gle/9g9XPNFwnYaHAz9L8
- Live-agent runbook: `docs/LIVE_AGENTS_RUNBOOK.md`
- Live-agent evidence: `docs/LIVE_AGENT_EVIDENCE.md`
- Demo video: add link
- Team wallet: add address
- Agent wallets: listed in `docs/LIVE_AGENT_EVIDENCE.md`

If `b8xmarket.xyz` is connected before submission, use that as the live site.

Deadline: **9 September 2026 at UTC+0**.

Prizes listed on the official pages:

- Main track: $30,000 equivalent plus official adoption as the BNB Agent Studio marketplace.
- TermiX: $10,000 total, split $6,000 / $3,000 / $1,000.
- PancakeSwap: 1,000 CAKE.
- Altana: 50,000 Altana XP.

## Main Track Requirements

- The site is public during judging.
- Four BNB Agent Studio seller-agent workspaces exist in `agents/`.
- The user can find agents by category.
- The user can understand what each agent does.
- The user can open a record and compare agents.
- The user can see an activation or hire flow.
- Agents surfaced on the marketplace are live on BSC.
- All four required categories are represented:
  - rebalancing
  - grid trading
  - yield optimisation
  - health factor monitoring
- Each category has comparable depth.
- Data goes beyond basic counts.

## Data Evidence

The register now uses the four current live listings instead of the original demo rows:

- `b8xrebal`, `b8xgrid` and `b8xyield` are live on BNB Agent Studio managed trial.
- `b8xhealth` is a Vercel fallback endpoint because the managed trial account is capped at three active agents.
- All four wallets are registered in ERC-8004. Agent IDs are recorded in `docs/LIVE_AGENT_EVIDENCE.md`.

Attach:

- output from `scripts/collect-agent-evidence.sh`
- verifier JSON
- BSC wallet addresses
- transaction links
- source window for each performance record
- explanation of filtered agents

Do not claim live BSC records without links.

## TermiX Evidence

Attach the Agent Advantage Report.

For each of the three tasks, include:

- task brief
- agent output
- manual baseline
- time comparison
- cost comparison
- output quality score
- raw evidence

At least one task must be trading, stock or security. B8X uses grid trading and health factor protection.

## Altana Evidence

If submitting for the Altana bounty, attach:

- agent wallet
- session registration link
- call allowlist
- spend cap
- expiry
- revoke transaction
- one live transaction through a session key

The UI already shows the user-facing control model. The submission still needs explorer links.

Only mention x402/B402 if the SDK or payment rail is actually connected and the transaction evidence is included.

## PancakeSwap Evidence

If submitting for the PancakeSwap challenge, attach:

- trading or liquidity workflow
- PancakeSwap-related transaction links
- user benefit
- risk control

Good examples for B8X:

- grid trading on BNB/USDT
- rebalancing through PancakeSwap routes
- reconstructed swap fills

## Suggested Submission Text

Short description:

> B8X is a marketplace register for BNB Chain agents. It helps users compare agents by category, performance and risk, then hire them through scoped sessions instead of handing over broad authority.

Long description:

> B8X turns on-chain agent activity into a marketplace people can understand. The product covers the four required Smart Money Era categories: rebalancing, grid trading, yield optimisation and health factor monitoring. Each listing shows the record behind the agent: realised PnL, drawdown, win rate, fills, risk ratio, venue and window. Users can filter by category, open an agent record, compare the Agent Advantage Report, and review a scoped session with call allowlist, spend cap, expiry and revocation before hiring.

What to say in the demo:

1. Start with discovery: four categories, equal depth.
2. Open a record: show PnL, drawdown, risk and fills.
3. Show filtered agents: explain that weak records are not hidden.
4. Show the Agent Advantage Report: agent vs manual work.
5. Show scoped control: spend cap, expiry, allowlist, revoke.
6. End with the live evidence links.

## Final Risk Check

Do not submit with these missing:

- live URL
- public repo
- real wallet addresses
- transaction evidence for live claims
- Agent Advantage Report evidence
- working OG image

The interface is already deployable. The evidence is what turns it from a polished demo into a strong hackathon entry.
