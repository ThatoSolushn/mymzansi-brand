# MyMzansi Components

The component library built on the [tokens](tokens.json). This file is the
**source of truth** for the components: what each one is, its variants and
states, the accessibility contract that travels with it, and where the code
lives on each platform. [BRAND.md §9](BRAND.md) holds the *rationale* these
components implement; this file holds the *contract*.

> **Unofficial concept work.** Not endorsed by or affiliated with the
> Presidency's Digital Services Unit or any organ of the South African state.
> Any organisation named in an example (e.g. "ABC Bank") is invented.

---

## Status

**Phase 1 — 14 primitives.** Shipped for **web**; the **React Native** set
carries the same primitives and variant vocabulary.

| Platform | Stack | Icons | Location | Browse |
|---|---|---|---|---|
| Web | React + Tailwind v4 + Radix | Fluent (`@fluentui/react-icons`) | `packages/web/src/components/ui` | Storybook |
| React Native | Expo (SDK 54) + Reanimated | MaterialCommunityIcons (Fluent pending) | `mymzansi-app/components` | `/dev-components` route |

Icons are referenced by a MyMzansi name (see [the Icons page](https://thatosolushn.github.io/mymzansi-brand/icons/)); on web an `Icon` wrapper maps that name to the Fluent component, so components never name a raw glyph.

The two libraries deliberately share one variant vocabulary, so a design
reviewed on one platform reads the same on the other. Where an API differs,
it is noted per component below.

---

## The rules every component obeys

These are not per-component choices; they are load-bearing across the library.

1. **Tokens, never literals (R1).** Components reference **theme** and
   **semantic** tokens — never `color.palette.*` directly. A green button and a
   green success message must stay separable, or the user cannot learn what
   green means. On web this is Tailwind classes bound to CSS custom properties;
   on RN it is `useTheme()`. Both resolve light and dark with no per-theme
   branching in the component.
2. **Depth from surface, not shadow.** Cards and controls lift by a border and
   a surface change. Shadows are paint-heavy on the target device (an
   entry-level Android on 2G/3G), so they are the exception, never the default.
3. **Motion is transform + opacity only (R5),** timed from the `motion` tokens
   (durations, `standard`/`overshoot`/`exit` easings, a 300 ms stagger cap) —
   never a framework default. Web uses CSS transitions/Radix; RN uses
   Reanimated.
4. **Reduced motion is first-class (R9).** Every animated component honours the
   OS reduced-motion setting with identical content and outcome and no
   movement — not a degraded fallback. Web: a global `prefers-reduced-motion`
   rule collapses transitions. RN: `useReducedMotion()` pins the animation.
5. **Never colour alone (R3).** Every stateful control carries its meaning in a
   word, a glyph, or an accessibility role/state — colour only reinforces.
6. **Targets ≥ 44px (R8),** 48px where an action is destructive or adjacent.
7. **Labels wrap, never truncate (R4).** isiZulu runs ~2× English; a clipped
   label is a defect.

---

## Availability

`✓` shipped · `~` in progress (specified, building)

| Component | Web | RN | What it is |
|---|:--:|:--:|---|
| [Button](#button) | ✓ | ✓ | Five variants; the primary action control |
| [Card](#card) | ✓ | ✓ | A surface that lifts by border + fill, not shadow |
| [Input / TextField](#input--textfield) | ✓ | ✓ | Labelled text field; web has an error state |
| [Badge](#badge) | ✓ | ✓ | A small pill whose text carries the meaning |
| [StatusRow](#statusrow) | ✓ | ✓ | A left status rail instead of an icon circle |
| [Section](#section) | ✓ | ✓ | A section heading — deliberately not uppercase |
| [Sheet](#sheet) | ✓ | ✓ | The one bottom-sheet idiom |
| [Switch](#switch) | ✓ | ✓ | A real toggle |
| [Checkbox](#checkbox) | ✓ | ✓ | A single opt-in |
| [Radio / RadioGroup](#radio--radiogroup) | ✓ | ✓ | One choice among several |
| [Divider](#divider) | ✓ | ✓ | A hairline rule |
| [Avatar](#avatar) | ✓ | ✓ | Initials-first identity |
| [Skeleton](#skeleton) | ✓ | ✓ | A content-shaped loading placeholder |
| [EmptyState](#emptystate) | ✓ | ✓ | An empty view with a concrete next action |

---

## Button

Five variants — one filled primary per screen, and a destructive treatment
held for irreversible actions (BRAND.md §9.2). Depth is carried by colour; the
press animates transform + opacity only.

**Variants:** `primary` · `secondary` · `plain` · `destructive` ·
`destructive-outline`

**States:** default, hover (web), pressed (spring), disabled.

**Accessibility:** ≥44px target (48px for both destructive variants); label
wraps, never truncates; focus is always visible; the optional trailing icon is
hidden from assistive tech.

```tsx
// Web
<Button variant="primary">Continue</Button>
<Button variant="destructive-outline" trailingIcon="logout">Sign out</Button>

// React Native — same variants; trailingIcon is a MaterialCommunityIcons name
<Button label="Continue" variant="primary" />
<Button label="Sign out" variant="destructive-outline" trailingIcon="logout" />
```

The trailing icon sits in its own nested chip (the "button-in-button"
treatment) — kept where it reads as a forward action, dropped where it would be
decoration.

## Card

A card lifts off the ground by a surface change and a hairline border, not a
drop shadow (BRAND.md §9.1). The canonical "a request came to you" surface.

**Anatomy (web):** `Card` › `CardEyebrow`, `CardTitle`, `CardDescription`,
`CardMeta`, `CardFooter`. **Accessibility:** heading + description are real
text; nothing conveyed by fill alone.

```tsx
<Card>
  <CardEyebrow>Waiting for you</CardEyebrow>
  <CardTitle>ABC Bank wants to check your details</CardTitle>
  <CardDescription>To open a cheque account</CardDescription>
  <CardMeta>Asked 4 minutes ago</CardMeta>
  <CardFooter>
    <Button variant="primary" trailingIcon="arrow_forward">Look at this request</Button>
  </CardFooter>
</Card>
```

RN composes the same parts from `Card` + `Text` variants.

## Input / TextField

Label above the field, sunk fill, hairline border. **Web (`Input`)** adds an
error state, linked with `aria-describedby` and announced via `role="alert"`,
with the border turning critical to reinforce it. **RN (`TextField`)** ships
the labelled field; a matching error state is the tracked next step so the two
converge.

```tsx
// Web
<Input label="ID number" placeholder="13 digits" />
<Input label="Passport number" error="This field is required" />

// React Native
<TextField value={id} onChangeText={setId} label="ID number" placeholder="13 digits" />
```

**Accessibility:** the label is tied to the field; never a placeholder standing
in for a label.

## Badge

Colour reinforces, never informs alone (R3): the label text always carries the
meaning.

**Tones:** `neutral` · `good` · `limit`. The `limit` tone uses maize as a bright
ground with dark ink on top (R2), pinned to dark ink in **both** themes so it
never becomes a pale-on-yellow pairing (8.9:1).

```tsx
<Badge tone="good">Visa approved</Badge>   // web
<Badge label="Visa approved" tone="good" /> // RN
```

## StatusRow

A coloured left rail replaces the icon circle in lists (BRAND.md §9.1): faster
to scan, no icon that means different things across twelve language
communities, cheap to render down a long list.

**States:** `allowed` · `restricted` · `attention` · `neutral`. The state is
always named in words, and a restricted row always states its reason
(FR-F3-07).

```tsx
<StatusRow title="Check your grant payment" state="allowed" />
<StatusRow title="Share your ID with a bank"
  detail="Because money can be moved with it" state="restricted" />
```

## Section

A section heading, **deliberately not uppercase** — uppercase text is
measurably harder for dyslexic and lower-literacy readers, because word-shape
recognition breaks when every letter is the same height. Hierarchy comes from
size. An optional `tone` shows as a small dot beside the heading, never by
recolouring the line.

```tsx
<Section label="You can do these now" tone="good">{/* rows */}</Section>
```

## Sheet

The one bottom-sheet idiom — factored out of the menu and the language picker,
which each hand-rolled it. **Web** is built on Radix Dialog (focus trap,
Escape-to-close, scroll lock); **RN** uses the platform Modal + Reanimated. The
entrance animates translateY + opacity on the `slow` token; exit runs shorter;
both honour reduced motion.

```tsx
// Web
<Sheet>
  <SheetTrigger asChild><Button variant="secondary">Open menu</Button></SheetTrigger>
  <SheetContent>
    <SheetTitle>Menu</SheetTitle>
    <SheetDescription>Profile, settings and sign out, from one place.</SheetDescription>
  </SheetContent>
</Sheet>

// React Native — controlled
<Sheet open={open} onClose={close} title="Menu">{/* items */}</Sheet>
```

## Switch

A real toggle. The thumb springs across on transform only; the track colour
carries the on/off state, but `role="switch"` + checked state means the meaning
never rests on colour alone.

```tsx
<Switch checked={on} onCheckedChange={setOn} />              // web (Radix)
<Switch value={on} onValueChange={setOn} label="Notifications" /> // RN
```

## Checkbox

A single opt-in — e.g. "share these details this once". The checked state is a
tick **glyph**, not colour alone.

```tsx
<Checkbox checked={agreed} onCheckedChange={setAgreed} />  // web (Radix)
<Checkbox checked={agreed} onChange={setAgreed} label="Share once" /> // RN
```

## Radio / RadioGroup

One choice among several. Pair each with a visible label — the label carries the
meaning; the ring only reinforces the selection. **Web** groups items in a
Radix `RadioGroup`; **RN** ships a single `Radio` the screen composes into a
group (formalizing the visa-reason picker pattern).

```tsx
// Web
<RadioGroup defaultValue="tourism">
  <label><RadioGroupItem value="tourism" /> Tourism</label>
  <label><RadioGroupItem value="business" /> Business</label>
</RadioGroup>

// React Native
<Radio selected={reason === 'tourism'} onSelect={() => setReason('tourism')} label="Tourism" />
```

## Divider

One hairline rule, factored out of the components that each drew their own. A
native separator, so its meaning reaches assistive technology.

```tsx
<Divider />
```

## Avatar

Initials-first, not photo-first — a name is more reliably present than a
picture, and the content model here is text-first. Formalizes the ad hoc
initials square the Wallet screen invented inline.

**Sizes:** `sm` · `md` · `lg`.

```tsx
<Avatar initials="TK" size="md" />
```

## Skeleton

A loading placeholder shaped like the content it stands in for — not a spinner.
Fill is the **border** token, **not** `surfaceSunk`: in dark mode surfaceSunk is
identical to `bg` by design, so a skeleton drawn in it would be invisible. The
shimmer is an opacity pulse (R5) that stops entirely under reduced motion,
holding a static, legible fill.

```tsx
<Skeleton className="h-4 w-3/4" />       // web
<Skeleton width="75%" />                 // RN
```

## EmptyState

A composed empty view with a concrete next action — never a dead end (R11). The
icon is decorative; the action is a real, labelled control, because an empty
state that only says "nothing here" leaves the person stuck.

```tsx
<EmptyState
  icon="inbox"
  title="No documents yet"
  description="Documents you're issued will show up here."
  action={{ label: 'Learn how to get your first ID' }}
/>
```

RN takes the same shape; `icon` is a MaterialCommunityIcons name and `action`
carries an `onPress`.

---

## Browsing the components

- **Web:** Storybook in `packages/web` — every variant, state and theme, with
  the accessibility notes inline in each story.
- **React Native:** the `/dev-components` route in `mymzansi-app` — a dev-only
  catalogue that renders every primitive in every state in the live app
  runtime, in both themes. It is linked from no user-facing screen. (An
  on-device `@storybook/react-native` UI is a possible future addition; it
  needs a connected device to render and swaps the app entry point, so the
  in-runtime catalogue is the primary surface for now.)
- **Live docs:** the [design system site](https://thatosolushn.github.io/mymzansi-brand/components/)
  renders each component with a token-painted example, a description, and a code
  example.

## What is next

Above the primitives sit **templates** (whole screens assembled from
components — a consent surface, an assurance-failure path, a device-recovery
flow), then the **Figma library** kept in step via Tokens Studio. See the
[roadmap](https://thatosolushn.github.io/mymzansi-brand/roadmap/).
