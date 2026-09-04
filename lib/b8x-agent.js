const ZERO_U_ADDRESS = "0xc70B8741B8B07A6d61E54fd4B20f22Fa648E5565";

const AGENTS = {
  b8xrebal: {
    slug: "b8xrebal",
    name: "b8xrebal-agent",
    title: "B8X Rebalancing Agent",
    category: "Rebalancing",
    wallet: "0xa2b4fB139150513872c68d51354e9f913A8c87a0",
    erc8004AgentId: 2095,
    riskFloor: "drift threshold",
    description:
      "B8X rebalancing agent for BNB Chain portfolios. It checks target weights, current balances, slippage and gas, then returns a bounded rebalance plan instead of trading blindly.",
    skillName: "Prepare a portfolio rebalance job",
    taskFallback: "Rebalance a BNB Chain portfolio against target weights",
    tags: ["rebalancing", "portfolio", "bnb-chain", "erc8183"],
    checks: [
      "Read target weights, current balances, prices, liquidity depth and gas.",
      "Skip trades where the drift is smaller than fees and slippage.",
      "Build an ordered swap plan with per-leg limits and fallback actions.",
      "Return a block-stamped report with expected drift after execution.",
    ],
    deliverableOutline: [
      "portfolio snapshot",
      "target-versus-current weight table",
      "gas and slippage threshold",
      "ordered rebalance plan",
      "post-trade drift estimate",
    ],
  },
  b8xgrid: {
    slug: "b8xgrid",
    name: "b8xgrid-agent",
    title: "B8X Grid Trading Agent",
    category: "Grid trading",
    wallet: "0x85aeD81F6d6e00dab442F1dd77aaE03c9cA11D89",
    erc8004AgentId: 2096,
    riskFloor: "range break",
    description:
      "B8X grid-trading analysis agent for BNB Chain. It prepares a bounded grid, checks whether the range is still valid and reports fills against the configured limits.",
    skillName: "Prepare a grid-trading job",
    taskFallback: "Place and maintain a bounded BNB Chain grid strategy",
    tags: ["grid-trading", "pancakeswap", "bnb-chain", "erc8183"],
    checks: [
      "Read the selected pair, price range, grid step, liquidity and gas.",
      "Reject a grid if the spread cannot cover fees and expected slippage.",
      "Prepare entry, re-centre and stop conditions before any execution step.",
      "Return a block-stamped fill ledger and range-status report.",
    ],
    deliverableOutline: [
      "pair and range snapshot",
      "grid levels and sizing",
      "fee and gas break-even check",
      "re-centre trigger",
      "fill ledger",
    ],
  },
  b8xyield: {
    slug: "b8xyield",
    name: "b8xyield-agent",
    title: "B8X Yield Optimisation Agent",
    category: "Yield optimisation",
    wallet: "0x9a27Cea90d0AcA683F4cAFc0C7ead0a57d7367c1",
    erc8004AgentId: 2098,
    riskFloor: "minimum net yield",
    description:
      "B8X yield-optimisation agent for BNB Chain. It compares yield routes after fees, liquidity, contract risk and gas, then returns a capped allocation plan.",
    skillName: "Prepare a yield optimisation job",
    taskFallback: "Compare BNB Chain yield routes and return a capped allocation plan",
    tags: ["yield", "defi", "bnb-chain", "erc8183"],
    checks: [
      "Read candidate pools, APY, liquidity depth, lockups and contract risk.",
      "Normalize gross APY into net expected yield after gas and fees.",
      "Apply concentration limits before recommending any route.",
      "Return a block-stamped allocation plan and monitoring triggers.",
    ],
    deliverableOutline: [
      "candidate pool table",
      "net APY comparison",
      "liquidity and risk filters",
      "allocation plan",
      "monitoring triggers",
    ],
  },
  b8xhealth: {
    slug: "b8xhealth",
    name: "b8xhealth-agent",
    title: "B8X Health Factor Agent",
    category: "Health factor monitoring",
    wallet: "0x00CCc45a862eaCEa3d421AAf4521FBc4978C3499",
    erc8004AgentId: 2097,
    riskFloor: "1.05",
    description:
      "B8X health-factor monitoring agent for BNB Chain. It checks collateral, debt, borrow rate and liquidation distance, then returns a bounded action plan before a position crosses its configured floor.",
    skillName: "Prepare a health-factor monitoring job",
    taskFallback: "Monitor a BNB Chain position health factor",
    tags: ["health-factor", "risk", "bnb-chain", "erc8183"],
    checks: [
      "Read collateral, debt, borrow rate and oracle state.",
      "Alert before the health factor crosses the configured floor.",
      "Choose top-up, partial repay or partial unwind based on gas and liquidation distance.",
      "Return a block-stamped action plan with assumptions and failure modes.",
    ],
    deliverableOutline: [
      "position snapshot",
      "health-factor floor check",
      "liquidation distance",
      "recommended collateral or debt action",
      "revocation and session-control note",
    ],
  },
};

function sendJson(res, status, body) {
  res.statusCode = status;
  res.setHeader("access-control-allow-origin", "*");
  res.setHeader("access-control-allow-methods", "GET,POST,OPTIONS");
  res.setHeader("access-control-allow-headers", "content-type,authorization");
  res.setHeader("content-type", "application/json; charset=utf-8");
  res.setHeader("cache-control", status === 200 ? "public, max-age=0, must-revalidate" : "no-store");
  res.end(status === 204 ? "" : JSON.stringify(body));
}

function getAgent(slug) {
  return AGENTS[slug] || null;
}

function getOrigin(req) {
  const proto = req.headers["x-forwarded-proto"] || "https";
  const host = req.headers["x-forwarded-host"] || req.headers.host || "b8xmarket-repo.vercel.app";
  return `${proto}://${host}`;
}

function getInvokeUrl(req, agent) {
  return `${getOrigin(req)}/api/agents/${agent.slug}/a2a`;
}

function agentCard(req, agent) {
  return {
    name: agent.name,
    description: agent.description,
    url: getInvokeUrl(req, agent),
    version: "1.0.0",
    protocolVersion: "0.3.0",
    preferredTransport: "JSONRPC",
    capabilities: { streaming: false },
    defaultInputModes: ["application/json"],
    defaultOutputModes: ["application/json"],
    metadata: {
      b8x_category: agent.category,
      erc8004_agent_id: agent.erc8004AgentId,
      wallet: agent.wallet,
      runtime: "vercel-public-a2a",
      bnb_agent_studio_source: "prepared with BNB Agent Studio workspaces",
    },
    skills: [
      {
        id: "negotiate",
        name: agent.skillName,
        description:
          "Send skill=negotiate with a task_description and optional terms. The endpoint returns a zero-price quote envelope for public B8X marketplace verification.",
        tags: agent.tags,
        inputModes: ["application/json"],
        outputModes: ["application/json"],
      },
      {
        id: "notify_funded",
        name: `Acknowledge a funded ${agent.category.toLowerCase()} job`,
        description:
          "Send skill=notify_funded with a job_id. The endpoint acknowledges the job and returns the expected deliverable outline.",
        tags: ["delivery", "bnb-chain", "b8x"],
        inputModes: ["application/json"],
        outputModes: ["application/json"],
      },
    ],
  };
}

function readBody(req) {
  if (!req.body) return {};
  if (typeof req.body === "string") return JSON.parse(req.body || "{}");
  return req.body;
}

function dataPart(req) {
  const body = readBody(req);
  req.body = body;

  const message = body.params && body.params.message;
  const part =
    message && Array.isArray(message.parts)
      ? message.parts.find((item) => item && item.kind === "data")
      : null;

  if (part && part.data) return part.data;
  if (body.params && typeof body.params === "object" && !body.params.message) return body.params;
  return body || {};
}

function rpcResponse(id, agent, data) {
  return {
    jsonrpc: "2.0",
    id: id || `${agent.slug}-response`,
    result: {
      message: {
        messageId: `${agent.slug}-${Date.now()}`,
        role: "agent",
        parts: [{ kind: "data", data }],
      },
    },
  };
}

function quoteNote(agent) {
  return [
    `${agent.title} is registered in ERC-8004 and served from a durable public Vercel A2A endpoint for the hackathon submission.`,
    "No private wallet key is stored in Vercel; the endpoint is zero-price quote mode and public verification evidence is kept in docs/LIVE_AGENT_EVIDENCE.md.",
  ].join(" ");
}

function negotiate(req, agent, payload) {
  const task = payload.task_description || payload.task || agent.taskFallback;
  const limit =
    (payload.terms && (payload.terms.health_factor_floor || payload.terms.risk_floor || payload.terms.limit)) ||
    agent.riskFloor;

  return rpcResponse(req.body && req.body.id, agent, {
    status: "quoted",
    agent: agent.name,
    category: agent.category,
    wallet: agent.wallet,
    erc8004_agent_id: agent.erc8004AgentId,
    quote: {
      price: "0",
      currency: ZERO_U_ADDRESS,
      quote_ttl_seconds: 900,
      signature_status: "vercel-fallback-unsigned",
      endpoint_status: "public-vercel-a2a",
      note: quoteNote(agent),
    },
    deliverable: {
      task,
      risk_floor: limit,
      checks: agent.checks,
    },
  });
}

function notifyFunded(req, agent, payload) {
  return rpcResponse(req.body && req.body.id, agent, {
    status: "accepted",
    agent: agent.name,
    category: agent.category,
    wallet: agent.wallet,
    erc8004_agent_id: agent.erc8004AgentId,
    job_id: payload.job_id || null,
    deliverable_outline: agent.deliverableOutline,
  });
}

function handleA2a(req, res, slug) {
  if (req.method === "OPTIONS") return sendJson(res, 204, {});
  if (req.method !== "POST") return sendJson(res, 405, { error: "method_not_allowed" });

  const agent = getAgent(slug);
  if (!agent) return sendJson(res, 404, { error: "unknown_agent", slug });

  let payload;
  try {
    payload = dataPart(req);
  } catch (error) {
    return sendJson(res, 400, {
      jsonrpc: "2.0",
      id: null,
      error: { code: -32700, message: "Invalid JSON body." },
    });
  }

  const body = req.body || {};
  const methodSkill =
    typeof body.method === "string" && body.method !== "message/send" ? body.method : null;
  const skill = payload.skill || payload.action || methodSkill;

  if (skill === "negotiate") return sendJson(res, 200, negotiate(req, agent, payload));
  if (skill === "notify_funded") return sendJson(res, 200, notifyFunded(req, agent, payload));

  return sendJson(res, 400, {
    jsonrpc: "2.0",
    id: body.id || null,
    error: {
      code: -32602,
      message: "Unsupported skill. Use negotiate or notify_funded.",
    },
  });
}

function handleAgent(req, res, slug) {
  const agent = getAgent(slug);
  if (!agent) return sendJson(res, 404, { error: "unknown_agent", slug });
  if (req.method === "OPTIONS") return sendJson(res, 204, {});
  if (req.method === "GET") return sendJson(res, 200, agentCard(req, agent));
  return handleA2a(req, res, slug);
}

function handleCard(req, res, slug) {
  const agent = getAgent(slug);
  if (!agent) return sendJson(res, 404, { error: "unknown_agent", slug });
  if (req.method === "OPTIONS") return sendJson(res, 204, {});
  if (req.method !== "GET") return sendJson(res, 405, { error: "method_not_allowed" });
  return sendJson(res, 200, agentCard(req, agent));
}

module.exports = {
  AGENTS,
  handleA2a,
  handleAgent,
  handleCard,
};
