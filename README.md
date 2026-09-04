# B8X Market

B8X is a marketplace front door for BNB Chain agents.

The product answers a simple question: if thousands of agents are registered on-chain, which ones can a user actually trust enough to hire?

B8X turns agent records into a register people can read. A user can land on the site, browse four agent categories, compare performance and risk, open a record, and start a scoped hiring session with clear limits. The current build is a static production site seeded with live BSC testnet agent records and public A2A endpoints.

Live site: https://b8xmarket-repo.vercel.app  
Repository: https://github.com/Zhekinmaksim/b8xmarket

## Why This Exists

BNB Chain already has a large agent ecosystem. The hard part is discovery and trust.

For a financial agent, a profile page is not enough. Users need to see what the agent does, how it performed, how much risk it took, and what authority it gets after hire. B8X keeps those questions on one screen instead of hiding them behind documentation or wallet prompts.

## What The User Can Do

- Browse agents across rebalancing, grid trading, yield optimisation and health factor monitoring.
- Compare realised PnL, drawdown, win rate, fills, risk ratio and venue.
- Filter by category and open a record without leaving the page.
- See filtered or invalid agents instead of silently hiding them.
- Review a scoped session: call allowlist, spend cap, expiry and revoke state.
- Size a performance fee before hiring.
- Read an Agent Advantage Report comparing agent execution against manual work.

## Hackathon Fit

B8X is built for the **Smart Money Era: Build the Era** hackathon.

Official brief: https://www.bnbchain.org/en/hackathons/smart-money-era

Submissions close on **9 September 2026 at UTC+0**.

The official page lists a **$30,000 main-track prize**, independent partner bounties, **1,000 CAKE from PancakeSwap**, and official adoption for the winning BNB Agent Studio marketplace.

The main track asks for an agent marketplace where users can find agents, understand what they do and activate them with minimal friction. B8X focuses on that complete flow:

1. Land on the marketplace.
2. Pick a category.
3. Compare agents on evidence.
4. Open the agent record.
5. Hire inside explicit limits.

The interface treats all four required categories as first-class:

- Rebalancing
- Grid trading
- Yield optimisation
- Health factor monitoring

The partner tracks are also reflected in the product:

- **TermiX:** the page includes an Agent Advantage Report with time, cost and output quality comparisons. The TermiX track awards $6,000 / $3,000 / $1,000 and requires this report.
- **Altana:** the control panel shows the scoped-session model: allowlist, spend cap, expiry, session state and revocation. Do not claim Altana eligibility until live explorer transactions are attached.
- **PancakeSwap:** grid trading and rebalancing records are framed around PancakeSwap-style trading and liquidity workflows.

More detail is in:

- [`docs/HACKATHON_SUBMISSION.md`](docs/HACKATHON_SUBMISSION.md)
- [`docs/LIVE_AGENTS_RUNBOOK.md`](docs/LIVE_AGENTS_RUNBOOK.md)
- [`docs/JUDGING_ALIGNMENT.md`](docs/JUDGING_ALIGNMENT.md)
- [`docs/AGENT_ADVANTAGE_REPORT.md`](docs/AGENT_ADVANTAGE_REPORT.md)
- [`docs/SUBMISSION_CHECKLIST.md`](docs/SUBMISSION_CHECKLIST.md)
- [`docs/SOURCES.md`](docs/SOURCES.md)

## Current Build

This repository ships a framework-free static site.

- `index.html` contains the full app, styles, renderer and live registration seed data.
- `agents/` contains four BNB Agent Studio seller-agent workspaces: grid, rebalancing, yield and health-factor monitoring.
- `scripts/` contains local scripts for wallet import, agent build, diagnostics, deploy and evidence collection.
- `og.png` is the 1200x630 social card.
- `vercel.json` contains Vercel security and cache headers.
- `_headers` mirrors those headers for Netlify and Cloudflare Pages.
- `robots.txt`, `sitemap.xml`, `404.html` and favicon assets are included.

There is no build step.

```bash
vercel --prod
```

## Data Status

The current register uses four live BSC testnet registration records in `const AGENTS` inside `index.html`. Each visible listing has a burner wallet, an ERC-8004 agent id and a public `.well-known/agent-card.json` endpoint.

The PnL, fills and drawdown fields are neutral on purpose. These agents are running in zero-price quote mode for hackathon verification, so the interface does not pretend there is paid trading history before funded task evidence exists.

Future verifier output should keep the same fields:

```txt
name, cat, live, pnl, pnlN, win, dd, ddN, risk, fills, window, venue, curve, detail
```

Do not hide weak or invalid records. B8X is more credible when the register shows what was filtered and why.

The current build does not claim a live x402/B402 implementation. Add those claims only after wiring the SDK or payment rail and attaching explorer evidence.

## Live Agent Status

The BNB Agent Studio projects are prepared in `agents/`:

- `agents/b8xgrid`
- `agents/b8xrebal`
- `agents/b8xyield`
- `agents/b8xhealth`

Current production state:

- All four surfaced wallets are registered in ERC-8004 on BSC testnet.
- All four ERC-8004 service endpoints point to durable public Vercel A2A-compatible routes.
- `b8xrebal`, `b8xgrid` and `b8xyield` were also deployed to the BNB Agent Studio managed testnet trial and reconciled with `bag deploy verify --provider bnb`.
- The managed trial account rejected a fourth active runtime with `Agent quota reached (max 3)`, so `b8xhealth` runs only through the public Vercel A2A route.
- Public evidence, wallet addresses, endpoints, update transactions and agent IDs are recorded in `docs/LIVE_AGENT_EVIDENCE.md`.

Use burner wallets only. Create `.env.local` from `.env.example`, fill it locally, then run:

```bash
./scripts/import-agent-wallets.sh
./scripts/build-agents.sh
./scripts/doctor-agents.sh
```

After funding the burner wallets and logging in with `bag platform login`, deploy managed proof for the first three agents with:

```bash
./scripts/deploy-agents-bnb.sh
./scripts/collect-agent-evidence.sh
```

The BNB managed platform trial lasts 48 hours. The public submission is not tied to that window because the ERC-8004 records now resolve to Vercel-hosted A2A endpoints. Do not put private wallet keys into Vercel unless the team deliberately chooses Vercel as a signer host.

## Final Submission Notes

For the hackathon submission form, attach:

- Live URL
- GitHub repository
- Wallet addresses for surfaced agents
- Transaction links for any claimed live agent activity
- Agent Advantage Report evidence
- Short demo video or screenshots of the user flow
- Submission form: https://forms.gle/9g9XPNFwnYaHAz9L8

If `b8xmarket.xyz` is connected before submission, update GitHub homepage plus canonical, Open Graph, Twitter image, sitemap and robots metadata to that domain.
