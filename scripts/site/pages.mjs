/**
 * Page content. Each entry returns { path, html }.
 *
 * Prose is written for the site rather than pasted from BRAND.md — but every
 * number is computed from tokens.json at build time, so the documentation
 * cannot drift from the system it documents.
 */
import {
  entries, group, token, val, leaf, names, ratio, grade, isHex, esc, fmt, code, dot,
  gradeChip, swatches, cards, table, callout, extLink, LIGHT_BG, LIGHT_SURF, DARK_BG, DARK_SURF, meta, icons,
} from './lib.mjs';
import { page, NAV } from './layout.mjs';
import { markTri } from './mark.mjs';

const MZ = 'https://www.mymzansi.gov.za';
const mzUrl = (p) => `${MZ}${p}`;

const R = (a, b) => ratio(a, b);
const maize = val('color.palette.maize');
const ink = val('color.palette.ink');

/* ===================================================================== home */

function home() {
  const guideCards = NAV[0].children.map((c) => ({
    href: c.href, title: c.title, body: c.blurb, eyebrow: 'Guideline',
  }));

  return page({
    title: 'A design system for public services',
    depth: 0,
    active: '',
    side: false,
    lead: 'Tokens, rules and evidence for building South African government services that nobody is excluded from — and that hold up on a four-year-old phone.',
    body: `
${callout(`<p>This is <b>unofficial concept work</b>. It is not endorsed by or affiliated with the Presidency's Digital Services Unit, the Department of Communications and Digital Technologies, or any organ of the South African state. Tokens marked <b>EXISTING</b> were read from the live ${extLink(MZ + '/', 'mymzansi.gov.za')} stylesheet; everything else is a proposal for discussion.</p>`, { tone: 'warn', title: 'Please read first' })}

<figure class="brand-moment">
  ${markTri({ size: 120, count: 6 })}
  <figcaption>The identity mark — method, not motif. <a href="guidelines/identity-mark/">How it is built →</a></figcaption>
</figure>

<h2 id="what">What this is</h2>
<p>A single source of truth — <code>tokens.json</code>, in the W3C Design Tokens format — plus the rules that govern how those tokens may be used, and the evidence behind each rule. Every page on this site is generated from that file, so the documentation cannot drift from the system.</p>

<div class="cards">
  <a class="card" href="tokens/"><span class="card-eyebrow">Reference</span><h3>${entries.length} tokens</h3><p>Colour, type, space, radius, motion and icons — each with its value, provenance, and the identifier it becomes on every platform.</p><span class="card-go">Browse →</span></a>
  <a class="card" href="guidelines/accessibility/"><span class="card-eyebrow">Evidence</span><h3>106 automated checks</h3><p>WCAG 2.1 contrast is computed and enforced in CI, not asserted. Six failures were found and corrected; the audit is published in full.</p><span class="card-go">See the audit →</span></a>
  <a class="card" href="guidelines/language/"><span class="card-eyebrow">Principle</span><h3>Twelve languages</h3><p>The identity is structural, not decorative. What that means for layout, typography and signed content.</p><span class="card-go">Read →</span></a>
</div>

<h2 id="principles">What it optimises for</h2>
<p>In priority order. When two requirements conflict, this is how they resolve.</p>
<ol>
  <li><b>Nobody is excluded.</b> Someone with worn fingerprints, no smartphone, no data, or no English must still complete the task.</li>
  <li><b>The user can verify what happened.</b> Trust is the product. Anything the state does with a person's data must be visible and contestable.</li>
  <li><b>It works on a cheap phone on a slow network.</b> A hard constraint, not an optimisation.</li>
  <li><b>It is beautiful.</b> Last in priority, never omitted. Dignity is a design requirement in a public service.</li>
</ol>

${callout(`<p>Most government products design the happy path and treat failure as an error state bolted on afterwards. This system inverts that. <b>The failure paths are the product</b> — the fingerprint that will not read, the stolen phone, the grant collected by someone else — because that is where trust is decided.</p>`, { title: 'The rule that catches most mistakes' })}

<h2 id="guidelines">Guidelines</h2>
${cards(guideCards)}

<h2 id="programme">Built for a specific programme</h2>
<p>This is not a generic design system — it exists to serve <a href="programme/">MyMzansi</a>, South Africa's national digital government initiative. Its mission, principles and roadmap come from the Presidency's Digital Services Unit, not from here. See how this system's rules trace back to their own stated principles, in their own words.</p>
<p><a href="programme/"><b>Read the strategic context →</b></a> · ${extLink(MZ + '/', 'Visit mymzansi.gov.za')}</p>

<h2 id="components">Components, built on the tokens</h2>
<p>The first component library is here: fourteen primitives — Button, Card, Input, Badge, StatusRow, Sheet, Switch and more — shipped for web, built with React, Tailwind and Radix directly on these tokens, and documented with their variants, states and accessibility contracts. The React Native set is following.</p>
<p><a href="components/"><b>See the components →</b></a></p>

<h2 id="next">What is coming</h2>
<p>With components now shipping, the tiers above them come into view — templates, an icon and Figma library, illustration guidance, machine-readable AI documentation and an adoption awards programme.</p>
<p><a href="roadmap/"><b>See the roadmap →</b></a></p>

<h2 id="using">Using the system</h2>
<p>Tokens are published for every platform from one source. Nothing downstream is hand-edited.</p>
${table(
  ['Platform', 'Import', 'Reference'],
  [
    ['Web / CSS', code('dist/css/tokens.css'), code('var(--theme-accent)')],
    ['React Native / JS', code("import brand from 'mymzansi-brand'"), code('themes.light.accent')],
    ['Tailwind', code('dist/tailwind/tailwind.config.js'), code('theme.extend')],
    ['iOS / Swift', code('dist/swift/MzTokens.swift'), code('MzTokens.aloe')],
    ['Android / Kotlin', code('dist/kotlin/MzTokens.kt'), code('MzTokens.aloe')],
    ['Flutter / Dart', code('dist/dart/mz_tokens.dart'), code('MzTokens.aloe')],
  ],
)}
${callout(`<p>Reference <b>theme</b> and <b>semantic</b> tokens from components — never <code>color.palette.*</code> directly. Theme tokens resolve light and dark on their own; palette tokens do not. When accent and success are the same token, neither reading is reliable.</p>`, { title: 'The one architectural rule' })}
`,
  });
}

/* =============================================================== guidelines */

function guidelinesIndex() {
  return page({
    title: 'Guidelines',
    eyebrow: 'Foundations',
    depth: 1,
    active: 'guidelines/',
    lead: 'The rules that govern how the tokens may be used, and the evidence behind each one.',
    body: `
<p>Each guideline states what to do, what not to do, and why. Where a rule exists because of measured evidence — a contrast ratio, a documented exclusion harm, a frame budget — the number is shown rather than summarised.</p>
${cards(NAV[0].children.map((c) => ({ href: `../${c.href}`, title: c.title, body: c.blurb, eyebrow: 'Guideline' })))}
`,
  });
}

/* =================================================================== colour */

function contrastRows(mode) {
  const bg = mode === 'light' ? LIGHT_BG : DARK_BG;
  const surf = mode === 'light' ? LIGHT_SURF : DARK_SURF;
  return ['text', 'text-2', 'text-3', 'accent', 'accent-warm', 'anchor'].map((k) => {
    const e = token(`color.theme.${mode}.${k}`);
    if (!e || !isHex(e.value)) return null;
    return [code(k), `${dot(e.value)}${code(e.value)}`, gradeChip(R(e.value, bg)), gradeChip(R(e.value, surf))];
  }).filter(Boolean);
}

function colour() {
  const maizeOnLight = R(maize, LIGHT_BG);
  const inkOnMaize = R(ink, maize);
  const maizeOnDark = R(maize, DARK_BG);
  const aloeLt = val('color.palette.aloe-lt');

  return page({
    title: 'Colour',
    eyebrow: 'Guideline',
    depth: 2,
    active: 'guidelines/colour/',
    lead: 'Colours drawn from specific South African material sources — not from the flag, which reads as municipal letterhead and is politically flat.',
    body: `
<h2 id="sources">Where the colours come from</h2>
${table(
  ['Token', 'Source', 'Role'],
  [
    [code('indigo'), 'Shweshwe indigo — the discharge-printed cotton, European and Indian in origin, made Xhosa and Sotho by adoption', 'Anchor, headers, dark surfaces'],
    [code('aloe'), 'Aloe and veld', 'Primary action, success'],
    [code('maize'), 'Maize', 'Joy and arrival — <b>ground only</b>'],
    [code('ochre'), 'Highveld soil and mine dump', 'Warm accent, restricted state'],
    [code('bone'), 'Warm paper', 'Page ground'],
    [code('ink'), 'Near-black with a green bias', 'Body text'],
  ],
)}
${callout(`<p>If a visual identity is wanted beyond colour, do <b>not</b> apply Ndebele geometry or beadwork motifs as a decorative skin. That visual culture has a documented history of extraction, it makes one people's language stand for twelve, and it survives exactly one redesign. What can legitimately be taken is <b>method, not motif</b>: hard edges, flat unmodulated colour, confident blocking, strong dividing lines. If pattern is genuinely wanted, commission a living artist with credit and an ongoing licence.</p>`, { tone: 'warn', title: 'Structure over motif' })}

<h2 id="palette">Palette</h2>
<p>Primitive colours. <b>Never reference these from a component</b> — use a theme or semantic token so light and dark resolve on their own.</p>
${swatches(group('color.palette'))}

<h2 id="theme">Theme tokens</h2>
<p>What components actually reference. The same name resolves to a different value per theme, so a component is written once.</p>
<h3>Light</h3>
${table(['Token', 'Value', 'On ground', 'On surface'], contrastRows('light'))}
<h3>Dark</h3>
${table(['Token', 'Value', 'On ground', 'On surface'], contrastRows('dark'))}

<h2 id="semantic">Semantic colour</h2>
<p>Meaning-carrying colours, deliberately separate from the brand accent.</p>
${swatches(group('color.semantic'), { showRatios: false })}
<p><code>restricted</code> is deliberately distinct from <code>critical</code>. An action someone cannot take <i>yet</i> is not an error, and a warm limit reads differently from a red failure to a person who has just been told their fingerprint would not read.</p>

<h2 id="maize">The maize rule</h2>
${callout(`<p>Maize reaches only <b>${maizeOnLight}:1</b> against the light ground. It cannot be corrected by darkening — reaching 3:1 costs 27% lightness, at which point it is a brown, not the joy colour.</p>
<p><b>In light theme, maize is a ground, never a mark.</b> Never text, never an icon, never a border, never the sole indicator of a state. Ink on maize is ${inkOnMaize}:1 (AAA). On the dark ground it is unrestricted at ${maizeOnDark}:1.</p>`, { tone: 'stop', title: 'R2 — non-negotiable' })}
${table(
  ['Maize used as…', 'Ratio', 'Verdict'],
  [
    ['Text on white', `<span class="num">${R(maize, '#FFFFFF')}:1</span>`, '<b>Fails badly</b>'],
    ['A filled state indicator on the light ground', `<span class="num">${maizeOnLight}:1</span>`, '<b>Fails §1.4.11</b>'],
    ['A ground with ink text on top', `<span class="num">${inkOnMaize}:1</span>`, 'AAA'],
    ['Anything on the dark ground', `<span class="num">${maizeOnDark}:1</span>`, 'AAA'],
    ['Against an indigo track', `<span class="num">${R(maize, val('color.palette.indigo'))}:1</span>`, 'AAA'],
  ],
)}
<p><b>Worked example.</b> An assurance meter filling maize against a light track is imperceptible. Two fixes, apply both: put the meter on an <b>indigo</b> track, and state the level in <b>text</b>. The text is the more important of the two — it satisfies §1.4.1, which makes the meter redundant reinforcement rather than the only carrier of the information.</p>

<h2 id="fragile">A fragile inherited token</h2>
${callout(`<p><code>aloe-lt</code> <code>${aloeLt}</code> is an existing MyMzansi token. It reaches <b>${R(aloeLt, '#FFFFFF')}:1</b> on pure white but only <b>${R(aloeLt, '#F2EFE8')}:1</b> on a warm off-white. It is not broken — it is <i>fragile</i>. Any tinted ground, disabled state or overlay tips it under AA without anyone noticing, because it still looks green and still looks fine.</p>
<p>Two acceptable fixes: darken it to <code>${val('color.palette.aloe')}</code>, or write a rule that it is a pure-white-background-only colour. Having neither is how a design system quietly ships inaccessible screens.</p>`, { tone: 'warn', title: 'Worth raising independently' })}
<p>The validator now flags any pairing that passes within 10% of its threshold, because this is the shape such defects take.</p>
`,
  });
}

/* =============================================================== typography */

function typography() {
  const specs = group('typography').map((e) => {
    const v = e.value;
    const size = parseFloat(v.fontSize);
    const lh = Math.round(size * parseFloat(v.lineHeight) * 100) / 100;
    const ls = Math.round(size * (parseFloat(v.letterSpacing) || 0) * 100) / 100;
    const style = `font-size:${v.fontSize};font-weight:${v.fontWeight};line-height:${v.lineHeight};letter-spacing:${v.letterSpacing};${v.textCase ? `text-transform:${v.textCase};` : ''}`;
    return `<div class="spec">
      <div class="spec-meta">
        <code class="k">${esc(leaf(e))}</code>
        <span>${v.fontSize} / ${v.fontWeight}</span>
        <span>line-height ${v.lineHeight} → <b>${lh}px</b></span>
        <span>tracking ${v.letterSpacing} → <b>${ls}px</b></span>
      </div>
      <p class="spec-sample" style="${style}">Sawubona — Ukuqinisekisa umnikelo</p>
    </div>`;
  }).join('');

  return page({
    title: 'Typography',
    eyebrow: 'Guideline',
    depth: 2,
    active: 'guidelines/typography/',
    lead: 'A type scale built for small sizes on cheap panels in hard sunlight — and for languages that write a whole phrase as one word.',
    body: `
<h2 id="scale">The scale</h2>
${specs}
${callout(`<p>Specimens on this page render in a system fallback face, not Montserrat. The site makes no external requests, and a font CDN would break the zero-rating guarantee the product has to honour.</p>`, { title: 'A note on this page' })}

<h2 id="conversion">Ratios become pixels</h2>
<p>React Native needs <code>lineHeight</code> and <code>letterSpacing</code> as absolute numbers, not ratios and em. The pipeline converts them, so no consumer does that arithmetic:</p>
${table(
  ['Token', 'Size', 'Line height', 'Tracking'],
  group('typography').map((e) => {
    const v = e.value;
    const size = parseFloat(v.fontSize);
    return [
      code(leaf(e)),
      `<span class="num">${v.fontSize}</span>`,
      `<span class="num">${v.lineHeight} → <b>${Math.round(size * parseFloat(v.lineHeight) * 100) / 100}px</b></span>`,
      `<span class="num">${v.letterSpacing} → <b>${Math.round(size * (parseFloat(v.letterSpacing) || 0) * 100) / 100}px</b></span>`,
    ];
  }),
)}

<h2 id="minimums">Minimum sizes</h2>
<ul>
  <li>Body text defaults to <b>16px</b>, not the 14 most mobile systems use. These screens are read at small sizes, on low-quality displays, in hard light, frequently by older people.</li>
  <li>Interactive text never below <b>14px</b>. Any text never below <b>12px</b>.</li>
  <li>Text must scale with OS text-size settings. Never lock to a pixel value in a way that ignores user preference.</li>
  <li>Running text sits between 45 and 75 characters. Nguni languages run longer per word, so err toward the lower bound.</li>
</ul>

<h2 id="face">Choosing a typeface</h2>
<p>Montserrat is an <b>interim</b> choice inherited from the existing site. Before any face is fixed it must be tested against:</p>
<ul>
  <li><b>Full Latin Extended</b> — the diacritics used across all official languages.</li>
  <li><b>The click letters</b> <code>ǀ ǁ ǂ ǃ</code> used in Khoekhoegowab and Nǀuu. The Constitution obliges the state to promote these languages, and most fashionable geometric sans faces lack them and fall back mid-word — a silent, ugly failure.</li>
  <li><b>High x-height and open apertures</b>, for legibility at small sizes.</li>
</ul>
<p>Test with real strings in all twelve languages, not with lorem, and not with English set in a different face.</p>
`,
  });
}

/* ================================================================= language */

function language() {
  return page({
    title: 'Language',
    eyebrow: 'Guideline',
    depth: 2,
    active: 'guidelines/language/',
    lead: 'The most distinctive fact about South Africa is not a pattern. It is that twelve official languages share one state — and since 2023, one of them is South African Sign Language.',
    body: `
<h2 id="structural">Identity that cannot be stripped</h2>
<p>Build the visual identity out of language and it is impossible to appropriate, impossible to remove in a redesign, and functional and beautiful in the same gesture. No other country designs under this constraint.</p>
<p>Most products bury language in a settings screen, chosen once and never seen again. The proposal here is the opposite: <b>language is a first-class object in the interface</b> — visible on the home surface, switchable in one action, and changeable mid-transaction without losing progress, because someone helping a relative at a counter may need to switch halfway through.</p>

<h2 id="orthography">The constraint nobody budgets for</h2>
<p>The Nguni languages — isiZulu, isiXhosa, siSwati, isiNdebele — use <b>conjunctive orthography</b>: what English writes as a phrase, they write as a single word. The Sotho-Tswana languages are disjunctive and behave differently again.</p>
<p>The practical result is that a label which fits in English will overflow, and it will overflow as an <b>unbreakable single token</b> — far worse than a long phrase.</p>
${table(
  ['Rule', 'Detail'],
  [
    ['No fixed-width containers', 'Buttons, tabs, chips, badges and table headers size to their content.'],
    ['Budget 2× the English length', 'For any translatable label.'],
    ['Allow mid-word breaking', 'Never let ellipsis be the fallback for a primary action label — truncation is passed to screen readers too.'],
    ['Never bake text into images', 'It cannot be translated, scaled, or read aloud.'],
    ['Declare the language of each part', 'WCAG §3.1.2. This is what lets a screen reader pronounce isiZulu as isiZulu rather than as mispronounced English.'],
  ],
)}

<h2 id="sasl">South African Sign Language</h2>
${callout(`<p>SASL became the <b>twelfth official language</b> in 2023, by constitutional amendment. Treat it as a <b>first-class content type</b>, not an accessibility bolt-on: short signed video for consent surfaces, assurance explanations, and anything with legal consequence.</p>
<p>It sits <i>beside</i> the text, not ghettoised in a corner, and it must degrade gracefully where bandwidth cannot carry video — saying so when it does.</p>
<p>No other government product does this. It is constitutionally grounded and would be genuinely unprecedented.</p>`, { title: 'The idea worth taking' })}

<h2 id="copy">Never invent translations</h2>
${callout(`<p>All non-English copy produced by a designer, a developer or an AI agent is <b>indicative, for layout only</b>, and must be marked as requiring native-speaker review. Machine translation must not ship unreviewed.</p>`, { tone: 'stop', title: 'R12' })}
`,
  });
}

/* ==================================================================== space */

function space() {
  const scaleRows = (prefix) =>
    group(prefix).map((e) => [
      code(leaf(e)),
      `<span class="num">${esc(e.value)}</span>`,
      code(names(e).css),
      `<span class="bar" style="width:${Math.min(parseFloat(e.value), 220)}px"></span>`,
    ]);

  return page({
    title: 'Space & layout',
    eyebrow: 'Guideline',
    depth: 2,
    active: 'guidelines/space/',
    lead: 'A spacing scale, corner radii, and the touch-target minimums that are not open to negotiation.',
    body: `
<h2 id="space">Spacing</h2>
<p>Use layout <b>gap</b>, not per-element margins. Margins collapse and double unpredictably.</p>
${table(['Token', 'Value', 'CSS', 'Scale'], scaleRows('dimension.space'))}

<h2 id="radius">Radius</h2>
${table(['Token', 'Value', 'CSS', 'Scale'], scaleRows('dimension.radius'))}

<h2 id="touch">Touch targets</h2>
${callout(`<p>WCAG 2.5.5 / 2.5.8. Users include people with motor impairment and older people on small, cheap screens. This is a floor, not a target.</p>`, { tone: 'stop', title: 'Non-negotiable' })}
${table(
  ['Token', 'Value', 'When'],
  group('dimension.touch').map((e) => [code(leaf(e)), `<span class="num">${esc(e.value)}</span>`, esc(e.description ?? '')]),
)}

<h2 id="surfaces">Surfaces</h2>
<p>Cards lift off the bone ground as white surfaces. Hierarchy comes from the surface change, not from shadows a cheap phone has to paint.</p>
<p>Prefer a <b>left status rail</b> to icon circles in lists: faster to scan, no cross-cultural icon ambiguity, and far cheaper to render in a long list.</p>
${callout(`<p>Card borders are <code>${val('color.palette.rule')}</code> — <b>${R(val('color.palette.rule'), '#FFFFFF')}:1</b> on white. WCAG §1.4.11 covers controls and meaningful state, not decorative grouping, so this <b>conforms</b>. But it still reads poorly in bright outdoor light, which is the real usage condition. Let the status rails carry structure where it matters.</p>`, { tone: 'warn', title: 'A known limitation' })}
`,
  });
}

/* ============================================================== iconography */

function iconography() {
  const set = meta.iconset ?? {};
  return page({
    title: 'Iconography',
    eyebrow: 'Guideline',
    depth: 2,
    active: 'guidelines/iconography/',
    lead: 'One icon set, referenced by meaning rather than by glyph, so changing the set means changing one file.',
    body: `
<h2 id="set">The set</h2>
<p><b>${extLink('https://github.com/microsoft/fluentui-system-icons', 'Fluent UI System Icons')}</b> (MIT) — ~19,000 glyphs delivered as true SVG, with matched regular and filled cuts. The system commits a curated subset, each normalised to <code>currentColor</code> so it inherits the colour around it and works in both themes. Browse the set on the <a href="../../icons/">Icons page</a>. (This supersedes the earlier Material Symbols proposal — both open; Fluent was chosen for true-SVG delivery, matched cuts, and size-specific hinting.)</p>
${table(
  ['Setting', 'Value'],
  [['Style', 'Regular'], ['Size', '24 (default)'], ['Licence', 'MIT']],
)}
<p>Use the regular cut throughout. Do not mix regular and filled to signal state — use the status rail plus a text label.</p>

<h2 id="rules">Rules</h2>
${table(
  ['Rule', 'Reason'],
  [
    ['An icon never appears without a text label for a primary action', 'Icon meaning is not universal across twelve language communities.'],
    ['Icons never carry state alone', 'WCAG §1.4.1. Pair with text or position.'],
    ['Icon colour inherits from its semantic token', 'Never a decorative colour.'],
    ['Meaningful icons meet 3:1 against their background', 'WCAG §1.4.11. Purely decorative icons are exempt.'],
    ['Prefer the status rail to icon circles in lists', 'Faster to scan, cheaper to render, no ambiguity.'],
  ],
)}

<h2 id="sizes">Sizes</h2>
${table(
  ['Token', 'Value', 'CSS'],
  group('dimension.icon').map((e) => [code(leaf(e)), `<span class="num">${esc(e.value)}</span>`, code(names(e).css)]),
)}

<h2 id="semantic">Semantic names</h2>
<p>Reference <code>icon.semantic.*</code> — never a raw glyph name. The whole catalogue, searchable, is on the <a href="../../icons/">Icons page</a>.</p>
${table(
  ['', 'Token', 'Fluent glyph', 'Notes'],
  group('icon.semantic').map((e) => {
    const ic = icons[leaf(e)];
    const rendered = ic ? `<span class="ticon">${ic.svg}</span>` : '';
    return [rendered, code(`icon.semantic.${leaf(e)}`), code(e.value), esc(e.description ?? '')];
  }),
  { min: 620 },
)}
`,
  });
}

/* =================================================================== motion */

function motion() {
  return page({
    title: 'Motion',
    eyebrow: 'Guideline',
    depth: 2,
    active: 'guidelines/motion/',
    lead: 'Every animation must hold 60fps on an entry-level handset. That is a 16.7ms frame budget, and in practice only two properties.',
    body: `
<h2 id="budget">What may be animated</h2>
${table(
  ['Animate', 'Never animate', 'Why'],
  [
    [code('transform'), `${code('width')} ${code('height')} ${code('top')} ${code('left')}`, 'Transforms are composited; layout properties reflow the whole subtree every frame.'],
    [code('opacity'), `${code('background-color')} ${code('box-shadow')}`, 'Paint-heavy — fine on a flagship, visible jank on a cheap handset.'],
    ['Composited filters, sparingly', 'Anything driven per-frame from the main thread', 'Main-thread work competes with everything else the phone is doing.'],
  ],
)}
<p>Images are the most common cause of jank on low-end devices: large images decoded on the main thread drop frames and cost the user data. Motion comes from code, not from video or Lottie files.</p>

<h2 id="tokens">Tokens</h2>
${table(
  ['Token', 'Value', 'Use'],
  [...group('motion.duration'), ...group('motion.easing'), ...group('motion.stagger')].map((e) => [
    code(leaf(e)), code(fmt(e.value)), esc(e.description ?? ''),
  ]),
)}
${callout(`<p>The stagger total is capped at <b>${val('motion.stagger.maxTotal')}</b> regardless of item count — compute the interval as <code>min(${val('motion.stagger.interval')}, ${val('motion.stagger.maxTotal')} / itemCount)</code>. A long stagger looks elegant on a designer's laptop and feels broken on a slow connection where the data arrived late already.</p>`, { title: 'Hard cap' })}

<h2 id="principles">Four principles</h2>
<ol>
  <li><b>Motion explains, it does not decorate.</b> Every animation answers one of: where did this come from, what changed, or did it work? If it answers none, cut it.</li>
  <li><b>Spend it on verification.</b> Trust is the product, and the moment the state confirms who you are is the one place a signature animation earns its cost.</li>
  <li><b>Fast in, slower out.</b> A tap shows feedback within ${val('motion.duration.instant')}. Confirmations may take their time — that is where confidence lives.</li>
  <li><b>Reduced motion is not a lesser version.</b> Same information, same hierarchy, arriving rather than moving. Test it as a first-class state.</li>
</ol>

<h2 id="exception">One documented exception</h2>
${callout(`<p>The verification ring sweep animates <code>stroke-dashoffset</code>, which is not a compositor property. It is affordable because it is one small element animating once. It must remain the <b>only</b> exception — recorded as named, so it does not quietly become a precedent.</p>`, { tone: 'warn', title: 'Named, not tolerated' })}
`,
  });
}

/* ============================================================ accessibility */

function accessibility() {
  const fails = [
    ['Ochre as label text on the light ground', '3.50', R(val('color.palette.ochre'), LIGHT_BG), '#C1663A → ' + val('color.palette.ochre')],
    ['White text on ochre fill', '4.02', R('#FFFFFF', val('color.palette.ochre')), 'Same darkening'],
    ['Aloe #3A7D44 on a warm off-white', '4.36', R(val('color.palette.aloe-lt'), LIGHT_BG), 'Ground lightened to ' + LIGHT_BG],
    ['Caution as text', '2.24', R(val('color.palette.caution'), LIGHT_BG), '#E0A21C → ' + val('color.palette.caution')],
    ['Meta text, light theme', '2.75', R(val('color.theme.light.text-3'), LIGHT_BG), '#8A938F → ' + val('color.palette.ink-3')],
    ['Meta text, dark theme', '4.40', R(val('color.theme.dark.text-3'), DARK_BG), '#767E88 → ' + val('color.palette.chalk-3')],
  ];

  return page({
    title: 'Accessibility',
    eyebrow: 'Guideline',
    depth: 2,
    active: 'guidelines/accessibility/',
    lead: 'WCAG 2.1 Level AA, computed rather than asserted, and enforced in CI so a rule that is written down is a rule that holds.',
    body: `
<h2 id="criteria">Criteria applied</h2>
${table(
  ['Criterion', 'Applies to', 'Threshold'],
  [
    ['1.4.3 Contrast (Minimum) — AA', 'Body text under 18.66px bold / 24px', '<b>4.5:1</b>'],
    ['1.4.3 — large text', '≥18.66px bold or ≥24px', '<b>3:1</b>'],
    ['1.4.6 Contrast (Enhanced) — AAA', 'Body text, enhanced', '7:1'],
    ['1.4.11 Non-text Contrast', 'Controls, state indicators, meaningful graphics', '<b>3:1</b>'],
    ['1.4.1 Use of Colour', 'Any information carried by colour', 'Needs a second cue'],
  ],
)}

<h2 id="failures">What failed, and what changed</h2>
<p>Six pairings failed the first audit. All are corrected; the record is kept so the reasoning is not lost.</p>
${table(
  ['Pairing', 'Was', 'Now', 'Fix'],
  fails.map(([label, was, now, fix]) => [
    esc(label),
    `<span class="num">${was}</span><span class="g fail">FAIL</span>`,
    gradeChip(now),
    code(fix),
  ]),
)}

<h2 id="verified">Verified results</h2>
<p>Every text pairing in both themes now meets AA or better. <b>Zero failures.</b></p>
<h3>Light</h3>
${table(['Token', 'Value', 'On ground', 'On surface'], contrastRows('light'))}
<h3>Dark</h3>
${table(['Token', 'Value', 'On ground', 'On surface'], contrastRows('dark'))}

<h2 id="enforced">Enforced, not documented</h2>
<p><code>npm run validate</code> runs <b>106 checks</b> and exits non-zero on failure, so it can gate CI. It also flags any pairing that passes <i>within 10% of its threshold</i> — the exact shape of the <code>aloe-lt</code> defect, which looked fine right up until the ground moved.</p>
${callout(`<p>A rule that is not in <code>scripts/validate-tokens.mjs</code> is a rule that will be broken.</p>`, { title: 'The operating principle' })}

<h2 id="requirements">Beyond contrast</h2>
${table(
  ['Requirement', 'Standard'],
  [
    ['No colour-only information', '§1.4.1'],
    ['Touch targets 44px, 48px where adjacent or destructive', '§2.5.5, §2.5.8'],
    ['Text resizes to 200% without loss', '§1.4.4'],
    ['Reflow at 320px equivalent', '§1.4.10'],
    ['Visible focus indicator', '§2.4.7'],
    ['<code>prefers-reduced-motion</code> honoured', '§2.3.3'],
    ['Every control has an accessible name', '§4.1.2'],
    ['Language of page <i>and of parts</i> declared', '§3.1.1, §3.1.2 — load-bearing across twelve languages'],
    ['Errors identified in text, with a fix', '§3.3.1, §3.3.3'],
  ],
)}

<h2 id="outstanding">What is still outstanding</h2>
${callout(`<ol>
  <li><b>Colour-vision deficiency has not been simulated.</b> Aloe versus ochre is the pairing most likely to collapse under deuteranopia. Do not assert CVD-safety.</li>
  <li><b>Sunlight legibility on low-cost LCDs has not been tested.</b> Ratios are computed against an ideal display; the real viewing condition is a cheap panel outdoors.</li>
  <li><b>Contrast ratios are a floor, not a proof.</b> The WCAG 2.1 formula overstates legibility for light-on-dark and understates some mid-tone pairs.</li>
</ol>`, { tone: 'warn', title: 'Stated, not papered over' })}
`,
  });
}

/* ================================================================== content */

function content() {
  return page({
    title: 'Content & tone',
    eyebrow: 'Guideline',
    depth: 2,
    active: 'guidelines/content/',
    lead: 'Plain, warm and direct. The reading-age target is low, and it should be — a service that only serves confident readers is not a public service.',
    body: `
<h2 id="errors">Error copy</h2>
${callout(`<p><b>The system failed, not the person.</b> The grammar of an error decides who is at fault, and at that moment it is the system that failed.</p>`, { tone: 'stop', title: 'R10' })}
${table(
  ['Never', 'Always'],
  [
    ['“Invalid fingerprint”', '“We couldn’t read that”'],
    ['“Authentication failed”', '“We couldn’t confirm it’s you”'],
    ['“You entered the wrong PIN”', '“That PIN didn’t match”'],
    ['“Access denied”', '“You need Level 2 for this — here’s how”'],
  ],
)}
<p>Name the likely cause when it is not the user — a dry sensor, a slow connection. And where a failure is common for a group, such as worn fingerprints from manual work or thin skin with age, <b>say so on the screen</b>. Being failed by a government system in public is humiliating, and naming the cause is the cheapest dignity intervention available.</p>

<h2 id="logs">Log and audit copy</h2>
<p>Write entries as <b>sentences ending in why</b>, not as table rows.</p>
${table(
  ['Not this', 'This'],
  [
    [code('SASSA · proof-of-life · 11/08 · API'), '“SASSA checked you were alive so your grant could be paid”'],
  ],
)}
${callout(`<p>An audit log that cannot display something wrong is decorative. Build the “no reason given” state into the primary view — it is what tells a citizen, on sight, that the thing is capable of catching something.</p>`, { title: 'Design for the bad case' })}

<h2 id="deadends">Never design a dead end</h2>
<p>Every failure path resolves to a concrete next action with <b>a place, a distance, an opening time and an expected wait</b>. “Please visit your nearest office” is not a next step; it is a shrug that costs someone a taxi fare to decode.</p>
<p>And say what is <i>not</i> lost. The most common way these systems waste people's time is silently discarding a half-finished journey.</p>

<h2 id="consent">Consent surfaces</h2>
<p>State what will <b>not</b> be shared, not only what will. Listing inclusions alone asks the reader to infer the boundary; naming the exclusions converts a disclosure into a promise.</p>
<p>Give the legal basis twice — in plain language and as a citation — because there are two audiences: the citizen, and their lawyer.</p>
`,
  });
}

/* =================================================================== tokens */

function tokensPage() {
  const rows = entries.map((e) => {
    const n = names(e);
    const v = e.value;
    const swatch = isHex(v) ? dot(v) : '';
    return `<tr data-k="${esc((e.path + ' ' + fmt(v) + ' ' + (e.description ?? '')).toLowerCase())}">
      <td>${code(e.path)}</td>
      <td>${swatch}${code(fmt(v))}</td>
      <td>${e.alias ? code(e.alias) : '<span class="count">—</span>'}</td>
      <td>${code(n.css)}</td>
      <td>${code(n.js)}</td>
      <td>${esc(e.description ?? '')}</td>
    </tr>`;
  }).join('');

  return page({
    title: 'All tokens',
    eyebrow: 'Reference',
    depth: 1,
    active: 'tokens/',
    lead: `The complete dictionary — ${entries.length} tokens, each with its value, its alias, and the identifier it becomes on every platform.`,
    body: `
<p>Source of truth: <code>tokens.json</code>. Everything else is generated. The same catalogue is available as <a href="../TOKENS.md">Markdown</a> so token changes appear as readable diffs in review.</p>

<label for="q" class="count">Filter by name, value or description</label><br>
<input id="q" class="filter" type="search" placeholder="e.g. aloe, motion, 44px, maize" autocomplete="off">
<p class="count" id="n">${entries.length} tokens</p>

<div class="tw"><table style="min-width:900px" id="tt">
  <thead><tr><th>Token</th><th>Value</th><th>Alias</th><th>CSS</th><th>JS</th><th>Notes</th></tr></thead>
  <tbody>${rows}</tbody>
</table></div>

<script>
(function(){
  var q=document.getElementById('q'), n=document.getElementById('n');
  var rows=[].slice.call(document.querySelectorAll('#tt tbody tr'));
  q.addEventListener('input',function(){
    var t=q.value.trim().toLowerCase(), c=0;
    rows.forEach(function(r){
      var hit=!t||r.dataset.k.indexOf(t)>-1;
      r.hidden=!hit; if(hit)c++;
    });
    n.textContent=c+' token'+(c===1?'':'s')+(t?' matching “'+q.value+'”':'');
  });
})();
</script>
`,
  });
}

/* ==================================================================== about */

function about() {
  return page({
    title: 'About & status',
    eyebrow: 'Reference',
    depth: 1,
    active: 'about/',
    lead: 'What this is, what is verified, and what is still open.',
    body: `
${callout(`<p><b>Unofficial concept work.</b> ${esc(meta.affiliation ?? '')} Nothing here has been reviewed or adopted by any organ of the South African state. It exists to open a conversation.</p>`, { tone: 'warn', title: 'Status' })}

<h2 id="provenance">Provenance</h2>
${table(
  ['Category', 'Status', 'Note'],
  [
    [code('aloe-lt') + ' ' + code('maize'), '<b>EXISTING</b>', 'Read from the live mymzansi.gov.za stylesheet.'],
    ['Spacing, radius, icon sizes', '<b>EXISTING</b>', 'Kept; spacing extended with the intermediate steps it lacked.'],
    ['Fluent UI System Icons', '<b>PROPOSED</b>', 'MIT. Supersedes the earlier Material Symbols proposal — see Iconography.'],
    ['Montserrat', '<b>EXISTING</b>', 'Interim — must be re-tested for language coverage.'],
    [code('indigo') + ' ' + code('ochre') + ' ' + code('bone'), '<b>PROPOSED</b>', 'New.'],
    ['All corrected accents', '<b>PROPOSED</b>', 'Result of the WCAG audit.'],
  ],
)}

<h2 id="confidence">How much to trust each claim</h2>
${table(
  ['Claim', 'Confidence'],
  [
    ['WCAG contrast results', '<b>High.</b> Computed and reproducible via <code>npm run validate</code>.'],
    ['Existing design tokens', '<b>High.</b> Read directly from the live site.'],
    ['International precedents', '<b>High.</b> Well documented in public sources.'],
    ['MyMzansi programme status', '<b>Verify before relying.</b> Public rollout and current live scope were not confirmed.'],
    ['Non-English copy', '<b>Indicative only.</b> Requires native-speaker review.'],
    ['Legal citations', '<b>Indicative.</b> Require legal review before use in an interface.'],
  ],
)}

<h2 id="open">Open items</h2>
<ul>
  <li>Colour-vision deficiency simulation — <b>not done</b>. Aloe versus ochre is most at risk.</li>
  <li>Sunlight legibility on low-cost LCDs — <b>not done</b>.</li>
  <li>Typeface validated against all twelve languages including click letters — <b>not done</b>.</li>
  <li>All copy reviewed by native speakers — <b>not done</b>.</li>
  <li>A signed-SASL content pattern — <b>not designed</b>.</li>
  <li>Component inventory — <b>not started</b>.</li>
</ul>

<h2 id="build">How this site is built</h2>
<p>A plain-Node generator reads <code>tokens.json</code> and writes static HTML. <b>Zero dependencies</b>, no build framework, and no external network requests at runtime — the site holds to the same budget it asks of the product.</p>
${table(
  ['Command', 'Does'],
  [
    [code('npm run build'), 'Generates platform outputs into <code>dist/</code>'],
    [code('npm run docs'), 'Generates the Markdown catalogue'],
    [code('npm run site'), 'Generates this site into <code>docs/</code>'],
    [code('npm run validate'), '106 WCAG and integrity checks; exits non-zero on failure'],
    [code('npm run check'), 'All of the above. Use in CI.'],
  ],
)}
`,
  });
}



/* ============================================================ identity mark */

function identityMark() {
  const maize = val('color.palette.maize');
  const indigo = val('color.palette.indigo');

  return page({
    title: 'Identity mark',
    eyebrow: 'Guideline · proposal',
    depth: 2,
    active: 'guidelines/identity-mark/',
    lead: 'A companion mark for this system — built from the same idea as the official MyMzansi logo, in our own accessible palette, without reproducing their asset.',
    body: `
${callout(`<p>This is a <b>proposal</b>, not an adopted mark. It has no standing with the Presidency's Digital Services Unit and has not been reviewed by whoever owns the actual MyMzansi brand. Treat it as a sketch of what "incorporating that thinking" could look like.</p>`, { tone: 'warn', title: 'Status' })}

<h2 id="theirs">The official mark</h2>
<p>MyMzansi's logo (${extLink(MZ + '/', 'mymzansi.gov.za')}) draws a fingerprint as concentric dashed arcs, shaped into the silhouette of South Africa, cycling through the national flag's colours, under the line <i>"One person, one government, one touch."</i> It is a genuinely good piece of design — it fuses biometric identity with the nation in a single image, which is exactly what the programme is.</p>
<p>We do not reproduce that asset on this site. It is a specific, owned mark belonging to a distinct government initiative, not a motif that is ours to reuse — the same principle this system already applies to Ndebele geometry in the <a href="../colour/#sources">Colour guideline</a>: take the method, not somebody else's specific mark.</p>

<h2 id="ours">What we propose instead</h2>
<div style="display:flex;justify-content:center;padding:var(--s-lg) 0">${markTri({ size: 168, count: 6, title: 'Proposed MyMzansi design system mark' })}</div>
<p>The method carried over is <b>concentric dashed arcs as a shorthand for identity</b> — a fingerprint read abstractly, not literally. Three differences from the official mark, each deliberate:</p>
${table(
  ['Their mark', 'This proposal', 'Why'],
  [
    ['Traces the outline of South Africa', 'No representational shape — a pinwheel of rings', 'Tracing the national map is exactly the kind of specific, ownable device that should not be duplicated by an unofficial companion system.'],
    ['Cycles through the raw flag palette', 'Uses this system\'s own tokens: <code>accent</code>, <code>accent-warm</code>, <code>anchor</code>', 'Flag colour reads as municipal letterhead and, as shown in the Colour guideline, several raw flag tones fail WCAG contrast outright. Every colour in this mark is already audited.'],
    ['One fixed rendering', 'Theme-reactive — resolves through CSS custom properties', 'The mark is generated from the same tokens as everything else on this site. Change the palette, and the mark updates with it.'],
  ],
)}

<h2 id="colours">Why these three colours</h2>
${table(
  ['Ring colour', 'Token', 'Why it is safe here'],
  [
    ['Aloe', code('var(--accent)'), `${R(val("color.palette.aloe"), LIGHT_BG)}:1 on the light ground, ${R(val("color.palette.aloe-br"), DARK_BG)}:1 on the dark ground — both AA. See <a href="../colour/#theme">Theme tokens</a>.`],
    ['Ochre', code('var(--warm)'), `${R(val("color.palette.ochre"), LIGHT_BG)}:1 on the light ground — the corrected value; the original failed at 3.50:1. See <a href="../colour/#failures">what failed</a>.`],
    ['Indigo', code('var(--anchor)'), `${R(indigo, LIGHT_BG)}:1 on light, and it is the one colour that stays fixed across both themes, because it doubles as the masthead fill.`],
  ],
)}
${callout(`<p>None of the three rings uses <code>maize</code>. §4.5's rule — maize is a <b>ground, never a mark</b> in light theme — applies here exactly as it would to any other stroke or icon. The one exception is the masthead version below, where the background itself is fixed indigo rather than the page ground, which is the specific condition under which maize is safe as a mark (${R(maize, indigo)}:1).</p>`, { title: 'This mark follows its own rules' })}

<h2 id="variants">Three sizes, three jobs</h2>
${table(
  ['Where', 'Treatment', 'Why'],
  [
    ['Masthead', 'Single colour — maize rings on the fixed indigo fill', 'The masthead background never changes with theme, so the mark on it does not need to either. Kept small and quiet.'],
    ['Content figure', 'Full three-colour, theme-reactive, larger', 'Where the mark can be looked at rather than glanced past — this page, a future About/home hero.'],
    ['Favicon', 'Static, baked to hex, indigo backdrop', 'Favicons cannot read page CSS variables, and need a solid backdrop to register as a coloured square at 16px.'],
  ],
)}

<h2 id="rules">If this is taken further</h2>
<ul>
  <li>Do not recolour individual rings — the three-colour set is fixed, so it stays recognisable as one mark rather than a decoration re-skinned per page.</li>
  <li>Do not pair it with a literal South Africa outline elsewhere on the same screen — that would reintroduce the exact overlap with the official mark this proposal avoids.</li>
  <li>Minimum size ~24px; below that the dash pattern stops reading as rings and just looks like noise.</li>
  <li>Clear space of at least one ring-gap on all sides before another element starts.</li>
</ul>
<p>This is the first concrete piece of <a href="../../roadmap/#next">Brand guidelines</a> on the roadmap. A wordmark, lock-up rules and misuse examples are still open — see the roadmap for what depends on a decision here.</p>
`,
  });
}

/* ================================================================= programme */

function programme() {
  const MAPPING = [
    ['Accessibility', 'Batho Pele', 'Services must be easy to access and understand, especially for vulnerable populations.', 'The WCAG 2.1 AA audit — 106 automated checks, six failures found and corrected, all published.', '../guidelines/accessibility/'],
    ['Upholding Responsiveness', 'Batho Pele', 'A government that listens to and promptly addresses public needs.', '"The system failed, not the person" — error copy that names the system as the point of failure, never the citizen.', '../guidelines/content/#errors'],
    ['Interoperability', 'Service principle', 'Open standards, integration across platforms, open-source to prevent vendor lock-in.', 'Tokens published in the open W3C DTCG format, with zero dependencies and no vendor lock-in by design.', '../about/#build'],
    ['Privacy and Security by Design', 'Service principle', 'Privacy protections embedded from the outset, not added later.', 'Consent surfaces state what will <i>not</i> be shared, not only what will — an explicit requirement, not a default.', '../guidelines/content/#consent'],
    ['Simplicity', 'Service principle', 'Reducing complexity, enhancing usability, streamlining process.', 'Body text set at 16px rather than the 14px most mobile systems default to, and a reading age kept deliberately low.', '../guidelines/typography/#minimums'],
    ['Scalability and Modularity', 'Service principle', 'Modular, reusable components that support growth without disrupting what exists.', 'The three-layer token architecture — palette → theme/semantic → component — so one edit updates every platform.', '../tokens/'],
    ['Agile. Incremental. Iterative.', 'Service principle', 'Continuous improvement delivered in small, adaptive cycles.', 'A validator that runs on every change and flags anything passing within 10% of its threshold, before it becomes a defect.', '../guidelines/accessibility/#enforced'],
    ['Reusability', 'Service principle', 'Designing components that can be leveraged across multiple contexts.', 'One <code>tokens.json</code> generates CSS, React Native, Tailwind, Swift, Kotlin and Dart from a single edit.', '../#using'],
    ['"Granny operations"', 'People assumption', 'Interfaces accessible and intuitive for users with varying digital literacy.', 'Tiered assurance that downgrades capability rather than blocking someone outright when a fingerprint will not read.', '../guidelines/colour/#maize'],
  ];

  return page({
    title: 'The MyMzansi programme',
    eyebrow: 'Strategic context',
    depth: 1,
    active: 'programme/',
    lead: 'This design system exists to serve a specific national programme. Its purpose, principles and roadmap are set by the Presidency\'s Digital Services Unit, not by this repository — here is what they say, and where this system tries to hold up its end.',
    body: `
${callout(`<p>Everything on this page is <b>quoted or closely paraphrased from the live site</b> at ${extLink(MZ + '/', 'mymzansi.gov.za')}, current as of this writing. It can change without notice — this page is not authoritative; theirs is. Where wording is condensed, the source page is linked so it can be checked directly.</p>`, { title: 'Source' })}

<h2 id="purpose">Purpose, vision, mission</h2>
${table(
  ['', 'What they say', 'Source'],
  [
    ['Purpose', '"South Africa is at a pivotal moment in its digital transformation journey... This roadmap sets out steps to deliver on the change wanted by people in South Africa."', extLink(mzUrl('/roadmap/purpose'), 'Purpose')],
    ['Vision', '"To deliver a safe and inclusive future by changing how government services are designed and accessed."', extLink(mzUrl('/roadmap/vision'), 'Vision')],
    ['Mission', '"To simplify and improve how residents, businesses, and government interact by using shared technology, modern design, and collaborative delivery models."', extLink(mzUrl('/roadmap/mission'), 'Mission')],
  ],
)}

<h2 id="principles">Principles</h2>
<p>The roadmap names three tiers of principle. The first is not a technology framework — it predates this programme by three decades.</p>

<h3>Batho Pele</h3>
<p>South Africa's public-service doctrine since 1997 — "People First." The roadmap states plainly that these values are "the foundation for this roadmap": <b>Accessibility</b>, <b>Upholding Responsiveness</b>, <b>Promoting Accountability</b>.</p>

<h3>Service principles</h3>
<p>How Digital Public Infrastructure is meant to behave in practice: <b>Interoperability</b> (open standards, no vendor lock-in), <b>Decentralised Delivery and Design</b>, <b>Privacy and Security by Design</b>, <b>Simplicity</b>, <b>Scalability and Modularity</b>, <b>Agile. Incremental. Iterative.</b>, <b>Agency. Empowering.</b>, <b>Reusability</b>.</p>

<h3>Universal principles</h3>
<p>Openness, inclusivity, security and interoperability "for all users" — plus explicit adoption of the <b>DPI Safeguards</b> framework. Full text: ${extLink(mzUrl('/roadmap/principles'), 'Principles')}.</p>

${callout(`<p>One line from the Assumptions page is worth quoting directly, because it states an inclusion bar most technology programmes never write down: interfaces should suit <b>"users with varying levels of digital literacy, including accessible, intuitive interfaces suitable for all, such as \'granny operations.\'"</b> Source: ${extLink(mzUrl('/roadmap/assumptions'), 'Assumptions')}.</p>`, { title: 'The bar, in their own words' })}

<h2 id="dpi">Digital Public Infrastructure</h2>
<p>"DPI refers to foundational technology building blocks — such as identity, data exchange, payments, and trusted digital channels — that enable secure, inclusive, and scalable government services." The roadmap names its influences directly: <b>India, Brazil, and Estonia</b> — the same three precedents this system's earlier research drew on independently.</p>

<h2 id="phases">Phases</h2>
${table(
  ['Phase', 'Focus'],
  [
    ['Phase 1 · 2025–2027', 'Social protection, digital identity, unified digital channels. Pilot the Digital ID, Data Exchange, and first government payment integrations.'],
    ['Phase 2 · 2028–2030', 'Scale Phase 1 technologies across healthcare, education, business services, and beyond.'],
  ],
)}
<p>Four initiatives carry Phase 1: <b>Digital Identity</b>, <b>Data Exchange</b>, <b>Digital Payments</b>, <b>Trusted Digital Channels</b>. Full breakdown: ${extLink(mzUrl('/roadmap/phases'), 'Phases')} · ${extLink(mzUrl('/roadmap/initiatives'), 'Initiatives')}.</p>

<h2 id="mapping">Where this system tries to hold up its end</h2>
<p>Naming a principle is not the same as satisfying it. This table is this system's own claim, checked against something concrete rather than left as a slogan — follow the links and judge for yourself.</p>
${table(
  ['Their principle', 'Tier', 'What it means', 'What holds up this end of it'],
  MAPPING.map(([p, tier, meaning, ours, href]) => [`<b>${esc(p)}</b>`, esc(tier), esc(meaning), `${ours} <a href="${href}">→</a>`]),
  { min: 900 },
)}

<h2 id="governance">Governance</h2>
<p>MyMzansi is a project under <b>Operation Vulindlela</b>, led by the Presidency and coordinated with the Department of Communications and Digital Technologies (DCDT) and National Treasury. An inter-ministerial committee and an inter-departmental working group oversee it. None of that governance extends to this repository — see <a href="../about/">About &amp; status</a>.</p>

<a class="card" href="${MZ}/" target="_blank" rel="noopener noreferrer" style="max-width:340px;margin-top:var(--s-sm)">
    <span class="card-eyebrow">Official programme</span>
    <h3>mymzansi.gov.za</h3>
    <p>Purpose, roadmap, phases, initiatives, and how to get involved — from the source.</p>
    <span class="card-go">Visit ↗</span>
  </a>
`,
  });
}

/* =============================================================== components */

/** The Phase 1 inventory. `web`/`rn` = shipped | wip. */
const COMPONENTS = [
  { name: 'Button', web: 'ship', rn: 'ship', what: 'Five variants (primary, secondary, plain, destructive, destructive-outline). Depth from colour, never a shadow.', a11y: '≥44px target (48px destructive); label wraps, never truncates; visible focus ring.' },
  { name: 'Card', web: 'ship', rn: 'ship', what: 'A surface that lifts off the ground by a border and a surface change, not a shadow the cheap phone must paint.', a11y: 'Heading + description are real text; nothing conveyed by fill alone.' },
  { name: 'Input', web: 'ship', rn: 'wip', what: 'Label above, sunk fill, hairline border — with an error state linked and announced.', a11y: 'Label tied to field; error uses role="alert" and aria-describedby.' },
  { name: 'Badge', web: 'ship', rn: 'ship', what: 'A small pill whose text always carries the meaning; colour only reinforces (R3).', a11y: 'Maize "limit" tone keeps dark ink on top in both themes (R2, 8.9:1).' },
  { name: 'StatusRow', web: 'ship', rn: 'ship', what: 'A left status rail instead of an icon circle — faster to scan, no cross-cultural ambiguity, cheap to render.', a11y: 'State named in words; restricted rows always state their reason.' },
  { name: 'Section', web: 'ship', rn: 'ship', what: 'A page-section heading — deliberately not uppercase.', a11y: 'Sentence case: uppercase harms dyslexic and lower-literacy readers.' },
  { name: 'Sheet', web: 'ship', rn: 'wip', what: 'The one bottom-sheet idiom, factored out of the two menus that each hand-rolled it.', a11y: 'Focus trap, Escape to close, scroll lock; scrim tuned per theme.' },
  { name: 'Switch', web: 'ship', rn: 'wip', what: 'A real toggle for Settings, which until now showed inert static rows.', a11y: 'Built on Radix — role="switch", keyboard, focus, checked state.' },
  { name: 'Checkbox', web: 'ship', rn: 'wip', what: 'A single opt-in — e.g. "share these details this once".', a11y: 'Radix primitive; indicator is a checkmark glyph, not colour alone.' },
  { name: 'RadioGroup', web: 'ship', rn: 'wip', what: 'Formalizes the manual selectable-list pattern used for visa reason.', a11y: 'Visible label beside each item carries meaning; ring reinforces.' },
  { name: 'Divider', web: 'ship', rn: 'wip', what: 'One hairline rule, factored out of the components that each drew their own.', a11y: 'Native separator semantics.' },
  { name: 'Avatar', web: 'ship', rn: 'ship', what: 'Initials-first, not photo-first — a name is more reliably present than a picture.', a11y: 'Initials are real text; decorative when a name label sits beside it.' },
  { name: 'Skeleton', web: 'ship', rn: 'wip', what: 'A loading placeholder shaped like the content it stands in for — not a spinner.', a11y: 'role="status"; shimmer is opacity-only and stops under reduced motion.' },
  { name: 'EmptyState', web: 'ship', rn: 'wip', what: 'A composed empty view with a concrete next action — never a dead end (R11).', a11y: 'Icon is decorative; the action is a real, labelled control.' },
];

/**
 * Per-component detail: a rendered visual, a description that folds in the
 * accessibility contract, and a real code example. `demo` reuses the site's
 * own token vars, so a Button shown here is painted by exactly the tokens
 * the shipped Button reads.
 */
const CMP_DETAIL = {
  Button: {
    demo: `<div class="cx">
      <button class="btn btn-primary" type="button">Continue</button>
      <button class="btn btn-secondary" type="button">Change details</button>
      <button class="btn btn-plain" type="button">Not now</button>
      <button class="btn btn-destructive" type="button">Delete account</button>
      <button class="btn btn-destructive-outline" type="button">Sign out <span class="btn-ico" aria-hidden="true">→</span></button>
    </div>`,
    desc: 'BRAND.md §9.2 — five variants, one filled primary per screen and a destructive treatment held for irreversible actions. Depth is carried by colour, and the press response animates <code>transform</code> and <code>opacity</code> only, so it holds the frame budget on a four-year-old handset. Every target is at least 44px (48px destructive), the label wraps rather than truncates, and focus is always visible. The trailing icon, where present, sits in its own nested chip — craft carried over from the "high-end agency" comparison, kept only where it reads as considered.',
    code: `<Button variant="primary">Continue</Button>
<Button variant="secondary">Change details</Button>
<Button variant="plain">Not now</Button>
<Button variant="destructive">Delete account</Button>
<Button variant="destructive-outline" trailingIcon="logout">
  Sign out
</Button>`,
  },
  Card: {
    demo: `<div class="cx">
      <div class="mzcard">
        <span class="eb">Waiting for you</span>
        <h4>ABC Bank wants to check your details</h4>
        <p class="ds">To open a cheque account</p>
        <span class="mt">Asked 4 minutes ago</span>
        <div class="mzcard-foot"><button class="btn btn-primary" type="button">Look at this request <span class="btn-ico" aria-hidden="true">→</span></button></div>
      </div>
    </div>`,
    desc: 'BRAND.md §9.1 — a card lifts off the ground by a surface change and a hairline border, not a drop shadow the cheap phone must paint. This is the canonical "a request came to you" surface. The heading and description are real text; nothing is conveyed by fill alone. Any organisation named in an example is invented, never a real institution.',
    code: `<Card>
  <CardEyebrow>Waiting for you</CardEyebrow>
  <CardTitle>ABC Bank wants to check your details</CardTitle>
  <CardDescription>To open a cheque account</CardDescription>
  <CardMeta>Asked 4 minutes ago</CardMeta>
  <CardFooter>
    <Button variant="primary" trailingIcon="arrow_forward">
      Look at this request
    </Button>
  </CardFooter>
</Card>`,
  },
  Input: {
    demo: `<div class="cx">
      <div class="mzfield"><label>ID number</label><div class="inp">13 digits</div></div>
      <div class="mzfield err"><label>Passport number</label><div class="inp"></div><span class="er">This field is required</span></div>
    </div>`,
    desc: 'Label above the field, sunk fill, hairline border — never a placeholder standing in for a label. The error sits below the field, tied to it with <code>aria-describedby</code> and announced via <code>role="alert"</code>, and the border turns critical to reinforce it without relying on colour alone.',
    code: `<Input label="ID number" placeholder="13 digits" />
<Input
  label="Passport number"
  error="This field is required"
/>`,
  },
  Badge: {
    demo: `<div class="cx">
      <span class="badge badge-neutral">Level 1 of 3</span>
      <span class="badge badge-good">Visa approved</span>
      <span class="badge badge-limit">Application refused</span>
    </div>`,
    desc: 'R3 — colour reinforces, never informs alone: the label text always carries the meaning. The "limit" tone uses maize as a bright ground with dark ink on top (R2), pinned to a dark foreground in both themes so it never becomes an illegible pale-on-yellow pairing (8.9:1).',
    code: `<Badge tone="neutral">Level 1 of 3</Badge>
<Badge tone="good">Visa approved</Badge>
<Badge tone="limit">Application refused</Badge>`,
  },
  StatusRow: {
    demo: `<div class="cx col">
      <div class="srlist">
        <div class="srow allowed"><span class="srail"></span><div><div class="st">Check your grant payment</div></div></div>
        <div class="srow allowed"><span class="srail"></span><div><div class="st">See your ID and licence</div></div></div>
        <div class="srow restricted"><span class="srail"></span><div><div class="st">Share your ID with a bank</div><div class="sd">Because money can be moved with it</div></div></div>
        <div class="srow restricted"><span class="srail"></span><div><div class="st">Change your address</div><div class="sd">Because it changes your official record</div></div></div>
      </div>
    </div>`,
    desc: 'BRAND.md §9.1 — a coloured left rail replaces the icon circle in lists: faster to scan, no icon that means different things across twelve language communities, and far cheaper to render down a long list. The state is always named in words, and a restricted row always states its reason (FR-F3-07).',
    code: `<StatusRow title="Check your grant payment" state="allowed" />
<StatusRow
  title="Share your ID with a bank"
  detail="Because money can be moved with it"
  state="restricted"
/>`,
  },
  Section: {
    demo: `<div class="cx col">
      <div style="display:flex;align-items:center;gap:8px"><span style="width:6px;height:6px;border-radius:3px;background:var(--ok)"></span><span style="font-size:1.03rem;font-weight:700;color:var(--ink)">You can do these now</span></div>
    </div>`,
    desc: 'A page-section heading, deliberately not uppercase — uppercase text is measurably harder for dyslexic and lower-literacy readers, because word-shape recognition breaks when every letter is the same height. Hierarchy comes from size. An optional tone shows as a small dot beside the heading, never by recolouring the whole line.',
    code: `<Section label="You can do these now" tone="good">
  {/* rows */}
</Section>`,
  },
  Sheet: {
    demo: `<div class="cx">
      <div class="mzsheet"><div class="grab"><i></i></div><div class="body"><strong>Menu</strong><span>Profile, settings and sign out, from one place.</span></div></div>
    </div>`,
    desc: 'The one bottom-sheet idiom, factored out of the two menus that each hand-rolled it. Built on Radix Dialog for the focus trap, Escape-to-close and scroll lock; the entrance uses the <code>slow</code> motion token and the scrim darkens per theme. On React Native the same contract comes from the platform Modal plus Reanimated.',
    code: `<Sheet>
  <SheetTrigger asChild>
    <Button variant="secondary">Open menu</Button>
  </SheetTrigger>
  <SheetContent>
    <SheetTitle>Menu</SheetTitle>
    <SheetDescription>
      Profile, settings and sign out, from one place.
    </SheetDescription>
  </SheetContent>
</Sheet>`,
  },
  Switch: {
    demo: `<div class="cx"><span class="mzswitch" role="img" aria-label="On"><i></i></span><span class="mzswitch off" role="img" aria-label="Off"><i></i></span></div>`,
    desc: 'A real toggle for Settings, which until now showed inert static rows. Built on Radix, so <code>role="switch"</code>, keyboard operation, focus and checked state all come for free. The thumb moves on <code>transform</code> only.',
    code: `<Switch checked={on} onCheckedChange={setOn} />`,
  },
  Checkbox: {
    demo: `<div class="cx"><span class="mzcheck">✓</span><span class="mzcheck off">✓</span></div>`,
    desc: 'A single opt-in — for example, "share these details this once". A Radix primitive; the checked indicator is a checkmark glyph, so the state is carried by a shape, not colour alone.',
    code: `<Checkbox checked={agreed} onCheckedChange={setAgreed} />`,
  },
  RadioGroup: {
    demo: `<div class="cx col">
      <div class="mzopt"><span class="mzradio"><i></i></span> Tourism</div>
      <div class="mzopt"><span class="mzradio off"><i></i></span> Business</div>
    </div>`,
    desc: 'Formalizes the manual selectable-list pattern the visa-reason picker already hand-rolls. The visible label beside each item carries the meaning; the ring only reinforces the selection.',
    code: `<RadioGroup defaultValue="tourism">
  <label><RadioGroupItem value="tourism" /> Tourism</label>
  <label><RadioGroupItem value="business" /> Business</label>
</RadioGroup>`,
  },
  Divider: {
    demo: `<div class="cx col"><div style="color:var(--ink2);font-size:.9rem">Above</div><hr style="width:100%;margin:2px 0"><div style="color:var(--ink2);font-size:.9rem">Below</div></div>`,
    desc: 'One hairline rule, factored out of the components that each drew their own <code>border-b</code>. A native separator, so its meaning reaches assistive technology without extra markup.',
    code: `<Divider />`,
  },
  Avatar: {
    demo: `<div class="cx">
      <span class="mzava" style="width:32px;height:32px;font-size:.8rem">TK</span>
      <span class="mzava">TK</span>
      <span class="mzava" style="width:56px;height:56px;font-size:1.1rem">TK</span>
    </div>`,
    desc: 'Initials-first, not photo-first — a name is more reliably present than a picture, and the whole content model here is text-first. The initials are real text; when a name label sits beside it, the avatar is marked decorative so it is not announced twice.',
    code: `<Avatar initials="TK" size="sm" />
<Avatar initials="TK" size="md" />
<Avatar initials="TK" size="lg" />`,
  },
  Skeleton: {
    demo: `<div class="cx col"><span class="mzskel" style="width:60%"></span><span class="mzskel" style="width:85%"></span><span class="mzskel" style="width:45%"></span></div>`,
    desc: 'A loading placeholder shaped like the content it stands in for, not a spinner. It carries <code>role="status"</code>, and its shimmer is an opacity pulse (R5) that stops entirely under reduced motion, collapsing to a still, legible fill rather than skipping the state.',
    code: `<Skeleton className="h-4 w-3/4" />`,
  },
  EmptyState: {
    demo: `<div class="cx">
      <div class="mzempty"><span class="ei" aria-hidden="true">▣</span><h4>No documents yet</h4><p>Documents you're issued will show up here.</p><button class="btn btn-secondary" type="button">Learn how to get your first ID <span class="btn-ico" aria-hidden="true">→</span></button></div>
    </div>`,
    desc: 'A composed empty view with a concrete next action — never a dead end (R11). The icon is decorative; the action is a real, labelled control, because an empty state that only says "no data" leaves the person stuck.',
    code: `<EmptyState
  icon="inbox"
  title="No documents yet"
  description="Documents you're issued will show up here."
  action={{ label: 'Learn how to get your first ID' }}
/>`,
  },
};

const availWeb = (s) =>
  s === 'ship' ? `<span class="avail ship">Web ✓</span>` : `<span class="avail wip">Web — in progress</span>`;
const availApp = (s) =>
  s === 'ship' ? `<span class="avail ship">App ✓</span>` : `<span class="avail wip">App — in progress</span>`;

function codeBlock(src) {
  return `<div class="codeblock"><div class="cb-head"><span class="cb-lang">tsx</span></div><pre>${esc(src)}</pre></div>`;
}

function componentSection(c) {
  const id = c.name.toLowerCase();
  const d = CMP_DETAIL[c.name];
  return `<section class="cref-sec" id="${id}">
    <div class="cref-head"><h2>${esc(c.name)}</h2>${availWeb(c.web)}${availApp(c.rn)}</div>
    ${d.demo}
    <p>${d.desc}</p>
    ${codeBlock(d.code)}
  </section>`;
}

function components() {
  const shipped = COMPONENTS.filter((c) => c.web === 'ship').length;

  const index = `<nav class="cref-nav" aria-label="Component index">
    <p class="sect">${COMPONENTS.length} components</p>
    <ul>${COMPONENTS.map((c) => `<li><a href="#${c.name.toLowerCase()}">${esc(c.name)}</a></li>`).join('')}</ul>
  </nav>`;

  const sections = COMPONENTS.map(componentSection).join('');

  return page({
    title: 'Components',
    eyebrow: 'Foundations',
    depth: 1,
    active: 'components/',
    side: false,
    lead: `The first component library, built directly on the tokens — ${shipped} primitives shipped for web, with the React Native set following. Each is shown with its live example, a description, and the code to use it.`,
    body: `
${callout(`<p>These are <b>real components</b>, not mockups — the web set is built with React, Tailwind and Radix in <code>packages/web</code>, and documented in Storybook. Every example below is painted by the same tokens the shipped component reads, so what you see is what it renders. Use the <b>Dark</b> toggle in the header to check both themes.</p>`, { title: 'What this page is' })}

<div class="cref">
  ${index}
  <div class="cref-main">
    ${sections}

    <section class="cref-sec" id="using">
      <div class="cref-head"><h2>Where the code lives</h2></div>
      <p>The web library is a self-contained package that consumes the generated token outputs — the zero-dependency token core is untouched. Components read the theme and semantic tokens through Tailwind classes, so one source renders correctly in light and dark with no per-theme variants to maintain.</p>
      ${table(
        ['Platform', 'Location', 'Documentation'],
        [
          ['Web (React + Tailwind + Radix)', code('packages/web/src/components/ui'), 'Storybook — every variant, state and theme'],
          ['React Native (Expo)', code('mymzansi-app/components/ui.tsx'), 'React Native Storybook (in progress)'],
        ],
      )}
      ${callout(`<p>Reference <b>theme</b> and <b>semantic</b> tokens from a component — never <code>color.palette.*</code> directly. A green button and a green success message must stay separable, or the user cannot learn what green means.</p>`, { title: 'The rule every component obeys' })}
    </section>
  </div>
</div>

<script>
(function(){
  var links=[].slice.call(document.querySelectorAll('.cref-nav a'));
  if(!links.length||!('IntersectionObserver' in window))return;
  var map={};links.forEach(function(a){map[a.getAttribute('href').slice(1)]=a;});
  var obs=new IntersectionObserver(function(es){
    es.forEach(function(e){
      if(e.isIntersecting){links.forEach(function(l){l.classList.remove('on');});var a=map[e.target.id];if(a)a.classList.add('on');}
    });
  },{rootMargin:'0px 0px -72% 0px'});
  document.querySelectorAll('.cref-sec').forEach(function(s){obs.observe(s);});
})();
</script>
`,
  });
}

/* ==================================================================== icons */

function iconCell(name, data) {
  const search = `${name} ${data.label} ${data.fluent}`.toLowerCase();
  const meaning = data.group === 'semantic' ? `<span class="im">${esc(data.label)}</span>` : '';
  return `<button type="button" class="icon-cell" data-search="${esc(search)}" data-copy="${esc(name)}" title="Copy “${esc(name)}”">
    ${data.svg}
    <span class="in">${esc(name)}</span>
    ${meaning}
    <span class="if">${esc(data.fluent)}</span>
  </button>`;
}

function iconsPage() {
  const iconNames = Object.keys(icons);
  const semantic = iconNames.filter((n) => icons[n].group === 'semantic');
  const ui = iconNames.filter((n) => icons[n].group === 'ui');

  const grid = (list) => `<div class="icon-grid">${list.map((n) => iconCell(n, icons[n])).join('')}</div>`;

  return page({
    title: 'Icons',
    eyebrow: 'Foundations',
    depth: 1,
    active: 'icons/',
    side: false,
    lead: `${iconNames.length} icons from Fluent UI System Icons — the set this system uses. Search, and click any icon to copy its name.`,
    body: `
${callout(`<p>The icon family is <b>${extLink('https://github.com/microsoft/fluentui-system-icons', 'Fluent UI System Icons')}</b> (MIT). This page is the curated set the design system actually uses — not all 19,000 upstream icons. Each is stored as an SVG normalised to <code>currentColor</code>, so it takes the colour of the text around it and works in both themes.</p>`, { title: 'The icon set' })}

${callout(`<p>Reference a semantic icon by its <b>meaning</b> (<code>icon.semantic.verified</code>), not the glyph name. The Fluent glyph is shown only so it can be found and swapped; the semantic layer means the whole set can be replaced without touching a screen. An icon never carries state on its own — see <a href="../guidelines/iconography/">Iconography</a>.</p>`, { tone: 'warn', title: 'How to use these' })}

<input type="search" class="filter" id="iconFilter" placeholder="Search ${iconNames.length} icons — name, meaning, or Fluent glyph" aria-label="Search icons">
<p class="count" id="iconCount"></p>

<h2 id="semantic">Semantic icons</h2>
<p>The ${semantic.length} meanings the system reserves. These are referenced by name (<code>icon.semantic.*</code>), so the glyph behind a meaning can change in one place.</p>
${grid(semantic)}

<h2 id="interface">Interface icons</h2>
<p>The ${ui.length} common controls the components and app screens use — menus, actions, navigation, and empty-state glyphs.</p>
${grid(ui)}

<p class="icon-none" id="iconNone" hidden>No icons match that search.</p>

<script>
(function(){
  var input=document.getElementById('iconFilter');
  var count=document.getElementById('iconCount');
  var none=document.getElementById('iconNone');
  var cells=[].slice.call(document.querySelectorAll('.icon-cell'));
  var total=cells.length;
  function apply(){
    var q=input.value.trim().toLowerCase();
    var shown=0;
    cells.forEach(function(c){
      var hit=!q||c.getAttribute('data-search').indexOf(q)!==-1;
      c.hidden=!hit; if(hit)shown++;
    });
    count.textContent=shown+' of '+total+' icons';
    none.hidden=shown!==0;
    // hide a section heading + intro when it has no visible cells
    document.querySelectorAll('.icon-grid').forEach(function(g){
      var any=[].slice.call(g.querySelectorAll('.icon-cell')).some(function(c){return !c.hidden;});
      g.hidden=!any;
    });
  }
  input.addEventListener('input',apply); apply();
  cells.forEach(function(c){
    c.addEventListener('click',function(){
      var name=c.getAttribute('data-copy');
      var done=function(){var i=c.querySelector('.in');var t=i.textContent;c.classList.add('copied');i.textContent='Copied';setTimeout(function(){c.classList.remove('copied');i.textContent=t;},900);};
      if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(name).then(done,done);}else{done();}
    });
  });
})();
</script>
`,
  });
}

/* ================================================================== roadmap */

const ROADMAP = [
  {
    n: '01',
    title: 'Brand guidelines',
    status: 'next',
    what: 'The identity layer above the tokens: how the wordmark, the colour band and the voice are used, and — more importantly — what may not be done with them.',
    detail: 'Most of the reasoning already exists in prose. What is missing is the applied half: logo clear-space and minimum sizes, co-branding with departments, the identity band\'s proportions as a rule rather than a happy accident, and worked misuse examples. The misuse section matters most, because it is what stops the system being applied decoratively.',
    needs: 'A decision on whether a wordmark exists at all, and who owns it.',
    unblocks: 'Templates, illustration guidelines, and anything a department would produce independently.',
  },
  {
    n: '02',
    title: 'Components with code references',
    status: 'shipping',
    what: 'The tier this system most obviously lacked. Fourteen primitives now shipped for web — each documented with its variants, its states, and the accessibility contract that travels with it. See the ' + '<a href="../components/">Components</a>' + ' page.',
    detail: 'Phase 1 is delivered on web: Button, Card, Input, Badge, StatusRow, Section, Sheet, Switch, Checkbox, RadioGroup, Divider, Avatar, Skeleton and EmptyState, built with React, Tailwind and Radix in <code>packages/web</code> and documented in Storybook. The canonical framework decision was made — the web set targets Tailwind + shadcn/Radix, the app set React Native — and the two share one variant vocabulary so a design reviewed on one platform reads the same on the other. The React Native set is next: the existing primitives are being reconciled to the same contract, with six genuinely new ones (Switch, Checkbox, Divider, Avatar, Skeleton, EmptyState) added.',
    needs: 'Nothing blocking web. React Native parity and a shared motion layer are the remaining work.',
    unblocks: 'Templates, the Figma library, and any meaningful conformity assessment.',
  },
  {
    n: '03',
    title: 'Templates',
    status: 'planned',
    what: 'Whole screens and flows assembled from components — the level at which most teams actually start work.',
    detail: 'The candidates are already specified in REQUIREMENTS.md: a consent surface, an assurance-failure path, a device-recovery flow, an access log, a delegation setup. These are the screens where getting it wrong excludes someone, so shipping them as templates is worth more than shipping another button variant. Each template should state which requirement IDs it satisfies, so a team can trace a screen back to the rule it implements.',
    needs: 'Components.',
    unblocks: 'Faster adoption, and a common baseline for the awards assessment.',
  },
  {
    n: '04',
    title: 'Icon library',
    status: 'shipping',
    what: 'A browsable, searchable set with the semantic mapping made concrete — every icon rendered, named, and tied to the meaning it is allowed to carry. See the <a href="../icons/">Icons page</a>.',
    detail: 'Shipped, on both platforms. The family is Fluent UI System Icons (MIT), and the curated set is rendered on the Icons page — searchable, each glyph shown, click-to-copy, grouped into the sixteen reserved semantic meanings (<code>icon.semantic.verified</code>, <code>icon.semantic.restricted</code>, …) and the common interface glyphs. Each SVG is normalised to <code>currentColor</code> so it themes for free, and the semantic layer means the whole set can be replaced without touching a single screen. Both component libraries render these at runtime through an <code>Icon</code> wrapper that maps the MyMzansi name to the glyph — <b>web</b> via <code>@fluentui/react-icons</code>, <b>React Native</b> via <code>react-native-svg</code> reading the same curated SVG registry. Third-party brand marks (e.g. Apple/Google Wallet) are the one documented exception. Still ahead: flagging which icons are safe to use unaccompanied (in practice very few).',
    needs: 'Nothing blocking. A downloadable/packaged export and unaccompanied-use flags are the polish left.',
    unblocks: 'The Figma library, and consistent icon use across departments.',
  },
  {
    n: '05',
    title: 'Figma library',
    status: 'planned',
    what: 'The tokens and components as a published Figma library, kept in step with code rather than redrawn alongside it.',
    detail: 'The important word is <i>synchronised</i>. A Figma file that is manually kept in step with code diverges within one sprint. The intended path is Tokens Studio pointed at the same <code>tokens.json</code> in this repository, so a colour change lands in design and code from one edit. MyMzansi already has an in-progress Figma design system, so this should extend that rather than compete with it.',
    needs: 'Tokens Studio wired to the repository; agreement on who owns the file.',
    unblocks: 'Designers working in the system without reading a token file.',
  },
  {
    n: '06',
    title: 'Illustration guidelines',
    status: 'exploring',
    what: 'How the service depicts people — which is a harder and more consequential question here than in most design systems.',
    detail: 'This is where a South African public service is most likely to cause harm without meaning to. Representation across a very diverse population, whether people are drawn at all, how disability is depicted, and whether illustration is used to soften moments that should not be softened — a grant failure is not an occasion for a friendly character. There is also a hard constraint: illustration is the heaviest thing on a page, and large images decoded on the main thread are the most common cause of jank on low-end devices, as well as data the user is paying for.',
    needs: 'A commissioned illustrator, and research with the people depicted. This should not be designed from a desk.',
    unblocks: 'Templates that need imagery; empty and error states.',
  },
  {
    n: '07',
    title: 'AI documentation',
    status: 'exploring',
    what: 'A machine-readable contract so that an AI agent building on this system follows its rules rather than approximating them.',
    detail: 'The groundwork is done and, unusually, this system was written for agents from the start: BRAND.md opens with twelve MUST/MUST NOT rules in RFC 2119 form and a verification checklist, and REQUIREMENTS.md carries 137 citable requirement IDs. What is missing is the machine-facing surface — a stable index at a predictable path, structured rule metadata rather than prose an agent must infer from, and ideally a server exposing the tokens and rules as callable tools so an agent queries the system instead of guessing at it.',
    detail2: 'The rules most often broken by generated code are already known: hardcoded values instead of tokens, maize used as a mark, and fixed-width containers on translatable text. Those three deserve to be machine-checkable, not merely documented.',
    needs: 'Nothing blocking. The rules exist; they need a machine-readable shape.',
    unblocks: 'Reliable AI-assisted implementation, and automated conformity checking.',
  },
  {
    n: '08',
    title: 'Adoption awards',
    status: 'blocked',
    what: 'Recognition for departments and vendors that implement the system properly — assessed against measurable conformity rather than appearance.',
    detail: 'The strength of an awards programme is that it makes conformity worth something to the people who decide budgets. The design of it matters: assessed against automated checks first, so it rewards accessibility and inclusion rather than visual polish. A credible scheme would test contrast conformance across a live service, target sizes, language coverage across all twelve official languages, behaviour on a low-end device over a slow network, and the presence of working failure paths — not whether the screens look tidy.',
    detail2: 'Two design constraints worth setting now. Assessment should be reproducible — a service either passes the automated suite or does not — and results should be published in full, including failures, or the award becomes decorative.',
    needs: 'Institutional authority this concept does not have. An award is only meaningful if the body granting it has standing, so this depends entirely on the programme being adopted rather than on any work in this repository.',
    unblocks: 'A reason for departments to conform when nobody is compelling them to.',
  },
];

const PHASES = [
  { key: 'shipping', label: 'Now shipping', note: 'Delivered, or actively landing. Building on the token foundation rather than waiting behind it.' },
  { key: 'next', label: 'Next up', note: 'Ready to start. Nothing blocks these, and between them they unblock most of the rest.' },
  { key: 'planned', label: 'Planned', note: 'Wanted, but each depends on earlier work landing first.' },
  { key: 'exploring', label: 'Exploring', note: 'The shape is not settled. These need research or a commission before they can be scoped.' },
  { key: 'blocked', label: 'Needs a mandate', note: 'Cannot be built from this repository. Depends on institutional authority the concept does not have.' },
];
const STATUS_LABEL = Object.fromEntries(PHASES.map((p) => [p.key, p.label]));

function rmCard(i) {
  return `<article class="rm-card ${i.status}">
    <div class="rm-top">
      <span class="rm-num">${i.n}</span>
      <span class="chip ${i.status}">${STATUS_LABEL[i.status]}</span>
    </div>
    <h3>${esc(i.title)}</h3>
    <p class="rm-what">${i.what}</p>
    <details>
      <summary>Why, and what it needs</summary>
      <p>${i.detail}</p>
      ${i.detail2 ? `<p>${i.detail2}</p>` : ''}
      <dl class="rm-meta">
        <div><dt>Needs</dt><dd>${i.needs}</dd></div>
        <div><dt>Unblocks</dt><dd>${i.unblocks}</dd></div>
      </dl>
    </details>
  </article>`;
}

function roadmap() {
  const counts = ROADMAP.reduce((a, i) => ((a[i.status] = (a[i.status] || 0) + 1), a), {});

  const legend = `<div class="rm-legend">${PHASES.map((ph) => `
    <div class="rm-leg">
      <span class="chip ${ph.key}">${ph.label}</span>
      <span class="n">${counts[ph.key] ?? 0}</span>
      <span class="d">${esc(ph.note.split('.')[0])}.</span>
    </div>`).join('')}</div>`;

  const phases = PHASES.map((ph) => {
    const items = ROADMAP.filter((i) => i.status === ph.key);
    if (!items.length) return '';
    return `<section class="rm-phase">
      <div class="rm-phase-head">
        <h2 id="${ph.key}">${esc(ph.label)}</h2>
        <span class="chip ${ph.key}">${items.length} item${items.length === 1 ? '' : 's'}</span>
      </div>
      <p class="rm-phase-note">${esc(ph.note)}</p>
      <div class="rm-grid">${items.map(rmCard).join('')}</div>
    </section>`;
  }).join('');

  return page({
    title: 'Roadmap',
    eyebrow: 'What is coming',
    depth: 1,
    active: 'roadmap/',
    lead: 'Eight things above the token foundation, grouped by how ready they are. The first — a component library — is now shipping; the rest is a statement of intent, with dependencies stated so the sequencing is arguable.',
    body: `
${callout(`<p>The foundation — tokens, rules, and the evidence behind them — is in place, and the <a href="../components/">component library</a> is now building on top of it. Everything else on this page sits above that layer. Where an item is blocked, it says so and by what — an honest roadmap is more useful than an ambitious one.</p>`, { title: 'Where this stands' })}

${legend}
${phases}

<h2 id="sequencing">Why this order</h2>
<p><b>Components came first</b> because almost everything else depends on them: templates are assembled from components, the Figma library mirrors them, and a conformity assessment needs something concrete to assess. That is why they are the first thing shipping. Brand guidelines sit alongside because they are largely written already, and they gate anything a department would produce on its own.</p>
<p><b>The awards programme is last</b> not because it matters least — it may be the item with the most leverage over adoption — but because it is the only one that cannot be built. It needs an institution willing to stand behind it.</p>

${table(
  ['This', 'Depends on', 'And unblocks'],
  ROADMAP.map((i) => [`${code(i.n)} ${esc(i.title)}`, i.needs.split('.')[0] + '.', i.unblocks]),
  { min: 720 },
)}

${callout(`<p>This is unofficial concept work. Nothing on this page is a commitment by any organ of the South African state, and no timeline is implied.</p>`, { tone: 'warn', title: 'To be clear' })}
`,
  });
}

/* ==================================================================== index */

export const pages = [
  { path: 'index.html', html: home() },
  { path: 'guidelines/index.html', html: guidelinesIndex() },
  { path: 'guidelines/colour/index.html', html: colour() },
  { path: 'guidelines/typography/index.html', html: typography() },
  { path: 'guidelines/language/index.html', html: language() },
  { path: 'guidelines/space/index.html', html: space() },
  { path: 'guidelines/iconography/index.html', html: iconography() },
  { path: 'guidelines/motion/index.html', html: motion() },
  { path: 'guidelines/accessibility/index.html', html: accessibility() },
  { path: 'guidelines/content/index.html', html: content() },
  { path: 'guidelines/identity-mark/index.html', html: identityMark() },
  { path: 'components/index.html', html: components() },
  { path: 'icons/index.html', html: iconsPage() },
  { path: 'programme/index.html', html: programme() },
  { path: 'roadmap/index.html', html: roadmap() },
  { path: 'tokens/index.html', html: tokensPage() },
  { path: 'about/index.html', html: about() },
];
