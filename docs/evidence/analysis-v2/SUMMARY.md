# Measured analysis benchmark

Generated: 2026-09-06T10:01:59.392Z
Endpoint: https://b8xmarket-repo.vercel.app

Five requests per category using identical supplied scenarios. The reference is a standalone calculator, not a person. Both outputs are attached in each JSON file.

| Agent | HTTP p50 (ms) | HTTP max (ms) | Local baseline p50 (ms) | Metric agreement |
|---|---:|---:|---:|---:|
| b8xrebal | 344.80 | 715.66 | 0.0073 | 4/4 |
| b8xgrid | 210.58 | 350.42 | 0.0181 | 4/4 |
| b8xyield | 221.76 | 237.85 | 0.0248 | 3/3 |
| b8xhealth | 226.29 | 237.92 | 0.0087 | 5/5 |

The endpoint adds a form, validation, decimal arithmetic, provenance and a downloadable report. It is slower than a local calculator; no time advantage over that baseline is claimed.

## Limits

- Not human timing. Not paid hiring. No autonomous trading was tested.
- Network request time and local calculation time measure different delivery paths. No speed advantage is claimed.
- Correctness compares selected numerical metrics, not all financial risks or output quality.
- Host infrastructure and operator costs are not included.

Fee per analysis request: 0 USD. Transactions sent: 0. Infrastructure costs: not measured.
