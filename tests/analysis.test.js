const { test } = require("node:test");
const assert = require("node:assert/strict");
const { analyze, InputError } = require("../lib/analysis");
const { handleA2a, handleAgent } = require("../lib/b8x-agent");
const catalog = require("../catalog");
const inputFor = (slug) => {
  const a = catalog.find((a) => a.slug === slug);
  return {
    ...Object.fromEntries(a.fields.map((f) => [f.key, f.value])),
    ...(a.routes ? { routes: structuredClone(a.routes) } : {}),
  };
};
const result = (slug, patch = {}) =>
  analyze(slug, { ...inputFor(slug), ...patch }).result;
const close = (actual, expected) =>
  assert.ok(Math.abs(actual - expected) < 1e-7, `${actual} != ${expected}`);
test("all four engines complete with inputs, formulas and provenance", () => {
  for (const a of catalog) {
    const r = analyze(a.slug, inputFor(a.slug));
    assert.equal(r.status, "completed");
    assert.equal(r.source.kind, "user_input");
    assert.ok(r.result.rows.length);
    assert.match(r.inputSha256, /^[a-f0-9]{64}$/);
  }
});
test("grid no-cost fixture has exactly 3 levels and 2 fully allocated intervals", () => {
  const r = result("b8xgrid", {
    price: 100,
    lower: 90,
    upper: 110,
    levels: 3,
    capital: 180,
    feeBps: 0,
    slippageBps: 0,
    gasPerTrade: 0,
  });
  close(r.metrics.priceStep, 10);
  close(r.rows[0].baseQuantity, 1);
  close(r.rows[0].netPerCycle, 10);
  close(r.rows[1].netPerCycle, 9);
  close(
    r.rows.reduce((s, r) => s + r.allocatedQuote, 0),
    180,
  );
});
test("grid rejects uneconomic costs and detects outside price", () => {
  assert.equal(result("b8xgrid").decision, "COSTS_EXCEED_SPREAD");
  assert.equal(result("b8xgrid", { price: 100 }).decision, "OUTSIDE_RANGE");
});
test("LP bounds, budget conservation and cost threshold", () => {
  const r = result("b8xrebal");
  close(r.rows[1].lower, 570);
  close(r.rows[1].upper, 630);
  close(r.metrics.estimatedMoveCost, 12);
  close(r.metrics.breakEvenDays, 2.4);
  close(r.rows[1].baseAmount * 600 + r.rows[1].quoteAmount, 10000);
  assert.equal(r.decision, "REVIEW_RECENTER");
  assert.equal(
    result("b8xrebal", { lower: 550, upper: 650 }).decision,
    "KEEP_RANGE",
  );
  assert.equal(
    result("b8xrebal", { expectedDailyFees: 0 }).decision,
    "WAIT_COST_THRESHOLD",
  );
});
test("yield excludes high APR with insufficient liquidity or long lock", () => {
  const r = result("b8xyield");
  assert.equal(r.metrics.bestRoute, "Scenario A");
  close(r.rows[0].netReturn, (10000 * 0.08 * 30) / 365 - 12);
  assert.equal(r.rows.at(-1).eligible, false);
});
test("health stress and two recovery actions reach target", () => {
  const r = result("b8xhealth");
  close(r.metrics.healthFactor, 4 / 3);
  close(r.metrics.stressedHealthFactor, 16 / 15);
  close(r.metrics.repayAfterShock, 6000 - 6400 / 1.3);
  close(r.metrics.topUpAfterShock, 1750);
  assert.equal(r.decision, "BELOW_TARGET_UNDER_STRESS");
});
test("health no debt and breach cases", () => {
  const noDebt = result("b8xhealth", { debtValue: 0 });
  assert.equal(noDebt.decision, "NO_DEBT");
  assert.equal(noDebt.metrics.healthFactor, null);
  assert.equal(
    result("b8xhealth", { debtValue: 9000 }).decision,
    "LIQUIDATION_THRESHOLD_BREACHED",
  );
});
test("reject malformed and economically invalid values", () => {
  for (const patch of [
    { levels: -12 },
    { levels: 2.2 },
    { price: null },
    { capital: Infinity },
    { lower: 700 },
    { feeBps: true },
    { price: "" },
  ])
    assert.throws(() => result("b8xgrid", patch), InputError);
  assert.throws(() => result("b8xyield", { routes: [null, null] }), InputError);
});
async function rpc(payload, id = 0, method = "message/send") {
  let response;
  const res = {
    setHeader() {},
    end(text) {
      response = { status: this.statusCode, body: JSON.parse(text) };
    },
  };
  await handleA2a(
    {
      method: "POST",
      headers: {},
      body: {
        jsonrpc: "2.0",
        id,
        method,
        params: { message: { parts: [{ kind: "data", data: payload }] } },
      },
    },
    res,
    "b8xgrid",
  );
  return response;
}
test("API preserves zero id and returns completed A2A message", async () => {
  const r = await rpc({ skill: "analyze", input: inputFor("b8xgrid") });
  assert.equal(r.status, 200);
  assert.equal(r.body.id, 0);
  assert.equal(r.body.result.kind, "message");
  assert.equal(r.body.result.parts[0].data.status, "completed");
});
test("API never accepts nonexistent funded jobs", async () => {
  const r = await rpc({ skill: "notify_funded" });
  assert.equal(r.status, 400);
  assert.ok(r.body.error);
});
test("API rejects wrong RPC methods and invalid parameters", async () => {
  assert.equal(
    (await rpc({ skill: "analyze", input: {} }, "x", "bad")).body.error.code,
    -32601,
  );
  assert.equal(
    (await rpc({ skill: "analyze", input: {} })).body.error.code,
    -32602,
  );
});
test("card uses trusted origin even with forged forwarded host", () => {
  let card;
  handleAgent(
    { method: "GET", headers: { "x-forwarded-host": "evil.example" } },
    {
      setHeader() {},
      end(s) {
        card = JSON.parse(s);
      },
    },
    "b8xgrid",
  );
  assert.equal(new URL(card.url).host, "b8xmarket-repo.vercel.app");
  assert.equal(card.metadata.registry.status, "registered_endpoint_verified_2026-09-09");
  assert.equal(card.metadata.registry.verificationBlock, "129959947");
  assert.equal(card.metadata.activationEvidence.jobId, 1186);
  assert.equal(card.metadata.activationEvidence.status, "SUBMITTED");
  assert.equal(card.metadata.paidHiring, false);
});
