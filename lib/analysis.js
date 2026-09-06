const Decimal = require('decimal.js');
const { createHash, randomUUID } = require('node:crypto');
const D = value => new Decimal(value);
const n = value => Number(D(value).toSignificantDigits(12));
class InputError extends Error {}
function num(p, key, min, max, integer = false) {
  const value = p[key];
  if ((typeof value !== 'number' && typeof value !== 'string') || String(value).trim() === '') throw new InputError(`${key} is required.`);
  const result = Number(value);
  if (!Number.isFinite(result) || result < min || result > max || (integer && !Number.isInteger(result))) throw new InputError(`${key} must be ${integer ? 'an integer ' : ''}between ${min} and ${max}.`);
  return D(value);
}
function grid(p) {
  const price = num(p, 'price', .000001, 1e9), lower = num(p, 'lower', .000001, 1e9), upper = num(p, 'upper', .000001, 1e9);
  const levels = num(p, 'levels', 2, 100, true).toNumber(), capital = num(p, 'capital', 1, 1e9);
  const fee = num(p, 'feeBps', 0, 1000).div(10000), slip = num(p, 'slippageBps', 0, 1000).div(10000), gas = num(p, 'gasPerTrade', 0, 1e5);
  if (upper.lte(lower)) throw new InputError('upper must be greater than lower.');
  const step = upper.minus(lower).div(levels - 1), budget = capital.div(levels - 1);
  const rows = Array.from({ length: levels - 1 }, (_, i) => {
    const buy = lower.plus(step.times(i)), sell = buy.plus(step);
    const quantity = budget.div(buy.times(D(1).plus(fee).plus(slip)));
    const proceeds = quantity.times(sell).times(D(1).minus(fee).minus(slip));
    return { interval: i + 1, buy: n(buy), sell: n(sell), baseQuantity: n(quantity), allocatedQuote: n(budget), netPerCycle: n(proceeds.minus(budget).minus(gas.times(2))) };
  });
  const outside = price.lt(lower) || price.gt(upper), worst = Math.min(...rows.map(r => r.netPerCycle));
  return {
    title: 'Grid feasibility', decision: outside ? 'OUTSIDE_RANGE' : worst <= 0 ? 'COSTS_EXCEED_SPREAD' : 'FEASIBLE_UNDER_ASSUMPTIONS',
    summary: outside ? 'Spot price is outside the selected range.' : worst <= 0 ? 'At least one interval loses money after the configured costs.' : 'All intervals clear the configured round-trip costs. Fills are not guaranteed.',
    metrics: { priceStep: n(step), budgetPerInterval: n(budget), worstCycleNet: worst, levels },
    columns: ['interval', 'buy', 'sell', 'baseQuantity', 'allocatedQuote', 'netPerCycle'], rows,
    assumptions: ['Arithmetic grid; quote currency units throughout.', 'Each interval is an independent buy-then-sell cycle; all capital starts in quote currency.', 'Fees and slippage charged on each leg; gas charged twice per cycle.', 'No order execution, inventory simulation, fill probability or realized PnL.'],
    formulas: ['step = (upper - lower) / (levels - 1)', 'quantity = budget / (buy * (1 + fee + slippage))', 'net = quantity * sell * (1 - fee - slippage) - budget - 2 * gas']
  };
}
function rebalance(p) {
  const price = num(p, 'price', .000001, 1e9), lower = num(p, 'lower', .000001, 1e9), upper = num(p, 'upper', .000001, 1e9);
  const width = num(p, 'halfWidthPercent', .1, 90).div(100), capital = num(p, 'capital', 1, 1e9);
  const gas = num(p, 'gasCost', 0, 1e5), slip = num(p, 'slippageBps', 0, 1000).div(10000), fees = num(p, 'expectedDailyFees', 0, 1e6), days = num(p, 'horizonDays', 1, 365, true);
  if (upper.lte(lower)) throw new InputError('upper must be greater than lower.');
  const newLower = price.times(D(1).minus(width)), newUpper = price.times(D(1).plus(width));
  const sqrtP = price.sqrt(), sqrtA = newLower.sqrt(), sqrtB = newUpper.sqrt();
  const token0PerL = D(1).div(sqrtP).minus(D(1).div(sqrtB)), token1PerL = sqrtP.minus(sqrtA);
  const liquidity = capital.div(token0PerL.times(price).plus(token1PerL));
  const cost = gas.plus(capital.times(slip)), expected = fees.times(days), inRange = price.gte(lower) && price.lt(upper);
  return {
    title: 'LP range review', decision: inRange ? 'KEEP_RANGE' : expected.gt(cost) ? 'REVIEW_RECENTER' : 'WAIT_COST_THRESHOLD',
    summary: inRange ? 'Spot is inside the current range. No range move is proposed.' : expected.gt(cost) ? 'The range is inactive; the supplied fee scenario exceeds the estimated move cost.' : 'The range is inactive, but the supplied fee scenario does not cover the move cost.',
    metrics: { inRange, estimatedMoveCost: n(cost), scenarioFees: n(expected), breakEvenDays: fees.isZero() ? null : n(cost.div(fees)) },
    columns: ['range', 'lower', 'upper', 'baseAmount', 'quoteAmount'],
    rows: [{ range: 'Current', lower: n(lower), upper: n(upper), baseAmount: null, quoteAmount: null }, { range: 'Candidate', lower: n(newLower), upper: n(newUpper), baseAmount: n(liquidity.times(token0PerL)), quoteAmount: n(liquidity.times(token1PerL)) }],
    assumptions: ['Concentrated-liquidity range analysis, not a 60/40 portfolio rebalance.', 'Price is quote per base token. Candidate amounts follow concentrated-liquidity square-root formulas.', 'Bounds are theoretical: no token-decimal conversion, tick-spacing alignment or mint transaction.', 'Daily fees are a user scenario, not measured fees or a forecast. Move cost conservatively applies slippage to the whole capital.', 'No NFT position is read or changed; current holdings and impermanent loss are not estimated.'],
    formulas: ['candidate bounds = spot * (1 +/- halfWidthPercent / 100)', 'amount0 / L = 1 / sqrt(spot) - 1 / sqrt(upper)', 'amount1 / L = sqrt(spot) - sqrt(lower)', 'move cost = gas + capital * slippage; break-even days = cost / daily fees']
  };
}
function yieldAnalysis(p) {
  const capital = num(p, 'capital', 1, 1e9), days = num(p, 'horizonDays', 1, 365, true);
  if (!Array.isArray(p.routes) || p.routes.length < 2 || p.routes.length > 10) throw new InputError('Provide 2 to 10 yield routes.');
  const names = new Set();
  const rows = p.routes.map(route => {
    if (!route || typeof route.name !== 'string' || !route.name.trim() || route.name.length > 60 || names.has(route.name.trim())) throw new InputError('Route names must be unique, non-empty, and at most 60 characters.');
    names.add(route.name.trim());
    const apr = num(route, 'aprPercent', 0, 500), cost = num(route, 'roundTripCost', 0, 1e6), liquidity = num(route, 'availableLiquidity', 0, 1e12), lock = num(route, 'lockDays', 0, 3650, true);
    const gross = capital.times(apr).div(100).times(days).div(365), net = gross.minus(cost);
    return { name: route.name.trim(), aprPercent: n(apr), grossReturn: n(gross), roundTripCost: n(cost), netReturn: n(net), netAnnualizedPercent: n(net.div(capital).times(365).div(days).times(100)), eligible: liquidity.gte(capital) && lock.lte(days), exclusion: liquidity.lt(capital) ? 'Insufficient exit liquidity' : lock.gt(days) ? 'Lock exceeds horizon' : null };
  }).sort((a, b) => Number(b.eligible) - Number(a.eligible) || b.netReturn - a.netReturn);
  const best = rows.find(r => r.eligible && r.netReturn > 0);
  return {
    title: 'Yield route comparison', decision: best ? 'REVIEW_ROUTE' : 'NO_POSITIVE_ELIGIBLE_ROUTE', summary: best ? `${best.name} has the largest positive net return among eligible supplied routes.` : 'No supplied route is both eligible and net positive.',
    metrics: { bestRoute: best?.name || null, bestNetReturn: best?.netReturn ?? null, horizonDays: n(days) },
    columns: ['name', 'aprPercent', 'grossReturn', 'roundTripCost', 'netReturn', 'eligible', 'exclusion'], rows,
    assumptions: ['User-supplied route data, not verified protocol yields or safety ratings.', 'Simple APR, no compounding or token-price change; all values use one quote currency.', 'Full capital is evaluated separately in each route; this is not a simultaneous allocation.', 'Liquidity and lock duration are mechanical filters; contract, oracle and depeg risk remain unpriced.'],
    formulas: ['gross = capital * APR / 100 * days / 365', 'net = gross - roundTripCost', 'eligible = availableLiquidity >= capital AND lockDays <= horizonDays']
  };
}
function health(p) {
  const collateral = num(p, 'collateralValue', .01, 1e12), debt = num(p, 'debtValue', 0, 1e12), threshold = num(p, 'liquidationThresholdPercent', 1, 100).div(100), target = num(p, 'targetHealth', 1.01, 5), stress = num(p, 'priceDropPercent', 0, 99).div(100);
  const adjusted = collateral.times(threshold), stressed = adjusted.times(D(1).minus(stress));
  const factor = debt.isZero() ? null : adjusted.div(debt), stressFactor = debt.isZero() ? null : stressed.div(debt);
  const repay = Decimal.max(0, debt.minus(stressed.div(target))), topup = Decimal.max(0, target.times(debt).minus(stressed).div(threshold));
  return {
    title: 'Liquidation stress check', decision: debt.isZero() ? 'NO_DEBT' : factor.lt(1) ? 'LIQUIDATION_THRESHOLD_BREACHED' : stressFactor.lt(1) ? 'STRESS_BREACH' : stressFactor.lt(target) ? 'BELOW_TARGET_UNDER_STRESS' : 'ABOVE_TARGET_UNDER_STRESS',
    summary: debt.isZero() ? 'No debt was supplied; the health factor is not applicable.' : 'The table shows current and stressed collateral coverage, with two alternative ways to reach the target after the shock.',
    metrics: { healthFactor: factor === null ? null : n(factor), stressedHealthFactor: stressFactor === null ? null : n(stressFactor), priceDropToLiquidationPercent: debt.isZero() ? null : n(D(1).minus(debt.div(adjusted)).times(100)), repayAfterShock: n(repay), topUpAfterShock: n(topup) },
    columns: ['scenario', 'collateralValue', 'debtValue', 'healthFactor'],
    rows: [{ scenario: 'Current', collateralValue: n(collateral), debtValue: n(debt), healthFactor: factor === null ? null : n(factor) }, { scenario: 'After price shock', collateralValue: n(collateral.times(D(1).minus(stress))), debtValue: n(debt), healthFactor: stressFactor === null ? null : n(stressFactor) }],
    assumptions: ['User-supplied single collateral basket, one effective liquidation threshold and constant quote-denominated debt.', 'Generic health-factor model, not a verified Venus account or protocol-specific liquidation prediction.', 'Repay and top-up are alternatives, valued after the shock. Interest, gas, oracle delay and liquidation penalties are excluded.', 'A completed check does not start continuous monitoring or protect a position.'],
    formulas: ['HF = collateral value * liquidation threshold / debt', 'repay = max(0, debt - stressed adjusted collateral / target HF)', 'top-up = max(0, (target HF * debt - stressed adjusted collateral) / threshold)']
  };
}
const ENGINES = { b8xrebal: rebalance, b8xgrid: grid, b8xyield: yieldAnalysis, b8xhealth: health };
function analyze(slug, input, source = { kind: 'user_input', description: 'All values supplied by the user; not independently verified.' }) {
  if (!ENGINES[slug]) throw new InputError('Unknown agent.');
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new InputError('input must be an object.');
  const started = performance.now(), result = ENGINES[slug](input);
  return { id: randomUUID(), status: 'completed', agent: slug, engine: 'deterministic-analysis', engineVersion: '2.0.0', completedAt: new Date().toISOString(), durationMs: Math.round((performance.now() - started) * 1000) / 1000, fee: { amount: '0', unit: 'USD', gasPaid: '0' }, execution: 'read_only_analysis', input, inputSha256: createHash('sha256').update(JSON.stringify(input)).digest('hex'), source, result };
}
module.exports = { analyze, InputError };
