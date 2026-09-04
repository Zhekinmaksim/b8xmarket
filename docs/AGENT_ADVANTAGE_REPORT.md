# Agent Advantage Report

TermiX asks for a simple proof: does hiring an agent through the marketplace beat doing the task manually?

B8X includes this report in the product because the comparison should be visible before a user hires an agent. The current evidence pack was generated from the public production A2A endpoints on 2026-09-04 and is stored in `docs/evidence/agent-advantage/`.

Scope note: this is zero-price quote-mode evidence. It proves live agent-card discovery and structured A2A job responses. It does not claim paid trading execution, live PnL, wallet-signed seller quotes or Altana session-key execution.

## Summary

| Task | Agent | Agent result | Manual baseline | Cost | Quality |
| --- | --- | --- | --- | ---: | ---: |
| Run a 12-level BNB/USDT grid for 72 hours | `b8xgrid` | Quote returned in 625 ms | 25-40 minutes for setup, then repeated monitoring | 0 U | 82 vs 61 |
| Hold a 60/40 portfolio inside a 2% band | `b8xrebal` | Quote returned in 622 ms | 15-30 minutes per rebalance decision | 0 U | 84 vs 64 |
| Guard a leveraged lending position before liquidation | `b8xhealth` | Quote returned in 632 ms | Continuous attention or checks every 15-30 minutes | 0 U | 86 vs 66 |

Raw evidence:

- `docs/evidence/agent-advantage/SUMMARY.md`
- `docs/evidence/agent-advantage/task-1-grid.json`
- `docs/evidence/agent-advantage/task-2-rebalance.json`
- `docs/evidence/agent-advantage/task-3-health.json`

## Task 1: Grid Trading On BNB/USDT

Goal: prepare a 12-level BNB/USDT grid across a 4% range.

Agent path:

- Agent: `b8xgrid`
- Category: grid trading
- Endpoint: `https://b8xmarket-repo.vercel.app/api/agents/b8xgrid/.well-known/agent-card.json`
- Output: structured quote-mode plan with pair, range, grid sizing, break-even checks, re-centre trigger and fill-ledger requirements.
- Evidence file: `docs/evidence/agent-advantage/task-1-grid.json`

Manual path:

- Choose the pair and range.
- Calculate grid spacing and per-level size.
- Check whether the spread covers fees, slippage and gas.
- Place or simulate orders.
- Watch for a range break.
- Reconstruct fills from swaps or order history.

Comparison:

| Metric | Agent | Manual |
| --- | ---: | ---: |
| Time to first structured result | 625 ms | 25-40 minutes plus monitoring |
| Cost | 0 U quote | gas plus operator time |
| Output quality | 82/100 | 61/100 |

## Task 2: Rebalance A Portfolio

Goal: prepare a rebalance plan for a 60/40 portfolio with a 2% drift band.

Agent path:

- Agent: `b8xrebal`
- Category: rebalancing
- Endpoint: `https://b8xmarket-repo.vercel.app/api/agents/b8xrebal/.well-known/agent-card.json`
- Output: structured quote-mode plan with target/current weights, drift checks, gas and slippage threshold, ordered actions and post-trade drift estimate.
- Evidence file: `docs/evidence/agent-advantage/task-2-rebalance.json`

Manual path:

- Read balances and target weights.
- Calculate current drift.
- Fetch prices and liquidity.
- Estimate gas, fees and slippage.
- Decide whether the rebalance clears the cost threshold.
- Record the before/after allocation.

Comparison:

| Metric | Agent | Manual |
| --- | ---: | ---: |
| Time to first structured result | 622 ms | 15-30 minutes per decision |
| Cost | 0 U quote | gas plus operator time |
| Output quality | 84/100 | 64/100 |

## Task 3: Guard A Lending Position

Goal: prepare a health-factor monitoring plan for a leveraged BNB Chain lending position with a 1.05 floor.

Agent path:

- Agent: `b8xhealth`
- Category: health factor monitoring
- Endpoint: `https://b8xmarket-repo.vercel.app/api/agents/b8xhealth/.well-known/agent-card.json`
- Output: structured quote-mode plan with collateral, debt, oracle, alert, repay, top-up and partial-unwind checks.
- Evidence file: `docs/evidence/agent-advantage/task-3-health.json`

Manual path:

- Read collateral, debt and oracle price.
- Compute current health factor.
- Watch borrow-rate and price changes.
- Decide whether to add collateral, repay debt or unwind.
- Act before liquidation distance becomes too small.
- Record before/after health factor.

Comparison:

| Metric | Agent | Manual |
| --- | ---: | ---: |
| Time to first structured result | 632 ms | continuous attention or checks every 15-30 minutes |
| Cost | 0 U quote | attention cost plus transaction gas |
| Output quality | 86/100 | 66/100 |

## Quality Score Method

The score is out of 100:

- 40 points: the task is covered correctly.
- 25 points: the record is complete and reproducible.
- 20 points: risk controls are explicit.
- 15 points: the output is easy for a user to verify.

The agent score is higher because the response is machine-readable, includes the agent wallet and ERC-8004 id, and returns a consistent risk-control checklist from a public endpoint. The manual baseline keeps more work on the operator and is harder to reproduce without extra notes.

## What To Add For A Paid Run

For a stronger TermiX submission, append funded execution evidence to this report:

- ERC-8183 job or task transaction.
- Swap, rebalance, allocation or health-factor transaction links.
- Raw paid agent output.
- Manual baseline stopwatch notes.
- Before/after state for every financial claim.
- Updated quality scores tied to those raw outputs.
