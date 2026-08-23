# Agent Advantage Report

TermiX asks for a simple proof: does hiring an agent beat doing the task manually?

B8X includes this report in the product because it should not live in a separate slide deck. A user should see the advantage before hiring.

## Summary

The report compares three tasks run two ways:

- with an agent hired through B8X
- without an agent, using manual work

Each task is measured on:

- time
- cost
- output quality

At least one task must come from trading, stock or security. B8X includes two high-stakes tasks: grid trading and health factor protection.

## Task 1: Grid Trading On BNB/USDT

Goal: run a 12-level grid for 72 hours.

Agent path:

- Agent: `grid-01`
- Category: grid trading
- Output: 88 fills with block references
- User control: spend cap and session expiry

Manual path:

- User monitors price range.
- User places and adjusts orders by hand.
- User reconstructs fills after execution.

Reported comparison in the demo:

| Metric | Agent | Manual |
| --- | ---: | ---: |
| Time to result | 4 min | 6 h 10 m |
| Cost | $18 | $104 |
| Output quality | 96 / 100 | 71 / 100 |

Evidence to attach before final submission:

- agent wallet
- grid session transaction
- swap or fill transaction links
- raw output from the agent
- manual baseline notes

## Task 2: Rebalance A Portfolio

Goal: hold a 60/40 book inside a 2% band for one week.

Agent path:

- Agent: `rebal-core`
- Category: rebalancing
- Output: 23 rebalances and drift log
- Rule: rebalance only when drift exceeds cost

Manual path:

- User checks drift.
- User calculates whether the rebalance is worth gas and fees.
- User executes trades manually.

Reported comparison in the demo:

| Metric | Agent | Manual |
| --- | ---: | ---: |
| Time to result | 2 min | 3 h 40 m |
| Cost | $11 | $68 |
| Output quality | 92 / 100 | 78 / 100 |

Evidence to attach before final submission:

- target-weight configuration
- rebalance transactions
- before/after allocation records
- drift log
- manual baseline notes

## Task 3: Guard A Lending Position

Goal: monitor a leveraged position for 30 days and act before liquidation.

Agent path:

- Agent: `hf-guard`
- Category: health factor monitoring
- Output: 7 interventions
- Rule: act before health factor crosses the configured floor

Manual path:

- User checks health factor repeatedly.
- User decides whether to add collateral or reduce debt.
- User acts under time pressure when the position moves.

Reported comparison in the demo:

| Metric | Agent | Manual |
| --- | ---: | ---: |
| Attention needed | 0.7 h | 46 h |
| Cost | $9 | $0 plus risk |
| Output quality | 98 / 100 | 44 / 100 |

Evidence to attach before final submission:

- lending position address
- monitoring window
- intervention transactions
- before/after health factor values
- liquidation-risk baseline

## Quality Score Method

The demo uses a 100-point output quality score so tasks with different shapes can be compared on one page.

For final submission, use the same scoring rubric for all three tasks:

- 40 points: task completed correctly
- 25 points: record is complete and reproducible
- 20 points: risk controls were followed
- 15 points: output is easy for a user to verify

Do not score a task from vibes. Attach the output and show why the score is deserved.

## Final Evidence Checklist

For each task, include:

- agent name
- wallet address
- category
- task brief
- time started and ended
- cost basis
- output file or transaction list
- manual baseline
- quality score explanation

The report is strongest when the judge can follow the numbers without asking the team to explain them live.
