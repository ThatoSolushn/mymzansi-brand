/**
 * Shared site helpers: token loading, WCAG maths, and documentation components.
 *
 * Zero dependencies. Everything here reads tokens.json — the site is a view of
 * the design system, never a second copy of it.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
export const tokens = JSON.parse(readFileSync(path.join(ROOT, 'tokens.json'), 'utf8'));
export const meta = tokens.$extensions?.['org.mymzansi.meta'] ?? {};

/* ------------------------------------------------------------- flattening */

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
function deref(v, seen = new Set()) {
  if (typeof v === 'string') {
    const m = v.match(REF);
    if (!m) return v;
    if (seen.has(m[1])) throw new Error(`Circular reference: ${m[1]}`);
    const t = raw.get(m[1]);
    if (!t) throw new Error(`Unresolved reference: {${m[1]}}`);
    return deref(t.value, new Set(seen).add(m[1]));
  }
  if (Array.isArray(v)) return v.map((x) => deref(x, seen));
  if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, deref(x, seen)]));
  return v;
}

export const entries = [...raw.entries()].map(([p, t]) => ({
  path: p,
  value: deref(t.value),
  type: t.type,
  description: t.description,
  alias: typeof t.value === 'string' && REF.test(t.value) ? t.value.slice(1, -1) : null,
}));

export const group = (prefix) =>
  entries.filter((e) => e.path.startsWith(prefix + '.') && !e.path.slice(prefix.length + 1).includes('.'));
export const token = (p) => entries.find((e) => e.path === p);
export const val = (p) => token(p)?.value;
export const leaf = (e) => e.path.split('.').pop();

/* ------------------------------------------------------------ WCAG maths */

const hex2rgb = (h) => [0, 2, 4].map((i) => parseInt(h.replace('#', '').slice(i, i + 2), 16));
const lin = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
export const lum = (h) => { const [r, g, b] = hex2rgb(h); return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b); };
export const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)];
  return Math.round(((Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05)) * 100) / 100;
};
export const isHex = (v) => typeof v === 'string' && /^#[0-9A-Fa-f]{6}$/.test(v);
export const grade = (r, need = 4.5) => (r >= 7 ? 'AAA' : r >= need ? 'AA' : 'FAIL');

export const LIGHT_BG = val('color.theme.light.bg');
export const LIGHT_SURF = val('color.theme.light.surface');
export const DARK_BG = val('color.theme.dark.bg');
export const DARK_SURF = val('color.theme.dark.surface');

/* -------------------------------------------------------- platform naming */

const kebabToCamel = (s) => s.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
const safeName = (s) => s.replace(/^(\d+)x([a-z]+)$/, (_, n, sfx) => 'x'.repeat(Number(n)) + sfx);
export const ident = (s) => kebabToCamel(safeName(s));
export const kebab = (s) => String(s).replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

/** The identifier one token becomes on each platform. */
export function names(e) {
  const segs = e.path.split('.');
  const isTheme = segs[0] === 'color' && segs[1] === 'theme';
  const cssSegs = isTheme ? ['theme', ...segs.slice(3)] : segs;
  return {
    css: `--${cssSegs.map(kebab).join('-')}`,
    js: isTheme ? `themes.${segs[2]}.${ident(segs[3])}` : segs.map(ident).join('.'),
    swift: `MzTokens.${ident(segs[segs.length - 1])}`,
  };
}

/* ------------------------------------------------------------- utilities */

/** An external link, visually marked, opened safely. */
export const extLink = (href, label) =>
  `<a href="${esc(href)}" target="_blank" rel="noopener noreferrer">${esc(label)} <span aria-hidden="true">↗</span></a>`;

export const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const fmt = (v) =>
  Array.isArray(v)
    ? v.join(', ')
    : v && typeof v === 'object'
      ? Object.entries(v).map(([k, x]) => `${k}: ${x}`).join('; ')
      : String(v);

/* ------------------------------------------------- documentation components */

export const lede = (t) => `<p class="lede">${t}</p>`;

export function callout(body, { tone = 'note', title = '' } = {}) {
  return `<aside class="callout ${tone}">${title ? `<b class="ct">${esc(title)}</b>` : ''}<div>${body}</div></aside>`;
}

export function table(head, rows, { min = 560 } = {}) {
  return `<div class="tw"><table style="min-width:${min}px">
    <thead><tr>${head.map((h) => `<th>${h}</th>`).join('')}</tr></thead>
    <tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody>
  </table></div>`;
}

export const code = (s) => `<code>${esc(s)}</code>`;

export const dot = (hex) => `<span class="dot" style="background:${esc(hex)}"></span>`;

export function gradeChip(r, need = 4.5) {
  const g = grade(r, need);
  return `<span class="num">${r}</span><span class="g ${g.toLowerCase()}">${g}</span>`;
}

export function swatches(list, { showRatios = true } = {}) {
  return `<div class="grid">${list.map((e) => {
    const v = e.value;
    const n = names(e);
    return `<figure class="sw">
      <div class="chip" style="background:${esc(v)}"></div>
      <figcaption>
        <div class="nm">${esc(leaf(e))}</div>
        <code class="val">${esc(v)}</code>
        ${e.alias ? `<div class="alias">→ ${esc(e.alias)}</div>` : ''}
        ${e.description ? `<p class="desc">${esc(e.description)}</p>` : ''}
        <dl class="plat">
          <div><dt>CSS</dt><dd><code>${esc(n.css)}</code></dd></div>
          <div><dt>JS</dt><dd><code>${esc(n.js)}</code></dd></div>
        </dl>
        ${showRatios && isHex(v) ? `<div class="ratios"><span>bone <b>${ratio(v, LIGHT_BG)}</b></span><span>night <b>${ratio(v, DARK_BG)}</b></span></div>` : ''}
      </figcaption>
    </figure>`;
  }).join('')}</div>`;
}

export function cards(items) {
  return `<div class="cards">${items.map((i) => `
    <a class="card" href="${i.href}">
      <span class="card-eyebrow">${esc(i.eyebrow ?? '')}</span>
      <h3>${esc(i.title)}</h3>
      <p>${esc(i.body)}</p>
      <span class="card-go">Read →</span>
    </a>`).join('')}</div>`;
}
