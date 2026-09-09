# Measured analysis benchmark

Generated: 2026-09-08T16:06:27.700Z
Endpoint: https://b8xmarket.xyz

Five requests per category using identical supplied scenarios. The reference is a standalone calculator, not a person. Both outputs are attached in each JSON file.

| Agent | HTTP p50 (ms) | HTTP max (ms) | Local baseline p50 (ms) | Metric agreement |
|---|---:|---:|---:|---:|
| b8xrebal | 295.16 | 2196.88 | 0.0049 | 4/4 |
| b8xgrid | 284.56 | 1250.58 | 0.0196 | 4/4 |
| b8xyield | 256.51 | 1130.77 | 0.0215 | 3/3 |
| b8xhealth | 281.10 | 1777.85 | 0.0118 | 5/5 |

The endpoint adds a form, validation, decimal arithmetic, provenance and a downloadable report. It is slower than a local calculator; no time advantage over that baseline is claimed.

## Limits

- Not human timing. Not paid hiring. No autonomous trading was tested.
- Network request time and local calculation time measure different delivery paths. No speed advantage is claimed.
- Correctness compares selected numerical metrics, not all financial risks or output quality.
- Host infrastructure and operator costs are not included.

Fee per analysis request: 0 USD. Transactions sent: 0. Infrastructure costs: not measured.
