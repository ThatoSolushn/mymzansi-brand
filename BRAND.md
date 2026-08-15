# MyMzansi — Brand & Design System

**Version** 1.0.0 · **Updated** 2026-08-13 · **Status** Proposal, for discussion

**Companion:** [`REQUIREMENTS.md`](./REQUIREMENTS.md) — what must exist, with acceptance criteria. This document governs how it looks and behaves; that one governs what it does. Both apply.

> **Affiliation notice.** This is unofficial concept work. It is not endorsed by or affiliated with the Presidency's Digital Services Unit (DSU), the Department of Communications and Digital Technologies, or any organ of the South African state. Tokens marked `EXISTING` were read from the live `mymzansi.gov.za` stylesheet. Everything else is proposed.

---

## 0. Instructions for AI agents

**Read this section fully before generating any code, design, or copy.**

You are implementing a South African government service used by people across a very wide range of literacy, language, income, disability, and device capability. The constraints below are not stylistic preferences. Several of them are legal requirements, and several exist because breaking them excludes people from grants, identity documents, or income.

### 0.1 Source of truth

- `tokens.json` in this directory is the **single source of truth** for every colour, type style, dimension, icon and motion value.
- It uses the **W3C Design Tokens Community Group (DTCG)** format.
- Platform files (CSS, Swift, Kotlin, Dart, Tailwind config, XML) are **generated** from it. Never hand-edit a generated file. Never introduce a value that is not in `tokens.json`.
- If you need a value that does not exist, **add it to `tokens.json` first**, with a `$description` explaining why, then reference it.

### 0.2 Absolute rules

These are phrased per RFC 2119. Violating any of them is a defect, not a style disagreement.

| # | Rule |
|---|---|
| R1 | You **MUST NOT** hardcode a colour, font size, spacing value, radius, or duration. Reference a token. |
| R2 | You **MUST NOT** use `maize` (`#FBC549`) as text, an icon, a border, or the sole indicator of state on a light background. It is a **ground only**. See §4.5. |
| R3 | You **MUST NOT** convey information by colour alone. Every state carries a second cue: text, icon, position, or shape. |
| R4 | You **MUST NOT** use fixed-width containers for anything holding translatable text. See §5.4. |
| R5 | You **MUST** animate only `transform` and `opacity`. See §8.2 for the one documented exception. |
| R6 | You **MUST NOT** add any external network origin — no font CDN, no analytics host, no remote image host. See §12. |
| R7 | You **MUST** meet WCAG 2.1 Level AA. Text 4.5:1, large text 3:1, non-text and UI state 3:1. |
| R8 | You **MUST** give every interactive target a minimum of 44×44px, and 48px where targets are adjacent or the action is destructive. |
| R9 | You **MUST** honour `prefers-reduced-motion` as a first-class state with identical information, not a degraded fallback. |
| R10 | You **MUST NOT** blame the user in error copy. The system failed, not the person. See §10.2. |
| R11 | You **MUST NOT** design a dead end. Every failure path resolves to a concrete next action with a place, a time, or a person. |
| R12 | You **MUST NOT** invent translated strings. Mark all non-English copy as requiring native-speaker review. See §5.5. |

### 0.3 Before you finish any task

Run the checklist in **§13**. If you cannot verify an item, say so explicitly rather than assuming it passes.

### 0.4 What this system is optimising for

In priority order, highest first:

1. **Nobody is excluded.** A person with worn fingerprints, no smartphone, no data, or no literacy in English must still complete the task.
2. **The user can verify what happened.** Trust is the product. Anything the state does with a person's data must be visible and contestable.
3. **It works on a cheap phone on a slow network.** This is a hard constraint, not an optimisation.
4. **It is beautiful.** Last in priority, never omitted. Dignity is a design requirement in a public service.

---

## 1. Provenance and status of each token

| Category | Status | Note |
|---|---|---|
| `aloe-lt` `#3A7D44` | **EXISTING** | Read from live site. Has a documented contrast fragility — see §4.6. |
| `maize` `#FBC549` | **EXISTING** | Read from live site. Usage now constrained — see §4.5. |
| Spacing scale (xs/sm/md/lg/xl) | **EXISTING** | Extended with intermediate steps. |
| Radius `4px` / `12px` | **EXISTING** | Kept. |
| Icon sizes 18/20/24/28 | **EXISTING** | Kept. |
| Material Symbols Outlined | **EXISTING** | Observed loading on the live site. Standardised on. |
| Montserrat | **EXISTING** | Interim. Must be re-tested — see §5.4. |
| `indigo`, `ochre`, `bone` | **PROPOSED** | New. |
| All corrected accents | **PROPOSED** | Result of the WCAG audit in §4.6. |

---

## 2. Design principles

### 2.1 The identity is structural, not decorative

The distinctive fact about South Africa is not a pattern. It is that **twelve official languages share one state**, and that since 2023 one of them is **South African Sign Language**. The visual identity is built from that.

**Do not apply Ndebele geometry, beadwork motifs, or "African" pattern as a decorative skin.** Three reasons:

1. Ndebele visual culture has a documented history of extraction — from apartheid-era tourism propaganda that displayed Ndebele women as exotic attractions, through fashion houses using the geometry without credit or payment.
2. It makes one people's visual language stand for twelve.
3. It is decoration. It survives one redesign, and nothing structural about it is South African.

If pattern is wanted, **commission a living artist with credit and an ongoing licence**. Anything else is pastiche.

### 2.2 Structure over motif

What can legitimately be taken is **method, not motif**: hard edges, flat unmodulated colour, confident blocking, strong dividing lines. Practically:

- No gradients unless they carry meaning.
- No soft drop shadows doing work a real edge should do.
- Colour blocks with crisp boundaries.
- Asymmetric proportions in identity elements, so they read as composed rather than as a flag.

### 2.3 Show the failure paths

Most government products design the happy path and treat failure as an error state. This system inverts that: **the failure paths are the product**, because they are where trust is won or lost. See §9.4.

---

## 3. Token architecture

### 3.1 Three layers — never skip a layer

```
palette  →  theme / semantic  →  component
(raw)       (meaning)             (usage)
```

- **`color.palette.*`** — raw values. **Never reference these in a component.**
- **`color.theme.light.*` / `color.theme.dark.*`** — resolved surfaces and text.
- **`color.semantic.*`** — meaning: success, critical, restricted.

**Why this matters:** when `accent` and `success` are the same token, neither reading is reliable. A green button and a green success message must be separable, or the user cannot learn what green means.

### 3.2 Generating platform outputs

`tokens.json` is technology-agnostic. `scripts/build-tokens.mjs` transforms it — plain Node, **zero dependencies**:

```
tokens.json
   ├── dist/css/tokens.css              (custom properties + three-state theming)
   ├── dist/tailwind/tailwind.config.js
   ├── dist/swift/MzTokens.swift
   ├── dist/kotlin/MzTokens.kt
   └── dist/dart/mz_tokens.dart
```

**The rule:** one edit to `tokens.json`, one build, every platform updates. Nothing downstream is edited by hand.

Any DTCG-compatible transformer (Style Dictionary, Terrazzo) can replace the generator without touching `tokens.json` — that is the point of using the standard format. Adopt one when the number of outputs justifies the dependency; until then zero dependencies is the stronger position for a public-sector repo.

### 3.3 Theming contract

Whatever the platform, three theme states must resolve correctly:

1. **Explicit light** — user chose light.
2. **Explicit dark** — user chose dark.
3. **System / unset** — the default. Most users are here. Only the OS preference distinguishes light from dark.

Define the complete light palette at the base level, redefine **only the tokens** for dark, and ensure an explicit user choice beats the OS setting in both directions. Never define a colour only inside a dark-mode conditional — it will not apply in the unset state.

---

## 4. Colour

### 4.1 Palette and sources

| Token | Value | Source | Role |
|---|---|---|---|
| `indigo` | `#1B2A4A` | Shweshwe indigo — the discharge-printed cotton, a material with a genuinely mixed history, European and Indian in origin, made Xhosa and Sotho by adoption | Anchor, headers, dark surfaces |
| `aloe` | `#2F6B3A` | Aloe / veld | Primary action, success |
| `maize` | `#FBC549` | Maize | Joy, arrival — **ground only** |
| `ochre` | `#A8542E` | Highveld soil and mine dump | Warm accent, restricted state |
| `bone` | `#F5F3ED` | Warm paper | Page ground |
| `ink` | `#16191A` | Near-black, green-biased | Body text |

Flag colours are deliberately not used. They read as municipal letterhead and are politically flat.

### 4.2 Semantic assignments

| Meaning | Light | Dark |
|---|---|---|
| Success | `#2F6B3A` | `#58B06A` |
| Caution (as text) | `#8F5E0A` | `#E9BC55` |
| Caution (as fill) | `#FBC549` + ink on top | `#FBC549` |
| Critical | `#B3271E` | `#E4756A` |
| Info | `#2C5D8A` | `#7FAAD4` |
| Restricted / not-yet-available | `#A8542E` | `#DE8A5E` |

**`restricted` is deliberately distinct from `critical`.** An action the user cannot take *yet* is not an error. A warm limit reads differently from a red failure, and the difference matters to someone who has just been told their fingerprint did not read.

### 4.3 Rationing rules

| Rule | Detail |
|---|---|
| **Maize is rationed** | Moments of arrival only — verified, paid, collected, done. Never chrome, never navigation. A joy colour used for navigation stops being a joy colour by the second screen. |
| **Semantic ≠ brand** | Semantic tokens never borrow the accent token. |
| **One accent per screen** | If two things compete for attention, neither has it. |

### 4.4 Contrast requirements

| Content | Ratio | Criterion |
|---|---|---|
| Body text (< 18.66px bold / < 24px) | **4.5:1** | WCAG 2.1 §1.4.3 AA |
| Large text (≥ 18.66px bold / ≥ 24px) | **3:1** | WCAG 2.1 §1.4.3 AA |
| Enhanced body text | 7:1 | WCAG 2.1 §1.4.6 AAA — target where practical |
| UI components, state indicators, meaningful graphics | **3:1** | WCAG 2.1 §1.4.11 |
| Information carried by colour | Needs a second cue | WCAG 2.1 §1.4.1 |

### 4.5 The maize rule — structural, not adjustable

Maize **cannot be corrected by darkening**. To reach 3:1 on a light ground it must lose 27% lightness, at which point it is `#B68004` — a brown, not the joy colour.

| Maize used as… | Ratio | Verdict |
|---|---|---|
| Text on white | 1.59:1 | Fails badly |
| Filled state indicator on bone | 1.44:1 | **Fails §1.4.11** |
| Filled vs unfilled meter segment | 1.20:1 | **State is imperceptible** |
| Ground with ink text on top | 11.10:1 | AAA |
| Anything on the dark theme ground | 11.36:1 | AAA |
| Against an indigo track | 8.93:1 | AAA |

> **RULE (R2).** In light theme, maize is a **ground, never a mark**. It carries ink text on top of it, and it sits against indigo. It is never text, never an icon, never a border, and never the sole indicator of state. In dark theme it is unrestricted.

**Worked example — the assurance meter.** A maize segment against a light track is 1.20:1: the filled state is effectively invisible, a direct §1.4.11 failure. Two fixes, apply both:

1. Put the meter on an **indigo** track (8.93:1).
2. State the level in **text** — a large `1 / 3` numeral. This satisfies §1.4.1 and is the more important of the two, because it makes the meter redundant reinforcement rather than the only carrier of the information.

### 4.6 WCAG 2.1 audit — full results

Ratios computed, not estimated. Audit date 2026-08-13.

#### 4.6.1 Failures found and corrected

| Pairing | Was | Now | Fix |
|---|---|---|---|
| Ochre as label text on bone | **3.50 ✗** | 4.76 ✓ | `#C1663A` → `#A8542E` |
| White text on ochre fill | **4.02 ✗** | 5.29 ✓ | Same darkening |
| Aloe `#3A7D44` on warm off-white | **4.36 ✗** | 4.51 ✓ | Ground lightened to `#F5F3ED` |
| Caution as text | **2.24 ✗** | 5.02 ✓ | `#E0A21C` → `#8F5E0A` |
| Meta text, light theme | **2.75 ✗** | 4.82 ✓ | `#8A938F` → `#646D68` |
| Meta text, dark theme | **4.40 ✗** | 5.74 ✓ | `#767E88` → `#8A929B` |

#### 4.6.2 Finding that affects the existing MyMzansi token

> **`aloe-lt` `#3A7D44` — currently shipping — reaches only 4.36:1 on a warm off-white.**
>
> On pure white it is fine at 5.00:1. The token is not broken; it is **fragile**. Any tinted ground, disabled state, or overlay tips it under AA without anyone noticing, because it still looks green and still looks fine.
>
> **Two acceptable fixes.** Darken the token to `#2F6B3A` (5.76:1 on tint, 6.39:1 on white), or write a rule that `#3A7D44` is a pure-white-background-only colour. Either is fine. Having neither is how a design system quietly ships inaccessible screens.
>
> This is worth raising with the DSU independently of whether any of the rest of this direction is adopted.

#### 4.6.3 Verified results — light theme

All values ≥ 4.5:1 unless noted. Ground `#F5F3ED`, panel `#FFFFFF`.

| Token | On bone | On panel | Level |
|---|---|---|---|
| `ink` `#16191A` | 15.93 | 17.68 | AAA |
| `ink-2` `#4A5450` | 7.07 | 7.85 | AAA |
| `ink-3` `#646D68` | 4.82 | 5.34 | AA |
| `indigo` `#1B2A4A` | 12.82 | 14.22 | AAA |
| `aloe` `#2F6B3A` | 5.76 | 6.39 | AA |
| `ochre` `#A8542E` | 4.76 | 5.29 | AA |
| `crit` `#B3271E` | 5.87 | 6.51 | AA |
| `caution` `#8F5E0A` | 5.02 | 5.57 | AA |
| `info` `#2C5D8A` | 6.23 | 6.91 | AA |

**White text on filled accents:** indigo 14.22 (AAA) · aloe 6.39 · ochre 5.29 · crit 6.51 · caution 5.57 · info 6.91 — all AA or better.

**Ink on maize fill:** 11.10 (AAA). **Indigo on maize fill:** 8.93 (AAA).

#### 4.6.4 Verified results — dark theme

Ground `#12161F`, panel `#1A2030`.

| Token | On ground | On panel | Level |
|---|---|---|---|
| `chalk` `#ECEAE4` | 15.04 | 13.50 | AAA |
| `chalk-2` `#A8AFB8` | 8.18 | 7.34 | AAA |
| `chalk-3` `#8A929B` | 5.74 | 5.15 | AA |
| `aloe-br` `#58B06A` | 6.75 | 6.06 | AA |
| `indigo-lt` `#93A9D6` | 7.66 | 6.87 | AA/AAA |
| `ochre-br` `#DE8A5E` | 6.81 | 6.11 | AA |
| `crit-br` `#E4756A` | 6.08 | 5.45 | AA |
| `info-br` `#7FAAD4` | 7.41 | 6.65 | AA/AAA |
| `maize` `#FBC549` | 11.36 | 10.20 | AAA |

**Result: 0 text failures in either theme.**

#### 4.6.5 Known limitations — state these, do not paper over them

1. **Card borders do not reach 3:1.** `#E4DFD4` on white is 1.33:1. WCAG §1.4.11 applies to controls and meaningful state, not decorative grouping, so a card border is **exempt and conformant**. But a white card on a bone ground is only 1.11:1, so neither fill nor border is doing much work. It conforms and still reads poorly in bright outdoor light, which is the real usage condition. **Preference: let the left status rails carry structure** — aloe and ochre both clear 3:1 comfortably.

2. **Colour-vision deficiency has NOT been simulated.** Aloe-versus-ochre is the pairing most likely to collapse under deuteranopia. This must be tested before the palette is fixed. Do not assert CVD-safety.

3. **Contrast ratios are a floor, not a proof.** The WCAG 2.1 formula overstates legibility for light-on-dark and understates some mid-tone pairs. It models nothing about sunlight on a cheap LCD, which is the actual viewing condition.

---

## 5. Typography

### 5.1 Families

| Role | Stack | Use |
|---|---|---|
| Sans | Montserrat → system-ui → -apple-system → Segoe UI → Roboto | Everything |
| Mono | ui-monospace → SFMono-Regular → Menlo → Consolas | Reference numbers, IDs, codes — anything read aloud or transcribed |

### 5.2 Scale

| Style | Size | Weight | Line height | Tracking |
|---|---|---|---|---|
| `display` | 34 | 800 | 1.1 | −0.025em |
| `title-1` | 26 | 800 | 1.15 | −0.02em |
| `title-2` | 21 | 700 | 1.2 | −0.015em |
| `title-3` | 18 | 700 | 1.25 | −0.01em |
| `body-lg` | 17 | 400 | 1.55 | 0 |
| `body` | 16 | 400 | 1.55 | 0 |
| `body-sm` | 14 | 400 | 1.5 | 0 |
| `caption` | 13 | 400 | 1.45 | 0 |
| `label` | 11 | 700 | 1.4 | 0.12em, uppercase |

**Minimum sizes.** Interactive text never below 14. Any text never below 12. Body defaults to **16**, not 14 — these screens are read at small sizes on cheap panels in hard light, frequently by older users.

**Text must scale with OS text-size settings.** Never lock to a pixel value in a way that ignores user preference.

### 5.3 Line length

Running text: **45–75 characters**. Nguni languages run longer per word, so err toward the lower bound.

### 5.4 Language coverage — the typeface requirement

Montserrat is an **interim** choice inherited from the existing site. Before a face is fixed it must be tested against:

- **Full Latin Extended** for the diacritics used across all official languages.
- **Click letters** `ǀ ǁ ǂ ǃ` used in Khoekhoegowab and Nǀuu. The Constitution obliges the state to promote these languages. Most fashionable geometric sans faces lack them and fall back mid-word — a silent, ugly failure.
- **High x-height and open apertures** for legibility at small sizes on low-quality displays.

Test with **real strings in all twelve languages**, not with lorem or with English set in a different face.

### 5.5 The multilingual layout constraint

South Africa has **twelve official languages**. The Nguni group — isiZulu, isiXhosa, siSwati, isiNdebele — uses **conjunctive orthography**: what English writes as a phrase, they write as a single word. Sotho-Tswana languages are disjunctive and behave differently again.

**Practical consequence:** a label that fits in English will overflow, and it will overflow as an **unbreakable single token**, which is far worse than a long phrase.

| Rule | Detail |
|---|---|
| **No fixed-width containers** | Buttons, tabs, chips, table headers, badges size to content. |
| **Budget 2× the English string length** | For any translatable label. |
| **Allow mid-word breaking on long tokens** | Never let ellipsis be the fallback for a primary action label. Truncation is also passed to screen readers. |
| **Never bake text into images** | It cannot be translated, scaled, or read aloud. |
| **Language is a first-class UI object** | Visible on the home screen, switchable in one tap — not buried in settings. Someone helping a relative at a counter may need to switch mid-transaction. |

> **RULE (R12).** Do not invent translated strings. Any non-English copy you produce is **indicative, for layout only**, and must be marked as requiring native-speaker review.

### 5.6 South African Sign Language

SASL became the **twelfth official language** in 2023 (Constitution Eighteenth Amendment). Treat it as a **first-class content type**, not an accessibility bolt-on:

- Short signed video for consent screens, key explanations, and anything with legal consequence.
- It sits **beside** text, not ghettoised in a corner.
- It must degrade gracefully when there is no bandwidth for video.

No other government product does this. It is constitutionally grounded and would be genuinely unprecedented.

---

## 6. Iconography

### 6.1 Set

**Material Symbols Outlined** — Apache-2.0, already loading on the live MyMzansi site. Standardising on it adds no new dependency and aligns with the digital-public-goods posture.

| Setting | Value |
|---|---|
| Style | Outlined |
| Optical size | 24 |
| Weight / Grade | 400 / 0 |
| Fill | 0 |

**Use one style throughout.** Do not mix outlined and filled to signal state — use the status rail plus a text label.

### 6.2 Sizes

`sm` 18 · `md` 20 · `lg` 24 (default) · `xl` 28. All EXISTING tokens.

### 6.3 Rules

| Rule | Reason |
|---|---|
| An icon **never** appears without a text label for a primary action | Icon meaning is not universal across twelve language communities |
| Icons **never** carry state alone | §1.4.1. Pair with text or position |
| Icon colour inherits from its semantic token | Never a decorative colour |
| Icons meet **3:1** against their background when meaningful | §1.4.11. Purely decorative icons are exempt |
| Prefer the **status rail** to icon circles in lists | Faster to scan, no cross-cultural ambiguity, far cheaper to render |

### 6.4 Semantic icon map

Reference `icon.semantic.*` in `tokens.json` — never a raw glyph name. Changing the set then means changing one file.

---

## 7. Space, radius, targets

### 7.1 Spacing

`3xs` 2 · `2xs` 4 · `xs` 8 · `sm` 12 · `md` 16 · `lg` 24 · `xl` 40 · `2xl` 60

Use **layout gap**, not per-element margins. Margins collapse and double unpredictably.

### 7.2 Radius

`sm` 4 (buttons, inputs, chips) · `md` 8 · `lg` 12 (cards, sheets) · `full` 999 (pills and badges only).

### 7.3 Touch targets

| Token | Value | Use |
|---|---|---|
| `touch.min` | **44px** | Absolute minimum, all interactive elements |
| `touch.min-spaced` | **48px** | Adjacent targets, or destructive/irreversible actions |

Non-negotiable — WCAG 2.5.5 / 2.5.8. Users include people with motor impairment and older people on small, cheap screens.

---

## 8. Motion

### 8.1 The budget

Every animation must hold **60fps on an entry-level Snapdragon or MediaTek handset**: a **16.7ms frame budget**.

| Animate | Never animate | Why |
|---|---|---|
| `transform` | `width`, `height`, `top`, `left` | Transforms are composited; layout properties reflow the subtree every frame |
| `opacity` | `background-color`, `box-shadow` | Paint-heavy — fine on a flagship, visible jank on a cheap handset |
| Composited filters, sparingly | Anything driven per-frame from the main thread | Main-thread work competes with everything else |

**Images are the most common cause of jank on low-end devices.** Large images decoded on the main thread drop frames and cost the user data. Motion comes from code, not from video or Lottie.

### 8.2 The one documented exception

The verification ring sweep animates `stroke-dashoffset`, which is not a compositor property. It is affordable because it is **one small element animating once**. It must remain the **only** exception — record it as named, so it does not become precedent.

### 8.3 Tokens

| Token | Value | Use |
|---|---|---|
| `duration.instant` | 100ms | Max latency before a tap shows feedback |
| `duration.quick` | 180ms | Toggles, chips, hover |
| `duration.base` | 280ms | Default state changes |
| `duration.slow` | 380ms | Entrances, expansions, meters |
| `duration.deliberate` | 1100ms | **Verification moment only** |
| `easing.standard` | `cubic-bezier(.2,.8,.3,1)` | Default |
| `easing.overshoot` | `cubic-bezier(.2,1.5,.4,1)` | Confirmation. One overshoot, never a loop |
| `easing.exit` | `cubic-bezier(.4,0,1,1)` | Leaving the screen |
| `stagger.interval` | 45ms | List entrances |
| `stagger.maxTotal` | **300ms** | Hard cap. `interval = min(45ms, 300ms / itemCount)` |

### 8.4 Principles

1. **Motion explains, it does not decorate.** Every animation answers one of: *where did this come from*, *what changed*, or *did it work?* If it answers none, cut it.
2. **Spend it on verification.** Trust is the product. The verification moment is the one place a signature animation earns its cost.
3. **Fast in, slower out.** Response to a tap starts within 100ms. Confirmations may take their time — that is where confidence lives.
4. **Reduced motion is not a lesser version.** Same information, same hierarchy, arriving rather than moving. Test it as a first-class state.

---

## 9. Component and pattern guidance

> These are the rules a component must obey. The components themselves —
> anatomy, states, accessibility contract, and working code per platform —
> are documented in **[COMPONENTS.md](COMPONENTS.md)**, which is the source of
> truth for the library. This section is the rationale that library implements.

### 9.1 Surfaces

Cards lift off a **bone** ground as **white** surfaces. Hierarchy comes from the surface change, not from shadows the cheap phone has to paint. Prefer a **left status rail** (`dimension.rail.status`, 4px) over icon circles in lists.

### 9.2 Buttons

| Variant | Fill | Label | Use |
|---|---|---|---|
| Primary | `anchor` (indigo) or `accent` (aloe) | white | One per screen |
| Secondary | transparent, accent border | accent | Alternatives |
| Plain | surface, border | `text-2` | Dismiss, "not now" |
| Destructive | `critical` | white | Irreversible only |
| Destructive-outline | transparent, `critical` border | `critical` | Leads somewhere consequential, but is not the commit action — e.g. "Sign out", "Report a lost phone". Reserves the solid `Destructive` fill for the actual "stop it now" action. |

Buttons size to content (R4). A button label is never truncated. Destructive variants (both) get the larger `touch.min-spaced` target.

### 9.3 Consent surfaces

Consent screens must show **what will not be shared**, not only what will. Listing only inclusions asks the reader to infer the boundary. Naming exclusions converts a disclosure into a promise.

State: **who**, **what exactly**, **why**, **how long**, and **the legal basis** — written twice, in plain language and with the citation, for two audiences: the citizen and their lawyer.

### 9.4 Failure paths — design these first

| Pattern | Requirement |
|---|---|
| **Biometric failure** | After the second failure, alternatives become primary and retry drops to secondary. Tell the person the failure is common and not their fault. |
| **Stepped-down assurance** | Failure downgrades capability, it never ends the session. Every restriction states its reason in plain language. |
| **Dead ends** | Resolve to a place, a distance, an opening time, and a wait. "Visit your nearest office" is not a next step. |
| **Nothing is lost** | A half-finished journey persists across channels and completes without restarting. |
| **Recovery** | Available **outside** the sign-in wall. If recovery is behind the thing that was lost, it is not recovery. |
| **Multiple routes** | Any single recovery route excludes somebody. Provide at least three, including one requiring no documents. |
| **Facts vs decisions** | Restore credentials automatically. **Never** silently restore a standing permission — that is a decision the user made and must make again. |
| **Assisted service** | The counter official needs a defensible procedure and a visible audit trail, or they will invent one. |
| **Delegation** | Originates with the principal, is scoped, time-bounded, non-transitive, and notifies the principal on every use. |

### 9.5 Channel diversity

The app is the primary channel, never the only one. USSD, SMS and assisted counter paths are **first-class**, designed alongside the app, not retrofitted. Revocation must work over SMS on a twenty-year-old handset.

---

## 10. Voice and content

### 10.1 Register

Plain, warm, direct. Short sentences. Second person. The reading age target is low, and it should be — a service that only serves confident readers is not a public service.

### 10.2 Error copy

> **R10. The system failed, not the person.**

| Never | Always |
|---|---|
| "Invalid fingerprint" | "We couldn't read that" |
| "Authentication failed" | "We couldn't confirm it's you" |
| "You entered the wrong PIN" | "That PIN didn't match" |
| "Access denied" | "You need Level 2 for this — here's how" |

Name the likely cause when it is not the user (a dry sensor, a slow connection). Where a failure is common for a group — worn fingerprints from manual work, thin skin with age — **say so on the screen**. Being failed by a government system in public is humiliating, and naming the cause is the cheapest dignity intervention available.

### 10.3 Log and audit copy

Write as **sentences ending in why**, not table rows.

- ✗ `SASSA · proof-of-life · 11/08 · API`
- ✓ `SASSA checked you were alive so your grant could be paid`

An audit log that cannot display something wrong is decorative. Build the "no reason given" state into the primary view.

---

## 11. Accessibility requirements

| Requirement | Standard |
|---|---|
| Contrast AA | WCAG 2.1 §1.4.3, §1.4.11 |
| No colour-only information | §1.4.1 |
| Touch targets 44px / 48px | §2.5.5, §2.5.8 |
| Text resizes to 200% without loss | §1.4.4 |
| Reflow at 320px equivalent | §1.4.10 |
| Visible focus indicator, 2px | §2.4.7 |
| `prefers-reduced-motion` honoured | §2.3.3 |
| Every control has an accessible name | §4.1.2 |
| Language of page and of parts declared | §3.1.1, §3.1.2 — **critical here**, screen readers must switch pronunciation per language |
| Errors identified in text, with a fix | §3.3.1, §3.3.3 |

**§3.1.2 is load-bearing in this product.** With twelve languages, marking the language of each part is what lets a screen reader pronounce isiZulu as isiZulu rather than as mispronounced English.

---

## 12. Performance and data budget

| Constraint | Value |
|---|---|
| Target device | Entry-level Android, ~4 years old |
| Network | 2G/3G |
| Frame budget | 16.7ms |
| Initial payload | ≤ 200KB |
| **External origins** | **0** |

> **R6.** Zero-rating covers the platform's own origin only. Any third-party origin — font CDN, analytics, remote image host — **costs the user money and breaks the zero-rating guarantee**. Embed fonts. Self-host everything. This is an architectural constraint, not a marketing arrangement.

---

## 13. Verification checklist

Run before completing any task. Report items you could not verify.

**Tokens**
- [ ] No hardcoded colour, size, spacing, radius or duration
- [ ] Components reference theme/semantic tokens, never `palette` directly
- [ ] Any new value was added to `tokens.json` with a `$description`

**Colour**
- [ ] Every text pairing ≥ 4.5:1 (or ≥ 3:1 for large text) — **computed, not estimated**
- [ ] Every meaningful non-text element ≥ 3:1
- [ ] Maize used only as a ground in light theme
- [ ] No information carried by colour alone
- [ ] All three theme states resolve (light / dark / unset)

**Language**
- [ ] No fixed-width containers on translatable text
- [ ] Tested with a string 2× the English length
- [ ] No text baked into images
- [ ] Non-English copy marked as needing native-speaker review
- [ ] `lang` declared on page and on parts

**Interaction**
- [ ] All targets ≥ 44px (48px if adjacent or destructive)
- [ ] Visible focus state on every interactive element
- [ ] Full keyboard operability

**Motion**
- [ ] Only `transform` / `opacity` (or the documented §8.2 exception)
- [ ] Stagger total ≤ 300ms
- [ ] `prefers-reduced-motion` verified as a first-class state

**Content**
- [ ] No error copy blames the user
- [ ] Every failure path ends in a concrete next action
- [ ] Consent surfaces state what is **not** shared

**Budget**
- [ ] Zero external origins
- [ ] Initial payload ≤ 200KB

---

## 14. Tooling recommendation

### 14.1 Recommended stack

| Layer | Tool | Why |
|---|---|---|
| **Source of truth** | `tokens.json` (W3C DTCG) in git | Technology-agnostic, diffable, reviewable, AI-readable, zero lock-in |
| **Transform** | `scripts/build-tokens.mjs` (plain Node, zero deps) | No supply chain to audit. Swap in Style Dictionary or Terrazzo when outputs multiply |
| **Design authoring** | **Tokens Studio** for Figma | Designers edit tokens in Figma; syncs to the same git repo. They already have a Figma design system |
| **Component docs** | **Storybook**, once a framework is chosen | Live, testable component documentation |
| **Stakeholder docs** | **zeroheight** or **Supernova**, only if non-technical sign-off requires it | Both are hosted and paid. Neither should own the tokens |

### 14.2 Why git + DTCG rather than a platform

For a government project this is close to a requirement rather than a preference:

1. **No vendor lock-in.** The anti-lock-in argument is the same one made about credential formats. A design system held hostage in a SaaS account is the same failure at a smaller scale.
2. **It works in their existing GitLab**, described on the MyMzansi resources page as the approved government codebase repository.
3. **AI agents read plain text natively** — no API, no export, no auth.
4. **Free and auditable**, which matters for public procurement.
5. **Aligns with the digital-public-goods posture** — South Africa joined the Digital Public Goods Alliance, and the DSU already reuses GOV.UK Pay and Notify.

### 14.3 Order of work

1. Put `tokens.json` and `BRAND.md` in a git repo.
2. Run `npm run check` — the generator and validator are already in `scripts/`, with no install step.
3. Connect Tokens Studio so design and code share one source.
4. Add Storybook once a framework is chosen.
5. Add a hosted docs layer **only** if non-technical stakeholders demand it — and never let it become the source of truth.

### 14.4 What to avoid

| Avoid | Why |
|---|---|
| Tokens living in Figma only | Not consumable by code or agents |
| Tokens living in a SaaS platform only | Lock-in, and inaccessible to agents |
| Hand-maintained per-platform files | They diverge — always |
| A component library before tokens | Bakes in values you will have to unpick |

---

## 15. Open items

| Item | Status |
|---|---|
| Colour-vision deficiency simulation | **NOT DONE** — aloe vs ochre most at risk |
| Sunlight legibility on low-cost LCD | **NOT DONE** |
| Typeface tested against all twelve languages incl. click letters | **DONE** — Montserrat's glyph coverage was checked directly (its `cmap` table via fontTools) against the click consonants `ǀ ǁ ǂ ǃ` (4/4 present) and real diacritic strings across the languages (Tshivenda `ṱ`, Sepedi `š`, etc. — all covered). Both skill-recommended "premium" alternatives (Plus Jakarta Sans, Outfit) failed the clicks 0/4. Montserrat is confirmed as the face — no longer interim. The x-height check (§5.4 pt 3) remains a visual judgement, but coverage — the constitutional requirement — is met. |
| All copy reviewed by native speakers | **NOT DONE** — all strings indicative |
| SASL video pattern | **NOT DESIGNED** |
| Component inventory | **IN PROGRESS** — 14 primitives shipped for web (`packages/web`, React + Tailwind + Radix), documented in [COMPONENTS.md](COMPONENTS.md); the React Native set (`mymzansi-app`) has the same primitives with Reanimated motion. Templates and the Figma library are the tiers above. |

---

## Appendix A — file map

```
mymzansi-brand/
├── tokens.json                 ← SINGLE SOURCE OF TRUTH. Edit only this.
├── BRAND.md                    ← this file: rules, rationale, agent directives
├── README.md                   ← how to build, consume and extend
├── scripts/
│   ├── build-tokens.mjs        ← generator, zero dependencies
│   └── validate-tokens.mjs     ← WCAG 2.1 + integrity validator (CI gate)
└── dist/                       ← GENERATED. Never edit by hand.
    ├── css/tokens.css              (custom properties + theming)
    ├── tailwind/tailwind.config.js
    ├── swift/MzTokens.swift
    ├── kotlin/MzTokens.kt
    └── dart/mz_tokens.dart
```

Both scripts are plain Node with **no dependencies** — no `npm install`, no lockfile, no supply chain to audit. For a public-sector repo that is worth more than the convenience of a token framework.

**Commands**

| Command | Does |
|---|---|
| `npm run build` | Regenerate every platform output |
| `npm run validate` | 100 WCAG 2.1 and integrity checks; exits non-zero on failure |
| `npm run check` | Both. Use in CI. |

**The validator enforces this document.** It checks every theme and semantic pairing against §1.4.3 AA, confirms the maize rule in §4.5 still holds, detects token drift, and flags any pairing that passes within 10% of its threshold — which is the exact shape of the `aloe-lt` defect in §4.6.2. A rule that is not in `scripts/validate-tokens.mjs` is a rule that will be broken.

## Appendix B — key sources

- MyMzansi: `mymzansi.gov.za` — roadmap, resources, design system, live token values
- South Africa Digital Transformation Roadmap, May 2025 (Operation Vulindlela Phase II)
- Open Cities Lab: product thinking, design ethos, "one-touch government", the streetlight critique
- WCAG 2.1 (W3C Recommendation)
- Constitution Eighteenth Amendment Act, 2023 — South African Sign Language
- UNDP DPI Safeguards — adopted by the MyMzansi roadmap
- Material Symbols (Apache-2.0)
- W3C Design Tokens Community Group format specification
