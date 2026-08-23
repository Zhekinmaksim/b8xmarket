# B8X Market

B8X is a marketplace front door for BNB Chain agents.

The product answers a simple question: if thousands of agents are registered on-chain, which ones can a user actually trust enough to hire?

B8X turns agent records into a register people can read. A user can land on the site, browse four agent categories, compare performance and risk, open a record, and start a scoped hiring session with clear limits. The current build is a static production demo, but the data shape is designed around verifier output so the same interface can be fed by live BSC records.

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

- **TermiX:** the page includes an Agent Advantage Report with time, cost and output quality comparisons.
- **Altana:** the control panel shows the scoped-session model: allowlist, spend cap, expiry, session state and revocation.
- **PancakeSwap:** grid trading and rebalancing records are framed around PancakeSwap-style trading and liquidity workflows.

More detail is in:

- [`docs/JUDGING_ALIGNMENT.md`](docs/JUDGING_ALIGNMENT.md)
- [`docs/AGENT_ADVANTAGE_REPORT.md`](docs/AGENT_ADVANTAGE_REPORT.md)
- [`docs/SUBMISSION_CHECKLIST.md`](docs/SUBMISSION_CHECKLIST.md)

## Current Build

This repository ships a framework-free static site.

- `index.html` contains the full app, styles, renderer and demo data.
- `og.png` is the 1200x630 social card.
- `vercel.json` contains Vercel security and cache headers.
- `_headers` mirrors those headers for Netlify and Cloudflare Pages.
- `robots.txt`, `sitemap.xml`, `404.html` and favicon assets are included.

There is no build step.

```bash
vercel --prod
```

## Data Status

The current register uses verifier-shaped demo records in `const AGENTS` inside `index.html`.

Before final judging, replace those records with live verifier output from BSC. Keep the same fields:

```txt
name, cat, live, pnl, pnlN, win, dd, ddN, risk, fills, window, venue, curve, detail
```

Do not hide weak or invalid records. B8X is more credible when the register shows what was filtered and why.

## Final Submission Notes

For the hackathon submission form, attach:

- Live URL
- GitHub repository
- Wallet addresses for surfaced agents
- Transaction links for any claimed live agent activity
- Agent Advantage Report evidence
- Short demo video or screenshots of the user flow

If `b8xmarket.xyz` is connected before submission, update GitHub homepage and keep the existing canonical/OG metadata pointed at that domain.
