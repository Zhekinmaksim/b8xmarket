(function (root) {
  const field = (key, label, value, min, max, step = "any") => ({
    key,
    label,
    value,
    min,
    max,
    step,
  });
  const catalog = [
    {
      slug: "b8xrebal",
      category: "LP rebalancing",
      id: 2095,
      wallet: "0xa2b4fB139150513872c68d51354e9f913A8c87a0",
      description:
        "Check a concentrated-liquidity range and estimate whether a range move clears your cost scenario.",
      output: "Range bounds, candidate token amounts, move cost",
      fields: [
        field("price", "Spot price (quote / base)", 600, 0.000001, 1e9),
        field("lower", "Current lower price", 610, 0.000001, 1e9),
        field("upper", "Current upper price", 650, 0.000001, 1e9),
        field("halfWidthPercent", "New range half-width (%)", 5, 0.1, 90),
        field("capital", "Position value (quote)", 10000, 1, 1e9),
        field("gasCost", "Move gas cost (quote)", 2, 0, 1e5),
        field("slippageBps", "Move slippage (bps)", 10, 0, 1000),
        field("expectedDailyFees", "Assumed daily fees (quote)", 5, 0, 1e6),
        field("horizonDays", "Fee scenario horizon (days)", 7, 1, 365, 1),
      ],
    },
    {
      slug: "b8xgrid",
      category: "Grid trading",
      id: 2096,
      wallet: "0x85aeD81F6d6e00dab442F1dd77aaE03c9cA11D89",
      description:
        "Calculate an arithmetic grid and check every buy/sell interval after fees, slippage and gas.",
      output: "Grid prices, order sizes, per-cycle cost checks",
      fields: [
        field("price", "Spot price (quote / base)", 600, 0.000001, 1e9),
        field("lower", "Lower grid price", 588, 0.000001, 1e9),
        field("upper", "Upper grid price", 612, 0.000001, 1e9),
        field("levels", "Price levels", 12, 2, 100, 1),
        field("capital", "Capital (quote)", 10000, 1, 1e9),
        field("feeBps", "Fee per trade (bps)", 25, 0, 1000),
        field("slippageBps", "Slippage per trade (bps)", 5, 0, 1000),
        field("gasPerTrade", "Gas per trade (quote)", 0.05, 0, 1e5),
      ],
    },
    {
      slug: "b8xyield",
      category: "Yield optimisation",
      id: 2098,
      wallet: "0x9a27Cea90d0AcA683F4cAFc0C7ead0a57d7367c1",
      description:
        "Compare supplied APRs after entry and exit costs, lock duration and available liquidity.",
      output: "Ranked routes, net return, exclusion reasons",
      fields: [
        field("capital", "Capital (quote)", 10000, 1, 1e9),
        field("horizonDays", "Holding horizon (days)", 30, 1, 365, 1),
      ],
      routes: [
        {
          name: "Scenario A",
          aprPercent: 8,
          roundTripCost: 12,
          availableLiquidity: 100000,
          lockDays: 0,
        },
        {
          name: "Scenario B",
          aprPercent: 10,
          roundTripCost: 40,
          availableLiquidity: 200000,
          lockDays: 0,
        },
        {
          name: "Scenario C",
          aprPercent: 14,
          roundTripCost: 8,
          availableLiquidity: 5000,
          lockDays: 60,
        },
      ],
    },
    {
      slug: "b8xhealth",
      category: "Health factor",
      id: 2097,
      wallet: "0x00CCc45a862eaCEa3d421AAf4521FBc4978C3499",
      description:
        "Stress a supplied lending position and calculate the repay or top-up needed to restore a target.",
      output: "Health factors, liquidation distance, recovery amounts",
      fields: [
        field("collateralValue", "Collateral value (quote)", 10000, 0.01, 1e12),
        field("debtValue", "Debt value (quote)", 6000, 0, 1e12),
        field(
          "liquidationThresholdPercent",
          "Liquidation threshold (%)",
          80,
          1,
          100,
        ),
        field("targetHealth", "Target health factor", 1.3, 1.01, 5),
        field("priceDropPercent", "Collateral price shock (%)", 20, 0, 99),
      ],
    },
  ];
  if (typeof module !== "undefined") module.exports = catalog;
  else root.B8X_CATALOG = catalog;
})(typeof window === "undefined" ? {} : window);
