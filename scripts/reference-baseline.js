// Independent, non-marketplace JavaScript calculation. No calls to the engine.
module.exports = function baseline(slug, p) {
  if (slug === "b8xgrid") {
    const step = (p.upper - p.lower) / (p.levels - 1),
      budget = p.capital / (p.levels - 1);
    const net = Array.from({ length: p.levels - 1 }, (_, i) => {
      const buy = p.lower + i * step;
      return (
        (budget / (buy * (1 + (p.feeBps + p.slippageBps) / 10000))) *
          (buy + step) *
          (1 - (p.feeBps + p.slippageBps) / 10000) -
        budget -
        2 * p.gasPerTrade
      );
    });
    return {
      priceStep: step,
      budgetPerInterval: budget,
      worstCycleNet: Math.min(...net),
      levels: p.levels,
    };
  }
  if (slug === "b8xrebal") {
    const cost = p.gasCost + (p.capital * p.slippageBps) / 10000;
    return {
      inRange: p.price >= p.lower && p.price < p.upper,
      estimatedMoveCost: cost,
      scenarioFees: p.expectedDailyFees * p.horizonDays,
      breakEvenDays:
        p.expectedDailyFees === 0 ? null : cost / p.expectedDailyFees,
    };
  }
  if (slug === "b8xyield") {
    const eligible = p.routes
      .filter(
        (r) => r.availableLiquidity >= p.capital && r.lockDays <= p.horizonDays,
      )
      .map((r) => ({
        name: r.name,
        net:
          (((p.capital * r.aprPercent) / 100) * p.horizonDays) / 365 -
          r.roundTripCost,
      }))
      .filter((r) => r.net > 0)
      .sort((a, b) => b.net - a.net);
    return {
      bestRoute: eligible[0]?.name || null,
      bestNetReturn: eligible[0]?.net ?? null,
      horizonDays: p.horizonDays,
    };
  }
  const adjusted = (p.collateralValue * p.liquidationThresholdPercent) / 100,
    stressed = adjusted * (1 - p.priceDropPercent / 100);
  return {
    healthFactor: p.debtValue === 0 ? null : adjusted / p.debtValue,
    stressedHealthFactor: p.debtValue === 0 ? null : stressed / p.debtValue,
    priceDropToLiquidationPercent:
      p.debtValue === 0 ? null : (1 - p.debtValue / adjusted) * 100,
    repayAfterShock: Math.max(0, p.debtValue - stressed / p.targetHealth),
    topUpAfterShock: Math.max(
      0,
      (p.targetHealth * p.debtValue - stressed) /
        (p.liquidationThresholdPercent / 100),
    ),
  };
};
