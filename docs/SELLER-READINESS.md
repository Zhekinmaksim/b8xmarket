# B8XGrid Seller Readiness

Status: local implementation prepared and one zero-price BSC testnet job submitted on-chain; permanent deployment and a live paid job are not established.

## Supported Deliverable

The grid seller accepts a JSON string in `task_description` with this exact shape:

```json
{"type":"grid_analysis","version":1,"inputs":{"price":600,"lower":500,"upper":700,"levels":5,"capital":1000,"feeBps":10,"slippageBps":5,"gasPerTrade":0.1}}
```

ERC-8183 requests still require the existing `terms.deliverables` and `terms.quality_standards` fields. Suggested values are "JSON grid feasibility report with interval quantities and net cycle results" and "Apply the supplied inputs, show costs and formulas, and label scenario assumptions; no executed-trade claims". Place the JSON string in the signed task description, not in arbitrary terms. Fund exactly the resulting signed quote through the existing buyer workflow when separately authorized.

Both A2A and MCP reject unsupported input before quote signing. The fixed list price and clamp are unchanged. Verified ERC-8183 delivery re-parses the on-chain task string and runs the same bounded calculation used by B402's existing authorized work hook. B402 validation occurs inside that hook, after its existing commerce gate; pre-payment validation for that rail is not claimed. Malformed historic funded jobs fail without submitting an invented deliverable.

The result includes normalized inputs, a range/cost decision, price step, budget per interval, worst cycle net, at most 99 interval rows, formulas, numerical tolerance and assumptions. This is arithmetic-grid scenario analysis of buyer-supplied values. It fetches no live prices, performs no trades, verifies no fills and forecasts no realized PnL. Gas is deducted twice per independent cycle and requires a separate cash reserve beyond the capital allocated to buys.

The deploy-contained `src/gridWork.ts` ports the grid formulas and input bounds from `lib/analysis.js`. It imports no root module and adds no dependency. It uses IEEE-754 numbers with 12 significant digit output, rather than the root's Decimal arithmetic. Near-zero margins are conservatively classified as `BREAK_EVEN_WITHIN_PRECISION` using an explicit roundoff tolerance. Values are estimates, never token settlement quantities. The calculation does not call the LLM or its automatic credit-renewal path.

Input is capped at 8192 UTF-8 bytes, has an explicit task type/version, rejects extra fields, and requires all eight inputs. Numeric values may be JSON numbers or unsigned decimal strings. Bounds match the root grid: prices 0.000001-1e9, levels 2-100 (integer), capital 1-1e9, fee/slippage 0-1000 bps each, gas 0-1e5; upper must exceed lower.

## Current Blockers and Evidence Limits

- Root operator's current `bag deploy prepare` result: BNB signed in, trial expired, zero active agents. An available hosting provider/trial and authorized deployment are still required. No cloud deployment was attempted here.
- The initial missing `.studio/wallets` check was superseded: the original encrypted keystores were restored locally and their addresses match ERC-8004 IDs 2095-2098. No transaction was sent and no identity was rotated.
- Runtime secret injection and configured-provider readiness still need verification after restoration. The deterministic grid work itself requires no Pieverse call; this change does not remove or bypass existing deployment configuration checks.
- Read-only ERC-8004 reconciliation and public agent-card reachability passed on 2026-09-09. ERC-8183 job `1186` then completed the canonical zero-price create/register/set-budget/fund/submit path using the local bounded seller. The five successful transaction receipts and manifest are in [ERC8183_JOB_1186.md](ERC8183_JOB_1186.md). A permanently deployed signer, paid job and settlement remain unverified.
- Packaging and whole-project verification are owned by the root operator. This task changes only grid seller source/tests and this document; signing, pricing, keystore placement and security/deployment policy are untouched.

## Local Verification

Focused tests live in `agents/b8xgrid/app/agent/src/gridWork.test.ts`. They exercise numerical deliverables, cost/range/break-even decisions, bounds, cancellation, quote rejection before signing, verified delivery with mocked signing, deduplication, and failure without fake submission. These are local tests, not proof of an on-chain job.

Run from an agent package with dependencies installed:

```sh
npm run build
NODE_ENV=test node --test dist/gridWork.test.js
```

Verified 2026-09-09: the identical source in `/private/tmp/b8x-grid-work-check` built successfully with `npm run build`. All five focused tests passed with `NODE_ENV=test node --test dist/gridWork.test.js`. The logged mock transaction and deliberately rejected malformed task are test fixtures, not chain evidence.

The original four local keystores have been restored and their addresses match the recorded identities. The subsequent AWS readiness check confirms the grid wallet has approximately 0.050385 tBNB. AWS account/region and a storage upload endpoint remain unconfigured. The current deployment configuration also requires a Pieverse key despite the new grid work not invoking an LLM. No readiness gate was bypassed.
