# B8X Market

Live application: https://b8xmarket.xyz/analysis.html

Demo source data: https://b8xmarket.xyz/docs/evidence/demo-capture.json

Video: https://b8xmarket.xyz/media/b8x-demo.mp4

Source: https://github.com/Zhekinmaksim/b8xmarket

B8X lets a user select an agent category, supply a scenario and inspect a numerical result. Every result includes the inputs, assumptions, formulas and source status. Users can download the JSON and reopen recent results in the same browser.

The four categories have distinct implementations: LP range review, grid cost checks, net yield comparison and lending stress analysis. The calculations are deterministic. There is no LLM in the public analysis path.

The optional PancakeSwap integration reads the WBNB/USDT reserve-ratio price from BSC mainnet at a fixed block. The four historical ERC-8004 registration records are on BSC testnet. These are different networks and are labelled separately.

## How to try it

1. Select Grid trading and run the sample. The configured fees make some intervals uneconomic.
2. Change the number of levels and rerun. Inspect the per-interval numbers and download the result.
3. Try LP rebalancing, Yield optimisation and Health factor. Each has editable inputs and an inspectable output.
4. For LP or grid, select the live PancakeSwap price source. The result records the pool, block and observation time. Range bounds remain your own inputs.

## Current limits

This is a read-only analysis beta. It does not hire a paid seller, execute a strategy, monitor continuously, grant session authority or settle a payment. The earlier managed trial is not the current runtime. No Altana or x402 eligibility is claimed.

The benchmark compares actual HTTP calculations against a standalone calculator, not measured human work. The required TermiX human/hiring evidence remains incomplete. See [Agent Advantage evidence status](AGENT_ADVANTAGE_REPORT.md).

Do not describe this submission as a fully operational autonomous trading marketplace. The working contribution is transparent discovery and analysis across four categories; activation into execution remains a gap against the main-track brief.
