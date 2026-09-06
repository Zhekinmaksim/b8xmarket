# Measured analysis benchmark

Generated: 2026-09-06T07:53:03.268Z
Endpoint: http://127.0.0.1:4173

Five requests per category using identical supplied scenarios. The reference is a standalone calculator, not a person. Both outputs are attached in each JSON file.

| Agent | HTTP p50 (ms) | HTTP max (ms) | Local baseline p50 (ms) | Metric agreement |
|---|---:|---:|---:|---:|
| b8xrebal | 1.81 | 24.95 | 0.0059 | 4/4 |
| b8xgrid | 2.07 | 3.35 | 0.0086 | 4/4 |
| b8xyield | 1.15 | 1.56 | 0.0065 | 3/3 |
| b8xhealth | 0.61 | 1.58 | 0.0029 | 5/5 |

The endpoint adds a form, validation, decimal arithmetic, provenance and a downloadable report. It is slower than a local calculator; no time advantage over that baseline is claimed.

## Limits

- Not human timing. Not paid hiring. No autonomous trading was tested.
- Network request time and local calculation time measure different delivery paths. No speed advantage is claimed.
- Correctness compares selected numerical metrics, not all financial risks or output quality.
- Host infrastructure and operator costs are not included.

Fee per analysis request: 0 USD. Transactions sent: 0. Infrastructure costs: not measured.
