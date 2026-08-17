// GENERATED FILE. Do not hand-edit — edit tokens.json and run `node scripts/build-tokens.mjs`.
//
// Material binding for the MyMzansi tokens. Use `MzThemeData.light` / `.dark`
// on MaterialApp; read brand-only colours with `context.mz`.
import 'package:flutter/material.dart';

import 'mz_tokens.dart';

/// Foreground colours for the brand fills Material has no `onX` slot for.
/// Each is whichever theme extreme (text / text-invert) scores the higher WCAG
/// contrast ratio on that fill — computed at build time, never eyeballed.
class MzOn {
  MzOn._();
  static const accentLight = Color(0xFFFFFFFF); // 6.39:1 on #2F6B3A
  static const accentDark = Color(0xFF12161F); // 6.75:1 on #58B06A
  static const accentWarmLight = Color(0xFFFFFFFF); // 5.29:1 on #A8542E
  static const accentWarmDark = Color(0xFF12161F); // 6.81:1 on #DE8A5E
  static const successLight = Color(0xFFFFFFFF); // 6.39:1 on #2F6B3A
  static const successDark = Color(0xFF12161F); // 6.75:1 on #58B06A
  static const criticalLight = Color(0xFFFFFFFF); // 6.51:1 on #B3271E
  static const criticalDark = Color(0xFF12161F); // 6.08:1 on #E4756A
  static const infoLight = Color(0xFFFFFFFF); // 6.91:1 on #2C5D8A
  static const infoDark = Color(0xFF12161F); // 7.41:1 on #7FAAD4

  static const light = MzOnResolved(accent: accentLight, accentWarm: accentWarmLight, success: successLight, critical: criticalLight, info: infoLight);
  static const dark = MzOnResolved(accent: accentDark, accentWarm: accentWarmDark, success: successDark, critical: criticalDark, info: infoDark);
  static MzOnResolved current(Brightness brightness) => brightness == Brightness.dark ? dark : light;
}

class MzOnResolved {
  const MzOnResolved({required this.accent, required this.accentWarm, required this.success, required this.critical, required this.info});
  final Color accent;
  final Color accentWarm;
  final Color success;
  final Color critical;
  final Color info;

  static MzOnResolved lerp(MzOnResolved a, MzOnResolved b, double t) =>
      MzOnResolved(accent: Color.lerp(a.accent, b.accent, t)!, accentWarm: Color.lerp(a.accentWarm, b.accentWarm, t)!, success: Color.lerp(a.success, b.success, t)!, critical: Color.lerp(a.critical, b.critical, t)!, info: Color.lerp(a.info, b.info, t)!);
}

/// The brand colours that do not fit ColorScheme, carried on ThemeData so
/// widgets read them from context instead of importing MzColor directly.
///
/// ```dart
/// Container(color: context.mz.colors.surfaceSunk)
/// Text('Approved', style: TextStyle(color: context.mz.semantic.success))
/// ```
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

  /// Maize ground for the `limit` tone. [onCautionFill] (ink) is the only
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
/// ```dart
/// MaterialApp(
///   theme: MzThemeData.light,
///   darkTheme: MzThemeData.dark,
///   themeMode: ThemeMode.system,
/// )
/// ```
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
