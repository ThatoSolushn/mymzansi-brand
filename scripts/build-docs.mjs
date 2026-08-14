#!/usr/bin/env node
/**
 * Generates the style dictionary: a browsable reference for every token.
 *
 * Outputs
 *   docs/index.html   self-contained page — swatches, specimens, contrast results
 *   docs/TOKENS.md    the same catalogue as Markdown, for review and diffing
 *
 * Both are GENERATED from tokens.json and must never be hand-edited.
 *
 * The point of a *dictionary* is the cross-platform mapping: each entry shows
 * the one canonical token path alongside the identifier it becomes in CSS,
 * Swift, Kotlin and Dart — so a designer and four platform engineers can all
 * name the same thing.
 *
 * Zero dependencies, no external requests: the page holds to the same budget
 * the system asks of the product (BRAND.md §12).
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const tokens = JSON.parse(readFileSync(path.join(ROOT, 'tokens.json'), 'utf8'));
const meta = tokens.$extensions?.['org.mymzansi.meta'] ?? {};

/* ---------------------------------------------------------------- flatten */

const raw = new Map();
(function walk(node, segs, inherited) {
  if (node == null || typeof node !== 'object') return;
  const type = node.$type ?? inherited;
  if ('$value' in node) {
    raw.set(segs.join('.'), { value: node.$value, type, description: node.$description });
    return;
  }
  for (const [k, v] of Object.entries(node)) {
    if (k.startsWith('$')) continue;
    walk(v, [...segs, k], type);
  }
})(tokens, [], undefined);

const REF = /^\{([^}]+)\}$/;
function resolve(v, seen = new Set()) {
  if (typeof v === 'string') {
    const m = v.match(REF);
    if (!m) return v;
    if (seen.has(m[1])) throw new Error(`Circular reference: ${m[1]}`);
    const t = raw.get(m[1]);
    if (!t) throw new Error(`Unresolved reference: {${m[1]}}`);
    return resolve(t.value, new Set(seen).add(m[1]));
  }
  if (Array.isArray(v)) return v.map((x) => resolve(x, seen));
  if (v && typeof v === 'object') {
    return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, resolve(x, seen)]));
  }
  return v;
}

const entries = [...raw.entries()].map(([p, t]) => ({
  path: p,
  raw: t.value,
  value: resolve(t.value),
  type: t.type,
  description: t.description,
  alias: typeof t.value === 'string' && REF.test(t.value) ? t.value.slice(1, -1) : null,
}));
const byPrefix = (p) => entries.filter((e) => e.path.startsWith(p + '.') && !e.path.slice(p.length + 1).includes('.'));
const get = (p) => entries.find((e) => e.path === p);

/* -------------------------------------------------------------- WCAG maths */

const hex2rgb = (h) => [0, 2, 4].map((i) => parseInt(h.replace('#', '').slice(i, i + 2), 16));
const lin = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const lum = (h) => { const [r, g, b] = hex2rgb(h); return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b); };
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)];
  return Math.round(((Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05)) * 100) / 100;
};
const isHex = (v) => typeof v === 'string' && /^#[0-9A-Fa-f]{6}$/.test(v);
const grade = (r, need = 4.5) => (r >= 7 ? 'AAA' : r >= need ? 'AA' : 'FAIL');

/* ------------------------------------------------- platform name mappings */

const kebabToCamel = (s) => s.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
const safeName = (s) => s.replace(/^(\d+)x([a-z]+)$/, (_, n, sfx) => 'x'.repeat(Number(n)) + sfx);
const ident = (s) => kebabToCamel(safeName(s));
const kebab = (s) => String(s).replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

/** How one token path is named on each platform. */
function names(e) {
  const segs = e.path.split('.');
  const isTheme = segs[0] === 'color' && segs[1] === 'theme';
  // Theme tokens drop the mode segment: components reference one stable name.
  const cssSegs = isTheme ? ['theme', ...segs.slice(3)] : segs;
  return {
    css: `--${cssSegs.map(kebab).join('-')}`,
    js: isTheme ? `themes.${segs[2]}.${ident(segs[3])}` : segs.map(ident).join('.'),
    code: ident(segs[segs.length - 1]),
  };
}

/* ------------------------------------------------------------------ escape */

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const fmt = (v) => (Array.isArray(v) ? v.join(', ') : typeof v === 'object' && v !== null ? Object.entries(v).map(([k, x]) => `${k}: ${x}`).join('; ') : String(v));

/* ================================================================= HTML === */

const LIGHT_BG = get('color.theme.light.bg').value;
const LIGHT_SURF = get('color.theme.light.surface').value;
const DARK_BG = get('color.theme.dark.bg').value;
const DARK_SURF = get('color.theme.dark.surface').value;

function swatchGrid(list) {
  return `<div class="grid">${list.map((e) => {
    const v = e.value;
    const n = names(e);
    const onLight = isHex(v) ? ratio(v, LIGHT_BG) : null;
    const onDark = isHex(v) ? ratio(v, DARK_BG) : null;
    return `<figure class="sw">
      <div class="chip" style="background:${esc(v)}"></div>
      <figcaption>
        <div class="nm">${esc(e.path.split('.').pop())}</div>
        <code class="val">${esc(v)}</code>
        ${e.alias ? `<div class="alias">→ ${esc(e.alias)}</div>` : ''}
        ${e.description ? `<p class="desc">${esc(e.description)}</p>` : ''}
        <dl class="plat">
          <div><dt>CSS</dt><dd><code>${esc(n.css)}</code></dd></div>
          <div><dt>JS</dt><dd><code>${esc(n.js)}</code></dd></div>
        </dl>
        ${onLight !== null ? `<div class="ratios"><span>on bone <b>${onLight}</b></span><span>on night <b>${onDark}</b></span></div>` : ''}
      </figcaption>
    </figure>`;
  }).join('')}</div>`;
}

function contrastTable(mode) {
  const bg = mode === 'light' ? LIGHT_BG : DARK_BG;
  const surf = mode === 'light' ? LIGHT_SURF : DARK_SURF;
  const keys = ['text', 'text-2', 'text-3', 'accent', 'accent-warm', 'anchor', 'on-anchor'];
  const rows = keys.map((k) => {
    const e = get(`color.theme.${mode}.${k}`);
    if (!e || !isHex(e.value)) return '';
    const isOnAnchor = k === 'on-anchor';
    const base = isOnAnchor ? get(`color.theme.${mode}.anchor-fill`).value : bg;
    const baseSurf = isOnAnchor ? base : surf;
    const r1 = ratio(e.value, base);
    const r2 = ratio(e.value, baseSurf);
    return `<tr>
      <td><code>${esc(k)}</code></td>
      <td><span class="dot" style="background:${esc(e.value)}"></span><code>${esc(e.value)}</code></td>
      <td class="num">${r1}<span class="g ${grade(r1).toLowerCase()}">${grade(r1)}</span></td>
      <td class="num">${r2}<span class="g ${grade(r2).toLowerCase()}">${grade(r2)}</span></td>
    </tr>`;
  }).join('');
  return `<div class="tw"><table>
    <thead><tr><th>Token</th><th>Value</th><th>On ground</th><th>On surface</th></tr></thead>
    <tbody>${rows}</tbody></table></div>`;
}

function typeSpecimens() {
  return byPrefix('typography').map((e) => {
    const v = e.value;
    const n = names(e);
    const size = parseFloat(v.fontSize);
    const lh = Math.round(size * parseFloat(v.lineHeight) * 100) / 100;
    const ls = Math.round(size * (parseFloat(v.letterSpacing) || 0) * 100) / 100;
    const style = `font-size:${v.fontSize};font-weight:${v.fontWeight};line-height:${v.lineHeight};letter-spacing:${v.letterSpacing};${v.textCase ? `text-transform:${v.textCase};` : ''}`;
    return `<div class="spec">
      <div class="spec-meta">
        <code class="nm">${esc(e.path.split('.').pop())}</code>
        <span>${v.fontSize} / ${v.fontWeight}</span>
        <span>line-height ${v.lineHeight} → <b>${lh}px</b></span>
        <span>tracking ${v.letterSpacing} → <b>${ls}px</b></span>
        <code>${esc(n.js)}</code>
      </div>
      <p class="spec-sample" style="${style}">Sawubona — Ukuqinisekisa umnikelo</p>
    </div>`;
  }).join('');
}

function scaleRow(prefix, unit = 'px') {
  return `<div class="tw"><table><thead><tr><th>Token</th><th>Value</th><th>CSS</th><th>Scale</th></tr></thead><tbody>${
    byPrefix(prefix).map((e) => {
      const px = parseFloat(e.value);
      return `<tr>
        <td><code>${esc(e.path.split('.').pop())}</code></td>
        <td class="num">${esc(e.value)}</td>
        <td><code>${esc(names(e).css)}</code></td>
        <td><span class="bar" style="width:${Math.min(px, 240)}px"></span></td>
      </tr>`;
    }).join('')
  }</tbody></table></div>`;
}

function simpleTable(prefix, label = 'Value') {
  return `<div class="tw"><table><thead><tr><th>Token</th><th>${label}</th><th>CSS</th><th>Notes</th></tr></thead><tbody>${
    byPrefix(prefix).map((e) => `<tr>
      <td><code>${esc(e.path.split('.').pop())}</code></td>
      <td><code>${esc(fmt(e.value))}</code></td>
      <td><code>${esc(names(e).css)}</code></td>
      <td class="notes">${e.description ? esc(e.description) : ''}</td>
    </tr>`).join('')
  }</tbody></table></div>`;
}

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>MyMzansi — Style Dictionary</title>
<style>
:root{
  --bg:${LIGHT_BG};--surface:${LIGHT_SURF};--ink:${get('color.theme.light.text').value};
  --ink2:${get('color.theme.light.text-2').value};--ink3:${get('color.theme.light.text-3').value};
  --rule:${get('color.theme.light.border').value};--accent:${get('color.theme.light.accent').value};
  --warm:${get('color.theme.light.accent-warm').value};--anchor:${get('color.theme.light.anchor-fill').value};
  --onAnchor:${get('color.theme.light.on-anchor').value};
  --ok:${get('color.semantic.success').value};--bad:${get('color.semantic.critical').value};
  --font:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
  --mono:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){
  --bg:${DARK_BG};--surface:${DARK_SURF};--ink:${get('color.theme.dark.text').value};
  --ink2:${get('color.theme.dark.text-2').value};--ink3:${get('color.theme.dark.text-3').value};
  --rule:${get('color.theme.dark.border').value};--accent:${get('color.theme.dark.accent').value};
  --warm:${get('color.theme.dark.accent-warm').value};
  --ok:${get('color.semantic.success-dark').value};--bad:${get('color.semantic.critical-dark').value};
}}
*{box-sizing:border-box}
body{margin:0;padding:0 20px 80px;background:var(--bg);color:var(--ink);font-family:var(--font);line-height:1.6;-webkit-font-smoothing:antialiased}
.wrap{max-width:1080px;margin:0 auto}
header.top{padding:56px 0 32px;border-bottom:2px solid var(--ink);margin-bottom:8px}
.band{display:flex;height:8px;margin:0 -20px 40px}
.band i{flex:1}
h1{font-size:clamp(2rem,5vw,3rem);font-weight:800;letter-spacing:-.025em;margin:0 0 12px;line-height:1.05}
.stand{color:var(--ink2);max-width:64ch;margin:0 0 20px}
.meta{display:flex;flex-wrap:wrap;gap:8px 24px;font-family:var(--mono);font-size:11.5px;color:var(--ink3)}
.meta b{color:var(--ink2);font-weight:500}
.warn{background:var(--surface);border:1px solid var(--rule);border-left:3px solid var(--warm);padding:14px 18px;margin:20px 0;border-radius:0 6px 6px 0;font-size:.92rem;color:var(--ink2)}
.warn b{color:var(--ink)}
section{padding:44px 0;border-top:1px solid var(--rule)}
h2{font-size:1.6rem;font-weight:800;letter-spacing:-.02em;margin:0 0 6px}
h3{font-size:1rem;font-weight:700;margin:28px 0 10px}
.lede{color:var(--ink2);max-width:68ch;margin:0 0 18px}
p{max-width:68ch}
code{font-family:var(--mono);font-size:.85em;background:var(--surface);border:1px solid var(--rule);padding:1px 5px;border-radius:3px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:14px}
.sw{margin:0;background:var(--surface);border:1px solid var(--rule);border-radius:8px;overflow:hidden}
.sw .chip{height:76px}
.sw figcaption{padding:12px}
.sw .nm{font-weight:700;font-size:.95rem}
.sw .val{display:inline-block;margin-top:4px}
.sw .alias{font-family:var(--mono);font-size:11px;color:var(--ink3);margin-top:4px}
.sw .desc{font-size:12px;color:var(--ink2);margin:8px 0 0;line-height:1.45}
.plat{margin:10px 0 0;display:grid;gap:2px;font-size:11px}
.plat div{display:flex;gap:6px}
.plat dt{color:var(--ink3);font-family:var(--mono);min-width:26px}
.plat dd{margin:0}
.ratios{display:flex;gap:12px;margin-top:8px;font-size:11px;color:var(--ink3);font-family:var(--mono)}
.ratios b{color:var(--ink2)}
.tw{overflow-x:auto;border:1px solid var(--rule);border-radius:8px;background:var(--surface);margin:16px 0}
table{border-collapse:collapse;width:100%;min-width:560px;font-size:.9rem}
th{text-align:left;font-family:var(--mono);font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--ink3);padding:11px 14px;border-bottom:2px solid var(--rule);font-weight:600}
td{padding:11px 14px;border-bottom:1px solid var(--rule);color:var(--ink2);vertical-align:middle}
tr:last-child td{border-bottom:none}
td.num{font-variant-numeric:tabular-nums;white-space:nowrap}
td.notes{font-size:12px;line-height:1.45}
.dot{display:inline-block;width:12px;height:12px;border-radius:3px;margin-right:7px;vertical-align:-1px;border:1px solid var(--rule)}
.g{margin-left:8px;font-family:var(--mono);font-size:9.5px;letter-spacing:.08em;padding:2px 5px;border-radius:3px}
.g.aaa,.g.aa{background:color-mix(in srgb,var(--ok) 16%,transparent);color:var(--ok)}
.g.fail{background:color-mix(in srgb,var(--bad) 16%,transparent);color:var(--bad)}
.bar{display:block;height:10px;border-radius:3px;background:var(--accent)}
.spec{padding:16px 0;border-bottom:1px solid var(--rule)}
.spec:last-child{border-bottom:none}
.spec-meta{display:flex;flex-wrap:wrap;gap:6px 16px;font-family:var(--mono);font-size:10.5px;color:var(--ink3);margin-bottom:10px}
.spec-meta .nm{color:var(--accent)}
.spec-meta b{color:var(--ink2)}
.spec-sample{margin:0;color:var(--ink)}
footer{margin-top:56px;padding-top:22px;border-top:1px solid var(--rule);font-size:.85rem;color:var(--ink3);max-width:70ch}
</style>
</head>
<body>
<div class="band">
  <i style="background:${get('color.palette.maize').value};flex:1"></i>
  <i style="background:${get('color.palette.ochre').value};flex:2"></i>
  <i style="background:${get('color.palette.aloe').value};flex:1"></i>
</div>
<div class="wrap">
<header class="top">
  <h1>MyMzansi Style Dictionary</h1>
  <p class="stand">Every design token, its value, where it came from, and what it is called on each platform. Generated from <code>tokens.json</code> — the single source of truth.</p>
  <div class="meta">
    <span><b>Version</b> ${esc(meta.version ?? '—')}</span>
    <span><b>Status</b> ${esc(meta.status ?? '—')}</span>
    <span><b>Tokens</b> ${entries.length}</span>
    <span><b>Generated</b> ${new Date().toISOString().slice(0, 10)}</span>
  </div>
  <div class="warn">${esc(meta.affiliation ?? '')} Tokens described as EXISTING were read from the live mymzansi.gov.za stylesheet; everything else is proposed.</div>
  <div class="warn"><b>This page is generated.</b> Do not edit it. Change <code>tokens.json</code> and run <code>npm run docs</code>. Type specimens render in a system fallback face, not Montserrat — the page makes no external requests, per BRAND.md §12.</div>
</header>

<section>
  <h2>Palette</h2>
  <p class="lede">Primitive colours. <b>Never reference these from a component</b> — use a theme or semantic token, so light and dark resolve on their own (BRAND.md §3.1).</p>
  ${swatchGrid(byPrefix('color.palette'))}
</section>

<section>
  <h2>Theme — light</h2>
  <p class="lede">What components actually reference. Contrast computed against the light ground and surface.</p>
  ${contrastTable('light')}
  ${swatchGrid(byPrefix('color.theme.light'))}
</section>

<section>
  <h2>Theme — dark</h2>
  ${contrastTable('dark')}
  ${swatchGrid(byPrefix('color.theme.dark'))}
</section>

<section>
  <h2>Semantic</h2>
  <p class="lede">Meaning-carrying colours. These are deliberately <b>not</b> the same tokens as the brand accent: when accent and success are one token, neither reading is reliable.</p>
  ${swatchGrid(byPrefix('color.semantic'))}
  <div class="warn"><b>R2 — the maize rule.</b> Maize reaches only ${ratio(get('color.palette.maize').value, LIGHT_BG)}:1 on the light ground, so in light theme it is a <b>ground, never a mark</b>: never text, never an icon, never the sole indicator of state. Ink on maize is ${ratio(get('color.palette.ink').value, get('color.palette.maize').value)}:1 (AAA). On the dark ground it is unrestricted at ${ratio(get('color.palette.maize').value, DARK_BG)}:1.</div>
</section>

<section>
  <h2>Typography</h2>
  <p class="lede">React Native needs <code>lineHeight</code> and <code>letterSpacing</code> as absolute numbers, so the pipeline converts the ratio and em values below into px. Consumers never do that maths.</p>
  ${typeSpecimens()}
</section>

<section>
  <h2>Space</h2>
  ${scaleRow('dimension.space')}
  <h3>Radius</h3>
  ${scaleRow('dimension.radius')}
  <h3>Touch targets</h3>
  <p class="lede">Non-negotiable — WCAG 2.5.5 / 2.5.8.</p>
  ${simpleTable('dimension.touch')}
  <h3>Icon sizes</h3>
  ${scaleRow('dimension.icon')}
</section>

<section>
  <h2>Icons</h2>
  <p class="lede">Semantic names, so changing the icon set means changing one file. Reference <code>icon.semantic.*</code> — never a raw glyph name.</p>
  ${simpleTable('icon.semantic', 'Glyph')}
</section>

<section>
  <h2>Motion</h2>
  <p class="lede">Every animation must hold 60fps on an entry-level handset: a 16.7ms frame budget, and in practice only <code>transform</code> and <code>opacity</code>.</p>
  <h3>Duration</h3>
  ${simpleTable('motion.duration')}
  <h3>Easing</h3>
  ${simpleTable('motion.easing')}
  <h3>Stagger</h3>
  ${simpleTable('motion.stagger')}
</section>

<section>
  <h2>Elevation</h2>
  <p class="lede">Use sparingly — shadows are paint-heavy on low-end GPUs. Prefer a surface change or a border.</p>
  ${simpleTable('elevation')}
</section>

<footer>
  <p><b>Provenance.</b> ${esc(meta.provenance?.existing ?? '')} ${esc(meta.provenance?.audited ?? '')}</p>
  <p><b>Generated by</b> <code>scripts/build-docs.mjs</code> from <code>tokens.json</code>. Zero dependencies, no external requests.</p>
</footer>
</div>
</body>
</html>
`;

/* =================================================================== MD === */

function mdTable(rows, head) {
  return [`| ${head.join(' | ')} |`, `|${head.map(() => '---').join('|')}|`, ...rows].join('\n');
}

const md = `<!-- GENERATED by scripts/build-docs.mjs from tokens.json. Do not hand-edit. -->

# MyMzansi Style Dictionary

**Version** ${meta.version ?? '—'} · **Status** ${meta.status ?? '—'} · **Tokens** ${entries.length} · **Generated** ${new Date().toISOString().slice(0, 10)}

> ${meta.affiliation ?? ''}

Every token, its value, and what it is called on each platform. Source of truth: [\`tokens.json\`](../tokens.json). Rules and rationale: [\`BRAND.md\`](../BRAND.md).

**Never reference \`color.palette.*\` from a component** — use a theme or semantic token so light and dark resolve on their own (BRAND.md §3.1).

---

## Palette

${mdTable(byPrefix('color.palette').map((e) => {
  const n = names(e);
  return `| \`${e.path.split('.').pop()}\` | \`${e.value}\` | \`${n.css}\` | ${isHex(e.value) ? ratio(e.value, LIGHT_BG) : '—'} | ${isHex(e.value) ? ratio(e.value, DARK_BG) : '—'} | ${e.description ?? ''} |`;
}), ['Token', 'Value', 'CSS', 'On bone', 'On night', 'Notes'])}

---

## Theme

${['light', 'dark'].map((mode) => `### ${mode}

${mdTable(byPrefix(`color.theme.${mode}`).map((e) => {
  const bg = mode === 'light' ? LIGHT_BG : DARK_BG;
  const r = isHex(e.value) ? ratio(e.value, bg) : null;
  return `| \`${e.path.split('.').pop()}\` | \`${e.value}\` | \`${names(e).css}\` | ${e.alias ? `\`${e.alias}\`` : '—'} | ${r !== null ? `${r} (${grade(r)})` : '—'} |`;
}), ['Token', 'Resolves to', 'CSS', 'Alias', 'On ground'])}
`).join('\n')}

---

## Semantic

${mdTable(byPrefix('color.semantic').map((e) => `| \`${e.path.split('.').pop()}\` | \`${e.value}\` | ${e.alias ? `\`${e.alias}\`` : '—'} | ${e.description ?? ''} |`), ['Token', 'Value', 'Alias', 'Notes'])}

> **R2 — the maize rule.** Maize is ${ratio(get('color.palette.maize').value, LIGHT_BG)}:1 on the light ground. In light theme it is a **ground, never a mark**. Ink on maize is ${ratio(get('color.palette.ink').value, get('color.palette.maize').value)}:1 (AAA); on the dark ground maize is unrestricted at ${ratio(get('color.palette.maize').value, DARK_BG)}:1.

---

## Typography

Sizes in px. React Native receives \`lineHeight\` and \`letterSpacing\` as absolute numbers — the pipeline converts the ratio and em values here.

${mdTable(byPrefix('typography').map((e) => {
  const v = e.value;
  const size = parseFloat(v.fontSize);
  const lh = Math.round(size * parseFloat(v.lineHeight) * 100) / 100;
  const ls = Math.round(size * (parseFloat(v.letterSpacing) || 0) * 100) / 100;
  return `| \`${e.path.split('.').pop()}\` | ${v.fontSize} | ${v.fontWeight} | ${v.lineHeight} → **${lh}px** | ${v.letterSpacing} → **${ls}px** | ${v.textCase ?? '—'} |`;
}), ['Token', 'Size', 'Weight', 'Line height', 'Tracking', 'Case'])}

---

## Dimensions

### Space
${mdTable(byPrefix('dimension.space').map((e) => `| \`${e.path.split('.').pop()}\` | ${e.value} | \`${names(e).css}\` |`), ['Token', 'Value', 'CSS'])}

### Radius
${mdTable(byPrefix('dimension.radius').map((e) => `| \`${e.path.split('.').pop()}\` | ${e.value} | \`${names(e).css}\` |`), ['Token', 'Value', 'CSS'])}

### Touch targets
${mdTable(byPrefix('dimension.touch').map((e) => `| \`${e.path.split('.').pop()}\` | ${e.value} | ${e.description ?? ''} |`), ['Token', 'Value', 'Notes'])}

### Icon sizes
${mdTable(byPrefix('dimension.icon').map((e) => `| \`${e.path.split('.').pop()}\` | ${e.value} | \`${names(e).css}\` |`), ['Token', 'Value', 'CSS'])}

---

## Icons

Reference \`icon.semantic.*\`, never a raw glyph name.

${mdTable(byPrefix('icon.semantic').map((e) => `| \`${e.path.split('.').pop()}\` | \`${e.value}\` | ${e.description ?? ''} |`), ['Token', 'Glyph', 'Notes'])}

---

## Motion

Only \`transform\` and \`opacity\` may be animated — 16.7ms frame budget on an entry-level handset.

${['duration', 'easing', 'stagger'].map((k) => `### ${k}
${mdTable(byPrefix(`motion.${k}`).map((e) => `| \`${e.path.split('.').pop()}\` | \`${fmt(e.value)}\` | ${e.description ?? ''} |`), ['Token', 'Value', 'Notes'])}
`).join('\n')}

---

## Elevation

${mdTable(byPrefix('elevation').map((e) => `| \`${e.path.split('.').pop()}\` | \`${fmt(e.value)}\` |`), ['Token', 'Value'])}

---

*Generated by \`scripts/build-docs.mjs\`. Zero dependencies. Do not hand-edit — change \`tokens.json\` and run \`npm run docs\`.*
`;

mkdirSync(path.join(ROOT, 'docs'), { recursive: true });
writeFileSync(path.join(ROOT, 'docs/TOKENS.md'), md);

// NOTE: the browsable HTML catalogue is now a page of the website
// (scripts/build-site.mjs → docs/tokens/). This script owns the Markdown
// catalogue only — writing docs/index.html here would clobber the site home.
void html;

console.log('Generated:');
console.log('  docs/TOKENS.md');
console.log(`  (${entries.length} tokens documented)`);
