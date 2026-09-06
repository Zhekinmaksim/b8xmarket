# Manual comparison protocol

Status: no human trials recorded yet.

Use the same computer and input sheet for both paths. The manual path may use a calculator or spreadsheet, but not B8X or an AI assistant. The marketplace path uses the deployed B8X form. Alternate which path goes first between tasks to reduce practice effects. Record familiarity with the subject; a three-task trial is descriptive, not statistically conclusive.

Start the clock when the task sheet is visible. Stop when the complete answer is saved. Keep errors, failed attempts and corrections in the record. Save both output files. Report the software/browser used, external data lookup time, fees, gas and any paid tooling. Do not assign a quality score after seeing the answers.

## Task 1: grid costs

Spot 100; lower 90; upper 110; three price levels; capital 180 quote units; fee 25 bps per leg; slippage 5 bps per leg; gas 0.05 quote per trade. Calculate the two buy/sell intervals, capital per interval, quantities and net round-trip result. State whether all intervals are net positive under these assumptions.

## Task 2: LP range

Spot 600; current bounds 610 to 650; candidate half-width 5%; capital 10,000 quote; gas 2 quote; move slippage 10 bps on full capital; assumed daily fees 5 quote; horizon seven days. Determine whether the current position is in range. Calculate candidate bounds, move cost, break-even days and whether the supplied fee scenario covers the cost.

## Task 3: position stress

Collateral value 10,000 quote; debt 6,000 quote; effective liquidation threshold 80%; target health factor 1.3; collateral price shock 20%. Compute current and stressed health factor. Calculate the debt repayment OR post-shock collateral top-up needed to reach the target. Treat the two actions as alternatives.

## Predefined rubric

Each requested numeric value is correct if its absolute error is within 0.01 quote units or 0.0001 for dimensionless ratios. All requested categorical decisions must match the stated formulas. Report checks passed over checks requested, and list every mismatch. Do not convert this into a strategy safety or investment performance score.

## Trial record

For each path record: task, participant pseudonym, start UTC, end UTC, elapsed seconds, output file, tools, cost and units, corrections, checks passed/total, and observations. Leave missing fields empty; do not estimate them.

These tasks evaluate analysis only. They do not establish paid hiring or autonomous execution.
