/**
 * Page content. Each entry returns { path, html }.
 *
 * Prose is written for the site rather than pasted from BRAND.md — but every
 * number is computed from tokens.json at build time, so the documentation
 * cannot drift from the system it documents.
 */
import {
  entries, group, token, val, leaf, names, ratio, grade, isHex, esc, fmt, code, dot,
  gradeChip, swatches, cards, table, callout, LIGHT_BG, LIGHT_SURF, DARK_BG, DARK_SURF, meta,
} from './lib.mjs';
import { page, NAV } from './layout.mjs';

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
${callout(`<p>This is <b>unofficial concept work</b>. It is not endorsed by or affiliated with the Presidency's Digital Services Unit, the Department of Communications and Digital Technologies, or any organ of the South African state. Tokens marked <b>EXISTING</b> were read from the live mymzansi.gov.za stylesheet; everything else is a proposal for discussion.</p>`, { tone: 'warn', title: 'Please read first' })}

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

<h2 id="next">What is coming</h2>
<p>The system today is foundations only — tokens, rules and evidence. Components, templates, an icon and Figma library, illustration guidance, machine-readable AI documentation and an adoption awards programme are all still ahead.</p>
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
<p><b>Material Symbols Outlined</b> — Apache-2.0, and already loading on the live MyMzansi site. Standardising on it adds no new dependency and aligns with the digital-public-goods posture.</p>
${table(
  ['Setting', 'Value'],
  [['Style', 'Outlined'], ['Optical size', '24'], ['Weight / Grade', '400 / 0'], ['Fill', '0']],
)}
<p>Use one style throughout. Do not mix outlined and filled to signal state — use the status rail plus a text label.</p>

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
<p>Reference <code>icon.semantic.*</code> — never a raw glyph name.</p>
${table(
  ['Token', 'Glyph', 'Notes'],
  group('icon.semantic').map((e) => [code(leaf(e)), code(e.value), esc(e.description ?? '')]),
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
    ['Material Symbols Outlined', '<b>EXISTING</b>', 'Observed loading on the live site.'],
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
    status: 'next',
    what: 'The tier this system most obviously lacks. Each component documented with its anatomy, its states, its accessibility contract, and working code for every supported platform.',
    detail: 'The pattern is already proven in the reference app: Button, Card, StatusRow, Section and the identity band are built entirely from tokens. What is needed is to lift them into documented components with live examples, prop tables, and the code shown inline per platform. Every component carries its own accessibility contract — minimum target size, required accessible name, what must never be conveyed by colour alone — so the rules travel with the thing rather than living in a separate document nobody opens.',
    needs: 'A component inventory, and a decision on which framework the canonical implementation targets.',
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
    status: 'planned',
    what: 'A browsable, searchable set with the semantic mapping made concrete — every icon rendered, named, downloadable, and tied to the meaning it is allowed to carry.',
    detail: 'The semantic layer already exists in tokens.json: sixteen names such as <code>icon.semantic.verified</code> and <code>icon.semantic.restricted</code> that point at Material Symbols glyphs. The library turns that into something a designer can search, and enforces the rule that consumers reference the meaning rather than the glyph — so the set can be replaced without touching a single screen. It should also flag which icons are safe to use unaccompanied, which in practice is very few.',
    needs: 'Nothing blocking. Mostly rendering and packaging work.',
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
    lead: 'Eight things this system does not have yet, grouped by how ready they are. Nothing here is committed work — it is a statement of intent, with dependencies stated so the sequencing is arguable.',
    body: `
${callout(`<p>The system today is <b>foundations only</b>: tokens, rules, and the evidence behind them. Everything on this page sits above that layer. Where an item is blocked, it says so and by what — an honest roadmap is more useful than an ambitious one.</p>`, { title: 'Where this stands' })}

${legend}
${phases}

<h2 id="sequencing">Why this order</h2>
<p><b>Components come first</b> because almost everything else depends on them: templates are assembled from components, the Figma library mirrors them, and a conformity assessment needs something concrete to assess. Brand guidelines sit alongside because they are largely written already, and they gate anything a department would produce on its own.</p>
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
  { path: 'roadmap/index.html', html: roadmap() },
  { path: 'tokens/index.html', html: tokensPage() },
  { path: 'about/index.html', html: about() },
];
