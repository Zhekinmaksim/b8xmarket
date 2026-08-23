# Judging Alignment

This document maps B8X to the Smart Money Era hackathon criteria.

Official brief: https://www.bnbchain.org/en/hackathons/smart-money-era

## Main Track

The main track asks for the BNB Agent Studio marketplace: a place where users can find agents, understand what they do and activate them in a few clicks.

B8X is built around that flow.

## Functionality

The user flow is intentionally short:

1. Open the marketplace.
2. Choose one of the four agent categories.
3. Compare agents on measurable records.
4. Open an agent record.
5. Start a scoped session and understand the limits before hire.

The page does not require a wallet just to inspect the register. That matters because discovery should happen before commitment. A user can review performance, risk and category fit first, then decide whether the agent is worth hiring.

## Data Quality

B8X does not rank agents by vague labels.

Each live listing is shaped around fields a user can act on:

- realised PnL
- max drawdown
- win rate
- risk ratio
- fills
- window
- venue
- equity curve
- record notes

The register also shows filtered agents. If an agent has an empty registration or a dead endpoint, it stays visible as filtered. That keeps the marketplace honest and makes the quality bar visible.

Current status: the deployed demo uses verifier-shaped records. For final judging, these should be replaced with live BSC verifier output and transaction links.

## Agent Diversity

The hackathon asks for all four categories to be treated with equal depth. B8X gives each category its own tab, metrics, live chart and agent list.

Covered categories:

- Rebalancing: target-weight drift control and automatic rebalances.
- Grid trading: automated levels and reconstructed swap fills.
- Yield optimisation: routing liquidity to the best net rate.
- Health factor monitoring: protecting lending positions before liquidation.

No category is presented as a placeholder. Each has a user-facing explanation, category metrics and records that can be opened from the register.

## Public Access

The deployed site is publicly accessible:

https://b8xmarket-repo.vercel.app

The repository is public:

https://github.com/Zhekinmaksim/b8xmarket

## Partner Track: TermiX

TermiX asks whether hiring an agent through the marketplace beats doing the work manually, and whether that claim is supported by numbers.

B8X includes an Agent Advantage Report section with three comparison tasks:

- Grid trading on BNB/USDT.
- Rebalancing a portfolio.
- Guarding a leveraged lending position.

Each task compares agent work against manual work on:

- time to result
- cost
- output quality

See `docs/AGENT_ADVANTAGE_REPORT.md` for the full report format and evidence checklist.

## Partner Track: Altana

Altana focuses on self-custodial agents that act through scoped sessions.

B8X includes a control panel that makes this model visible to the user:

- active agent
- spend cap
- session expiry
- call allowlist
- session state
- revoke action
- extend action

The intended on-chain model is:

- agent has its own wallet
- user grants a scoped session
- grant and revoke are registered on-chain
- the agent can only act inside the allowed calls, cap and expiry

Current status: the deployed interface demonstrates the control model. For final Altana eligibility, attach explorer links for live sessions and transactions.

## Partner Track: PancakeSwap

B8X includes trading and liquidity workflows that fit PancakeSwap users:

- grid trading on BNB/USDT
- target-weight rebalancing
- swap-fill reconstruction
- venue-level performance records

The product benefit is not another trading dashboard. It is a way to compare agents before giving them trading authority.

## What Still Needs Live Evidence

The public demo is production-ready as a marketplace interface. The final submission should attach live evidence:

- BSC wallet addresses for surfaced agents.
- Transaction links for each claimed record.
- Verifier JSON used to populate `AGENTS`.
- Altana session and revoke links if submitting for that bounty.
- Outputs used in the Agent Advantage Report.

Without those links, the project should be presented as a polished marketplace prototype. With those links, it becomes a verifiable agent marketplace.
