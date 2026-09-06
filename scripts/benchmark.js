const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const catalog = require('../catalog');
const baseline = require('./reference-baseline');
const origin = process.argv[2] || 'http://127.0.0.1:4173';
const output = path.resolve(__dirname, '../docs/evidence/analysis-v2');
async function main() {
  fs.mkdirSync(output,{recursive:true}); const tasks=[];
  for (const agent of catalog) {
    const input={...Object.fromEntries(agent.fields.map(f=>[f.key,f.value])),...(agent.routes?{routes:agent.routes}:{})};
    const samples=[];
    for(let sample=0;sample<5;sample++) {
      const before=performance.now(), withoutMarketplace=baseline(agent.slug,input), baselineMs=performance.now()-before;
      const start=performance.now();
      const res=await fetch(`${origin}/api/agents/${agent.slug}/a2a`,{method:'POST',headers:{'content-type':'application/json'},signal:AbortSignal.timeout(30000),body:JSON.stringify({jsonrpc:'2.0',id:sample,method:'message/send',params:{message:{role:'user',messageId:`benchmark-${agent.slug}-${sample}`,parts:[{kind:'data',data:{skill:'analyze',input}}]}}})});
      const body=await res.json(), roundTripMs=performance.now()-start;
      if(!res.ok||body.error)throw new Error(`${agent.slug}: ${JSON.stringify(body)}`);
      const report=body.result.parts[0].data;
      const checks=Object.entries(withoutMarketplace).map(([key,expected])=>({key,expected,actual:report.result.metrics[key],passed:typeof expected==='number'?Math.abs(expected-report.result.metrics[key])<=Math.max(1e-8,Math.abs(expected)*1e-10):expected===report.result.metrics[key]}));
      if(checks.some(c=>!c.passed))throw new Error(`Reference mismatch for ${agent.slug}`);
      samples.push({sample,baselineMs,roundTripMs,baselineOutput:withoutMarketplace,checks,report});
    }
    const sorted=samples.map(s=>s.roundTripMs).sort((a,b)=>a-b);
    const item={agent:agent.slug,input,samples,summary:{runs:samples.length,p50RoundTripMs:sorted[2],maxRoundTripMs:sorted[4],p50BaselineMs:samples.map(s=>s.baselineMs).sort((a,b)=>a-b)[2],checksPassed:samples[0].checks.length,checksTotal:samples[0].checks.length}};
    tasks.push(item);fs.writeFileSync(path.join(output,`${agent.slug}.json`),JSON.stringify(item,null,2)+'\n');
  }
  const data={generatedAt:new Date().toISOString(),origin,environment:{node:process.version,platform:os.platform(),arch:os.arch()},mode:'deterministic scenarios; HTTP analysis versus local standalone non-agent calculator',limitations:['Not human timing. Not paid hiring. No autonomous trading was tested.','Network request time and local calculation time measure different delivery paths. No speed advantage is claimed.','Correctness compares selected numerical metrics, not all financial risks or output quality.','Host infrastructure and operator costs are not included.'],tasks:tasks.map(t=>({agent:t.agent,...t.summary}))};
  fs.writeFileSync(path.join(output,'summary.json'),JSON.stringify(data,null,2)+'\n');
  const md=['# Measured analysis benchmark','',`Generated: ${data.generatedAt}`,`Endpoint: ${origin}`,'','Five requests per category using identical supplied scenarios. The reference is a standalone calculator, not a person. Both outputs are attached in each JSON file.','','| Agent | HTTP p50 (ms) | HTTP max (ms) | Local baseline p50 (ms) | Metric agreement |','|---|---:|---:|---:|---:|',...data.tasks.map(t=>`| ${t.agent} | ${t.p50RoundTripMs.toFixed(2)} | ${t.maxRoundTripMs.toFixed(2)} | ${t.p50BaselineMs.toFixed(4)} | ${t.checksPassed}/${t.checksTotal} |`),'','The endpoint adds a form, validation, decimal arithmetic, provenance and a downloadable report. It is slower than a local calculator; no time advantage over that baseline is claimed.','','## Limits','',...data.limitations.map(s=>`- ${s}`),'','Fee per analysis request: 0 USD. Transactions sent: 0. Infrastructure costs: not measured.',''];
  fs.writeFileSync(path.join(output,'SUMMARY.md'),md.join('\n')); console.log(JSON.stringify(data,null,2));
}
main().catch(e=>{console.error(e.message);process.exitCode=1});
