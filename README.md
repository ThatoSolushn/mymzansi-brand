# MyMzansi — design system

The colours, type, spacing, icons and motion for a South African government
services app — plus the reasoning for each decision, and automated checks that
stop the system quietly breaking.

📖 **[Read the documentation →](https://thatosolushn.github.io/mymzansi-brand/)**

> **This is unofficial concept work.** It is not endorsed by, or connected to,
> the Presidency's Digital Services Unit or any part of the South African
> government. Values marked `EXISTING` in `BRAND.md` were read from the live
> mymzansi.gov.za stylesheet; everything else is proposed.

---

## What is in here

One file, `tokens.json`, holds every colour, size, spacing step, icon and
animation timing. Everything else is generated from it.

That matters because it means the documentation, the website, the app and the
stylesheets cannot drift apart. Change a colour in one place and every output
updates together. There is no second copy to forget.

| File | What it is |
|---|---|
| `tokens.json` | **The source of truth.** Every value lives here. Edit only this. |
| `BRAND.md` | How things should look and behave, and *why* — including the full contrast audit. |
| `REQUIREMENTS.md` | What the product must do — 147 requirements, each with a testable description. |
| `COMPONENTS.md` | Each component: its variants, its states, and working code. |
| `docs/` | The generated documentation website. |
| `dist/` | The generated files apps actually import. |

`dist/` and `docs/` are committed on purpose, so a designer or another team can
use them without installing anything.

---

## Running it

You need [Node.js](https://nodejs.org). There is nothing to install — the
scripts use no external packages at all.

```bash
npm run check
```

That rebuilds everything and runs all the checks. Use it before committing.

| Command | What it does |
|---|---|
| `npm run build` | Regenerates the files apps import, into `dist/` |
| `npm run site` | Regenerates the documentation website, into `docs/` |
| `npm run docs` | Regenerates the token list as Markdown |
| `npm run validate` | Runs 107 automated checks. Fails loudly if anything breaks |
| `npm run check` | All of the above |

---

## The documentation website

**[thatosolushn.github.io/mymzansi-brand](https://thatosolushn.github.io/mymzansi-brand/)**

This is the thing to send someone. It covers colour, typography, language,
spacing, icons, motion, accessibility and writing, plus a searchable list of
every value in the system.

Two things about it are deliberate:

Every number on the site is calculated from `tokens.json` when it is built, so
the documentation cannot describe a system that no longer exists.

Its own styling is generated from the same values, so the site is an example of
the design system rather than a description of one.

It also loads nothing from anywhere else — no fonts, no analytics, no tracking.
It holds to the same budget it asks of the app.

*Published from the `main` branch, `/docs` folder, via GitHub Pages.*

---

## Changing something

1. Edit `tokens.json`. Add a short note saying why.
2. Run `npm run check`.
3. Fix anything it flags before committing.
4. Commit `tokens.json` **and** the regenerated `dist/` and `docs/`.

---

## What the checks catch

The 107 checks are mostly about **contrast** — whether text is actually legible
against the background behind it. These are calculated, not eyeballed, because
colours that look fine on a designer's monitor routinely fail on a cheap phone
in daylight.

They also catch: values that point at something that no longer exists, the same
colour defined twice under different names, and combinations that pass but only
just.

**That last one matters more than it sounds.** The system flags any pairing
within 10% of the limit. The reason is a real defect documented in `BRAND.md`
§4.6.2: one green measured 5.00:1 on pure white and 4.36:1 on a slightly warm
white. It looked fine, it passed, and it broke the moment the background
changed. Anything sitting that close to the edge is one small decision away
from failing.

Three warnings are currently known and accepted — they are listed in the
validator output with the reasoning.

### What the checks cannot catch

Worth being honest about, because these are still open:

- **Colour blindness.** Green versus ochre is the pairing most at risk.
- **Readability in direct sunlight** on an inexpensive screen.
- **Whether the typeface covers all twelve official languages**, including the
  click letters `ǀ ǁ ǂ ǃ` and Tshivenda's marked letters.
- **Whether any of the writing is correct.** All non-English wording in the
  prototype is placeholder and needs a native speaker.

---

## For developers using it

Import the generated files rather than copying values out of them.

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
```

Use the `--theme-*` names, not the raw palette names. Theme names automatically
resolve to the right value in light and dark mode; raw palette names do not.

Light and dark work like this: by default the system follows the device
setting. Setting `data-theme="light"` or `data-theme="dark"` on the page
overrides it. Leaving it off is the normal case.

The same values ship for other platforms too — Swift, Kotlin, Dart and a
Tailwind config, all in `dist/`.

---

## For AI agents

**Read `BRAND.md` §0 and `REQUIREMENTS.md` §0 before generating anything.**

`REQUIREMENTS.md` says what must exist. `BRAND.md` says how it must look and
behave. Both apply, and `BRAND.md` §0 lists twelve rules phrased as MUST or
MUST NOT. The three broken most often:

- **R1** — never write a colour, size, spacing value or duration directly.
  Reference a named value.
- **R2** — maize (`#FBC549`) is a background only, never text, an icon or a
  border on a light surface. It measures 1.44:1 there. See §4.5.
- **R4** — never use fixed-width containers for text that gets translated.
  Nguni languages routinely run about twice the length of English, in words
  that cannot be broken. See §5.5.

Read `tokens.json` directly. Do not parse the generated CSS.

---

## Why it is built this way

Plain files in Git, rather than a hosted design-system product:

- **Nothing is locked inside someone else's account.** A design system you
  cannot export is a liability.
- **It works in GitLab**, which the MyMzansi programme uses.
- **AI agents can read it directly** — it is just text, with no login.
- **It is free and anyone can audit it**, which matters for public money.

The generator is about 30KB of plain Node with no dependencies. That means no
install step, no lockfile, and nothing to audit for security. A larger team or
more output formats would justify a proper tool like Style Dictionary; until
then, depending on nothing is the stronger position for public-sector code.
