// GENERATED FILE. Do not hand-edit — edit tokens.json and run `node scripts/build-tokens.mjs`.

export type ThemeMode = "light" | "dark";
export type ThemeColor = "bg" | "surface" | "surfaceSunk" | "surfaceInvert" | "text" | "text2" | "text3" | "textInvert" | "border" | "accent" | "accentWarm" | "anchor" | "anchorFill" | "onAnchor";
export type SemanticColor = "success" | "successDark" | "cautionText" | "cautionFill" | "onCautionFill" | "cautionDark" | "critical" | "criticalDark" | "info" | "infoDark" | "restricted";
export type PaletteColor = "ink" | "ink2" | "ink3" | "bone" | "bone2" | "white" | "indigo" | "indigo2" | "indigoLt" | "aloe" | "aloeLt" | "aloeBr" | "maize" | "ochre" | "ochreBr" | "crit" | "critBr" | "caution" | "cautionBr" | "info" | "infoBr" | "night" | "night2" | "night3" | "chalk" | "chalk2" | "chalk3" | "rule";
export type SpaceKey = "xxxs" | "xxs" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
export type RadiusKey = "sm" | "md" | "lg" | "full";
export type TypographyKey = "display" | "title1" | "title2" | "title3" | "bodyLg" | "body" | "bodyEmph" | "bodySm" | "caption" | "label" | "numeric";
export type IconName = "verified" | "partial" | "failed" | "restricted" | "consent" | "audit" | "revoke" | "dispute" | "delegate" | "document" | "payment" | "language" | "signLanguage" | "assist" | "location" | "offline";

export interface TextStyleToken {
  fontFamily: string;
  fontSize: number;
  fontWeight: string;
  lineHeight: number;
  letterSpacing: number;
  textTransform?: "uppercase";
}

export declare const palette: Record<PaletteColor, string>;
export declare const themes: Record<ThemeMode, Record<ThemeColor, string>>;
export declare const semantic: Record<SemanticColor, string>;
export declare const space: Record<SpaceKey, number>;
export declare const radius: Record<RadiusKey, number>;
export declare const touch: Record<"min" | "minSpaced", number>;
export declare const icon: Record<"sm" | "md" | "lg" | "xl", number>;
export declare const rail: Record<"status", number>;
export declare const border: Record<"hairline" | "focus", number>;
export declare const typography: Record<TypographyKey, TextStyleToken>;
export declare const motion: {
  duration: Record<"instant" | "quick" | "base" | "slow" | "deliberate", number>;
  easing: Record<"standard" | "overshoot" | "exit", [number, number, number, number]>;
  stagger: Record<"interval" | "maxTotal", number>;
};
export declare const icons: Record<IconName, string>;
export declare const fontFamily: { sans: string[]; mono: string[] };
export declare const budget: Record<string, unknown>;

declare const tokens: {
  palette: typeof palette;
  themes: typeof themes;
  semantic: typeof semantic;
  space: typeof space;
  radius: typeof radius;
  touch: typeof touch;
  icon: typeof icon;
  rail: typeof rail;
  border: typeof border;
  typography: typeof typography;
  motion: typeof motion;
  icons: typeof icons;
  fontFamily: typeof fontFamily;
  budget: typeof budget;
};
export default tokens;
