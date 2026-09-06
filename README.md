# B8X Market

B8X is a read-only analysis interface for four BNB Chain agent categories: LP rebalancing, grid trading, yield optimisation and health-factor checks.

[Open B8X](https://b8xmarket.xyz/) | [Hackathon brief](https://www.bnbchain.org/en/hackathons/smart-money-era)

Choose a category, edit the inputs and run an analysis. The API performs decimal calculations and returns the result, source details, assumptions and formulas. Results can be downloaded as JSON and reopened from browser-local history.

## What works

- LP range review: current range status, theoretical candidate bounds, token amounts and a fee-versus-cost scenario.
- Grid feasibility: arithmetic price levels, per-interval sizing and round-trip costs.
- Yield comparison: net simple-APR return after costs, with liquidity and lock filters.
- Health-factor stress: collateral shock, liquidation distance and alternative repay/top-up amounts.
- Optional live PancakeSwap V2 WBNB/USDT reserve-ratio price from BSC mainnet, pinned to a block. It is not an oracle or executable quote.
- Public agent cards and JSON-RPC `message/send` analysis endpoints for all four categories.

## Scope

The engine is deterministic, not an LLM. Default numbers are sample scenarios. Only the optional pool spot price is fetched on-chain; lending positions, LP holdings, APRs and transaction-cost assumptions are user supplied.

The four agent IDs refer to historical ERC-8004 registrations on BSC testnet. Registration is not a performance endorsement. The earlier BNB managed trial is historical evidence, not the current runtime.

Paid hiring, swaps, continuous monitoring, delegated sessions, Altana and settlement are not implemented in this public runtime. `notify_funded` is rejected. No private key is required to run this version.

## Run locally

Requires Node.js 20 or newer.

```bash
npm ci
npm test
npm run dev
```

Open http://127.0.0.1:4173. Use `PORT=4174 npm run dev` if that port is occupied. The dev server serves only public assets and documentation; it never serves environment files or wallets.

## Evidence

```bash
node scripts/benchmark.js http://127.0.0.1:4173
```

This compares five HTTP runs per category against an independent local calculator using the same inputs. It records actual timings and metric agreement. It is not a human comparison and does not establish TermiX eligibility.

See [benchmark status](docs/AGENT_ADVANTAGE_REPORT.md), [manual protocol](docs/MANUAL_BENCHMARK.md) and [registration records](docs/LIVE_AGENT_EVIDENCE.md).

## Deployment

The GitHub repository is linked to Vercel. Static assets and `api/` deploy together. An ordinary static host alone cannot run the analysis API.

`lib/analysis.js` holds the calculations; `lib/b8x-agent.js` validates requests and returns A2A messages; `lib/snapshot.js` reads the public pool; `catalog.js` is the shared listing and input schema. `agents/` preserves the earlier Studio seller workspaces, which are not invoked by the public analysis endpoint.

Secrets, wallet material, local browser artifacts and dependency folders are excluded from deployment. This application does not load `.env.local` or use a signer. Historical standalone `dist/` files are not the current application.
