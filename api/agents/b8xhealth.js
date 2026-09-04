const AGENT = {
  name: "b8xhealth-agent",
  wallet: "0x00CCc45a862eaCEa3d421AAf4521FBc4978C3499",
  currency: "0xc70B8741B8B07A6d61E54fd4B20f22Fa648E5565",
};

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader("content-type", "application/json; charset=utf-8");
  res.setHeader("cache-control", "public, max-age=0, must-revalidate");
  res.end(JSON.stringify(body));
}

function getOrigin(req) {
  const proto = req.headers["x-forwarded-proto"] || "https";
  const host = req.headers["x-forwarded-host"] || req.headers.host || "b8xmarket-repo.vercel.app";
  return `${proto}://${host}`;
}

function card(req) {
  const endpoint = `${getOrigin(req)}/api/agents/b8xhealth`;
  return {
    name: AGENT.name,
    description:
      "B8X health-factor monitoring agent fallback endpoint. It prepares collateral, debt and liquidation-risk actions for BSC positions when the health factor approaches a configured floor.",
    url: endpoint,
    version: "1.0.0",
    protocolVersion: "0.3.0",
    preferredTransport: "JSONRPC",
    capabilities: { streaming: false },
    defaultInputModes: ["application/json"],
    defaultOutputModes: ["application/json"],
    skills: [
      {
        id: "negotiate",
        name: "Prepare a health-factor monitoring job",
        description:
          "Send a data part with skill=negotiate, task_description and terms. The endpoint returns a zero-price health-factor monitoring plan envelope for B8X marketplace verification.",
        tags: ["health-factor", "risk", "bnb-chain", "erc8183"],
        inputModes: ["application/json"],
        outputModes: ["application/json"],
      },
      {
        id: "notify_funded",
        name: "Acknowledge a funded health-factor job",
        description:
          "Send skill=notify_funded with a job_id. This Vercel fallback endpoint acknowledges the job and returns the expected health-factor deliverable outline.",
        tags: ["health-factor", "delivery", "bnb-chain"],
        inputModes: ["application/json"],
        outputModes: ["application/json"],
      },
    ],
  };
}

function dataPart(req) {
  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
  req.body = body;
  const message = body.params && body.params.message;
  const part = message && Array.isArray(message.parts)
    ? message.parts.find((item) => item && item.kind === "data")
    : null;
  return (part && part.data) || req.body || {};
}

function response(id, data) {
  return {
    jsonrpc: "2.0",
    id: id || "b8xhealth-response",
    result: {
      message: {
        messageId: `b8xhealth-${Date.now()}`,
        role: "agent",
        parts: [{ kind: "data", data }],
      },
    },
  };
}

function negotiate(req, payload) {
  const task = payload.task_description || "Monitor BSC position health factor";
  const floor = payload.terms && payload.terms.health_factor_floor
    ? payload.terms.health_factor_floor
    : "1.05";

  return response(req.body && req.body.id, {
    status: "quoted",
    agent: AGENT.name,
    wallet: AGENT.wallet,
    quote: {
      price: "0",
      currency: AGENT.currency,
      quote_ttl_seconds: 900,
      signature_status: "vercel-fallback-unsigned",
      note:
        "BNB managed trial quota is three active agents on this account. Move this endpoint to BNB managed/AWS with the same wallet for production seller signatures.",
    },
    deliverable: {
      task,
      checks: [
        "Read collateral, debt, borrow rate and oracle state.",
        `Alert before health factor crosses ${floor}.`,
        "Choose top-up, partial repay or partial unwind based on gas and liquidation distance.",
        "Return a block-stamped action plan with assumptions and failure modes.",
      ],
    },
  });
}

function notifyFunded(req, payload) {
  return response(req.body && req.body.id, {
    status: "accepted",
    agent: AGENT.name,
    wallet: AGENT.wallet,
    job_id: payload.job_id || null,
    deliverable_outline: [
      "position snapshot",
      "health-factor floor check",
      "liquidation distance",
      "recommended collateral or debt action",
      "revocation and session-control note",
    ],
  });
}

module.exports = (req, res) => {
  if (req.method === "GET") return json(res, 200, card(req));
  if (req.method !== "POST") return json(res, 405, { error: "method_not_allowed" });

  const payload = dataPart(req);
  if (payload.skill === "negotiate") return json(res, 200, negotiate(req, payload));
  if (payload.skill === "notify_funded") return json(res, 200, notifyFunded(req, payload));

  return json(res, 400, {
    jsonrpc: "2.0",
    id: req.body && req.body.id,
    error: {
      code: -32602,
      message: "Unsupported skill. Use negotiate or notify_funded.",
    },
  });
};
