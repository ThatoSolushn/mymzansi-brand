// GENERATED FILE. Do not hand-edit — edit tokens.json and run `node scripts/build-tokens.mjs`.
// MyMzansi design tokens for JavaScript / TypeScript (React Native + web).
//
// Theme colours are pre-resolved per mode. Reference `themes.light` / `themes.dark`
// or `semantic` — never `palette` directly (BRAND.md 3.1).

export const palette = {
  "ink": "#16191A",
  "ink2": "#4A5450",
  "ink3": "#646D68",
  "bone": "#F5F3ED",
  "bone2": "#EAE6DC",
  "white": "#FFFFFF",
  "indigo": "#1B2A4A",
  "indigo2": "#2C3F66",
  "indigoLt": "#93A9D6",
  "aloe": "#2F6B3A",
  "aloeLt": "#3A7D44",
  "aloeBr": "#58B06A",
  "maize": "#FBC549",
  "ochre": "#A8542E",
  "ochreBr": "#DE8A5E",
  "crit": "#B3271E",
  "critBr": "#E4756A",
  "caution": "#8F5E0A",
  "cautionBr": "#E9BC55",
  "info": "#2C5D8A",
  "infoBr": "#7FAAD4",
  "night": "#12161F",
  "night2": "#1A2030",
  "night3": "#3A4557",
  "chalk": "#ECEAE4",
  "chalk2": "#A8AFB8",
  "chalk3": "#8A929B",
  "rule": "#E4DFD4",
};

const lightTheme = {
  "bg": "#F5F3ED",
  "surface": "#FFFFFF",
  "surfaceSunk": "#EAE6DC",
  "surfaceInvert": "#1B2A4A",
  "text": "#16191A",
  "text2": "#4A5450",
  "text3": "#646D68",
  "textInvert": "#FFFFFF",
  "border": "#E4DFD4",
  "accent": "#2F6B3A",
  "accentWarm": "#A8542E",
  "anchor": "#1B2A4A",
  "anchorFill": "#1B2A4A",
  "onAnchor": "#FFFFFF",
};

const darkTheme = {
  "bg": "#12161F",
  "surface": "#1A2030",
  "surfaceSunk": "#12161F",
  "surfaceInvert": "#ECEAE4",
  "text": "#ECEAE4",
  "text2": "#A8AFB8",
  "text3": "#8A929B",
  "textInvert": "#12161F",
  "border": "#3A4557",
  "accent": "#58B06A",
  "accentWarm": "#DE8A5E",
  "anchor": "#93A9D6",
  "anchorFill": "#1B2A4A",
  "onAnchor": "#ECEAE4",
};

export const themes = { light: lightTheme, dark: darkTheme };

export const semantic = {
  "success": "#2F6B3A",
  "successDark": "#58B06A",
  "cautionText": "#8F5E0A",
  "cautionFill": "#FBC549",
  "cautionDark": "#E9BC55",
  "critical": "#B3271E",
  "criticalDark": "#E4756A",
  "info": "#2C5D8A",
  "infoDark": "#7FAAD4",
  "restricted": "#A8542E",
};

export const space = {
  "xxxs": 2,
  "xxs": 4,
  "xs": 8,
  "sm": 12,
  "md": 16,
  "lg": 24,
  "xl": 40,
  "xxl": 60,
};

export const radius = {
  "sm": 4,
  "md": 8,
  "lg": 12,
  "full": 999,
};

export const touch = {
  "min": 44,
  "minSpaced": 48,
};

export const icon = {
  "sm": 18,
  "md": 20,
  "lg": 24,
  "xl": 28,
};

export const rail = {
  "status": 4,
};

export const border = {
  "hairline": 1,
  "focus": 2,
};

export const typography = {
  "display": {"fontFamily":"Montserrat","fontSize":34,"fontWeight":"800","lineHeight":37.4,"letterSpacing":-0.85},
  "title1": {"fontFamily":"Montserrat","fontSize":26,"fontWeight":"800","lineHeight":29.9,"letterSpacing":-0.52},
  "title2": {"fontFamily":"Montserrat","fontSize":21,"fontWeight":"700","lineHeight":25.2,"letterSpacing":-0.31},
  "title3": {"fontFamily":"Montserrat","fontSize":18,"fontWeight":"700","lineHeight":22.5,"letterSpacing":-0.18},
  "bodyLg": {"fontFamily":"Montserrat","fontSize":17,"fontWeight":"400","lineHeight":26.35,"letterSpacing":0},
  "body": {"fontFamily":"Montserrat","fontSize":16,"fontWeight":"400","lineHeight":24.8,"letterSpacing":0},
  "bodyEmph": {"fontFamily":"Montserrat","fontSize":16,"fontWeight":"600","lineHeight":24.8,"letterSpacing":0},
  "bodySm": {"fontFamily":"Montserrat","fontSize":14,"fontWeight":"400","lineHeight":21,"letterSpacing":0},
  "caption": {"fontFamily":"Montserrat","fontSize":13,"fontWeight":"400","lineHeight":18.85,"letterSpacing":0},
  "label": {"fontFamily":"Montserrat","fontSize":11,"fontWeight":"700","lineHeight":15.4,"letterSpacing":1.32,"textTransform":"uppercase"},
  "numeric": {"fontFamily":"ui-monospace","fontSize":14,"fontWeight":"500","lineHeight":19.6,"letterSpacing":0.28},
};

export const motion = {
  duration: {
    "instant": 100,
    "quick": 180,
    "base": 280,
    "slow": 380,
    "deliberate": 1100,
  },
  easing: {
    "standard": [0.2,0.8,0.3,1],
    "overshoot": [0.2,1.5,0.4,1],
    "exit": [0.4,0,1,1],
  },
  stagger: {
    "interval": 45,
    "maxTotal": 300,
  },
};

export const icons = {
  "verified": "verified",
  "partial": "shield_with_heart",
  "failed": "error",
  "restricted": "lock",
  "consent": "handshake",
  "audit": "history",
  "revoke": "block",
  "dispute": "flag",
  "delegate": "supervisor_account",
  "document": "badge",
  "payment": "payments",
  "language": "translate",
  "signLanguage": "sign_language",
  "assist": "support_agent",
  "location": "location_on",
  "offline": "cloud_off",
};

export const fontFamily = {
  "sans": ["Montserrat","system-ui","-apple-system","Segoe UI","Roboto","sans-serif"],
  "mono": ["ui-monospace","SFMono-Regular","SF Mono","Menlo","Consolas","monospace"],
};

export const budget = {
  "frameMs": 16.7,
  "animatableProperties": [
    "transform",
    "opacity"
  ],
  "initialPayloadKb": 200,
  "externalOrigins": 0,
  "targetDevice": "Entry-level Snapdragon/MediaTek Android, 2G/3G, 4 years old",
  "note": "Zero-rating covers the platform origin only. Any third-party origin — font CDN, analytics, image host — costs the user money and breaks the zero-rating guarantee."
};

export default { palette, themes, semantic, space, radius, touch, icon, rail, border, typography, motion, icons, fontFamily, budget };
