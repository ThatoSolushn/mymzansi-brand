/**
 * The identity mark.
 *
 * MyMzansi's official logo (mymzansi.gov.za) draws a fingerprint as concentric
 * dashed arcs, shaped into the silhouette of South Africa, cycling through the
 * flag palette, under the line "One person, one government, one touch." It is
 * a genuinely good mark: it fuses biometric identity with the nation in one
 * image. We do not reproduce that asset here — it is a specific, owned,
 * trademarked mark of a distinct government initiative, not ours to reuse.
 *
 * What we take is the METHOD, consistent with BRAND.md §2.2 ("structure over
 * motif"): concentric dashed arcs as a visual shorthand for identity. Rendered
 * in our own corrected, accessible tokens rather than raw flag colour or their
 * silhouette, so it reads as a companion mark rather than an impersonation.
 *
 * Three variants, each with a colour rule tied to a specific audited contrast
 * number rather than picked by eye:
 *
 *   markTri()   Content contexts (hero, guideline figure). Three rings, using
 *               var(--accent)/var(--warm)/var(--anchor) — all already verified
 *               AA or better against both page grounds (guidelines/colour/).
 *               Theme-reactive: swaps automatically with light/dark, for free,
 *               because it's built from the same CSS custom properties the
 *               rest of the site uses.
 *
 *   markMono()  Masthead. The masthead background is always deep indigo
 *               (anchor-fill is deliberately the same dark value in both
 *               themes — BRAND.md's fix for the header-inversion defect), so
 *               a multi-hue ring set tuned for a page ground would not read
 *               here. Single colour, var(--maize), which is 8.93:1 on indigo
 *               (guidelines/colour/#maize) — the one place maize is used as a
 *               mark rather than a ground, and it is safe here specifically
 *               because the background never changes.
 *
 *   faviconHref()  Static data URI — favicons cannot read page CSS variables.
 *               Same mono-on-indigo treatment, baked to the light-theme hex
 *               values at build time.
 */
import { val } from './lib.mjs';

function ring({ cx, cy, r, strokeW, colour, dashCount, phase }) {
  const circ = 2 * Math.PI * r;
  const dash = (circ / dashCount) * 0.58;
  const gapLen = circ / dashCount - dash;
  const rotate = (phase * 47) % 360; // irregular per ring — a pinwheel, not a bullseye
  return `<circle cx="${cx}" cy="${cy}" r="${r.toFixed(2)}" fill="none" stroke="${colour}" stroke-width="${strokeW}" stroke-linecap="round" stroke-dasharray="${dash.toFixed(2)} ${gapLen.toFixed(2)}" transform="rotate(${rotate} ${cx} ${cy})"/>`;
}

function rings({ size, count, colours }) {
  const cx = size / 2, cy = size / 2;
  const maxR = size / 2 - Math.max(2, size * 0.045);
  const minR = maxR * 0.34;
  const step = (maxR - minR) / Math.max(1, count - 1);
  const strokeW = Math.max(1.4, size / 30);
  let out = '';
  for (let i = 0; i < count; i++) {
    out += ring({
      cx, cy, r: minR + step * i, strokeW,
      colour: colours[i % colours.length],
      dashCount: 7 + (i % 2),
      phase: i,
    });
  }
  return out;
}

/** Content mark. Theme-reactive via CSS custom properties. */
export function markTri({ size = 120, count = 5, title = 'The MyMzansi design system mark' } = {}) {
  const body = rings({ size, count, colours: ['var(--accent)', 'var(--warm)', 'var(--anchor)'] });
  return `<svg class="mzmark" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img" aria-label="${title.replace(/"/g, '&quot;')}">${body}</svg>`;
}

/** Masthead mark. Fixed mono colour — the background it sits on never themes. */
export function markMono({ size = 30, count = 3 } = {}) {
  const body = rings({ size, count, colours: ['var(--maize)'] });
  return `<svg class="mzmark-mono" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" aria-hidden="true" focusable="false">${body}</svg>`;
}

/** Static favicon — same mono-on-indigo idea, baked to hex (data URIs can't read CSS vars). */
export function faviconHref() {
  const size = 64, r = 10;
  const indigo = val('color.palette.indigo');
  const maize = val('color.palette.maize');
  const body = rings({ size, count: 3, colours: [maize] });
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><rect width="${size}" height="${size}" rx="${r}" fill="${indigo}"/>${body}</svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}
