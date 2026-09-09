import type { RunWork } from "./sellerCore.js";

export class GridInputError extends Error {}

const bounds = {
  price: [0.000001, 1e9], lower: [0.000001, 1e9], upper: [0.000001, 1e9],
  levels: [2, 100], capital: [1, 1e9], feeBps: [0, 1000],
  slippageBps: [0, 1000], gasPerTrade: [0, 1e5],
} as const;
type GridInput = Record<keyof typeof bounds, number>;
const invalid = (message: string): never => { throw new GridInputError(message); };
function object(value: unknown): Record<string, unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value))
    return invalid("Expected a structured grid analysis object.");
  return value as Record<string, unknown>;
}

/** The task description itself is JSON so the signed task binds every input. */
export function parseGridTask(prompt: unknown): GridInput {
  if (typeof prompt !== "string" || Buffer.byteLength(prompt, "utf8") > 8192)
    return invalid("Grid task must be a JSON string of at most 8192 bytes.");
  let parsed: unknown;
  try { parsed = JSON.parse(prompt); } catch { return invalid("Grid task must be valid JSON."); }
  const task = object(parsed);
  if (task.type !== "grid_analysis" || task.version !== 1)
    return invalid("Supported task: type grid_analysis, version 1.");
  if (Object.keys(task).some(key => !["type", "version", "inputs"].includes(key)))
    return invalid("Unsupported grid task fields.");
  const source = object(task.inputs);
  if (Object.keys(source).some(key => !Object.hasOwn(bounds, key)))
    return invalid("Unsupported grid input fields.");
  const input = {} as GridInput;
  for (const key of Object.keys(bounds) as (keyof GridInput)[]) {
    const raw = source[key];
    if (typeof raw !== "number" &&
        !(typeof raw === "string" && /^\d+(?:\.\d+)?$/.test(raw)))
      return invalid(`${key} must be a number or unsigned decimal string.`);
    const value = Number(raw);
    const [min, max] = bounds[key];
    if (!Number.isFinite(value) || value < min || value > max ||
        (key === "levels" && !Number.isInteger(value)))
      return invalid(`${key} must be ${key === "levels" ? "an integer " : ""}between ${min} and ${max}.`);
    input[key] = value;
  }
  if (input.upper <= input.lower) return invalid("upper must be greater than lower.");
  return input;
}

export function validateGridQuote(request: Record<string, unknown>): void {
  parseGridTask(request.task_description);
}

const rounded = (value: number) => Number(value.toPrecision(12));

/** Deploy-contained implementation of lib/analysis.js grid formulas. */
export const runGridWork: RunWork = async (prompt, { abortSignal }) => {
  abortSignal?.throwIfAborted();
  const p = parseGridTask(prompt);
  const step = (p.upper - p.lower) / (p.levels - 1);
  const budget = p.capital / (p.levels - 1);
  const costs = (p.feeBps + p.slippageBps) / 10000;
  // Binary arithmetic is adequate for scenario estimates, not token settlement.
  // Treat machine-roundoff-sized margins as unresolved rather than profitable.
  const tolerance = Number.EPSILON * Math.max(p.capital, p.gasPerTrade * 2, 1) * 64;
  const rows = Array.from({ length: p.levels - 1 }, (_, i) => {
    const buy = p.lower + step * i;
    const sell = buy + step;
    const quantity = budget / (buy * (1 + costs));
    const net = quantity * sell * (1 - costs) - budget - 2 * p.gasPerTrade;
    return { interval: i + 1, buy: rounded(buy), sell: rounded(sell),
      baseQuantity: rounded(quantity), allocatedQuote: rounded(budget),
      netPerCycle: rounded(net) };
  });
  const worst = Math.min(...rows.map(row => row.netPerCycle));
  const decision = p.price < p.lower || p.price > p.upper ? "OUTSIDE_RANGE"
    : worst < -tolerance ? "COSTS_EXCEED_SPREAD"
    : worst <= tolerance ? "BREAK_EVEN_WITHIN_PRECISION"
    : "FEASIBLE_UNDER_ASSUMPTIONS";
  return JSON.stringify({
    schemaVersion: 1, agent: "b8xgrid", title: "Grid feasibility", decision,
    summary: decision === "OUTSIDE_RANGE" ? "Spot price is outside the selected range."
      : decision === "COSTS_EXCEED_SPREAD" ? "At least one interval loses money after configured costs."
      : decision === "BREAK_EVEN_WITHIN_PRECISION" ? "The weakest interval is at break-even within numerical precision."
      : "All intervals clear configured round-trip costs. Fills are not guaranteed.",
    inputs: p, dataSource: "buyer-supplied scenario; no live market data fetched",
    metrics: { priceStep: rounded(step), budgetPerInterval: rounded(budget),
      worstCycleNet: worst, levels: p.levels, numericalToleranceQuote: tolerance },
    columns: ["interval", "buy", "sell", "baseQuantity", "allocatedQuote", "netPerCycle"],
    rows,
    assumptions: [
      "Arithmetic grid; prices and costs use one quote currency.",
      "Each interval is an independent buy-then-sell cycle; capital starts in quote currency.",
      "Fees and slippage apply to both legs; gas is charged twice per cycle and requires a separate reserve.",
      "No execution, inventory simulation, fill probability, realized PnL or market forecast.",
      "IEEE-754 scenario estimates rounded to 12 significant digits; not token settlement amounts.",
    ],
    formulas: ["step = (upper - lower) / (levels - 1)",
      "budget = capital / (levels - 1)",
      "quantity = budget / (buy * (1 + feeBps / 10000 + slippageBps / 10000))",
      "net = quantity * sell * (1 - feeBps / 10000 - slippageBps / 10000) - budget - 2 * gasPerTrade"],
  });
};
