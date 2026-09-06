(() => {
  'use strict';
  const $ = id => document.getElementById(id), catalog = window.B8X_CATALOG;
  const esc = v => String(v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const label = key => key.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, c => c.toUpperCase());
  const format = v => v == null ? 'N/A' : typeof v === 'boolean' ? (v ? 'Yes' : 'No') : typeof v === 'number' ? new Intl.NumberFormat('en', { maximumSignificantDigits: 8 }).format(v) : String(v);
  let selected = catalog[0], lastReport = null, request = null, priceRequest = null, history = [];
  try { const saved = JSON.parse(localStorage.getItem('b8x-results-v2') || '[]'); if (Array.isArray(saved)) history = saved.filter(r => r?.engineVersion === '2.0.0' && r.result && r.input).slice(0, 10); } catch {}
  function addRoute(route = { name: '', aprPercent: 0, roundTripCost: 0, availableLiquidity: 0, lockDays: 0 }) {
    if ($('routes').children.length >= 10) return;
    const id = crypto.randomUUID(), row = document.createElement('div'); row.className = 'route';
    row.innerHTML = `<div class="route-name"><label for="name-${id}">Route name</label><input id="name-${id}" data-key="name" value="${esc(route.name)}" maxlength="60" required></div>` + [['aprPercent','APR (%)',500,'any'],['roundTripCost','Entry + exit cost (quote)',1e6,'any'],['availableLiquidity','Available exit liquidity (quote)',1e12,'any'],['lockDays','Lock duration (days)',3650,1]].map(([key,title,max,step]) => `<div><label for="${key}-${id}">${title}</label><input id="${key}-${id}" data-key="${key}" type="number" min="0" max="${max}" step="${step}" value="${route[key]}" required></div>`).join('') + '<button type="button" data-remove-route>Remove route</button>';
    $('routes').append(row); routeButtons();
  }
  function routeButtons() { $('add-route').disabled = $('routes').children.length >= 10; $('routes').querySelectorAll('[data-remove-route]').forEach(b => b.disabled = $('routes').children.length <= 2); }
  function choose(slug) {
    request?.abort(); priceRequest?.abort(); request = null; priceRequest = null;
    selected = catalog.find(a => a.slug === slug) || catalog[0];
    document.querySelectorAll('[data-agent]').forEach(b => { const active = b.dataset.agent === selected.slug; b.setAttribute('aria-pressed', String(active)); b.textContent = active ? 'Selected' : 'Select agent'; b.closest('.agent').classList.toggle('selected', active); });
    $('agent-slug').textContent = selected.slug; $('workspace-title').textContent = selected.category; $('agent-description').textContent = selected.description;
    $('fields').innerHTML = selected.fields.map(f => `<div><label for="${f.key}">${esc(f.label)}</label><input id="${f.key}" type="number" required min="${f.min}" max="${f.max}" step="${f.step}" value="${f.value}"></div>`).join('');
    $('price-source-wrap').hidden = !selected.fields.some(f => f.key === 'price'); $('price-source').value = 'user'; $('load-price').hidden = true;
    $('source-note').textContent = 'Sample values are editable and are not market observations.'; $('source-note').classList.remove('error');
    $('routes-wrap').hidden = !selected.routes; $('routes').replaceChildren(); selected.routes?.forEach(addRoute);
    $('run').disabled = false; $('run').textContent = 'Run analysis'; $('load-price').disabled = false; $('run-status').textContent = '';
    $('result').hidden = true; $('result-empty').hidden = false; lastReport = null;
  }
  function showReport(report) {
    lastReport = report; $('result-empty').hidden = true; $('result').hidden = false; const r = report.result;
    $('result-title').textContent = r.title;
    $('result-meta').textContent = `${report.agent} | ${new Date(report.completedAt).toLocaleString()} | compute ${report.durationMs} ms | free analysis`;
    $('decision').textContent = r.decision.replaceAll('_', ' '); $('decision').dataset.warning = String(/COSTS_|BREACH|BELOW_|OUTSIDE_|NO_POSITIVE/.test(r.decision)); $('summary').textContent = r.summary;
    $('metrics').innerHTML = Object.entries(r.metrics).map(([k,v]) => `<div><dt>${esc(label(k))}</dt><dd>${esc(format(v))}</dd></div>`).join('');
    $('result-table').innerHTML = '<thead><tr>' + r.columns.map(c => `<th scope="col">${esc(label(c))}</th>`).join('') + '</tr></thead><tbody>' + r.rows.map(row => '<tr>' + r.columns.map(c => `<td>${esc(format(row[c]))}</td>`).join('') + '</tr>').join('') + '</tbody>';
    const s = report.source;
    $('result-source').textContent = s.kind === 'onchain_pool_snapshot' ? `${s.venue}, ${s.network}, block ${s.blockNumber}, ${s.blockTime}. Spot ${format(s.price)} ${s.priceUnit}. ${s.warning}` : s.description;
    if (s.kind === 'onchain_pool_snapshot' && /^0x[a-fA-F0-9]{40}$/.test(s.pool)) { const link = document.createElement('a'); link.href = `https://bscscan.com/address/${s.pool}`; link.textContent = ' Inspect pool'; link.target = '_blank'; link.rel = 'noopener'; $('result-source').append(link); }
    $('assumptions').innerHTML = r.assumptions.map(s => `<li>${esc(s)}</li>`).join(''); $('formulas').innerHTML = r.formulas.map(s => `<li>${esc(s)}</li>`).join(''); $('raw').textContent = JSON.stringify(report, null, 2);
    $('result-title').focus({ preventScroll: true });
  }
  function saveHistory() { try { localStorage.setItem('b8x-results-v2', JSON.stringify(history)); } catch { $('run-status').textContent += ' Browser storage is unavailable; download the result to keep it.'; } }
  function renderHistory() { $('history-list').innerHTML = history.length ? history.map(r => `<div class="history-row"><span>${esc(r.result.title)} / ${esc(new Date(r.completedAt).toLocaleString())}<br><small>${esc(r.result.decision.replaceAll('_',' '))}</small></span><button data-result="${esc(r.id)}">Open result</button></div>`).join('') : '<p class="muted">No completed runs in this browser.</p>'; $('clear-history').disabled = !history.length; }
  async function checkCards() {
    $('check-cards').disabled = true; $('catalog-status').textContent = 'Checking public endpoints...';
    const outcomes = await Promise.all(catalog.map(async a => { const el = $('status-' + a.slug); el.textContent = 'Checking...'; try { const response = await fetch(`/api/agents/${a.slug}/.well-known/agent-card.json`, { signal: AbortSignal.timeout(10000), cache: 'no-store' }); const card = await response.json(); if (!response.ok || card.name !== a.slug || !card.skills?.some(s => s.id === 'analyze')) throw new Error(); el.textContent = 'Endpoint reachable'; el.dataset.status = 'ok'; return true; } catch { el.textContent = 'Endpoint unavailable'; el.dataset.status = 'error'; return false; } }));
    $('catalog-status').textContent = `${outcomes.filter(Boolean).length} of 4 endpoints reachable. Checked ${new Date().toLocaleTimeString()}. Availability is not a performance rating.`; $('check-cards').disabled = false;
  }
  $('agents').innerHTML = catalog.map(a => `<article class="agent"><p class="eyebrow">${a.slug}</p><h3>${a.category}</h3><p class="agent-output">${a.output}</p><span class="endpoint" id="status-${a.slug}">Not checked</span><div class="agent-links"><a href="/api/agents/${a.slug}/.well-known/agent-card.json" target="_blank" rel="noopener">Agent card</a><a href="https://testnet.bscscan.com/address/${a.wallet}" target="_blank" rel="noopener">Wallet</a></div><span class="muted">Testnet registration #${a.id}</span><button class="choose" data-agent="${a.slug}" aria-pressed="false">Select agent</button></article>`).join('');
  $('agents').addEventListener('click', e => { const b = e.target.closest('[data-agent]'); if (b) { choose(b.dataset.agent); $('workspace').scrollIntoView({ block: 'start' }); } });
  $('check-cards').addEventListener('click', checkCards); $('reset').addEventListener('click', () => choose(selected.slug));
  $('add-route').addEventListener('click', () => addRoute());
  $('routes').addEventListener('click', e => { if (e.target.closest('[data-remove-route]') && $('routes').children.length > 2) { e.target.closest('.route').remove(); routeButtons(); } });
  $('price-source').addEventListener('change', () => { priceRequest?.abort(); const live = $('price-source').value === 'pancakeswap'; $('price').readOnly = live; $('load-price').hidden = !live; $('source-note').textContent = live ? 'BSC mainnet pool price only. The server refreshes the snapshot when you run. Range bounds stay as entered.' : 'Spot price and all other values are supplied inputs.'; });
  $('load-price').addEventListener('click', async () => {
    priceRequest?.abort(); const controller = new AbortController(); priceRequest = controller; const slug = selected.slug; $('load-price').disabled = true;
    try { const res = await fetch('/api/snapshot', { signal: AbortSignal.any([controller.signal, AbortSignal.timeout(20000)]) }); const data = await res.json(); if (!res.ok) throw new Error(data.error); if (selected.slug !== slug || controller.signal.aborted) return; $('price').value = data.price; $('source-note').textContent = `USDT/WBNB ${format(data.price)} at BSC mainnet block ${data.blockNumber}. Range bounds unchanged. Pool ratio, not an executable quote.`; $('source-note').classList.remove('error'); }
    catch (err) { if (!controller.signal.aborted) { $('source-note').textContent = err.message; $('source-note').classList.add('error'); } }
    finally { if (priceRequest === controller) { $('load-price').disabled = false; priceRequest = null; } }
  });
  $('analysis-form').addEventListener('submit', async e => {
    e.preventDefault(); if (request) return;
    const input = Object.fromEntries(selected.fields.map(f => [f.key, Number($(f.key).value)]));
    if (selected.routes) input.routes = Array.from($('routes').children).map(row => Object.fromEntries(Array.from(row.querySelectorAll('[data-key]')).map(el => [el.dataset.key, el.dataset.key === 'name' ? el.value : Number(el.value)])));
    const controller = new AbortController(); request = controller; const started = performance.now();
    $('run').disabled = true; $('run').textContent = 'Calculating...'; $('run-status').classList.remove('error'); $('run-status').textContent = 'Request sent. Waiting for the calculation.'; $('result').hidden = true; $('result-empty').hidden = false; lastReport = null;
    try {
      const response = await fetch(`/api/agents/${selected.slug}/a2a`, { method: 'POST', headers: { 'content-type': 'application/json' }, signal: AbortSignal.any([controller.signal, AbortSignal.timeout(25000)]), body: JSON.stringify({ jsonrpc: '2.0', id: crypto.randomUUID(), method: 'message/send', params: { message: { kind: 'message', role: 'user', messageId: crypto.randomUUID(), parts: [{ kind: 'data', data: { skill: 'analyze', input, priceSource: $('price-source-wrap').hidden ? 'user' : $('price-source').value } }] } } }) });
      const data = await response.json(); if (!response.ok || data.error) throw new Error(data.error?.message || 'Analysis request failed.'); const report = data.result?.parts?.find(p => p.kind === 'data')?.data;
      if (report?.status !== 'completed') throw new Error('No completed result returned.'); if (controller.signal.aborted) return;
      report.clientRoundTripMs = Math.round(performance.now() - started); showReport(report); $('run-status').textContent = `Completed in ${report.clientRoundTripMs} ms including network. No transaction was sent.`; history = [report, ...history].slice(0, 10); saveHistory(); renderHistory();
    } catch (err) { if (!controller.signal.aborted) { $('run-status').textContent = err.name === 'TimeoutError' ? 'Request timed out. Retry or use supplied inputs.' : err.message; $('run-status').classList.add('error'); } }
    finally { if (request === controller) { request = null; $('run').disabled = false; $('run').textContent = 'Run analysis'; } }
  });
  $('download').addEventListener('click', () => { if (!lastReport) return; const url = URL.createObjectURL(new Blob([JSON.stringify(lastReport, null, 2)], { type: 'application/json' })), a = document.createElement('a'); a.href = url; a.download = `${lastReport.agent}-${lastReport.id}.json`; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); });
  $('history-list').addEventListener('click', e => { const b = e.target.closest('[data-result]'); if (b) { const report = history.find(r => r.id === b.dataset.result); if (!report) return; choose(report.agent); for (const f of selected.fields) $(f.key).value = report.input[f.key]; if (report.input.routes) { $('routes').replaceChildren(); report.input.routes.forEach(addRoute); } showReport(report); $('run-status').textContent = 'Saved result. Run again to calculate with current inputs.'; $('workspace').scrollIntoView({ block: 'start' }); } });
  $('clear-history').addEventListener('click', () => { history = []; saveHistory(); renderHistory(); });
  choose(selected.slug); renderHistory(); checkCards();
})();
