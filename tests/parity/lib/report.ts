import fs from 'node:fs';
import path from 'node:path';

import type { CheckName, Comparison } from './compare';
import {
  BASE_LIVE,
  BASE_NEW,
  REPORT_DIR,
  RESULTS_DIR,
  type ViewportName,
} from './settings';

export interface PageResult {
  path: string;
  viewport: ViewportName;
  /** pass: identical · known: differs only in accepted ways · fail: unexpected difference · error: capture failed */
  result: 'pass' | 'known' | 'fail' | 'error';
  live: { url: string; status: number | null; height: number; width: number };
  new: { url: string; status: number | null; height: number; width: number };
  failing: CheckName[];
  unexpected: CheckName[];
  known: string[];
  /** Site-wide intended fixes (`normalize` entries) that applied to this page. */
  normalized: string[];
  /** Known differences listed for this exact page that no longer show up. */
  stale: string[];
  comparison?: Comparison;
  images: { live?: string; new?: string; diff?: string };
  error?: string;
}

type Counts = Record<PageResult['result'] | 'total', number>;

export interface Report {
  generatedAt: string;
  baseLive: string;
  baseNew: string;
  summary: Record<string, Counts & { knownNoLongerDifferent: number }>;
  results: PageResult[];
}

/** Gathers `report/results/**.json` into `report/report.json` and `report/index.html`. */
export function buildReport(): Report | null {
  if (!fs.existsSync(RESULTS_DIR)) return null;
  const results: PageResult[] = [];
  for (const vp of fs.readdirSync(RESULTS_DIR)) {
    const dir = path.join(RESULTS_DIR, vp);
    for (const f of fs.readdirSync(dir)) {
      if (f.endsWith('.json'))
        results.push(JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')));
    }
  }
  const order = { error: 0, fail: 1, known: 2, pass: 3 };
  results.sort(
    (a, b) =>
      order[a.result] - order[b.result] ||
      a.path.localeCompare(b.path) ||
      a.viewport.localeCompare(b.viewport)
  );
  const summary: Report['summary'] = {};
  for (const r of results) {
    const s = (summary[r.viewport] ??= {
      total: 0,
      pass: 0,
      known: 0,
      fail: 0,
      error: 0,
      knownNoLongerDifferent: 0,
    });
    s.total++;
    s[r.result]++;
    if (r.stale?.length) s.knownNoLongerDifferent++;
  }
  const report: Report = {
    generatedAt: new Date().toISOString(),
    baseLive: BASE_LIVE,
    baseNew: BASE_NEW,
    summary,
    results,
  };
  fs.writeFileSync(
    path.join(REPORT_DIR, 'report.json'),
    JSON.stringify(report, null, 2)
  );
  fs.writeFileSync(path.join(REPORT_DIR, 'index.html'), html(report));
  return report;
}

export function printSummary(report: Report) {
  console.log('\nParity summary');
  for (const [vp, s] of Object.entries(report.summary)) {
    console.log(
      `  ${vp.padEnd(8)} ${s.total} pages · ${s.pass} identical · ${s.known} known differences · ` +
        `${s.fail} unexpected · ${s.error} errors` +
        (s.knownNoLongerDifferent
          ? ` · ${s.knownNoLongerDifferent} known entries now identical`
          : '')
    );
  }
  console.log(`  Report: ${path.join(REPORT_DIR, 'index.html')}\n`);
}

function html(report: Report): string {
  // `<` escaped so page text can't close the script tag.
  const data = JSON.stringify(report).replace(/</g, '\\u003c');
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Blog parity report</title>
<style>
  :root { --bg:#fff; --fg:#1b1b1f; --muted:#6b6b75; --line:#e4e4ea; --row:#fafafc;
          --pass:#1f7a4d; --known:#8a6d00; --fail:#b3261e; --error:#7a1fa2; --chip:#f1f1f5; }
  @media (prefers-color-scheme: dark) {
    :root { --bg:#141417; --fg:#ececf1; --muted:#9a9aa6; --line:#2b2b31; --row:#1a1a1f;
            --pass:#5cc58f; --known:#e0c04a; --fail:#ff7a70; --error:#d08cff; --chip:#24242b; }
  }
  * { box-sizing:border-box }
  body { margin:0; padding:24px; background:var(--bg); color:var(--fg);
         font:14px/1.45 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif }
  h1 { font-size:20px; margin:0 0 4px }
  .sub { color:var(--muted); margin-bottom:16px }
  .cards { display:flex; gap:12px; flex-wrap:wrap; margin-bottom:16px }
  .card { border:1px solid var(--line); border-radius:8px; padding:10px 14px; min-width:260px }
  .card b { font-size:15px }
  .n { font-variant-numeric:tabular-nums }
  .controls { display:flex; gap:8px; flex-wrap:wrap; align-items:center; margin-bottom:12px }
  .controls label { display:flex; gap:4px; align-items:center; background:var(--chip);
                    padding:4px 8px; border-radius:6px; cursor:pointer }
  input[type=search] { padding:6px 8px; border:1px solid var(--line); border-radius:6px;
                       background:var(--bg); color:var(--fg); min-width:260px }
  table { border-collapse:collapse; width:100% }
  th, td { text-align:left; vertical-align:top; padding:6px 8px; border-bottom:1px solid var(--line) }
  th { position:sticky; top:0; background:var(--bg); cursor:pointer; user-select:none; white-space:nowrap }
  th[data-dir="asc"]::after { content:" ▲" } th[data-dir="desc"]::after { content:" ▼" }
  tbody tr:nth-child(even) { background:var(--row) }
  td.num { text-align:right; font-variant-numeric:tabular-nums; white-space:nowrap }
  .badge { font-weight:600; text-transform:uppercase; font-size:11px; letter-spacing:.04em }
  .pass { color:var(--pass) } .known { color:var(--known) } .fail { color:var(--fail) } .error { color:var(--error) }
  .chk { display:inline-block; background:var(--chip); border-radius:4px; padding:0 5px; margin:0 3px 3px 0; font-size:12px }
  .chk.bad { color:var(--fail) } .chk.ok { color:var(--known) }
  details { margin-top:4px } summary { cursor:pointer; color:var(--muted) }
  pre { white-space:pre-wrap; word-break:break-word; margin:4px 0; font-size:12px; background:var(--chip); padding:6px; border-radius:4px; max-width:70ch }
  a { color:inherit }
  .reason { color:var(--muted); font-size:12px; max-width:40ch }
</style>
</head>
<body>
<h1>Blog parity report</h1>
<div class="sub" id="sub"></div>
<div class="cards" id="cards"></div>
<div class="controls">
  <label><input type="checkbox" value="fail" checked> unexpected</label>
  <label><input type="checkbox" value="error" checked> errors</label>
  <label><input type="checkbox" value="known"> known</label>
  <label><input type="checkbox" value="pass"> identical</label>
  <select id="vp"><option value="">all viewports</option></select>
  <input type="search" id="q" placeholder="Filter by URL or check…">
  <span id="count" class="sub" style="margin:0"></span>
</div>
<table>
  <thead><tr>
    <th data-k="result">Result</th><th data-k="path">URL</th><th data-k="viewport">Viewport</th>
    <th data-k="status">Status</th><th data-k="hd">Height Δ</th><th data-k="px">Pixels Δ</th>
    <th data-k="checks">Differences</th><th>Images</th>
  </tr></thead>
  <tbody id="rows"></tbody>
</table>
<script>
const R = ${data};
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
document.getElementById('sub').textContent =
  'Live ' + R.baseLive + ' vs new ' + R.baseNew + ' · generated ' + new Date(R.generatedAt).toLocaleString();
document.getElementById('cards').innerHTML = Object.entries(R.summary).map(([vp, s]) =>
  '<div class="card"><b>' + esc(vp) + '</b> <span class="sub n">' + s.total + ' pages</span><br>' +
  '<span class="pass n">' + s.pass + ' identical</span> · <span class="known n">' + s.known + ' known</span> · ' +
  '<span class="fail n">' + s.fail + ' unexpected</span> · <span class="error n">' + s.error + ' errors</span>' +
  (s.knownNoLongerDifferent ? '<br><span class="sub n">' + s.knownNoLongerDifferent + ' known entries now identical</span>' : '') +
  '</div>').join('');
const vpSel = document.getElementById('vp');
Object.keys(R.summary).forEach(v => vpSel.insertAdjacentHTML('beforeend', '<option>' + esc(v) + '</option>'));
const rows = R.results.map(r => {
  const c = r.comparison;
  return { r, result: r.result, path: r.path, viewport: r.viewport,
    status: (r.live.status ?? '–') + '→' + (r.new.status ?? '–'),
    hd: c ? c.heightDelta : null, px: c ? c.pixelDiffPct : null,
    checks: r.failing.join(' ') + ' ' + (r.error || '') };
});
const order = { error:0, fail:1, known:2, pass:3 };
let sortKey = 'result', sortDir = 'asc';
function cell(row) {
  const r = row.r, c = r.comparison;
  const chips = (c ? r.failing : []).map(k =>
    '<span class="chk ' + (r.unexpected.includes(k) ? 'bad' : 'ok') + '" title="' + esc(c.checks[k].detail) + '">' +
    esc(k) + (c.checks[k].detail ? ': ' + esc(c.checks[k].detail) : '') + '</span>').join('');
  let more = '';
  if (c && c.metaDiffs.length) more += c.metaDiffs.map(d => '<b>' + esc(d.key) + '</b><pre>live: ' + esc(d.live) + '\\nnew:  ' + esc(d.new) + '</pre>').join('');
  if (c && c.textDiff) more += '<b>text</b><pre>live: ' + esc(c.textDiff.live) + '</pre><pre>new:  ' + esc(c.textDiff.new) + '</pre>';
  if (c && c.blocksDiff) more += '<b>.bodyPostContainer block #' + c.blocksDiff.index + '</b><pre>live: ' + esc(c.blocksDiff.live) + '\\nnew:  ' + esc(c.blocksDiff.new) + '</pre>';
  return (r.error ? '<span class="error">' + esc(r.error) + '</span>' : chips) +
    (more ? '<details><summary>details</summary>' + more + '</details>' : '') +
    (r.known.length ? '<div class="reason">Known: ' + esc(r.known.join(' / ')) + '</div>' : '') +
    (r.stale && r.stale.length ? '<div class="reason">Listed as known but no longer differs: ' + esc(r.stale.join(' / ')) + '</div>' : '') +
    (r.normalized && r.normalized.length ? '<div class="reason" title="' + esc(r.normalized.join('\n')) + '">+ ' + r.normalized.length + ' site-wide fix' + (r.normalized.length > 1 ? 'es' : '') + ' normalized (hover)</div>' : '');
}
function render() {
  const show = new Set([...document.querySelectorAll('.controls input[type=checkbox]:checked')].map(i => i.value));
  const q = document.getElementById('q').value.toLowerCase(), vp = vpSel.value;
  const list = rows.filter(x => show.has(x.result) && (!vp || x.viewport === vp) &&
    (!q || (x.path + ' ' + x.checks).toLowerCase().includes(q)));
  const dir = sortDir === 'asc' ? 1 : -1;
  list.sort((a, b) => {
    let va = a[sortKey], vb = b[sortKey];
    if (sortKey === 'result') { va = order[va]; vb = order[vb]; }
    if (sortKey === 'hd') { va = va == null ? null : Math.abs(va); vb = vb == null ? null : Math.abs(vb); }
    if (va == null && vb == null) return 0; if (va == null) return 1; if (vb == null) return -1;
    return (typeof va === 'number' ? va - vb : String(va).localeCompare(String(vb))) * dir;
  });
  document.getElementById('count').textContent = list.length + ' rows';
  document.getElementById('rows').innerHTML = list.map(x => {
    const r = x.r, i = r.images;
    const img = [i.live && '<a href="' + esc(i.live) + '">live</a>', i.new && '<a href="' + esc(i.new) + '">new</a>',
      i.diff && '<a href="' + esc(i.diff) + '">diff</a>'].filter(Boolean).join(' · ');
    return '<tr><td><span class="badge ' + x.result + '">' + x.result + '</span></td>' +
      '<td>' + esc(r.path) + '<br><a href="' + esc(r.live.url) + '">live</a> · <a href="' + esc(r.new.url) + '">new</a></td>' +
      '<td>' + esc(r.viewport) + '</td><td class="num">' + esc(x.status) + '</td>' +
      '<td class="num">' + (x.hd == null ? '' : (x.hd > 0 ? '+' : '') + x.hd + 'px<br><span class="sub">' + r.live.height + '→' + r.new.height + '</span>') + '</td>' +
      '<td class="num">' + (x.px == null ? '' : x.px.toFixed(3) + '%') + '</td>' +
      '<td>' + cell(x) + '</td><td>' + img + '</td></tr>';
  }).join('');
  document.querySelectorAll('th[data-k]').forEach(th => th.dataset.dir = th.dataset.k === sortKey ? sortDir : '');
}
document.querySelectorAll('th[data-k]').forEach(th => th.addEventListener('click', () => {
  const k = th.dataset.k;
  if (sortKey === k) sortDir = sortDir === 'asc' ? 'desc' : 'asc';
  else { sortKey = k; sortDir = k === 'hd' || k === 'px' ? 'desc' : 'asc'; }
  render();
}));
document.querySelectorAll('.controls input, .controls select').forEach(el => el.addEventListener('input', render));
render();
</script>
</body>
</html>
`;
}
