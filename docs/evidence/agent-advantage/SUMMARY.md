# Agent Advantage Evidence

Generated: 2026-09-04T10:35:32.288Z

This pack was generated from the public production A2A endpoints. It is intentionally limited to zero-price quote mode: it proves discovery, agent-card reachability and structured job responses, but it does not claim paid trading execution.

| Task | Agent | Card | Quote | Agent time | Cost | Agent score | Manual baseline |
| --- | --- | ---: | ---: | ---: | ---: | ---: | --- |
| Run a 12-level BNB/USDT grid for 72 hours | `b8xgrid` | 200 | quoted | 625 ms | 0 U | 82/100 | 25-40 minutes for setup, then repeated monitoring while the range is live. |
| Hold a 60/40 portfolio inside a 2% band | `b8xrebal` | 200 | quoted | 622 ms | 0 U | 84/100 | 15-30 minutes per rebalance decision, plus repeated checks when prices move. |
| Guard a leveraged lending position before liquidation | `b8xhealth` | 200 | quoted | 632 ms | 0 U | 86/100 | Continuous attention during volatile windows, or manual checks every 15-30 minutes. |

Manual scores are conservative baseline notes, not hidden agent output. For a paid TermiX run, append explorer links and replace the quote-mode rows with funded execution records.
