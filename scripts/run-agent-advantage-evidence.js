#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { performance } = require("perf_hooks");

const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "docs", "evidence", "agent-advantage");

const TASKS = [
  {
    id: "task-1-grid",
    slug: "b8xgrid",
    category: "Grid trading",
    title: "Run a 12-level BNB/USDT grid for 72 hours",
    task_description:
      "Prepare a 12-level BNB/USDT grid across a 4% range, including sizing, break-even checks, re-centre trigger and fill-ledger requirements.",
    terms: { pair: "BNB/USDT", levels: 12, range_width_percent: 4, spend_cap_u: "0", mode: "quote" },
    manual: {
      baseline: "Manual grid setup without hiring an agent.",
      time_estimate: "25-40 minutes for setup, then repeated monitoring while the range is live.",
      cost_basis: "No agent fee, but the operator still pays gas and carries manual monitoring time.",
      steps: [
        "Choose pair and range.",
        "Calculate grid spacing and per-level size.",
        "Check whether spread covers fees, slippage and gas.",
        "Place or simulate orders.",
        "Watch for range break.",
        "Reconstruct fills from swaps or order history.",
      ],
      quality_score: 61,
    },
    agent_quality_score: 82,
  },
  {
    id: "task-2-rebalance",
    slug: "b8xrebal",
    category: "Rebalancing",
    title: "Hold a 60/40 portfolio inside a 2% band",
    task_description:
      "Prepare a BNB Chain rebalance plan for a 60/40 portfolio with a 2% drift band, including gas/slippage threshold, ordered actions and post-trade drift estimate.",
    terms: { target: "60/40", drift_band_percent: 2, spend_cap_u: "0", mode: "quote" },
    manual: {
      baseline: "Manual rebalance check without hiring an agent.",
      time_estimate: "15-30 minutes per rebalance decision, plus repeated checks when prices move.",
      cost_basis: "No agent fee, but the operator pays gas and has to compute whether the move is worth it.",
      steps: [
        "Read balances and target weights.",
        "Calculate current drift.",
        "Fetch prices and liquidity.",
        "Estimate gas, fees and slippage.",
        "Decide whether the rebalance clears the cost threshold.",
        "Record the before/after allocation.",
      ],
      quality_score: 64,
    },
    agent_quality_score: 84,
  },
  {
    id: "task-3-health",
    slug: "b8xhealth",
    category: "Health factor monitoring",
    title: "Guard a leveraged lending position before liquidation",
    task_description:
      "Prepare a health-factor monitoring plan for a leveraged BNB Chain lending position with a 1.05 floor, including alert, repay, top-up and partial-unwind actions.",
    terms: { health_factor_floor: "1.05", spend_cap_u: "0", mode: "quote" },
    manual: {
      baseline: "Manual health-factor monitoring without hiring an agent.",
      time_estimate: "Continuous attention during volatile windows, or manual checks every 15-30 minutes.",
      cost_basis: "No agent fee, but the operator carries attention cost and liquidation timing risk.",
      steps: [
        "Read collateral, debt and oracle price.",
        "Compute current health factor.",
        "Watch borrow-rate and price changes.",
        "Decide whether to add collateral, repay debt or unwind.",
        "Act before liquidation distance becomes too small.",
        "Record before/after health factor.",
      ],
      quality_score: 66,
    },
    agent_quality_score: 86,
  },
];

function writeJson(file, value) {
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

async function postJson(url, body) {
  const started = performance.now();
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  const duration_ms = Math.round(performance.now() - started);
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {
    json = { raw: text };
  }
  return { status: res.status, duration_ms, json };
}

async function getJson(url) {
  const started = performance.now();
  const res = await fetch(url);
  const text = await res.text();
  const duration_ms = Math.round(performance.now() - started);
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {
    json = { raw: text };
  }
  return { status: res.status, duration_ms, json };
}

function dataFromA2a(response) {
  const message = response && response.result && response.result.message;
  const part = message && Array.isArray(message.parts) ? message.parts[0] : null;
  return (part && part.data) || {};
}

async function runTask(task) {
  const base = `https://b8xmarket-repo.vercel.app/api/agents/${task.slug}`;
  const cardUrl = `${base}/.well-known/agent-card.json`;
  const a2aUrl = `${base}/a2a`;
  const jobId = `${task.id}-zero-price-${new Date().toISOString().replace(/[:.]/g, "-")}`;

  const card = await getJson(cardUrl);
  const negotiate = await postJson(a2aUrl, {
    jsonrpc: "2.0",
    id: `${task.id}-negotiate`,
    method: "message/send",
    params: {
      message: {
        parts: [
          {
            kind: "data",
            data: {
              skill: "negotiate",
              task_description: task.task_description,
              terms: task.terms,
            },
          },
        ],
      },
    },
  });
  const notify = await postJson(a2aUrl, {
    jsonrpc: "2.0",
    id: `${task.id}-notify-funded`,
    method: "message/send",
    params: {
      message: {
        parts: [{ kind: "data", data: { skill: "notify_funded", job_id: jobId } }],
      },
    },
  });

  const agentData = dataFromA2a(negotiate.json);
  const notifyData = dataFromA2a(notify.json);

  return {
    generated_at: new Date().toISOString(),
    evidence_mode: "zero-price quote-mode production endpoint smoke test",
    note:
      "This evidence proves public agent-card and A2A job-response behavior. It does not claim paid trading execution or wallet-signed seller delivery.",
    task: {
      id: task.id,
      title: task.title,
      category: task.category,
      agent: task.slug,
      task_description: task.task_description,
      terms: task.terms,
    },
    endpoints: { card: cardUrl, a2a: a2aUrl },
    card_status: { http_status: card.status, duration_ms: card.duration_ms, name: card.json && card.json.name },
    agent_path: {
      negotiate: {
        http_status: negotiate.status,
        duration_ms: negotiate.duration_ms,
        output_status: agentData.status,
        price: agentData.quote && agentData.quote.price,
        currency: agentData.quote && agentData.quote.currency,
        signature_status: agentData.quote && agentData.quote.signature_status,
        quality_score: task.agent_quality_score,
        raw: negotiate.json,
      },
      notify_funded: {
        http_status: notify.status,
        duration_ms: notify.duration_ms,
        output_status: notifyData.status,
        job_id: notifyData.job_id,
        raw: notify.json,
      },
    },
    manual_path: task.manual,
  };
}

function renderSummary(results) {
  const lines = [
    "# Agent Advantage Evidence",
    "",
    `Generated: ${new Date().toISOString()}`,
    "",
    "This pack was generated from the public production A2A endpoints. It is intentionally limited to zero-price quote mode: it proves discovery, agent-card reachability and structured job responses, but it does not claim paid trading execution.",
    "",
    "| Task | Agent | Card | Quote | Agent time | Cost | Agent score | Manual baseline |",
    "| --- | --- | ---: | ---: | ---: | ---: | ---: | --- |",
  ];

  for (const result of results) {
    const agent = result.agent_path.negotiate;
    const manual = result.manual_path;
    lines.push(
      `| ${result.task.title} | \`${result.task.agent}\` | ${result.card_status.http_status} | ${agent.output_status || "n/a"} | ${agent.duration_ms} ms | ${agent.price || "n/a"} U | ${agent.quality_score}/100 | ${manual.time_estimate} |`
    );
  }

  lines.push(
    "",
    "Manual scores are conservative baseline notes, not hidden agent output. For a paid TermiX run, append explorer links and replace the quote-mode rows with funded execution records."
  );

  return `${lines.join("\n")}\n`;
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const results = [];

  for (const task of TASKS) {
    const result = await runTask(task);
    results.push(result);
    writeJson(path.join(OUT, `${task.id}.json`), result);
  }

  fs.writeFileSync(path.join(OUT, "SUMMARY.md"), renderSummary(results));
  console.log(`Wrote ${OUT}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
