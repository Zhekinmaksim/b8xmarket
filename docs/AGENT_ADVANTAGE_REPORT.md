# Agent Advantage Report: evidence status

The current evidence supports a working read-only analysis service. It does not yet prove that hiring an agent beats a person doing the same task.

## Correction to the earlier report

The earlier 82/61, 84/64 and 86/66 quality scores were constants, not measured outcomes. The manual durations were estimates. Quote latency was compared with longer tasks that had not actually been completed. Those claims are withdrawn and must not be used in the submission or video.

## Reproducible comparison

[Measured results](evidence/analysis-v2/SUMMARY.md) compare four fixed scenarios through the HTTP service with an independent standalone JavaScript calculator. Each category has five runs, the same inputs on both paths, attached outputs and numerical checks. Timing is recorded using a monotonic clock.

This is a software baseline, not human timing. It checks selected numerical outputs, not investment performance. The endpoint incurs network overhead; no speed advantage over a local calculator is claimed. Analysis fees are zero, no transactions are sent, and hosting/operator costs are not measured.

The scenarios cover LP range costs, grid feasibility, yield route eligibility and a lending-position stress test. They are not historical trading runs or protection against an actual liquidation.

## Required before claiming TermiX agent advantage

1. Run at least three equivalent tasks with the marketplace and without it, with a clearly identified operator and the same input data.
2. Attach both actual outputs, start/end times, fees and a predefined correctness rubric. Failed attempts count.
3. Demonstrate the hiring path that TermiX can repeat. The current public service has free analysis, not paid hiring.

The [manual benchmark protocol](MANUAL_BENCHMARK.md) is ready. Human measurements remain pending. The report should be presented as incomplete for TermiX until those measurements and the required hiring evidence exist.

[Official requirements](https://www.bnbchain.org/en/hackathons/smart-money-era)
