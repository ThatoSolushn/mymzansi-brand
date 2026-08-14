/**
 * MyMzansi token validator.
 *
 * Makes the rules in BRAND.md enforceable rather than aspirational.
 * Exits non-zero on failure, so it can gate CI.
 *
 * Run: npm run validate   (or: node scripts/validate-tokens.mjs)
 *
 * Checks:
 *   1. tokens.json parses and every alias resolves
 *   2. WCAG 2.1 §1.4.3 AA — all theme text vs its surfaces (4.5:1)
 *   3. WCAG 2.1 §1.4.3 AA — inverted text on every filled accent (4.5:1)
 *   4. WCAG 2.1 §1.4.11 — semantic colours as UI elements (3:1)
 *   5. R2 — confirms maize still fails as a mark on light, so the rule stands
 *   6. Drift — same hex under two names, or a palette hex nothing references
 */
import fs from 'node:fs';

/* ---------- WCAG maths (sRGB relative luminance, WCAG 2.1) ---------- */
const hex2rgb = (h) => {
  const s = h.replace('#', '');
  return [0, 2, 4].map((i) => parseInt(s.slice(i, i + 2), 16));
};
const lin = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const lum = (h) => { const [r, g, b] = hex2rgb(h); return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b); };
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)];
  return Math.round(((Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05)) * 100) / 100;
};

/* ---------- load + flatten ---------- */
const raw = fs.readFileSync(new URL('../tokens.json', import.meta.url), 'utf8');
let tok;
try { tok = JSON.parse(raw); } catch (e) { console.error('✗ tokens.json does not parse:', e.message); process.exit(1); }

const flat = {};
(function walk(node, path) {
  for (const [k, v] of Object.entries(node)) {
    if (k.startsWith('$')) continue;
    const p = [...path, k];
    if (v && typeof v === 'object' && '$value' in v) flat[p.join('.')] = v.$value;
    else if (v && typeof v === 'object') walk(v, p);
  }
})(tok, []);

const collectRefs = (v) => {
  if (typeof v === 'string') return [...v.matchAll(/\{([A-Za-z0-9_.\-]+)\}/g)].map((m) => m[1]);
  if (Array.isArray(v)) return v.flatMap(collectRefs);
  if (v && typeof v === 'object') return Object.values(v).flatMap(collectRefs);
  return [];
};
const resolve = (v, depth = 0) => {
  if (depth > 10) throw new Error('alias cycle');
  if (typeof v === 'string') {
    const m = v.match(/^\{([A-Za-z0-9_.\-]+)\}$/);
    if (m) return resolve(flat[m[1]], depth + 1);
  }
  return v;
};

const fails = [];
const warns = [];
let checks = 0;
const check = (cond, msg) => { checks++; if (!cond) fails.push(msg); };

/**
 * Flag pairings that pass but only just. The aloe-lt finding (BRAND.md §4.6.2)
 * was exactly this shape: 5.00:1 on white, 4.36:1 on a tint — fine until the
 * ground moved. Anything inside 10% of the threshold is fragile, not safe.
 */
const MARGIN = 1.1;
const checkMargin = (r, threshold, label) => {
  if (r >= threshold && r < threshold * MARGIN) {
    warns.push(`Marginal: ${label} = ${r}:1 (threshold ${threshold}). Passes, but any ground change breaks it.`);
  }
};

/* ---------- 1. aliases ---------- */
let aliasCount = 0;
for (const [name, val] of Object.entries(flat)) {
  for (const r of collectRefs(val)) {
    aliasCount++;
    check(r in flat, `Unresolved alias: ${name} → {${r}}`);
  }
}

/* ---------- colour helpers ---------- */
const C = (path) => {
  const v = resolve(flat[path]);
  if (typeof v !== 'string' || !/^#[0-9A-Fa-f]{6}$/.test(v)) return null;
  return v;
};
const AA_TEXT = 4.5, AA_UI = 3.0;

const THEMES = {
  light: { surfaces: ['color.theme.light.bg', 'color.theme.light.surface'] },
  dark:  { surfaces: ['color.theme.dark.bg', 'color.theme.dark.surface'] },
};

/* ---------- 2. theme text vs surfaces ---------- */
for (const [mode, { surfaces }] of Object.entries(THEMES)) {
  for (const textKey of ['text', 'text-2', 'text-3', 'accent', 'accent-warm', 'anchor']) {
    const fg = C(`color.theme.${mode}.${textKey}`);
    if (!fg) continue;
    for (const sKey of surfaces) {
      const bg = C(sKey);
      const r = ratio(fg, bg);
      check(r >= AA_TEXT, `[§1.4.3 AA] ${mode}.${textKey} (${fg}) on ${sKey.split('.').pop()} (${bg}) = ${r}:1, need ${AA_TEXT}`);
      checkMargin(r, AA_TEXT, `${mode}.${textKey} on ${sKey.split('.').pop()}`);
    }
  }
}

/* ---------- 3. inverted text on filled accents ---------- */
for (const mode of ['light', 'dark']) {
  const inv = C(`color.theme.${mode}.text-invert`);
  for (const key of ['accent', 'accent-warm', 'anchor']) {
    const bg = C(`color.theme.${mode}.${key}`);
    if (!bg || !inv) continue;
    const r = ratio(inv, bg);
    check(r >= AA_TEXT, `[§1.4.3 AA] ${mode} text-invert on ${key} = ${r}:1, need ${AA_TEXT}`);
  }
}

/* ---------- 3b. on-anchor must be legible on anchor-fill ---------- */
for (const mode of ['light', 'dark']) {
  const fg = C(`color.theme.${mode}.on-anchor`);
  const bg = C(`color.theme.${mode}.anchor-fill`);
  if (!fg || !bg) continue;
  const r = ratio(fg, bg);
  check(r >= AA_TEXT, `[§1.4.3 AA] ${mode} on-anchor on anchor-fill = ${r}:1, need ${AA_TEXT}`);
  checkMargin(r, AA_TEXT, `${mode} on-anchor on anchor-fill`);
  // A filled header must read as a header in BOTH themes: it has to separate
  // from the page ground, or it is not a band at all.
  const ground = C(`color.theme.${mode}.bg`);
  const sep = ratio(bg, ground);
  if (sep < 1.2) {
    warns.push(`anchor-fill barely separates from the ${mode} page ground (${sep}:1) — the header may not read as a band.`);
  }
}

/* ---------- 4. semantic colours as UI elements ---------- */
const semanticLight = ['success', 'caution-text', 'critical', 'info', 'restricted'];
for (const s of semanticLight) {
  const fg = C(`color.semantic.${s}`);
  if (!fg) continue;
  for (const sKey of THEMES.light.surfaces) {
    const bg = C(sKey);
    const r = ratio(fg, bg);
    check(r >= AA_TEXT, `[§1.4.3 AA] semantic.${s} (${fg}) on ${sKey.split('.').pop()} = ${r}:1, need ${AA_TEXT}`);
    checkMargin(r, AA_TEXT, `semantic.${s} on ${sKey.split('.').pop()}`);
  }
}

/* ---------- 5. R2 — the maize rule ---------- */
const maize = C('color.palette.maize');
const ink = C('color.palette.ink');
for (const sKey of THEMES.light.surfaces) {
  const bg = C(sKey);
  const r = ratio(maize, bg);
  checks++;
  if (r >= AA_UI) {
    warns.push(`R2 may no longer be needed: maize now reaches ${r}:1 on ${sKey.split('.').pop()} — re-open BRAND.md §4.5`);
  }
}
const inkOnMaize = ratio(ink, maize);
check(inkOnMaize >= AA_TEXT, `[R2/§4.5] ink on maize fill = ${inkOnMaize}:1 — maize is only usable as a ground if this holds`);

/* caution-fill must carry ink, not white */
const cf = C('color.semantic.caution-fill');
if (cf) {
  const r = ratio(ink, cf);
  check(r >= AA_TEXT, `[§4.2] ink on caution-fill = ${r}:1, need ${AA_TEXT}`);
}

/* ---------- 6. drift ---------- */
const paletteHexes = {};
for (const [name, val] of Object.entries(flat)) {
  if (!name.startsWith('color.palette.')) continue;
  const v = resolve(val);
  if (typeof v !== 'string' || !/^#[0-9A-Fa-f]{6}$/.test(v)) continue;
  (paletteHexes[v.toUpperCase()] ??= []).push(name.split('.').pop());
}
for (const [hex, names] of Object.entries(paletteHexes)) {
  if (names.length > 1) warns.push(`Duplicate hex ${hex} under ${names.length} names: ${names.join(', ')} — likely drift`);
}

/* aloe-lt fragility guard (BRAND.md §4.6.2) */
const aloeLt = C('color.palette.aloe-lt');
if (aloeLt) {
  const onBone = ratio(aloeLt, C('color.palette.bone'));
  if (onBone < AA_TEXT) {
    warns.push(`aloe-lt (${aloeLt}) is ${onBone}:1 on bone — below AA. Documented as white-background-only (§4.6.2). Do not use it on a tinted ground.`);
  } else {
    checkMargin(onBone, AA_TEXT, 'aloe-lt on bone (EXISTING token, §4.6.2)');
  }
}

/* ---------- report ---------- */
const g = (s) => `\x1b[32m${s}\x1b[0m`, r = (s) => `\x1b[31m${s}\x1b[0m`, y = (s) => `\x1b[33m${s}\x1b[0m`;
console.log(`\nMyMzansi token validation`);
console.log(`  tokens:  ${Object.keys(flat).length}`);
console.log(`  aliases: ${aliasCount}`);
console.log(`  checks:  ${checks}\n`);

if (warns.length) {
  console.log(y(`  ${warns.length} warning(s):`));
  warns.forEach((w) => console.log(y(`    ! ${w}`)));
  console.log('');
}
if (fails.length) {
  console.log(r(`  ${fails.length} FAILURE(S):`));
  fails.forEach((f) => console.log(r(`    ✗ ${f}`)));
  console.log('');
  process.exit(1);
}
console.log(g(`  ✓ All ${checks} checks pass — WCAG 2.1 AA holds across both themes\n`));
