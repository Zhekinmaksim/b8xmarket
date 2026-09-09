import assert from "node:assert/strict";
import test from "node:test";
import { parseGridTask, runGridWork } from "./gridWork.js";
import { SellerCore, type SigningApi } from "./sellerCore.js";

const inputs = { price: 600, lower: 500, upper: 700, levels: 5,
  capital: 1000, feeBps: 0, slippageBps: 0, gasPerTrade: 0 };
const task = (overrides = {}) => JSON.stringify({ type: "grid_analysis", version: 1,
  inputs: { ...inputs, ...overrides } });
const work = async (overrides = {}) => JSON.parse(await runGridWork(task(overrides), { sessionId: "test" }));

test("deliverable contains auditable quantities, costs and independent cycle results", async () => {
  const report = await work();
  assert.equal(report.decision, "FEASIBLE_UNDER_ASSUMPTIONS");
  assert.equal(report.rows.length, 4);
  assert.equal(report.metrics.priceStep, 50);
  assert.equal(report.rows[0].baseQuantity, 0.5);
  assert.equal(report.rows[0].netPerCycle, 25);
  assert.equal(report.rows.reduce((sum: number, row: { allocatedQuote: number }) => sum + row.allocatedQuote, 0), 1000);
  assert.ok(Math.abs(report.metrics.worstCycleNet - 250 / 13) < 1e-9);
  assert.match(report.dataSource, /buyer-supplied/);
  assert.ok(report.formulas.length >= 3);
  const costed = await work({ feeBps: 10, slippageBps: 5, gasPerTrade: 0.1 });
  const expected = 250 / (500 * 1.0015) * 550 * 0.9985 - 250 - 0.2;
  assert.ok(Math.abs(costed.rows[0].netPerCycle - expected) < 1e-9);
});

test("range, unprofitable, break-even and maximum-size scenarios", async () => {
  assert.equal((await work({ price: 701 })).decision, "OUTSIDE_RANGE");
  assert.equal((await work({ gasPerTrade: 100 })).decision, "COSTS_EXCEED_SPREAD");
  assert.equal((await work({ upper: 600, levels: 2, gasPerTrade: 100 })).decision, "BREAK_EVEN_WITHIN_PRECISION");
  assert.equal((await work({ levels: 100 })).rows.length, 99);
  assert.equal((await work({ price: 500 })).decision, "FEASIBLE_UNDER_ASSUMPTIONS");
  assert.equal((await work({ price: 700 })).decision, "FEASIBLE_UNDER_ASSUMPTIONS");
});

test("rejects ambiguous, unsupported and oversized inputs without guessing", async () => {
  for (const prompt of ["recommend a profitable grid", "null", "[]", "x".repeat(8193),
    task({ levels: 101 }), task({ levels: 2.5 }), task({ feeBps: -1 }),
    task({ capital: true }), task({ upper: 500 }), task({ price: "Infinity" }),
    task({ price: "0x100" }), task({ price: null }), task({ extra: 1 })]) {
    assert.throws(() => parseGridTask(prompt));
    await assert.rejects(runGridWork(prompt, { sessionId: "invalid" }));
  }
  assert.equal(parseGridTask(task({ capital: "1000.00" })).capital, 1000);
  await assert.rejects(runGridWork(task(), { sessionId: "aborted", abortSignal: AbortSignal.abort() }));
});

test("quote validates before signing; verified delivery submits the valuable report once", async () => {
  let quotes = 0;
  const submitted: string[] = [];
  const signing: SigningApi = {
    listPrice: () => 10n, clampPrice: value => value,
    signQuote: async (request, price) => { quotes++; assert.equal(price, 10n); return request; },
    verifySignedJob: async () => ({ ok: true, permanent: false, reason: "" }),
    jobSpec: async () => ({ task: task(), terms: {} }),
    submitResult: async (_id, content) => { submitted.push(content); return { submitTx: "mock", deliverableUrl: null }; },
  };
  const core = new SellerCore({ runWork: runGridWork, generator: "test", signing,
    pendingJobs: async () => ({}) });
  assert.equal((await core.negotiate({ task_description: "freeform" })).status, "rejected");
  assert.equal(quotes, 0);
  await core.negotiate({ request: { task_description: task() } });
  assert.equal(quotes, 1);
  assert.equal((await core.notifyFunded({ job_id: 1 })).status, "accepted");
  await core.drain();
  await core.notifyFunded({ job_id: 1 });
  await core.drain();
  assert.equal(submitted.length, 1);
  assert.equal(JSON.parse(submitted[0]).rows[0].netPerCycle, 25);
});

test("unverified or malformed funded jobs never submit a fake deliverable", async () => {
  for (const verified of [false, true]) {
    let submitted = false;
    const signing: SigningApi = {
      listPrice: () => 0n, clampPrice: value => value, signQuote: async () => ({}),
      verifySignedJob: async () => ({ ok: verified, permanent: true, reason: "mock rejection" }),
      jobSpec: async () => ({ task: "unsupported task", terms: {} }),
      submitResult: async () => { submitted = true; throw new Error("must not submit"); },
    };
    const core = new SellerCore({ runWork: runGridWork, generator: "test", signing,
      pendingJobs: async () => ({}) });
    await core.notifyFunded({ job_id: 2 });
    await core.drain();
    assert.equal(submitted, false);
  }
});
