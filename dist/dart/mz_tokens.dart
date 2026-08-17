// GENERATED FILE. Do not hand-edit — edit tokens.json and run `node scripts/build-tokens.mjs`.
import 'package:flutter/material.dart';

class MzColor {
  MzColor._();
  static const ink = Color(0xFF16191A);
  static const ink2 = Color(0xFF4A5450);
  static const ink3 = Color(0xFF646D68);
  static const bone = Color(0xFFF5F3ED);
  static const bone2 = Color(0xFFEAE6DC);
  static const white = Color(0xFFFFFFFF);
  static const indigo = Color(0xFF1B2A4A);
  static const indigo2 = Color(0xFF2C3F66);
  static const indigoLt = Color(0xFF93A9D6);
  static const aloe = Color(0xFF2F6B3A);
  static const aloeLt = Color(0xFF3A7D44);
  static const aloeBr = Color(0xFF58B06A);
  static const maize = Color(0xFFFBC549);
  static const ochre = Color(0xFFA8542E);
  static const ochreBr = Color(0xFFDE8A5E);
  static const crit = Color(0xFFB3271E);
  static const critBr = Color(0xFFE4756A);
  static const caution = Color(0xFF8F5E0A);
  static const cautionBr = Color(0xFFE9BC55);
  static const info = Color(0xFF2C5D8A);
  static const infoBr = Color(0xFF7FAAD4);
  static const night = Color(0xFF12161F);
  static const night2 = Color(0xFF1A2030);
  static const night3 = Color(0xFF3A4557);
  static const chalk = Color(0xFFECEAE4);
  static const chalk2 = Color(0xFFA8AFB8);
  static const chalk3 = Color(0xFF8A929B);
  static const rule = Color(0xFFE4DFD4);
}

/// Meaning-carrying colours. Prefer `MzSemanticColor.current(brightness)` over reading Light/Dark directly.
class MzSemanticColor {
  MzSemanticColor._();
  static const successLight = Color(0xFF2F6B3A);
  static const criticalLight = Color(0xFFB3271E);
  static const infoLight = Color(0xFF2C5D8A);
  static const successDark = Color(0xFF58B06A);
  static const criticalDark = Color(0xFFE4756A);
  static const infoDark = Color(0xFF7FAAD4);
  static const cautionText = Color(0xFF8F5E0A);
  static const cautionFill = Color(0xFFFBC549);
  static const onCautionFill = Color(0xFF16191A);
  static const restricted = Color(0xFFA8542E);

  static const light = MzSemanticColorResolved(success: successLight, critical: criticalLight, info: infoLight);
  static const dark = MzSemanticColorResolved(success: successDark, critical: criticalDark, info: infoDark);
  static MzSemanticColorResolved current(Brightness brightness) => brightness == Brightness.dark ? dark : light;
}

class MzSemanticColorResolved {
  const MzSemanticColorResolved({required this.success, required this.critical, required this.info});
  final Color success;
  final Color critical;
  final Color info;

  /// Field-wise interpolation, so a light/dark swap can animate instead of jumping.
  static MzSemanticColorResolved lerp(MzSemanticColorResolved a, MzSemanticColorResolved b, double t) =>
      MzSemanticColorResolved(success: Color.lerp(a.success, b.success, t)!, critical: Color.lerp(a.critical, b.critical, t)!, info: Color.lerp(a.info, b.info, t)!);
}

/// Theme-resolved surface/text colours. Components MUST use `MzTheme.current()`, never MzColor directly.
class MzTheme {
  const MzTheme({required this.bg, required this.surface, required this.surfaceSunk, required this.surfaceInvert, required this.text, required this.text2, required this.text3, required this.textInvert, required this.border, required this.accent, required this.accentWarm, required this.anchor, required this.anchorFill, required this.onAnchor});
  final Color bg;
  final Color surface;
  final Color surfaceSunk;
  final Color surfaceInvert;
  final Color text;
  final Color text2;
  final Color text3;
  final Color textInvert;
  final Color border;
  final Color accent;
  final Color accentWarm;
  final Color anchor;
  final Color anchorFill;
  final Color onAnchor;

  static const light = MzTheme(bg: Color(0xFFF5F3ED), surface: Color(0xFFFFFFFF), surfaceSunk: Color(0xFFEAE6DC), surfaceInvert: Color(0xFF1B2A4A), text: Color(0xFF16191A), text2: Color(0xFF4A5450), text3: Color(0xFF646D68), textInvert: Color(0xFFFFFFFF), border: Color(0xFFE4DFD4), accent: Color(0xFF2F6B3A), accentWarm: Color(0xFFA8542E), anchor: Color(0xFF1B2A4A), anchorFill: Color(0xFF1B2A4A), onAnchor: Color(0xFFFFFFFF));
  static const dark = MzTheme(bg: Color(0xFF12161F), surface: Color(0xFF1A2030), surfaceSunk: Color(0xFF12161F), surfaceInvert: Color(0xFFECEAE4), text: Color(0xFFECEAE4), text2: Color(0xFFA8AFB8), text3: Color(0xFF8A929B), textInvert: Color(0xFF12161F), border: Color(0xFF3A4557), accent: Color(0xFF58B06A), accentWarm: Color(0xFFDE8A5E), anchor: Color(0xFF93A9D6), anchorFill: Color(0xFF1B2A4A), onAnchor: Color(0xFFECEAE4));

  static MzTheme current(Brightness brightness) => brightness == Brightness.dark ? dark : light;

  /// Field-wise interpolation, so a light/dark swap can animate instead of jumping.
  static MzTheme lerp(MzTheme a, MzTheme b, double t) =>
      MzTheme(bg: Color.lerp(a.bg, b.bg, t)!, surface: Color.lerp(a.surface, b.surface, t)!, surfaceSunk: Color.lerp(a.surfaceSunk, b.surfaceSunk, t)!, surfaceInvert: Color.lerp(a.surfaceInvert, b.surfaceInvert, t)!, text: Color.lerp(a.text, b.text, t)!, text2: Color.lerp(a.text2, b.text2, t)!, text3: Color.lerp(a.text3, b.text3, t)!, textInvert: Color.lerp(a.textInvert, b.textInvert, t)!, border: Color.lerp(a.border, b.border, t)!, accent: Color.lerp(a.accent, b.accent, t)!, accentWarm: Color.lerp(a.accentWarm, b.accentWarm, t)!, anchor: Color.lerp(a.anchor, b.anchor, t)!, anchorFill: Color.lerp(a.anchorFill, b.anchorFill, t)!, onAnchor: Color.lerp(a.onAnchor, b.onAnchor, t)!);
}

/// CSS generic families are stripped — Flutter resolves real family names only.
class MzFontFamily {
  MzFontFamily._();
  static const sans = 'Montserrat';
  static const sansFallback = ['Segoe UI', 'Roboto'];
  static const mono = 'SFMono-Regular';
  static const monoFallback = ['SF Mono', 'Menlo', 'Consolas'];
}

/// Composite type styles. `height` is a unitless multiplier of fontSize, matching CSS line-height.
/// `label` additionally needs its text upper-cased by the caller — TextStyle has no text-transform equivalent.
class MzFont {
  MzFont._();
  static const display = TextStyle(fontFamily: MzFontFamily.sans, fontFamilyFallback: MzFontFamily.sansFallback, fontSize: 34, fontWeight: FontWeight.w800, height: 1.1, letterSpacing: -0.85);
  static const title1 = TextStyle(fontFamily: MzFontFamily.sans, fontFamilyFallback: MzFontFamily.sansFallback, fontSize: 26, fontWeight: FontWeight.w800, height: 1.15, letterSpacing: -0.52);
  static const title2 = TextStyle(fontFamily: MzFontFamily.sans, fontFamilyFallback: MzFontFamily.sansFallback, fontSize: 21, fontWeight: FontWeight.w700, height: 1.2, letterSpacing: -0.315);
  static const title3 = TextStyle(fontFamily: MzFontFamily.sans, fontFamilyFallback: MzFontFamily.sansFallback, fontSize: 18, fontWeight: FontWeight.w700, height: 1.25, letterSpacing: -0.18);
  static const bodyLg = TextStyle(fontFamily: MzFontFamily.sans, fontFamilyFallback: MzFontFamily.sansFallback, fontSize: 17, fontWeight: FontWeight.w400, height: 1.55, letterSpacing: 0);
  static const body = TextStyle(fontFamily: MzFontFamily.sans, fontFamilyFallback: MzFontFamily.sansFallback, fontSize: 16, fontWeight: FontWeight.w400, height: 1.55, letterSpacing: 0);
  static const bodyEmph = TextStyle(fontFamily: MzFontFamily.sans, fontFamilyFallback: MzFontFamily.sansFallback, fontSize: 16, fontWeight: FontWeight.w600, height: 1.55, letterSpacing: 0);
  static const bodySm = TextStyle(fontFamily: MzFontFamily.sans, fontFamilyFallback: MzFontFamily.sansFallback, fontSize: 14, fontWeight: FontWeight.w400, height: 1.5, letterSpacing: 0);
  static const caption = TextStyle(fontFamily: MzFontFamily.sans, fontFamilyFallback: MzFontFamily.sansFallback, fontSize: 13, fontWeight: FontWeight.w400, height: 1.45, letterSpacing: 0);
  static const label = TextStyle(fontFamily: MzFontFamily.sans, fontFamilyFallback: MzFontFamily.sansFallback, fontSize: 11, fontWeight: FontWeight.w700, height: 1.4, letterSpacing: 1.32);
  static const numeric = TextStyle(fontFamily: MzFontFamily.mono, fontFamilyFallback: MzFontFamily.monoFallback, fontSize: 14, fontWeight: FontWeight.w500, height: 1.4, letterSpacing: 0.28);
}

class MzSpace {
  MzSpace._();
  static const xxxs = 2.0;
  static const xxs = 4.0;
  static const xs = 8.0;
  static const sm = 12.0;
  static const md = 16.0;
  static const lg = 24.0;
  static const xl = 40.0;
  static const xxl = 60.0;
}

class MzRadius {
  MzRadius._();
  static const sm = 4.0;
  static const md = 8.0;
  static const lg = 12.0;
  static const full = 999.0;
}

class MzTouch {
  MzTouch._();
  static const min = 44.0;
  static const minSpaced = 48.0;
}

class MzIconSize {
  MzIconSize._();
  static const sm = 18.0;
  static const md = 20.0;
  static const lg = 24.0;
  static const xl = 28.0;
}

/// Left status rail widths (BRAND.md §9.1) — the rail replaces icon circles in lists.
class MzRail {
  MzRail._();
  static const status = 4.0;
}

class MzBorder {
  MzBorder._();
  static const hairline = 1.0;
  static const focus = 2.0;
}

/// Fluent UI System Icons glyph names (see BRAND.md §6).
class MzIcon {
  MzIcon._();
  static const verified = 'checkmark_circle';
  static const partial = 'shield';
  static const failed = 'error_circle';
  static const restricted = 'lock_closed';
  static const consent = 'handshake';
  static const audit = 'history';
  static const revoke = 'prohibited';
  static const dispute = 'flag';
  static const delegate = 'people_swap';
  static const document = 'document';
  static const payment = 'payment';
  static const language = 'translate';
  static const signLanguage = 'hand_wave';
  static const assist = 'person_support';
  static const location = 'location';
  static const offline = 'cloud_off';
}

class MzDuration {
  MzDuration._();
  static const instant = Duration(milliseconds: 100);
  static const quick = Duration(milliseconds: 180);
  static const base = Duration(milliseconds: 280);
  static const slow = Duration(milliseconds: 380);
  static const deliberate = Duration(milliseconds: 1100);
}

class MzEasing {
  MzEasing._();
  static const standard = Cubic(0.2, 0.8, 0.3, 1);
  static const overshoot = Cubic(0.2, 1.5, 0.4, 1);
  static const exit = Cubic(0.4, 0, 1, 1);
}

class MzElevation {
  MzElevation._();
  static const none = BoxShadow(color: Color(0x00000000), offset: Offset(0, 0), blurRadius: 0, spreadRadius: 0);
  static const card = BoxShadow(color: Color(0x1F000000), offset: Offset(0, 1), blurRadius: 3, spreadRadius: 0);
  static const lift = BoxShadow(color: Color(0x24000000), offset: Offset(0, 8), blurRadius: 24, spreadRadius: 0);
}

