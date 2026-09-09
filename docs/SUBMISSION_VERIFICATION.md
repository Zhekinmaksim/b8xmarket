# Submission verification

Observed 2026-09-08 and rechecked 2026-09-09 against https://b8xmarket.xyz. The machine-readable latest result is [submission-verification.json](evidence/submission-verification.json).

## Completed checks

- `npm test`: 12 tests passed, no failures.
- `npm run benchmark -- https://b8xmarket.xyz`: 20 completed HTTP requests, five per category. Every checked metric matched the independent calculator. Inputs, outputs and measured timings are in `evidence/analysis-v2/`.
- Browser: all four categories completed; zero-debt case returned NO DEBT; JSON downloaded; five results survived reload; saved output reopened.
- Mobile viewport 390 x 844: no horizontal overflow; yield analysis completed.
- Invalid grid bounds returned the expected validation error and HTTP 400. This deliberately generated the browser's one resource-error console entry; no uncaught page errors were observed.
- Live PancakeSwap price loaded and its source appeared in the result.
- Final video: 1920 x 1080, H.264/AAC, approximately 60 seconds. The prior full decode and audio-tail checks passed.
- Original four local testnet keystores restored from the protected local configuration. Addresses match the historical registration evidence. No on-chain writes or new identities were created during this preparation.
- Read-only BSC testnet reconciliation at block `129959947`: ERC-8004 IDs 2095-2098 are owned by the expected wallets, each on-chain service URL matches the published agent card, and all four URLs returned HTTP 200.
- Real BSC testnet ERC-8183 job `1186`: create, policy registration, `setBudget(0)`, `fund(0)` and seller `submit` all succeeded. The chain reports `SUBMITTED`, budget `0 U`, buyer `b8xrebal`, provider `b8xgrid`, and deliverable hash `0x5e6dae5f0e82fdb4c5656a3c0bdb3d1aff32434ddb741c6185d1595662a5d8e3`. See [transaction evidence](ERC8183_JOB_1186.md).

## Runtime readiness

`bag deploy prepare` reports the BNB managed trial expired and zero active managed agents. The public read-only APIs remain reachable on Vercel.

`bag deploy prepare --provider aws` is not ready: no real AWS account/region is configured, and the LLM key and storage upload endpoint are missing. The grid wallet had approximately 0.050385 tBNB and 0 U before job 1186. Zero-price ERC-8183 delivery was completed locally against the canonical testnet contracts; no permanent signer runtime was deployed.

Permanent signer hosting and any signer secret handoff require a supported Studio provider. The available generic VPS was inspected but not used for signer deployment because the project policy requires `bag deploy --provider bnb|aws|azure`. The public Vercel application has no signer and remains keyless.

## Claims not established

On 2026-09-09, the deploy-contained grid seller built successfully and passed all five focused tests. A separate bounded local seller then delivered job 1186 on-chain. Neither implementation is connected to the public keyless analysis deployment.

This verification does not establish paid hiring, strategy execution, continuous monitoring, Altana session transactions/revocation, human time savings, settlement, or investment returns. Job 1186 is on-chain analysis-delivery evidence only.
