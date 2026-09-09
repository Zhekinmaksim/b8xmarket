const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { createPublicClient, http, parseAbi } = require("viem");
const { bscTestnet } = require("viem/chains");
const catalog = require("../catalog");

const origin = process.argv[2] || "https://b8xmarket.xyz";
const evidence = { observedAt: new Date().toISOString(), origin, checks: [], registrations: [],
  limitations: ["Read-only checks; no hiring, execution or settlement is tested.",
    "Registry ownership and service metadata are not a strategy endorsement."] };
async function check(name, work) {
  try { evidence.checks.push({ name, passed: true, detail: await work() }); }
  catch (error) { evidence.checks.push({ name, passed: false, error: error.shortMessage || error.message }); }
}
async function request(route, options = {}) {
  return fetch(new URL(route, origin), { ...options, signal: AbortSignal.timeout(20000) });
}
async function main() {
  for (const route of ["/", "/analysis.html", "/docs/evidence/demo-capture.json"]) {
    await check(route, async () => { const res = await request(route); assert.equal(res.status, 200); return { status: res.status }; });
  }
  await check("video metadata", async () => {
    const res = await request("/media/b8x-demo.mp4", { method: "HEAD" });
    assert.equal(res.status, 200);
    assert.match(res.headers.get("content-type"), /video\/mp4/);
    assert.ok(Number(res.headers.get("content-length")) > 1000000);
    return { status: res.status, contentType: res.headers.get("content-type"), bytes: res.headers.get("content-length") };
  });
  for (const route of ["/.env.local", "/docs/SUBMISSION-FORM-DRAFT.md", "/video-remotion/README.md"]) {
    await check(`private path ${route}`, async () => { const res = await request(route); assert.equal(res.status, 404); return { status: res.status }; });
  }
  for (const agent of catalog) {
    await check(`${agent.slug} public card`, async () => {
      const res = await request(`/api/agents/${agent.slug}/.well-known/agent-card.json`);
      assert.equal(res.status, 200);
      const card = await res.json();
      assert.equal(card.name, agent.slug);
      assert.ok(card.skills.some(skill => skill.id === "analyze"));
      return { name: card.name, version: card.version, url: card.url };
    });
  }
  await check("mainnet pool snapshot", async () => {
    const res = await request("/api/snapshot");
    assert.equal(res.status, 200);
    const data = await res.json();
    const snapshot = data.snapshot || data;
    assert.equal(snapshot.chainId, 56);
    assert.ok(snapshot.price > 0);
    assert.ok(Math.abs(Date.now() - Date.parse(snapshot.blockTime)) < 180000);
    return snapshot;
  });
  const registry = "0x8004A818BFB912233c491871b3d84c89A494BD9e";
  const client = createPublicClient({ chain: bscTestnet,
    transport: http("https://data-seed-prebsc-1-s1.bnbchain.org:8545", { timeout: 15000, retryCount: 0 }) });
  const abi = parseAbi(["function ownerOf(uint256) view returns (address)", "function tokenURI(uint256) view returns (string)"]);
  await check("testnet registration reconciliation", async () => {
    const blockNumber = await client.getBlockNumber();
    for (const agent of catalog) {
      const base = { address: registry, abi, args: [BigInt(agent.id)], blockNumber };
      const owner = await client.readContract({ ...base, functionName: "ownerOf" });
      assert.equal(owner.toLowerCase(), agent.wallet.toLowerCase());
      const uri = await client.readContract({ ...base, functionName: "tokenURI" });
      assert.ok(uri.startsWith("data:application/json;base64,"));
      const metadata = JSON.parse(Buffer.from(uri.slice(uri.indexOf(",") + 1), "base64").toString("utf8"));
      const service = metadata.services.find(item => item.name === "A2A");
      assert.equal(service.endpoint, `https://b8xmarket-repo.vercel.app/api/agents/${agent.slug}/.well-known/agent-card.json`);
      const card = await fetch(service.endpoint, { signal: AbortSignal.timeout(20000) });
      assert.equal(card.status, 200);
      evidence.registrations.push({ agent: agent.slug, agentId: agent.id, owner, registry, chainId: 97,
        blockNumber: String(blockNumber), endpoint: service.endpoint, endpointStatus: card.status });
    }
    return { blockNumber: String(blockNumber), count: evidence.registrations.length };
  });
  const file = path.resolve(__dirname, "../docs/evidence/submission-verification.json");
  fs.writeFileSync(file, JSON.stringify(evidence, null, 2) + "\n");
  console.log(JSON.stringify(evidence, null, 2));
  if (evidence.checks.some(item => !item.passed)) process.exitCode = 1;
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
