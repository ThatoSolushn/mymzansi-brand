#!/usr/bin/env node
// Generates CSS, Tailwind, Swift, Kotlin, and Dart token files from tokens.json.
// tokens.json is the single source of truth (see BRAND.md 0.1) — never hand-edit the outputs.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const tokens = JSON.parse(readFileSync(path.join(ROOT, "tokens.json"), "utf8"));

const GENERATED_NOTICE =
  "GENERATED FILE. Do not hand-edit — edit tokens.json and run `node scripts/build-tokens.mjs`.";

// ---------------------------------------------------------------------------
// 1. Flatten the DTCG tree into path -> raw token, tracking inherited $type.
// ---------------------------------------------------------------------------

const raw = new Map(); // "color.palette.ink" -> { value, type, description }

function flatten(node, segments, inheritedType) {
  if (node == null || typeof node !== "object") return;
  const type = node.$type ?? inheritedType;
  if ("$value" in node) {
    raw.set(segments.join("."), {
      value: node.$value,
      type,
      description: node.$description,
    });
    return;
  }
  for (const [key, child] of Object.entries(node)) {
    if (key.startsWith("$")) continue;
    flatten(child, [...segments, key], type);
  }
}

flatten(tokens, [], undefined);

// ---------------------------------------------------------------------------
// 2. Resolve DTCG aliases ({a.b.c}) recursively.
// ---------------------------------------------------------------------------

const REF = /^\{([^}]+)\}$/;

function resolve(value, seen = new Set()) {
  if (typeof value === "string") {
    const m = value.match(REF);
    if (!m) return value;
    const refPath = m[1];
    if (seen.has(refPath)) throw new Error(`Circular token reference: ${refPath}`);
    const target = raw.get(refPath);
    if (!target) throw new Error(`Unresolved token reference: {${refPath}}`);
    return resolve(target.value, new Set(seen).add(refPath));
  }
  if (Array.isArray(value)) return value.map((v) => resolve(v, seen));
  if (value != null && typeof value === "object") {
    const out = {};
    for (const [k, v] of Object.entries(value)) out[k] = resolve(v, seen);
    return out;
  }
  return value;
}

const resolved = new Map(); // path -> { value: resolved, type, description }
for (const [p, t] of raw) {
  resolved.set(p, { value: resolve(t.value), type: t.type, description: t.description });
}

function val(p) {
  const t = resolved.get(p);
  if (!t) throw new Error(`Unknown token path: ${p}`);
  return t.value;
}

function group(prefix) {
  // Returns [name, value][] for every leaf directly under prefix (one level).
  const out = [];
  const seen = new Set();
  for (const p of resolved.keys()) {
    if (!p.startsWith(prefix + ".")) continue;
    const rest = p.slice(prefix.length + 1);
    if (rest.includes(".")) continue; // not a direct child
    if (seen.has(rest)) continue;
    seen.add(rest);
    out.push([rest, val(p)]);
  }
  return out;
}

// ---------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------

const kebabToCamel = (s) => s.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
const kebabToPascal = (s) => {
  const c = kebabToCamel(s);
  return c.charAt(0).toUpperCase() + c.slice(1);
};

// Swift/Kotlin identifiers can't start with a digit (tokens.json has "3xs", "2xs", "2xl").
// Spell the leading count out as repeated 'x' — "2xs" -> "xxs", "3xs" -> "xxxs", "2xl" -> "xxl" —
// matching the "extra extra small/large" reading of the scale.
const safeName = (s) => s.replace(/^(\d+)x([a-z]+)$/, (_, n, suffix) => "x".repeat(Number(n)) + suffix);
const ident = (s) => kebabToCamel(safeName(s));

function hexParts(hex) {
  const h = hex.replace("#", "");
  if (h.length === 6) {
    return { r: h.slice(0, 2), g: h.slice(2, 4), b: h.slice(4, 6), a: "FF" };
  }
  if (h.length === 8) {
    // tokens.json uses RRGGBBAA (CSS 8-digit hex order)
    return { r: h.slice(0, 2), g: h.slice(2, 4), b: h.slice(4, 6), a: h.slice(6, 8) };
  }
  throw new Error(`Unexpected hex colour: ${hex}`);
}

function pxToRem(px, base = 16) {
  const n = parseFloat(px);
  const rem = n / base;
  return `${rem % 1 === 0 ? rem : rem.toFixed(4).replace(/0+$/, "").replace(/\.$/, "")}rem`;
}

function msToSeconds(ms) {
  return parseFloat(ms) / 1000;
}

function quoteFontName(name) {
  return /[^a-zA-Z0-9-]/.test(name) ? `"${name}"` : name;
}

// ---------------------------------------------------------------------------
// gather token groups
// ---------------------------------------------------------------------------

const palette = group("color.palette");
const themeLight = group("color.theme.light");
const themeDark = group("color.theme.dark");
const semantic = group("color.semantic");
const fontFamily = group("font.family");
const fontWeight = group("font.weight");
const typography = group("typography");
const space = group("dimension.space");
const radius = group("dimension.radius");
const touch = group("dimension.touch");
const iconSize = group("dimension.icon");
const rail = group("dimension.rail");
const border = group("dimension.border");
const iconSemantic = group("icon.semantic");
const duration = group("motion.duration");
const easing = group("motion.easing");
const stagger = group("motion.stagger");
const elevation = group("elevation");

// semantic colour pairs that switch with theme (e.g. success / success-dark)
const semanticMap = new Map(semantic);
const semanticPairs = []; // [baseName, lightValue, darkValue]
const semanticStatic = []; // [name, value] with no light/dark pairing
for (const [name, value] of semantic) {
  if (name.endsWith("-dark")) continue;
  const darkName = `${name}-dark`;
  if (semanticMap.has(darkName)) {
    semanticPairs.push([name, value, semanticMap.get(darkName)]);
  } else {
    semanticStatic.push([name, value]);
  }
}

mkdirSync(path.join(ROOT, "dist/js"), { recursive: true });
mkdirSync(path.join(ROOT, "dist/css"), { recursive: true });
mkdirSync(path.join(ROOT, "dist/tailwind"), { recursive: true });
mkdirSync(path.join(ROOT, "dist/swift"), { recursive: true });
mkdirSync(path.join(ROOT, "dist/kotlin"), { recursive: true });
mkdirSync(path.join(ROOT, "dist/dart"), { recursive: true });

// ===========================================================================
// CSS
// ===========================================================================

function buildCss() {
  const lines = [];
  lines.push(`/* ${GENERATED_NOTICE} */`, "");

  lines.push(":root {");
  lines.push("  /* color.palette — theme-invariant primitives. Do not use directly in components; see --theme-* / --semantic-*. */");
  for (const [name, v] of palette) lines.push(`  --color-${name}: ${v};`);
  lines.push("");
  lines.push("  /* font.family */");
  for (const [name, v] of fontFamily) {
    const stack = v.map(quoteFontName).join(", ");
    lines.push(`  --font-${name}: ${stack};`);
  }
  lines.push("");
  lines.push("  /* font.weight */");
  for (const [name, v] of fontWeight) lines.push(`  --font-weight-${name}: ${v};`);
  lines.push("");
  lines.push("  /* dimension.space */");
  for (const [name, v] of space) lines.push(`  --space-${name}: ${v};`);
  lines.push("");
  lines.push("  /* dimension.radius */");
  for (const [name, v] of radius) lines.push(`  --radius-${name}: ${v};`);
  lines.push("");
  lines.push("  /* dimension.touch */");
  for (const [name, v] of touch) lines.push(`  --touch-${name}: ${v};`);
  lines.push("");
  lines.push("  /* dimension.icon */");
  for (const [name, v] of iconSize) lines.push(`  --icon-size-${name}: ${v};`);
  lines.push("");
  lines.push("  /* dimension.rail */");
  for (const [name, v] of rail) lines.push(`  --rail-${name}: ${v};`);
  lines.push("");
  lines.push("  /* dimension.border */");
  for (const [name, v] of border) lines.push(`  --border-${name}: ${v};`);
  lines.push("");
  lines.push("  /* motion.duration */");
  for (const [name, v] of duration) lines.push(`  --duration-${name}: ${v};`);
  lines.push("");
  lines.push("  /* motion.easing */");
  for (const [name, v] of easing) lines.push(`  --ease-${name}: cubic-bezier(${v.join(", ")});`);
  lines.push("");
  lines.push("  /* motion.stagger */");
  for (const [name, v] of stagger) lines.push(`  --stagger-${name}: ${v};`);
  lines.push("");
  lines.push("  /* elevation — offset-x offset-y blur spread color */");
  for (const [name, v] of elevation) {
    lines.push(`  --elevation-${name}: ${v.offsetX} ${v.offsetY} ${v.blur} ${v.spread} ${v.color};`);
  }
  lines.push("");
  lines.push("  /* color.semantic — meaning-carrying. Switches automatically with theme where a -dark variant exists. */");
  for (const [name, lightV] of semanticPairs) lines.push(`  --semantic-${name}: ${lightV};`);
  for (const [name, v] of semanticStatic) lines.push(`  --semantic-${name}: ${v};`);
  lines.push("");
  lines.push("  /* color.theme — light (default) */");
  for (const [name, v] of themeLight) lines.push(`  --theme-${name}: ${v};`);
  lines.push("}");
  lines.push("");

  lines.push("/* Dark theme: follows system preference unless overridden by [data-theme]. */");
  lines.push('@media (prefers-color-scheme: dark) {');
  lines.push('  :root:not([data-theme="light"]) {');
  for (const [name, v] of themeDark) lines.push(`    --theme-${name}: ${v};`);
  for (const [name, , darkV] of semanticPairs) lines.push(`    --semantic-${name}: ${darkV};`);
  lines.push("  }");
  lines.push("}");
  lines.push('');
  lines.push(':root[data-theme="dark"] {');
  for (const [name, v] of themeDark) lines.push(`  --theme-${name}: ${v};`);
  for (const [name, , darkV] of semanticPairs) lines.push(`  --semantic-${name}: ${darkV};`);
  lines.push("}");
  lines.push("");

  lines.push("/* typography — composite type styles. Font sizes are in rem so they scale with OS/browser text-size settings. */");
  for (const [name, v] of typography) {
    lines.push(`.text-${name} {`);
    lines.push(`  font-family: var(--font-${familyVarName(v.fontFamily)});`);
    lines.push(`  font-size: ${pxToRem(v.fontSize)};`);
    lines.push(`  font-weight: ${v.fontWeight};`);
    lines.push(`  line-height: ${v.lineHeight};`);
    if (v.letterSpacing && v.letterSpacing !== "0") lines.push(`  letter-spacing: ${v.letterSpacing};`);
    if (v.textCase === "uppercase") lines.push(`  text-transform: uppercase;`);
    lines.push("}");
  }
  lines.push("");

  return lines.join("\n") + "\n";
}

function familyVarName(resolvedFamilyArray) {
  // Match the resolved font-family array back to its token name (sans/mono).
  for (const [name, v] of fontFamily) {
    if (JSON.stringify(v) === JSON.stringify(resolvedFamilyArray)) return name;
  }
  return "sans";
}

writeFileSync(path.join(ROOT, "dist/css/tokens.css"), buildCss());

// ===========================================================================
// Tailwind config
// ===========================================================================

function buildTailwind() {
  // Palette, semantic, and theme are nested under their own keys (not flattened together):
  // tokens.json forbids referencing palette directly in components, and palette/semantic names
  // collide (both have "info") — flattening would silently let one clobber the other.
  const paletteColorEntries = palette.map(([name]) => [kebabToCamel(name), `var(--color-${name})`]);
  const semanticColorEntries = [
    ...semanticPairs.map(([name]) => [kebabToCamel(name), `var(--semantic-${name})`]),
    ...semanticStatic.map(([name]) => [kebabToCamel(name), `var(--semantic-${name})`]),
  ];
  const themeColorEntries = themeLight.map(([name]) => [kebabToCamel(name), `var(--theme-${name})`]);

  const spacingEntries = [
    ...space.map(([name]) => [name, `var(--space-${name})`]),
    ...touch.map(([name]) => [`touch-${name}`, `var(--touch-${name})`]),
  ];

  const fontSizeEntries = typography.map(([name, v]) => {
    const opts = { lineHeight: v.lineHeight, letterSpacing: v.letterSpacing ?? "0" };
    return [name, [pxToRem(v.fontSize), opts]];
  });

  const jsonish = (v, indent = 2) => JSON.stringify(v, null, indent).replace(/"/g, "'");

  return `// ${GENERATED_NOTICE}
/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
      colors: {
        palette: {
          ${paletteColorEntries.map(([k, v]) => `${k}: '${v}',`).join("\n          ")}
        },
        semantic: {
          ${semanticColorEntries.map(([k, v]) => `${k}: '${v}',`).join("\n          ")}
        },
        theme: {
          ${themeColorEntries.map(([k, v]) => `${k}: '${v}',`).join("\n          ")}
        },
      },
      fontFamily: {
        ${fontFamily.map(([name]) => `${kebabToCamel(name)}: ['var(--font-${name})'],`).join("\n        ")}
      },
      fontWeight: {
        ${fontWeight.map(([name, v]) => `${kebabToCamel(name)}: '${v}',`).join("\n        ")}
      },
      fontSize: {
        ${fontSizeEntries.map(([k, v]) => `${kebabToCamel(k)}: ${jsonish(v, 0).replace(/\n/g, " ")},`).join("\n        ")}
      },
      spacing: {
        ${spacingEntries.map(([k, v]) => `'${k}': '${v}',`).join("\n        ")}
      },
      borderRadius: {
        ${radius.map(([name]) => `${kebabToCamel(name)}: 'var(--radius-${name})',`).join("\n        ")}
      },
      boxShadow: {
        ${elevation.map(([name]) => `${kebabToCamel(name)}: 'var(--elevation-${name})',`).join("\n        ")}
      },
      transitionDuration: {
        ${duration.map(([name, v]) => `${kebabToCamel(name)}: '${v}',`).join("\n        ")}
      },
      transitionTimingFunction: {
        ${easing.map(([name]) => `${kebabToCamel(name)}: 'var(--ease-${name})',`).join("\n        ")}
      },
    },
  },
  plugins: [],
};
`;
}

writeFileSync(path.join(ROOT, "dist/tailwind/tailwind.config.js"), buildTailwind());

// ===========================================================================
// Swift
// ===========================================================================

function swiftColor(hex) {
  const { r, g, b, a } = hexParts(hex);
  const f = (h) => (parseInt(h, 16) / 255).toFixed(4).replace(/0+$/, "").replace(/\.$/, "") || "0";
  return `Color(red: ${f(r)}, green: ${f(g)}, blue: ${f(b)}${a !== "FF" ? `, opacity: ${f(a)}` : ""})`;
}

function buildSwift() {
  const lines = [];
  lines.push(`// ${GENERATED_NOTICE}`);
  lines.push("import SwiftUI", "");

  lines.push("enum MzColor {");
  for (const [name, v] of palette) {
    lines.push(`  static let ${ident(name)} = ${swiftColor(v)}`);
  }
  lines.push("}", "");

  lines.push("/// Meaning-carrying colours. Static — safe to use directly (each already resolves per-theme where relevant).");
  lines.push("enum MzSemanticColor {");
  for (const [name, v] of semanticPairs) lines.push(`  static let ${ident(name)}Light = ${swiftColor(v)}`);
  for (const [name, , dv] of semanticPairs) lines.push(`  static let ${ident(name)}Dark = ${swiftColor(dv)}`);
  for (const [name, v] of semanticStatic) lines.push(`  static let ${ident(name)} = ${swiftColor(v)}`);
  lines.push(
    "",
    "  static func resolved(_ colorScheme: ColorScheme) -> Resolved { colorScheme == .dark ? dark : light }",
    "",
    "  struct Resolved {"
  );
  for (const [name] of semanticPairs) lines.push(`    let ${ident(name)}: Color`);
  lines.push(
    "  }",
    "",
    `  static let light = Resolved(${semanticPairs.map(([n]) => `${ident(n)}: ${ident(n)}Light`).join(", ")})`,
    `  static let dark = Resolved(${semanticPairs.map(([n]) => `${ident(n)}: ${ident(n)}Dark`).join(", ")})`
  );
  lines.push("}", "");

  lines.push("/// Theme-resolved surface/text colours. Components MUST use these (via `MzTheme.current(for:)`), never MzColor directly.");
  lines.push("struct MzTheme {");
  for (const [name] of themeLight) lines.push(`  let ${ident(name)}: Color`);
  lines.push("");
  lines.push(
    `  static let light = MzTheme(${themeLight.map(([n, v]) => `${ident(n)}: ${swiftColor(v)}`).join(", ")})`
  );
  lines.push(
    `  static let dark = MzTheme(${themeDark.map(([n, v]) => `${ident(n)}: ${swiftColor(v)}`).join(", ")})`
  );
  lines.push("");
  lines.push("  static func current(for colorScheme: ColorScheme) -> MzTheme { colorScheme == .dark ? .dark : .light }");
  lines.push("}", "");

  lines.push("// SwiftUI's Font.Weight has no public integer initializer, so the numeric weight scale");
  lines.push("// (font.weight.regular=400 ... black=800) maps onto its named cases explicitly:");
  lines.push("extension Font.Weight {");
  lines.push("  static let mzRegular = Font.Weight.regular");
  lines.push("  static let mzMedium = Font.Weight.medium");
  lines.push("  static let mzSemibold = Font.Weight.semibold");
  lines.push("  static let mzBold = Font.Weight.bold");
  lines.push("  static let mzBlack = Font.Weight.black");
  lines.push("}", "");

  lines.push("/// Composite type styles. Uses Font.custom(relativeTo:) so sizes scale with Dynamic Type.");
  lines.push("enum MzFont {");
  for (const [name, v] of typography) {
    const weightName = swiftWeightFromNumber(v.fontWeight);
    const family = familyVarName(v.fontFamily) === "mono" ? "MzFontFamily.mono" : "MzFontFamily.sans";
    lines.push(
      `  static let ${ident(name)} = Font.custom(${family}, size: ${parseFloat(v.fontSize)}, relativeTo: .body).weight(${weightName})`
    );
  }
  lines.push("}", "");
  lines.push("enum MzFontFamily {");
  for (const [name, v] of fontFamily) {
    lines.push(`  static let ${ident(name)} = "${v[0]}" // full fallback stack: ${v.join(", ")}`);
  }
  lines.push("}", "");

  lines.push("enum MzSpace {");
  for (const [name, v] of space) lines.push(`  static let ${ident(name)}: CGFloat = ${parseFloat(v)}`);
  lines.push("}", "");

  lines.push("enum MzRadius {");
  for (const [name, v] of radius) lines.push(`  static let ${ident(name)}: CGFloat = ${parseFloat(v)}`);
  lines.push("}", "");

  lines.push("enum MzTouch {");
  for (const [name, v] of touch) lines.push(`  static let ${ident(name)}: CGFloat = ${parseFloat(v)}`);
  lines.push("}", "");

  lines.push("enum MzIconSize {");
  for (const [name, v] of iconSize) lines.push(`  static let ${ident(name)}: CGFloat = ${parseFloat(v)}`);
  lines.push("}", "");

  lines.push("/// Fluent UI System Icons glyph names (see BRAND.md §6). Render the matching SVG asset.");
  lines.push("enum MzIcon {");
  for (const [name, v] of iconSemantic) lines.push(`  static let ${ident(name)} = "${v}"`);
  lines.push("}", "");

  lines.push("enum MzDuration {");
  for (const [name, v] of duration) lines.push(`  static let ${ident(name)}: TimeInterval = ${msToSeconds(v)}`);
  lines.push("}", "");

  lines.push("/// Cubic-bezier control points (x1, y1, x2, y2). Feed into Animation.timingCurve(_:_:_:_:duration:).");
  lines.push("enum MzEasing {");
  for (const [name, v] of easing) {
    lines.push(`  static let ${ident(name)}: (Double, Double, Double, Double) = (${v.join(", ")})`);
  }
  lines.push("}", "");

  lines.push("struct MzElevation {");
  lines.push("  let offsetX: CGFloat; let offsetY: CGFloat; let blur: CGFloat; let color: Color");
  for (const [name, v] of elevation) {
    lines.push(
      `  static let ${ident(name)} = MzElevation(offsetX: ${parseFloat(v.offsetX)}, offsetY: ${parseFloat(
        v.offsetY
      )}, blur: ${parseFloat(v.blur)}, color: ${swiftColor(v.color)})`
    );
  }
  lines.push("}", "");

  return lines.join("\n") + "\n";
}

function swiftWeightFromNumber(n) {
  const map = { 400: ".mzRegular", 500: ".mzMedium", 600: ".mzSemibold", 700: ".mzBold", 800: ".mzBlack" };
  return map[n] ?? ".regular";
}

writeFileSync(path.join(ROOT, "dist/swift/MzTokens.swift"), buildSwift());

// ===========================================================================
// Kotlin (Jetpack Compose)
// ===========================================================================

function kotlinColor(hex) {
  const { r, g, b, a } = hexParts(hex);
  return `Color(0x${a.toUpperCase()}${r.toUpperCase()}${g.toUpperCase()}${b.toUpperCase()})`;
}

function buildKotlin() {
  const lines = [];
  lines.push(`// ${GENERATED_NOTICE}`);
  lines.push("package org.mymzansi.tokens", "");
  lines.push("import androidx.compose.animation.core.CubicBezierEasing");
  lines.push("import androidx.compose.ui.graphics.Color");
  lines.push("import androidx.compose.ui.text.TextStyle");
  lines.push("import androidx.compose.ui.text.font.FontFamily");
  lines.push("import androidx.compose.ui.text.font.FontWeight");
  lines.push("import androidx.compose.ui.unit.dp");
  lines.push("import androidx.compose.ui.unit.sp");
  lines.push("import androidx.compose.ui.unit.em", "");

  lines.push("object MzColor {");
  for (const [name, v] of palette) lines.push(`  val ${ident(name)} = ${kotlinColor(v)}`);
  lines.push("}", "");

  lines.push("/** Meaning-carrying colours. Prefer `MzSemanticColor.current(darkTheme)` over reading Light/Dark directly. */");
  lines.push("object MzSemanticColor {");
  for (const [name, v] of semanticPairs) lines.push(`  val ${ident(name)}Light = ${kotlinColor(v)}`);
  for (const [name, , dv] of semanticPairs) lines.push(`  val ${ident(name)}Dark = ${kotlinColor(dv)}`);
  for (const [name, v] of semanticStatic) lines.push(`  val ${ident(name)} = ${kotlinColor(v)}`);
  lines.push("");
  lines.push("  data class Resolved(");
  for (const [name] of semanticPairs) lines.push(`    val ${ident(name)}: Color,`);
  lines.push("  )", "");
  lines.push(
    `  val Light = Resolved(${semanticPairs.map(([n]) => `${ident(n)} = ${ident(n)}Light`).join(", ")})`
  );
  lines.push(
    `  val Dark = Resolved(${semanticPairs.map(([n]) => `${ident(n)} = ${ident(n)}Dark`).join(", ")})`
  );
  lines.push("  fun current(darkTheme: Boolean) = if (darkTheme) Dark else Light");
  lines.push("}", "");

  lines.push("/** Theme-resolved surface/text colours. Components MUST use `MzTheme.current()`, never MzColor directly. */");
  lines.push("data class MzTheme(");
  for (const [name] of themeLight) lines.push(`  val ${ident(name)}: Color,`);
  lines.push(") {");
  lines.push("  companion object {");
  lines.push(
    `    val Light = MzTheme(${themeLight.map(([n, v]) => `${ident(n)} = ${kotlinColor(v)}`).join(", ")})`
  );
  lines.push(
    `    val Dark = MzTheme(${themeDark.map(([n, v]) => `${ident(n)} = ${kotlinColor(v)}`).join(", ")})`
  );
  lines.push("    fun current(darkTheme: Boolean) = if (darkTheme) Dark else Light");
  lines.push("  }");
  lines.push("}", "");

  lines.push("object MzFontFamily {");
  lines.push("  // Swap FontFamily.Default for a FontFamily(Font(R.font.montserrat...)) once the face is bundled.");
  for (const [name] of fontFamily) lines.push(`  val ${ident(name)} = FontFamily.Default`);
  lines.push("}", "");

  lines.push("/** Composite type styles. Font sizes are in sp so they scale with the system font-size setting. */");
  lines.push("object MzFont {");
  for (const [name, v] of typography) {
    const family = familyVarName(v.fontFamily) === "mono" ? "MzFontFamily.mono" : "MzFontFamily.sans";
    const letterSpacing =
      v.letterSpacing && v.letterSpacing !== "0" ? `${parseFloat(v.letterSpacing)}.em` : "0.em";
    const lineHeightSp = Math.round(parseFloat(v.fontSize) * parseFloat(v.lineHeight) * 100) / 100;
    lines.push(
      `  val ${ident(name)} = TextStyle(fontFamily = ${family}, fontSize = ${parseFloat(
        v.fontSize
      )}.sp, fontWeight = FontWeight(${v.fontWeight}), lineHeight = ${lineHeightSp}.sp, letterSpacing = ${letterSpacing})`
    );
  }
  lines.push("}", "");

  lines.push("object MzSpace {");
  for (const [name, v] of space) lines.push(`  val ${ident(name)} = ${parseFloat(v)}.dp`);
  lines.push("}", "");

  lines.push("object MzRadius {");
  for (const [name, v] of radius) lines.push(`  val ${ident(name)} = ${parseFloat(v)}.dp`);
  lines.push("}", "");

  lines.push("object MzTouch {");
  for (const [name, v] of touch) lines.push(`  val ${ident(name)} = ${parseFloat(v)}.dp`);
  lines.push("}", "");

  lines.push("object MzIconSize {");
  for (const [name, v] of iconSize) lines.push(`  val ${ident(name)} = ${parseFloat(v)}.dp`);
  lines.push("}", "");

  lines.push("/** Fluent UI System Icons glyph names (see BRAND.md §6). */");
  lines.push("object MzIcon {");
  for (const [name, v] of iconSemantic) lines.push(`  const val ${ident(name)} = "${v}"`);
  lines.push("}", "");

  lines.push("object MzDuration {");
  for (const [name, v] of duration) lines.push(`  const val ${ident(name)}Ms = ${parseInt(v)}`);
  lines.push("}", "");

  lines.push("object MzEasing {");
  for (const [name, v] of easing) {
    lines.push(
      `  val ${ident(name)} = CubicBezierEasing(${v[0]}f, ${v[1]}f, ${v[2]}f, ${v[3]}f)`
    );
  }
  lines.push("}", "");

  lines.push("data class MzElevationSpec(val offsetXDp: Float, val offsetYDp: Float, val blurDp: Float, val color: Color)");
  lines.push("object MzElevation {");
  for (const [name, v] of elevation) {
    lines.push(
      `  val ${ident(name)} = MzElevationSpec(${parseFloat(v.offsetX)}f, ${parseFloat(v.offsetY)}f, ${parseFloat(
        v.blur
      )}f, ${kotlinColor(v.color)})`
    );
  }
  lines.push("}", "");

  return lines.join("\n") + "\n";
}

writeFileSync(path.join(ROOT, "dist/kotlin/MzTokens.kt"), buildKotlin());

// ===========================================================================
// Dart (Flutter)
// ===========================================================================

function dartColor(hex) {
  const { r, g, b, a } = hexParts(hex);
  return `Color(0x${a.toUpperCase()}${r.toUpperCase()}${g.toUpperCase()}${b.toUpperCase()})`;
}

// CSS letter-spacing is in em; Flutter's TextStyle.letterSpacing wants logical pixels.
function letterSpacingPx(letterSpacingEm, fontSizePx) {
  if (!letterSpacingEm || letterSpacingEm === "0") return 0;
  return Math.round(parseFloat(letterSpacingEm) * parseFloat(fontSizePx) * 1000) / 1000;
}

// CSS generic families ("system-ui", "sans-serif", "ui-monospace", …) are a browser concept.
// Flutter's font resolver matches real family names only and silently drops the rest, so a stack
// led by "ui-monospace" resolves to nothing. Strip them from the Dart stack, same as the
// letter-spacing conversion above: the pipeline does the platform transform, not the consumer.
const CSS_GENERIC_FAMILIES = new Set([
  "system-ui",
  "-apple-system",
  "ui-monospace",
  "ui-sans-serif",
  "ui-serif",
  "sans-serif",
  "serif",
  "monospace",
  "cursive",
  "fantasy",
]);

function dartFontStack(families) {
  const out = families.filter((f) => !CSS_GENERIC_FAMILIES.has(f));
  if (out.length === 0) throw new Error(`Font stack has no real family for Flutter: ${families.join(", ")}`);
  return out;
}

function buildDart() {
  const lines = [];
  lines.push(`// ${GENERATED_NOTICE}`);
  lines.push("import 'package:flutter/material.dart';", "");

  lines.push("class MzColor {");
  lines.push("  MzColor._();");
  for (const [name, v] of palette) lines.push(`  static const ${ident(name)} = ${dartColor(v)};`);
  lines.push("}", "");

  lines.push("/// Meaning-carrying colours. Prefer `MzSemanticColor.current(brightness)` over reading Light/Dark directly.");
  lines.push("class MzSemanticColor {");
  lines.push("  MzSemanticColor._();");
  for (const [name, v] of semanticPairs) lines.push(`  static const ${ident(name)}Light = ${dartColor(v)};`);
  for (const [name, , dv] of semanticPairs) lines.push(`  static const ${ident(name)}Dark = ${dartColor(dv)};`);
  for (const [name, v] of semanticStatic) lines.push(`  static const ${ident(name)} = ${dartColor(v)};`);
  lines.push("");
  lines.push(
    `  static const light = MzSemanticColorResolved(${semanticPairs
      .map(([n]) => `${ident(n)}: ${ident(n)}Light`)
      .join(", ")});`
  );
  lines.push(
    `  static const dark = MzSemanticColorResolved(${semanticPairs
      .map(([n]) => `${ident(n)}: ${ident(n)}Dark`)
      .join(", ")});`
  );
  lines.push(
    "  static MzSemanticColorResolved current(Brightness brightness) => brightness == Brightness.dark ? dark : light;"
  );
  lines.push("}", "");

  lines.push("class MzSemanticColorResolved {");
  lines.push(
    `  const MzSemanticColorResolved({${semanticPairs.map(([n]) => `required this.${ident(n)}`).join(", ")}});`
  );
  for (const [name] of semanticPairs) lines.push(`  final Color ${ident(name)};`);
  lines.push("");
  lines.push("  /// Field-wise interpolation, so a light/dark swap can animate instead of jumping.");
  lines.push(
    "  static MzSemanticColorResolved lerp(MzSemanticColorResolved a, MzSemanticColorResolved b, double t) =>"
  );
  lines.push(
    `      MzSemanticColorResolved(${semanticPairs
      .map(([n]) => `${ident(n)}: Color.lerp(a.${ident(n)}, b.${ident(n)}, t)!`)
      .join(", ")});`
  );
  lines.push("}", "");

  lines.push("/// Theme-resolved surface/text colours. Components MUST use `MzTheme.current()`, never MzColor directly.");
  lines.push("class MzTheme {");
  lines.push(`  const MzTheme({${themeLight.map(([n]) => `required this.${ident(n)}`).join(", ")}});`);
  for (const [name] of themeLight) lines.push(`  final Color ${ident(name)};`);
  lines.push("");
  lines.push(
    `  static const light = MzTheme(${themeLight.map(([n, v]) => `${ident(n)}: ${dartColor(v)}`).join(", ")});`
  );
  lines.push(
    `  static const dark = MzTheme(${themeDark.map(([n, v]) => `${ident(n)}: ${dartColor(v)}`).join(", ")});`
  );
  lines.push("");
  lines.push("  static MzTheme current(Brightness brightness) => brightness == Brightness.dark ? dark : light;");
  lines.push("");
  lines.push("  /// Field-wise interpolation, so a light/dark swap can animate instead of jumping.");
  lines.push("  static MzTheme lerp(MzTheme a, MzTheme b, double t) =>");
  lines.push(
    `      MzTheme(${themeLight
      .map(([n]) => `${ident(n)}: Color.lerp(a.${ident(n)}, b.${ident(n)}, t)!`)
      .join(", ")});`
  );
  lines.push("}", "");

  lines.push("/// CSS generic families are stripped — Flutter resolves real family names only.");
  lines.push("class MzFontFamily {");
  lines.push("  MzFontFamily._();");
  for (const [name, v] of fontFamily) {
    const stack = dartFontStack(v);
    lines.push(`  static const ${ident(name)} = '${stack[0]}';`);
    lines.push(`  static const ${ident(name)}Fallback = [${stack.slice(1).map((f) => `'${f}'`).join(", ")}];`);
  }
  lines.push("}", "");

  lines.push(
    "/// Composite type styles. `height` is a unitless multiplier of fontSize, matching CSS line-height."
  );
  lines.push(
    "/// `label` additionally needs its text upper-cased by the caller — TextStyle has no text-transform equivalent."
  );
  lines.push("class MzFont {");
  lines.push("  MzFont._();");
  for (const [name, v] of typography) {
    const family = familyVarName(v.fontFamily) === "mono" ? "mono" : "sans";
    const ls = letterSpacingPx(v.letterSpacing, v.fontSize);
    lines.push(
      `  static const ${ident(name)} = TextStyle(fontFamily: MzFontFamily.${family}, fontFamilyFallback: MzFontFamily.${family}Fallback, fontSize: ${parseFloat(
        v.fontSize
      )}, fontWeight: FontWeight.w${v.fontWeight}, height: ${v.lineHeight}, letterSpacing: ${ls});`
    );
  }
  lines.push("}", "");

  lines.push("class MzSpace {");
  lines.push("  MzSpace._();");
  for (const [name, v] of space) lines.push(`  static const ${ident(name)} = ${parseFloat(v)}.0;`);
  lines.push("}", "");

  lines.push("class MzRadius {");
  lines.push("  MzRadius._();");
  for (const [name, v] of radius) lines.push(`  static const ${ident(name)} = ${parseFloat(v)}.0;`);
  lines.push("}", "");

  lines.push("class MzTouch {");
  lines.push("  MzTouch._();");
  for (const [name, v] of touch) lines.push(`  static const ${ident(name)} = ${parseFloat(v)}.0;`);
  lines.push("}", "");

  lines.push("class MzIconSize {");
  lines.push("  MzIconSize._();");
  for (const [name, v] of iconSize) lines.push(`  static const ${ident(name)} = ${parseFloat(v)}.0;`);
  lines.push("}", "");

  lines.push("/// Left status rail widths (BRAND.md §9.1) — the rail replaces icon circles in lists.");
  lines.push("class MzRail {");
  lines.push("  MzRail._();");
  for (const [name, v] of rail) lines.push(`  static const ${ident(name)} = ${parseFloat(v)}.0;`);
  lines.push("}", "");

  lines.push("class MzBorder {");
  lines.push("  MzBorder._();");
  for (const [name, v] of border) lines.push(`  static const ${ident(name)} = ${parseFloat(v)}.0;`);
  lines.push("}", "");

  lines.push("/// Fluent UI System Icons glyph names (see BRAND.md §6).");
  lines.push("class MzIcon {");
  lines.push("  MzIcon._();");
  for (const [name, v] of iconSemantic) lines.push(`  static const ${ident(name)} = '${v}';`);
  lines.push("}", "");

  lines.push("class MzDuration {");
  lines.push("  MzDuration._();");
  for (const [name, v] of duration) lines.push(`  static const ${ident(name)} = Duration(milliseconds: ${parseInt(v)});`);
  lines.push("}", "");

  lines.push("class MzEasing {");
  lines.push("  MzEasing._();");
  for (const [name, v] of easing) {
    lines.push(`  static const ${ident(name)} = Cubic(${v[0]}, ${v[1]}, ${v[2]}, ${v[3]});`);
  }
  lines.push("}", "");

  lines.push("class MzElevation {");
  lines.push("  MzElevation._();");
  for (const [name, v] of elevation) {
    lines.push(
      `  static const ${ident(name)} = BoxShadow(color: ${dartColor(v.color)}, offset: Offset(${parseFloat(
        v.offsetX
      )}, ${parseFloat(v.offsetY)}), blurRadius: ${parseFloat(v.blur)}, spreadRadius: ${parseFloat(v.spread)});`
    );
  }
  lines.push("}", "");

  return lines.join("\n") + "\n";
}

writeFileSync(path.join(ROOT, "dist/dart/mz_tokens.dart"), buildDart());

// ===========================================================================
// Dart (Flutter) — Material ThemeData binding
// ===========================================================================
//
// mz_tokens.dart is the raw scale. This file binds it to Material, so a Flutter
// consumer gets the brand from `Theme.of(context)` rather than reaching for
// MzColor by hand in every widget (COMPONENTS.md R1: tokens, never literals).
//
// Two halves, because Material's ColorScheme is narrower than the brand:
//   * the slots that DO map (primary, surface, outline, error, …) go into
//     ColorScheme and the component themes;
//   * everything Material has no slot for (surface-sunk, anchor, accent-warm,
//     text-3, the semantic trio) rides along in an MzColors ThemeExtension,
//     which lerps, so a light/dark swap animates.
//
// Component themes encode BRAND.md §9: elevation 0 everywhere (§9.1 — depth is
// a border and a surface change, never a shadow the cheap phone has to paint)
// and 44px minimum targets (R8).
// ---------------------------------------------------------------------------

const themeLightMap = new Map(themeLight);
const themeDarkMap = new Map(themeDark);
const semanticResolvedMap = new Map(semantic);

// A rename in tokens.json should fail the build loudly here, not emit Dart that
// no longer compiles against mz_tokens.dart.
for (const key of [
  "bg", "surface", "surface-sunk", "surface-invert", "text", "text-2", "text-3",
  "text-invert", "border", "accent", "accent-warm", "anchor", "anchor-fill", "on-anchor",
]) {
  if (!themeLightMap.has(key) || !themeDarkMap.has(key)) {
    throw new Error(`color.theme.{light,dark}.${key} is required by the Flutter ThemeData emitter`);
  }
}
for (const key of ["success", "critical", "info", "caution-fill", "on-caution-fill", "restricted"]) {
  if (!semanticResolvedMap.has(key)) {
    throw new Error(`color.semantic.${key} is required by the Flutter ThemeData emitter`);
  }
}

function srgbToLinear(channel) {
  const c = channel / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function relativeLuminance(hex) {
  const { r, g, b } = hexParts(hex);
  const [R, G, B] = [r, g, b].map((h) => srgbToLinear(parseInt(h, 16)));
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

function contrastRatio(a, b) {
  const [hi, lo] = [relativeLuminance(a), relativeLuminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

// Material wants an `onX` for every fill. Rather than eyeball one, take whichever
// of the theme's own two extremes — its text colour and its inverse — scores the
// higher WCAG ratio on that fill. Ties never happen at these values.
function pickOn(fillHex, themeMap) {
  const candidates = [themeMap.get("text"), themeMap.get("text-invert")];
  const scored = candidates.map((c) => ({ hex: c, ratio: contrastRatio(fillHex, c) }));
  scored.sort((a, b) => b.ratio - a.ratio);
  return scored[0];
}

function buildDartTheme() {
  // [dartFieldName, lightFillHex, darkFillHex] for every fill Material has no `on` slot for.
  const onTargets = [
    ["accent", themeLightMap.get("accent"), themeDarkMap.get("accent")],
    ["accentWarm", themeLightMap.get("accent-warm"), themeDarkMap.get("accent-warm")],
    ["success", semanticResolvedMap.get("success"), semanticResolvedMap.get("success-dark")],
    ["critical", semanticResolvedMap.get("critical"), semanticResolvedMap.get("critical-dark")],
    ["info", semanticResolvedMap.get("info"), semanticResolvedMap.get("info-dark")],
  ];

  const onLines = [];
  for (const [name, lightFill, darkFill] of onTargets) {
    const l = pickOn(lightFill, themeLightMap);
    const d = pickOn(darkFill, themeDarkMap);
    onLines.push(`  static const ${name}Light = ${dartColor(l.hex)}; // ${l.ratio.toFixed(2)}:1 on ${lightFill}`);
    onLines.push(`  static const ${name}Dark = ${dartColor(d.hex)}; // ${d.ratio.toFixed(2)}:1 on ${darkFill}`);
  }
  const onFields = onTargets.map(([n]) => n);

  return `// ${GENERATED_NOTICE}
//
// Material binding for the MyMzansi tokens. Use \`MzThemeData.light\` / \`.dark\`
// on MaterialApp; read brand-only colours with \`context.mz\`.
import 'package:flutter/material.dart';

import 'mz_tokens.dart';

/// Foreground colours for the brand fills Material has no \`onX\` slot for.
/// Each is whichever theme extreme (text / text-invert) scores the higher WCAG
/// contrast ratio on that fill — computed at build time, never eyeballed.
class MzOn {
  MzOn._();
${onLines.join("\n")}

  static const light = MzOnResolved(${onFields.map((n) => `${n}: ${n}Light`).join(", ")});
  static const dark = MzOnResolved(${onFields.map((n) => `${n}: ${n}Dark`).join(", ")});
  static MzOnResolved current(Brightness brightness) => brightness == Brightness.dark ? dark : light;
}

class MzOnResolved {
  const MzOnResolved({${onFields.map((n) => `required this.${n}`).join(", ")}});
${onFields.map((n) => `  final Color ${n};`).join("\n")}

  static MzOnResolved lerp(MzOnResolved a, MzOnResolved b, double t) =>
      MzOnResolved(${onFields.map((n) => `${n}: Color.lerp(a.${n}, b.${n}, t)!`).join(", ")});
}

/// The brand colours that do not fit ColorScheme, carried on ThemeData so
/// widgets read them from context instead of importing MzColor directly.
///
/// \`\`\`dart
/// Container(color: context.mz.colors.surfaceSunk)
/// Text('Approved', style: TextStyle(color: context.mz.semantic.success))
/// \`\`\`
@immutable
class MzColors extends ThemeExtension<MzColors> {
  const MzColors({required this.colors, required this.semantic, required this.on});

  /// Surface and text roles for the active brightness.
  final MzTheme colors;

  /// Meaning-carrying colours (success / critical / info) for the active brightness.
  final MzSemanticColorResolved semantic;

  /// Legible foregrounds for [colors] and [semantic] fills.
  final MzOnResolved on;

  static MzColors of(Brightness brightness) => MzColors(
        colors: MzTheme.current(brightness),
        semantic: MzSemanticColor.current(brightness),
        on: MzOn.current(brightness),
      );

  /// Maize ground for the \`limit\` tone. [onCautionFill] (ink) is the only
  /// permitted foreground on it, in both themes — see COMPONENTS.md, Badge.
  Color get cautionFill => MzSemanticColor.cautionFill;
  Color get onCautionFill => MzSemanticColor.onCautionFill;
  Color get cautionText => MzSemanticColor.cautionText;
  Color get restricted => MzSemanticColor.restricted;

  @override
  MzColors copyWith({MzTheme? colors, MzSemanticColorResolved? semantic, MzOnResolved? on}) => MzColors(
        colors: colors ?? this.colors,
        semantic: semantic ?? this.semantic,
        on: on ?? this.on,
      );

  @override
  MzColors lerp(covariant ThemeExtension<MzColors>? other, double t) {
    if (other is! MzColors) return this;
    return MzColors(
      colors: MzTheme.lerp(colors, other.colors, t),
      semantic: MzSemanticColorResolved.lerp(semantic, other.semantic, t),
      on: MzOnResolved.lerp(on, other.on, t),
    );
  }
}

extension MzColorsContext on BuildContext {
  /// Brand colours for the current theme. Falls back to the raw tokens if the
  /// surrounding ThemeData was not built by [MzThemeData], so a widget dropped
  /// into a plain MaterialApp still renders on-brand instead of throwing.
  MzColors get mz {
    final theme = Theme.of(this);
    return theme.extension<MzColors>() ?? MzColors.of(theme.brightness);
  }
}

/// The five button variants of BRAND.md §9.2. ThemeData can only carry one
/// style per button widget, so the variants that do not map to a Material
/// widget (both destructive treatments) are exposed here for call sites.
class MzButtonStyles {
  MzButtonStyles._();

  static ButtonStyle _base(Color background, Color foreground, {BorderSide? side, required double minHeight}) =>
      ButtonStyle(
        backgroundColor: WidgetStatePropertyAll(background),
        foregroundColor: WidgetStatePropertyAll(foreground),
        overlayColor: WidgetStatePropertyAll(foreground.withValues(alpha: 0.08)),
        // §9.1: depth is the fill and the border, never a shadow.
        elevation: const WidgetStatePropertyAll(0),
        shadowColor: const WidgetStatePropertyAll(Color(0x00000000)),
        side: side == null ? null : WidgetStatePropertyAll(side),
        // Height only — width is unconstrained so a label wraps instead of
        // truncating (R4: isiZulu runs ~2x English).
        minimumSize: WidgetStatePropertyAll(Size(0, minHeight)),
        padding: const WidgetStatePropertyAll(
          EdgeInsets.symmetric(horizontal: MzSpace.lg, vertical: MzSpace.sm),
        ),
        textStyle: const WidgetStatePropertyAll(MzFont.bodyEmph),
        shape: const WidgetStatePropertyAll(
          RoundedRectangleBorder(borderRadius: BorderRadius.all(Radius.circular(MzRadius.md))),
        ),
        animationDuration: MzDuration.quick,
      );

  /// One filled primary per screen.
  static ButtonStyle primary(Brightness brightness) {
    final t = MzTheme.current(brightness);
    return _base(t.anchorFill, t.onAnchor, minHeight: MzTouch.min);
  }

  /// Alternatives — transparent, accent border and label.
  static ButtonStyle secondary(Brightness brightness) {
    final t = MzTheme.current(brightness);
    return _base(
      const Color(0x00000000),
      t.accent,
      side: BorderSide(color: t.accent, width: MzBorder.hairline),
      minHeight: MzTouch.min,
    );
  }

  /// Dismiss, "not now".
  static ButtonStyle plain(Brightness brightness) {
    final t = MzTheme.current(brightness);
    return _base(
      t.surface,
      t.text2,
      side: BorderSide(color: t.border, width: MzBorder.hairline),
      minHeight: MzTouch.min,
    );
  }

  /// Irreversible actions only. Gets the larger spaced target.
  static ButtonStyle destructive(Brightness brightness) {
    final sem = MzSemanticColor.current(brightness);
    final on = MzOn.current(brightness);
    return _base(sem.critical, on.critical, minHeight: MzTouch.minSpaced);
  }

  /// Leads somewhere consequential but is not the commit action — "Sign out".
  static ButtonStyle destructiveOutline(Brightness brightness) {
    final sem = MzSemanticColor.current(brightness);
    return _base(
      const Color(0x00000000),
      sem.critical,
      side: BorderSide(color: sem.critical, width: MzBorder.hairline),
      minHeight: MzTouch.minSpaced,
    );
  }
}

/// The brand as Material [ThemeData].
///
/// \`\`\`dart
/// MaterialApp(
///   theme: MzThemeData.light,
///   darkTheme: MzThemeData.dark,
///   themeMode: ThemeMode.system,
/// )
/// \`\`\`
class MzThemeData {
  MzThemeData._();

  static final ThemeData light = _build(Brightness.light);
  static final ThemeData dark = _build(Brightness.dark);

  static ThemeData of(Brightness brightness) => brightness == Brightness.dark ? dark : light;

  static ThemeData _build(Brightness brightness) {
    final t = MzTheme.current(brightness);
    final sem = MzSemanticColor.current(brightness);
    final on = MzOn.current(brightness);

    final scheme = ColorScheme(
      brightness: brightness,
      primary: t.anchorFill,
      onPrimary: t.onAnchor,
      primaryContainer: t.surfaceSunk,
      onPrimaryContainer: t.text,
      secondary: t.accent,
      onSecondary: on.accent,
      secondaryContainer: t.surfaceSunk,
      onSecondaryContainer: t.text,
      tertiary: t.accentWarm,
      onTertiary: on.accentWarm,
      tertiaryContainer: t.surfaceSunk,
      onTertiaryContainer: t.text,
      error: sem.critical,
      onError: on.critical,
      errorContainer: t.surfaceSunk,
      onErrorContainer: sem.critical,
      surface: t.surface,
      onSurface: t.text,
      onSurfaceVariant: t.text2,
      surfaceContainerLowest: t.surface,
      surfaceContainerLow: t.bg,
      surfaceContainer: t.surfaceSunk,
      surfaceContainerHigh: t.surfaceSunk,
      surfaceContainerHighest: t.surfaceSunk,
      surfaceBright: t.surface,
      surfaceDim: t.surfaceSunk,
      outline: t.border,
      outlineVariant: t.border,
      inverseSurface: t.surfaceInvert,
      onInverseSurface: t.textInvert,
      inversePrimary: t.anchor,
      // Material 3 tints elevated surfaces toward the primary. The brand builds
      // depth from discrete surface tokens instead, so the tint is switched off
      // here and on every component below.
      surfaceTint: const Color(0x00000000),
      shadow: const Color(0xFF000000),
      scrim: const Color(0xFF000000),
    );

    final hairline = BorderSide(color: t.border, width: MzBorder.hairline);
    const cardShape = RoundedRectangleBorder(
      borderRadius: BorderRadius.all(Radius.circular(MzRadius.lg)),
    );
    final fieldShape = OutlineInputBorder(
      borderRadius: const BorderRadius.all(Radius.circular(MzRadius.md)),
      borderSide: hairline,
    );

    return ThemeData(
      useMaterial3: true,
      brightness: brightness,
      colorScheme: scheme,
      extensions: [MzColors.of(brightness)],

      fontFamily: MzFontFamily.sans,
      fontFamilyFallback: MzFontFamily.sansFallback,
      textTheme: _textTheme(t),

      scaffoldBackgroundColor: t.bg,
      canvasColor: t.bg,
      dividerColor: t.border,
      splashColor: t.accent.withValues(alpha: 0.10),
      highlightColor: t.accent.withValues(alpha: 0.06),
      // R8: every tap target clears 44px even when a widget is laid out smaller.
      materialTapTargetSize: MaterialTapTargetSize.padded,
      visualDensity: VisualDensity.standard,

      appBarTheme: AppBarTheme(
        backgroundColor: t.bg,
        foregroundColor: t.text,
        surfaceTintColor: const Color(0x00000000),
        elevation: 0,
        scrolledUnderElevation: 0,
        centerTitle: false,
        titleTextStyle: MzFont.title2.copyWith(color: t.text),
        iconTheme: IconThemeData(color: t.text, size: MzIconSize.lg),
      ),

      // §9.1: a card lifts off the bone ground by surface + hairline, not shadow.
      cardTheme: CardThemeData(
        color: t.surface,
        surfaceTintColor: const Color(0x00000000),
        elevation: 0,
        margin: EdgeInsets.zero,
        shape: cardShape.copyWith(side: hairline),
        clipBehavior: Clip.antiAlias,
      ),

      elevatedButtonTheme: ElevatedButtonThemeData(style: MzButtonStyles.primary(brightness)),
      filledButtonTheme: FilledButtonThemeData(style: MzButtonStyles.primary(brightness)),
      outlinedButtonTheme: OutlinedButtonThemeData(style: MzButtonStyles.secondary(brightness)),
      textButtonTheme: TextButtonThemeData(style: MzButtonStyles.plain(brightness)),

      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: t.surfaceSunk,
        contentPadding: const EdgeInsets.symmetric(horizontal: MzSpace.md, vertical: MzSpace.sm),
        constraints: const BoxConstraints(minHeight: MzTouch.min),
        border: fieldShape,
        enabledBorder: fieldShape,
        disabledBorder: fieldShape,
        focusedBorder: fieldShape.copyWith(
          borderSide: BorderSide(color: t.accent, width: MzBorder.focus),
        ),
        errorBorder: fieldShape.copyWith(
          borderSide: BorderSide(color: sem.critical, width: MzBorder.hairline),
        ),
        focusedErrorBorder: fieldShape.copyWith(
          borderSide: BorderSide(color: sem.critical, width: MzBorder.focus),
        ),
        // The label sits above the field and stays there — never a placeholder
        // standing in for a label (COMPONENTS.md, Input).
        floatingLabelBehavior: FloatingLabelBehavior.always,
        labelStyle: MzFont.bodySm.copyWith(color: t.text2),
        floatingLabelStyle: MzFont.bodySm.copyWith(color: t.text2),
        hintStyle: MzFont.body.copyWith(color: t.text3),
        errorStyle: MzFont.caption.copyWith(color: sem.critical),
        errorMaxLines: 3,
      ),

      switchTheme: SwitchThemeData(
        thumbColor: WidgetStateProperty.resolveWith(
          (states) => states.contains(WidgetState.selected) ? on.accent : t.surface,
        ),
        trackColor: WidgetStateProperty.resolveWith(
          (states) => states.contains(WidgetState.selected) ? t.accent : t.surfaceSunk,
        ),
        trackOutlineColor: WidgetStatePropertyAll(t.border),
      ),

      checkboxTheme: CheckboxThemeData(
        fillColor: WidgetStateProperty.resolveWith(
          (states) => states.contains(WidgetState.selected) ? t.accent : const Color(0x00000000),
        ),
        checkColor: WidgetStatePropertyAll(on.accent),
        side: hairline,
        shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.all(Radius.circular(MzRadius.sm)),
        ),
      ),

      radioTheme: RadioThemeData(
        fillColor: WidgetStateProperty.resolveWith(
          (states) => states.contains(WidgetState.selected) ? t.accent : t.text3,
        ),
      ),

      dividerTheme: DividerThemeData(
        color: t.border,
        thickness: MzBorder.hairline,
        space: MzSpace.md,
      ),

      bottomSheetTheme: BottomSheetThemeData(
        backgroundColor: t.surface,
        surfaceTintColor: const Color(0x00000000),
        elevation: 0,
        modalElevation: 0,
        showDragHandle: true,
        dragHandleColor: t.text3,
        shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(top: Radius.circular(MzRadius.lg)),
        ),
      ),

      dialogTheme: DialogThemeData(
        backgroundColor: t.surface,
        surfaceTintColor: const Color(0x00000000),
        elevation: 0,
        shape: cardShape.copyWith(side: hairline),
        titleTextStyle: MzFont.title2.copyWith(color: t.text),
        contentTextStyle: MzFont.body.copyWith(color: t.text2),
      ),

      snackBarTheme: SnackBarThemeData(
        backgroundColor: t.surfaceInvert,
        contentTextStyle: MzFont.body.copyWith(color: t.textInvert),
        actionTextColor: t.textInvert,
        behavior: SnackBarBehavior.floating,
        elevation: 0,
        shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.all(Radius.circular(MzRadius.md)),
        ),
      ),

      chipTheme: ChipThemeData(
        backgroundColor: t.surfaceSunk,
        selectedColor: t.accent,
        side: hairline,
        labelStyle: MzFont.bodySm.copyWith(color: t.text),
        padding: const EdgeInsets.symmetric(horizontal: MzSpace.sm, vertical: MzSpace.xxs),
        shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.all(Radius.circular(MzRadius.full)),
        ),
      ),

      listTileTheme: ListTileThemeData(
        iconColor: t.text2,
        textColor: t.text,
        titleTextStyle: MzFont.body.copyWith(color: t.text),
        subtitleTextStyle: MzFont.bodySm.copyWith(color: t.text2),
        minVerticalPadding: MzSpace.sm,
        contentPadding: const EdgeInsets.symmetric(horizontal: MzSpace.md),
      ),

      progressIndicatorTheme: ProgressIndicatorThemeData(
        color: t.accent,
        linearTrackColor: t.surfaceSunk,
        circularTrackColor: t.surfaceSunk,
      ),

      iconTheme: IconThemeData(color: t.text, size: MzIconSize.lg),

      tooltipTheme: TooltipThemeData(
        decoration: BoxDecoration(
          color: t.surfaceInvert,
          borderRadius: const BorderRadius.all(Radius.circular(MzRadius.sm)),
        ),
        textStyle: MzFont.caption.copyWith(color: t.textInvert),
      ),
    );
  }

  static TextTheme _textTheme(MzTheme t) {
    // Material's roles are a bigger grid than the brand's ten styles, so the
    // scale is mapped onto them rather than stretched to fill them.
    TextStyle primary(TextStyle s) => s.copyWith(color: t.text);
    TextStyle secondary(TextStyle s) => s.copyWith(color: t.text2);

    return TextTheme(
      displayLarge: primary(MzFont.display),
      displayMedium: primary(MzFont.display),
      displaySmall: primary(MzFont.title1),
      headlineLarge: primary(MzFont.title1),
      headlineMedium: primary(MzFont.title2),
      headlineSmall: primary(MzFont.title3),
      titleLarge: primary(MzFont.title2),
      titleMedium: primary(MzFont.title3),
      titleSmall: primary(MzFont.bodyEmph),
      bodyLarge: primary(MzFont.bodyLg),
      bodyMedium: primary(MzFont.body),
      bodySmall: secondary(MzFont.bodySm),
      labelLarge: primary(MzFont.bodyEmph),
      labelMedium: secondary(MzFont.caption),
      // MzFont.label still needs its text upper-cased by the caller.
      labelSmall: secondary(MzFont.label),
    );
  }
}
`;
}

writeFileSync(path.join(ROOT, "dist/dart/mz_theme.dart"), buildDartTheme());


// ---------------------------------------------------------------------------
// 7. JavaScript / TypeScript (React Native + web)
// ---------------------------------------------------------------------------
//
// Platform transforms that matter here:
//   * React Native lineHeight is an absolute number, not a ratio  -> fontSize * ratio
//   * React Native letterSpacing is an absolute number, not em    -> fontSize * em
//   * fontWeight is a string in RN style objects
// Doing this in the pipeline is the whole point: consumers never do the maths.
// ---------------------------------------------------------------------------

function jsObj(entries, indent = 2) {
  const pad = " ".repeat(indent);
  return entries.map(([k, v]) => `${pad}${JSON.stringify(k)}: ${v},`).join("\n");
}

function rnTypography(name) {
  const t = val(`typography.${name}`);
  const fontSize = parseFloat(t.fontSize);
  const ratio = parseFloat(t.lineHeight);
  const em = parseFloat(t.letterSpacing) || 0;
  const out = {
    fontFamily: resolve(t.fontFamily)[0],
    fontSize,
    fontWeight: String(t.fontWeight),
    lineHeight: Math.round(fontSize * ratio * 100) / 100,
    letterSpacing: Math.round(fontSize * em * 100) / 100,
  };
  if (t.textCase === "uppercase") out.textTransform = "uppercase";
  return out;
}

function buildJs() {
  const L = [];
  L.push(`// ${GENERATED_NOTICE}`);
  L.push("// MyMzansi design tokens for JavaScript / TypeScript (React Native + web).");
  L.push("//");
  L.push("// Theme colours are pre-resolved per mode. Reference `themes.light` / `themes.dark`");
  L.push("// or `semantic` — never `palette` directly (BRAND.md 3.1).");
  L.push("");

  L.push("export const palette = {");
  L.push(jsObj(group("color.palette").map(([n, v]) => [ident(n), JSON.stringify(v)])));
  L.push("};", "");

  for (const mode of ["light", "dark"]) {
    L.push(`const ${mode}Theme = {`);
    L.push(jsObj(group(`color.theme.${mode}`).map(([n, v]) => [ident(n), JSON.stringify(v)])));
    L.push("};", "");
  }
  L.push("export const themes = { light: lightTheme, dark: darkTheme };", "");

  L.push("export const semantic = {");
  L.push(jsObj(group("color.semantic").map(([n, v]) => [ident(n), JSON.stringify(v)])));
  L.push("};", "");

  for (const [key, prefix] of [["space", "dimension.space"], ["radius", "dimension.radius"],
                               ["touch", "dimension.touch"], ["icon", "dimension.icon"],
                               ["rail", "dimension.rail"], ["border", "dimension.border"]]) {
    L.push(`export const ${key} = {`);
    L.push(jsObj(group(prefix).map(([n, v]) => [ident(n), String(parseFloat(v))])));
    L.push("};", "");
  }

  L.push("export const typography = {");
  const typeNames = group("typography").map(([n]) => n);
  const seenType = [...new Set(resolvedTypographyNames())];
  for (const n of seenType) {
    L.push(`  ${JSON.stringify(ident(n))}: ${JSON.stringify(rnTypography(n))},`);
  }
  L.push("};", "");

  L.push("export const motion = {");
  L.push("  duration: {");
  L.push(jsObj(group("motion.duration").map(([n, v]) => [ident(n), String(parseFloat(v))]), 4));
  L.push("  },");
  L.push("  easing: {");
  L.push(jsObj(group("motion.easing").map(([n, v]) => [ident(n), JSON.stringify(v)]), 4));
  L.push("  },");
  L.push("  stagger: {");
  L.push(jsObj(group("motion.stagger").map(([n, v]) => [ident(n), String(parseFloat(v))]), 4));
  L.push("  },");
  L.push("};", "");

  L.push("export const icons = {");
  L.push(jsObj(group("icon.semantic").map(([n, v]) => [ident(n), JSON.stringify(v)])));
  L.push("};", "");

  L.push("export const fontFamily = {");
  L.push(jsObj(group("font.family").map(([n, v]) => [ident(n), JSON.stringify(resolve(v))])));
  L.push("};", "");

  L.push("export const budget = " + JSON.stringify(
    tokens.budget?.$extensions?.["org.mymzansi.budget"] ?? {}, null, 2) + ";", "");

  L.push("export default { palette, themes, semantic, space, radius, touch, icon, rail, border, typography, motion, icons, fontFamily, budget };");
  return L.join("\n") + "\n";
}

function resolvedTypographyNames() {
  const out = [];
  for (const p of resolved.keys()) {
    if (!p.startsWith("typography.")) continue;
    const rest = p.slice("typography.".length);
    if (rest.includes(".")) continue;
    out.push(rest);
  }
  return out;
}

function buildDts() {
  const names = [...new Set(resolvedTypographyNames())].map((n) => ident(n));
  const keys = (prefix) => group(prefix).map(([n]) => JSON.stringify(ident(n))).join(" | ");
  const L = [];
  L.push(`// ${GENERATED_NOTICE}`);
  L.push("");
  L.push("export type ThemeMode = \"light\" | \"dark\";");
  L.push(`export type ThemeColor = ${keys("color.theme.light")};`);
  L.push(`export type SemanticColor = ${keys("color.semantic")};`);
  L.push(`export type PaletteColor = ${keys("color.palette")};`);
  L.push(`export type SpaceKey = ${keys("dimension.space")};`);
  L.push(`export type RadiusKey = ${keys("dimension.radius")};`);
  L.push(`export type TypographyKey = ${names.map((n) => JSON.stringify(n)).join(" | ")};`);
  L.push(`export type IconName = ${keys("icon.semantic")};`);
  L.push("");
  L.push("export interface TextStyleToken {");
  L.push("  fontFamily: string;");
  L.push("  fontSize: number;");
  L.push("  fontWeight: string;");
  L.push("  lineHeight: number;");
  L.push("  letterSpacing: number;");
  L.push("  textTransform?: \"uppercase\";");
  L.push("}");
  L.push("");
  L.push("export declare const palette: Record<PaletteColor, string>;");
  L.push("export declare const themes: Record<ThemeMode, Record<ThemeColor, string>>;");
  L.push("export declare const semantic: Record<SemanticColor, string>;");
  L.push("export declare const space: Record<SpaceKey, number>;");
  L.push("export declare const radius: Record<RadiusKey, number>;");
  L.push(`export declare const touch: Record<${keys("dimension.touch")}, number>;`);
  L.push(`export declare const icon: Record<${keys("dimension.icon")}, number>;`);
  L.push(`export declare const rail: Record<${keys("dimension.rail")}, number>;`);
  L.push(`export declare const border: Record<${keys("dimension.border")}, number>;`);
  L.push("export declare const typography: Record<TypographyKey, TextStyleToken>;");
  L.push("export declare const motion: {");
  L.push(`  duration: Record<${keys("motion.duration")}, number>;`);
  L.push(`  easing: Record<${keys("motion.easing")}, [number, number, number, number]>;`);
  L.push(`  stagger: Record<${keys("motion.stagger")}, number>;`);
  L.push("};");
  L.push("export declare const icons: Record<IconName, string>;");
  L.push("export declare const fontFamily: { sans: string[]; mono: string[] };");
  L.push("export declare const budget: Record<string, unknown>;");
  L.push("");
  L.push("declare const tokens: {");
  for (const k of ["palette","themes","semantic","space","radius","touch","icon","rail","border","typography","motion","icons","fontFamily","budget"]) {
    L.push(`  ${k}: typeof ${k};`);
  }
  L.push("};");
  L.push("export default tokens;");
  return L.join("\n") + "\n";
}

writeFileSync(path.join(ROOT, "dist/js/tokens.js"), buildJs());
writeFileSync(path.join(ROOT, "dist/js/tokens.d.ts"), buildDts());

console.log("Generated:");
console.log("  dist/css/tokens.css");
console.log("  dist/tailwind/tailwind.config.js");
console.log("  dist/swift/MzTokens.swift");
console.log("  dist/kotlin/MzTokens.kt");
console.log("  dist/dart/mz_tokens.dart");
console.log("  dist/dart/mz_theme.dart");
console.log("  dist/js/tokens.js");
console.log("  dist/js/tokens.d.ts");
