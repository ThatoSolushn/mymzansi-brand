# MyMzansi Design Tokens

Design tokens for MyMzansi in **W3C Design Tokens Community Group (DTCG)** format, with a multi-platform build and enforceable WCAG 2.1 validation.

> **Unofficial concept work.** Not endorsed by or affiliated with the Presidency's Digital Services Unit or any organ of the South African state. Tokens marked `EXISTING` in `BRAND.md` were read from the live `mymzansi.gov.za` stylesheet.

---

## Quick start

```bash
npm run check      # build + validate. No dependencies, no install step.
```

| Script | Does |
|---|---|
| `npm run build` | Generates all platform outputs into `dist/` |
| `npm run docs` | Generates the style dictionary into `docs/` |
| `npm run validate` | Runs 106 WCAG 2.1 and integrity checks. Exits non-zero on failure |
| `npm run check` | All three. **Use this in CI.** |

---

## Files

```
tokens.json                    ← SINGLE SOURCE OF TRUTH. Edit only this.
BRAND.md                       ← Design rules, agent directives, full WCAG audit
REQUIREMENTS.md                ← What must exist: 137 requirements with acceptance criteria
scripts/build-tokens.mjs       ← Platform generator. Zero dependencies.
scripts/build-docs.mjs         ← Style dictionary generator. Zero dependencies.
scripts/validate-tokens.mjs    ← WCAG + integrity validator (CI gate). Zero dependencies.
dist/                          ← GENERATED. Never edit by hand.
  css/tokens.css
  js/tokens.js + tokens.d.ts       (React Native / web)
  tailwind/tailwind.config.js
  swift/MzTokens.swift
  kotlin/MzTokens.kt
  dart/mz_tokens.dart
docs/                          ← GENERATED. The style dictionary.
  index.html                       (browsable: swatches, specimens, contrast)
  TOKENS.md                        (same catalogue, reviewable and diffable)
```

## The style dictionary

`docs/index.html` is the reference to hand a developer or designer. For every token it shows the value, where it came from, the description, **the identifier it becomes on each platform**, and the measured contrast against both grounds. Open it directly — it is a single self-contained file with no external requests.

`docs/TOKENS.md` is the same catalogue in Markdown, so token changes show up as readable diffs in review.

`dist/` is committed deliberately — designers, other agents, and non-JS platforms need the outputs without running a toolchain.

**No dependencies.** Both scripts are plain Node with no packages, so there is no `npm install`, no lockfile to audit, and no supply chain. For a public-sector repo that is worth more than the convenience of a token framework.

---

## For AI agents

**Read `BRAND.md` §0 and `REQUIREMENTS.md` §0 before generating anything.**

- `REQUIREMENTS.md` says **what must exist** — features, behaviour, acceptance criteria. Cite requirement IDs (`FR-F3-04`) in code and tests.
- `BRAND.md` says **how it must look and behave** — tokens, contrast, motion, copy.

Both apply. `BRAND.md` §0 contains twelve `MUST`/`MUST NOT` design rules. It contains twelve `MUST`/`MUST NOT` rules and a verification checklist. The three that are broken most often:

- **R1** — never hardcode a colour, size, spacing value, radius or duration. Reference a token.
- **R2** — maize (`#FBC549`) is a **ground, never a mark** on light backgrounds. It is 1.44:1 there. See `BRAND.md` §4.5.
- **R4** — no fixed-width containers on translatable text. Nguni languages produce unbreakable tokens roughly 2× the English length. See `BRAND.md` §5.5.

`tokens.json` itself is the machine-readable source — a DTCG tree of `$value` / `$type` / `$description`. Read it directly; do not parse the generated CSS.

---

## Consuming the tokens

### Web

```html
<link rel="stylesheet" href="dist/css/tokens.css">
```

```css
.card {
  background: var(--theme-surface);
  color: var(--theme-text);
  border-radius: var(--dimension-radius-lg);
  padding: var(--dimension-space-md);
}
.card__action {
  background: var(--theme-accent);
  color: var(--theme-text-invert);
  min-height: var(--dimension-touch-min);
  transition: transform var(--motion-duration-base) var(--motion-easing-standard);
}
```

Reference **theme** tokens (`--theme-text`, `--theme-surface`, `--theme-accent`) — not palette tokens (`--color-palette-ink`). Theme tokens resolve per theme automatically; palette tokens do not.

Typography ships as both variables and utility classes:

```html
<h1 class="type-title-1">Sawubona</h1>
<p class="type-body">…</p>
```

### Theming

The generated CSS implements the three-state contract from `BRAND.md` §3.3:

| State | Selector |
|---|---|
| System/unset (**the default**) | `:root` + `@media (prefers-color-scheme: dark)` |
| Explicit light | `:root[data-theme="light"]` beats the OS dark preference |
| Explicit dark | `:root[data-theme="dark"]` beats the OS light preference |

Set `data-theme` on `<html>` to override. Leave it off for system behaviour.

### Other platforms

```swift
MzTokens.aloe               // dist/swift/MzTokens.swift
```
```kotlin
MzTokens.aloe               // dist/kotlin/MzTokens.kt
```
```dart
MzTokens.aloe               // dist/dart/mz_tokens.dart
```
```js
// dist/tailwind/tailwind.config.js
```

---

## Adding or changing a token

1. Edit **`tokens.json`** only. Add a `$description` explaining the choice.
2. Run `npm run check`.
3. Fix any failure before committing. Treat warnings as review items, not noise — see below.
4. Commit `tokens.json` **and** the regenerated `dist/`.

### About the marginal warnings

The validator flags any pairing that passes but sits within 10% of its threshold. This is not pedantry — it is the exact shape of the `aloe-lt` defect documented in `BRAND.md` §4.6.2: `#3A7D44` is 5.00:1 on pure white and 4.36:1 on a warm tint. It looked fine, and it broke the moment the ground moved.

Current warnings are known and accepted:

| Warning | Status |
|---|---|
| `light.text-3` 4.82:1 | Accepted — meta text, deliberately quiet |
| `light.accent-warm` / `semantic.restricted` 4.76:1 | Accepted — ochre is at its usable ceiling before it stops reading as ochre |
| `aloe-lt on bone` 4.51:1 | **Watch.** Existing MyMzansi token, only passes because bone was lightened for it. Do not darken bone. |

---

## CI

```yaml
- run: npm run check     # no install step — zero dependencies
```

`scripts/validate-tokens.mjs` exits non-zero on any WCAG failure, unresolved alias, or token drift.

---

## What the validator checks

| # | Check |
|---|---|
| 1 | `tokens.json` parses; all 56 aliases resolve; no cycles |
| 2 | §1.4.3 AA — every theme text token vs both its surfaces (4.5:1) |
| 3 | §1.4.3 AA — inverted text on every filled accent (4.5:1) |
| 4 | §1.4.3 AA — every semantic colour on both light surfaces |
| 5 | R2 — confirms maize still fails as a mark, so the rule still stands; and that ink on maize holds |
| 6 | Drift — duplicate hexes under different names |
| 7 | Marginal-pass detection (within 10% of threshold) |

**What it does not check** — and these remain open, see `BRAND.md` §15:

- Colour-vision deficiency. Aloe vs ochre is most at risk.
- Sunlight legibility on low-cost LCDs.
- Typeface coverage across all twelve official languages, including the click letters `ǀ ǁ ǂ ǃ`.
- Whether any copy is correct — all non-English strings are indicative and need native-speaker review.

---

## Tooling rationale

Git + DTCG + a plain-Node generator, rather than a hosted design-system platform:

1. **No vendor lock-in.** A design system held hostage in a SaaS account is the credential-format lock-in argument at a smaller scale.
2. **Works in GitLab**, which the MyMzansi resources page describes as the approved government codebase repository.
3. **AI agents read plain text natively** — no API, no export, no auth.
4. **Free and auditable**, which matters for public procurement.
5. **Aligns with the digital-public-goods posture** — South Africa joined the DPGA, and the DSU already reuses GOV.UK Pay and Notify.

The generator is ~30KB of plain Node rather than Style Dictionary. Style Dictionary is the right call once outputs multiply or the team grows; until then, zero dependencies is the stronger position for a public-sector repo.

Add **Tokens Studio for Figma** so designers edit the same source. Add **Storybook** once a framework is chosen. Add a hosted docs layer only if non-technical sign-off demands it — and never let it own the tokens.
