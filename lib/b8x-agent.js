const catalog = require("../catalog");
const { analyze, InputError } = require("./analysis");
const { poolSnapshot } = require("./snapshot");
const ORIGIN = "https://b8xmarket-repo.vercel.app";
function send(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "content-type");
  res.end(status === 204 ? "" : JSON.stringify(body));
}
function error(res, id, code, message, status = 400) {
  return send(res, status, { jsonrpc: "2.0", id, error: { code, message } });
}
async function handleA2a(req, res, slug) {
  if (req.method === "OPTIONS") return send(res, 204, {});
  if (req.method !== "POST")
    return error(res, null, -32600, "POST required.", 405);
  if (!catalog.some((a) => a.slug === slug))
    return error(res, null, -32602, "Unknown agent.", 404);
  let body;
  try {
    if (Number(req.headers["content-length"] || 0) > 32768)
      return error(res, null, -32600, "Body exceeds 32 KiB.", 413);
    body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    if (JSON.stringify(body || {}).length > 32768)
      return error(res, null, -32600, "Body exceeds 32 KiB.", 413);
  } catch {
    return error(res, null, -32700, "Invalid JSON.");
  }
  const id = body?.id ?? null;
  if (
    !body ||
    body.jsonrpc !== "2.0" ||
    !["string", "number"].includes(typeof id) ||
    (typeof id === "number" && !Number.isFinite(id))
  )
    return error(
      res,
      null,
      -32600,
      "JSON-RPC 2.0 request with a string or numeric id is required.",
    );
  if (body.method !== "message/send")
    return error(res, id, -32601, "Only message/send is supported.");
  const parts = body.params?.message?.parts;
  const payload = Array.isArray(parts)
    ? parts.find((p) => p?.kind === "data")?.data
    : null;
  if (!payload || typeof payload !== "object")
    return error(res, id, -32602, "A data part is required.");
  if (payload.skill === "notify_funded")
    return error(
      res,
      id,
      -32601,
      "Paid jobs are not supported by this analysis endpoint. No job was accepted.",
    );
  if (payload.skill !== "analyze")
    return error(
      res,
      id,
      -32602,
      "Use skill=analyze with input. Quote-only negotiation has been retired.",
    );
  try {
    let source,
      input = payload.input;
    // Validate before any RPC so invalid user data cannot trigger expensive reads.
    analyze(slug, input);
    if (
      payload.priceSource !== undefined &&
      !["user", "pancakeswap"].includes(payload.priceSource)
    )
      throw new InputError("Unknown priceSource.");
    if (payload.priceSource === "pancakeswap") {
      if (!["b8xgrid", "b8xrebal"].includes(slug))
        throw new InputError(
          "Pool price is available for grid and LP analysis only.",
        );
      source = await poolSnapshot();
      input = { ...input, price: source.price };
    }
    const report = analyze(slug, input, source);
    return send(res, 200, {
      jsonrpc: "2.0",
      id,
      result: {
        kind: "message",
        messageId: report.id,
        role: "agent",
        parts: [{ kind: "data", data: report }],
      },
    });
  } catch (err) {
    if (err instanceof InputError) return error(res, id, -32602, err.message);
    return error(
      res,
      id,
      -32001,
      "Analysis could not complete. Live data may be unavailable; retry or use supplied values.",
      503,
    );
  }
}
function handleAgent(req, res, slug) {
  if (req.method === "POST") return handleA2a(req, res, slug);
  if (req.method === "OPTIONS") return send(res, 204, {});
  if (req.method !== "GET")
    return error(res, null, -32600, "GET or POST required.", 405);
  const agent = catalog.find((a) => a.slug === slug);
  if (!agent) return send(res, 404, { error: "Unknown agent." });
  return send(res, 200, {
    name: slug,
    description: agent.description,
    version: "2.0.0",
    protocolVersion: "0.3.0",
    url: `${ORIGIN}/api/agents/${slug}/a2a`,
    preferredTransport: "JSONRPC",
    capabilities: { streaming: false },
    defaultInputModes: ["application/json"],
    defaultOutputModes: ["application/json"],
    skills: [
      {
        id: "analyze",
        name: agent.category,
        description:
          "Read-only deterministic calculation. Send skill=analyze and input matching the field schema in metadata. Returns completed calculations, inputs, formulas and assumptions.",
        tags: ["bsc", "analysis", "read-only"],
      },
    ],
    metadata: {
      registry: {
        chainId: 97,
        agentId: agent.id,
        wallet: agent.wallet,
        status: "historical_registration_record",
        evidence: `${ORIGIN}/docs/LIVE_AGENT_EVIDENCE.md`,
      },
      fields: agent.fields,
      routes: agent.routes,
      engine: "deterministic-analysis",
      paidHiring: false,
      transactionExecution: false,
      continuousMonitoring: false,
      checkedAt: new Date().toISOString(),
    },
  });
}
module.exports = { handleA2a, handleAgent, handleCard: handleAgent };
