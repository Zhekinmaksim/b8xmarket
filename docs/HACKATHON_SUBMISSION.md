# Hackathon Submission Draft

Use this as the human-readable project summary for the Smart Money Era submission form and demo script.

## Short Description

B8X is a marketplace register for BNB Chain agents. It helps users compare agents by category, performance and risk, then hire them through scoped sessions instead of handing over broad authority.

## Long Description

BNB Chain already has a large base of registered on-chain agents. The missing layer is a place where a normal user can decide which agent is worth hiring.

B8X solves that discovery problem as a marketplace interface. It covers the four required Smart Money Era categories: rebalancing, grid trading, yield optimisation and health factor monitoring. Each category has the same treatment: a focused tab, category metrics, records that can be opened, and data points a user can compare without reading docs first.

The product does not rank agents by vague badges. Each listing shows the record behind the agent: realised PnL, drawdown, win rate, fills, risk ratio, venue and time window. If an agent has a weak record, empty registration or dead endpoint, the interface keeps that visible instead of hiding it. That makes the quality bar clear.

The hire flow is built around scoped control. Before a user activates an agent, they see the allowed calls, spend cap, expiry and revoke state. The intended model is simple: the agent can work, but only inside the permission the user granted.

## What Works In The Current Build

- Public static site deployed on Vercel.
- Four BNB Agent Studio seller-agent workspaces prepared in `agents/`.
- Four first-class categories required by the main track.
- Agent register with filtering, opened records and visible rejected records.
- Agent Advantage Report section comparing agent work with manual work.
- Scoped-session control panel with allowlist, spend cap, expiry and revoke state.
- SEO, Open Graph image, favicon, security headers, sitemap and accessibility landmarks.

## Current Evidence Status

The current deployment is production-ready as a marketplace interface. The agent rows are still verifier-shaped demo records.

The repository now includes BNB Agent Studio workspaces for all four categories. They build locally, but they still need burner wallets, funding, platform login, deployment and transaction evidence before final submission.

Before final submission, replace the demo records with live BSC agent data and attach the evidence:

- BSC wallet addresses for surfaced agents.
- Transaction links for every live activity claim.
- Verifier JSON used to populate the agent register.
- Raw outputs and manual baselines for the Agent Advantage Report.
- Altana explorer links if submitting for the Altana bounty.
- x402/B402 evidence only if that payment rail is actually connected.

## Main Track Fit

The main track asks for the BNB Agent Studio marketplace: a place where users can find agents, understand what they do and activate them quickly.

B8X follows that path:

1. The user lands on the marketplace.
2. The user chooses one of the four required categories.
3. The user compares agents by record, risk and venue.
4. The user opens a listing to see the evidence behind it.
5. The user reviews session limits before hiring.

This is built for a user who does not already know Agent Studio. The page explains the agent record through the interface itself instead of sending the user into separate documentation.

## Partner Track Fit

**TermiX:** B8X includes an Agent Advantage Report format with three tasks run both ways: with an agent and manually. The final report must attach the actual outputs, time, cost and quality evidence.

**Altana:** B8X shows the scoped-session control model: wallet authority, allowlist, spend cap, expiry and revocation. For Altana eligibility, the final submission must include live explorer links for sessions and transactions.

**PancakeSwap:** B8X includes trading and liquidity workflows that match PancakeSwap users: grid trading, LP rebalancing, fill reconstruction and risk-aware execution.

## Demo Flow

1. Open the live site.
2. Show that all four required categories are present.
3. Filter to grid trading and open an agent record.
4. Walk through the metrics: PnL, drawdown, win rate, fills, risk and venue.
5. Open the Agent Advantage Report and compare agent execution with manual work.
6. Show the scoped-session panel: allowlist, spend cap, expiry and revoke.
7. End with the live wallet and transaction evidence links.

## Submission Links

- Live site: https://b8xmarket-repo.vercel.app
- Repository: https://github.com/Zhekinmaksim/b8xmarket
- Official brief: https://www.bnbchain.org/en/hackathons/smart-money-era
- Submission form: https://forms.gle/9g9XPNFwnYaHAz9L8

Deadline: **9 September 2026 at UTC+0**.
