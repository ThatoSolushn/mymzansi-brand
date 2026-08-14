// GENERATED FILE. Do not hand-edit — edit tokens.json and run `node scripts/build-tokens.mjs`.
package org.mymzansi.tokens

import androidx.compose.animation.core.CubicBezierEasing
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.unit.em

object MzColor {
  val ink = Color(0xFF16191A)
  val ink2 = Color(0xFF4A5450)
  val ink3 = Color(0xFF646D68)
  val bone = Color(0xFFF5F3ED)
  val bone2 = Color(0xFFEAE6DC)
  val white = Color(0xFFFFFFFF)
  val indigo = Color(0xFF1B2A4A)
  val indigo2 = Color(0xFF2C3F66)
  val indigoLt = Color(0xFF93A9D6)
  val aloe = Color(0xFF2F6B3A)
  val aloeLt = Color(0xFF3A7D44)
  val aloeBr = Color(0xFF58B06A)
  val maize = Color(0xFFFBC549)
  val ochre = Color(0xFFA8542E)
  val ochreBr = Color(0xFFDE8A5E)
  val crit = Color(0xFFB3271E)
  val critBr = Color(0xFFE4756A)
  val caution = Color(0xFF8F5E0A)
  val cautionBr = Color(0xFFE9BC55)
  val info = Color(0xFF2C5D8A)
  val infoBr = Color(0xFF7FAAD4)
  val night = Color(0xFF12161F)
  val night2 = Color(0xFF1A2030)
  val night3 = Color(0xFF3A4557)
  val chalk = Color(0xFFECEAE4)
  val chalk2 = Color(0xFFA8AFB8)
  val chalk3 = Color(0xFF8A929B)
  val rule = Color(0xFFE4DFD4)
}

/** Meaning-carrying colours. Prefer `MzSemanticColor.current(darkTheme)` over reading Light/Dark directly. */
object MzSemanticColor {
  val successLight = Color(0xFF2F6B3A)
  val criticalLight = Color(0xFFB3271E)
  val infoLight = Color(0xFF2C5D8A)
  val successDark = Color(0xFF58B06A)
  val criticalDark = Color(0xFFE4756A)
  val infoDark = Color(0xFF7FAAD4)
  val cautionText = Color(0xFF8F5E0A)
  val cautionFill = Color(0xFFFBC549)
  val restricted = Color(0xFFA8542E)

  data class Resolved(
    val success: Color,
    val critical: Color,
    val info: Color,
  )

  val Light = Resolved(success = successLight, critical = criticalLight, info = infoLight)
  val Dark = Resolved(success = successDark, critical = criticalDark, info = infoDark)
  fun current(darkTheme: Boolean) = if (darkTheme) Dark else Light
}

/** Theme-resolved surface/text colours. Components MUST use `MzTheme.current()`, never MzColor directly. */
data class MzTheme(
  val bg: Color,
  val surface: Color,
  val surfaceSunk: Color,
  val surfaceInvert: Color,
  val text: Color,
  val text2: Color,
  val text3: Color,
  val textInvert: Color,
  val border: Color,
  val accent: Color,
  val accentWarm: Color,
  val anchor: Color,
  val anchorFill: Color,
  val onAnchor: Color,
) {
  companion object {
    val Light = MzTheme(bg = Color(0xFFF5F3ED), surface = Color(0xFFFFFFFF), surfaceSunk = Color(0xFFEAE6DC), surfaceInvert = Color(0xFF1B2A4A), text = Color(0xFF16191A), text2 = Color(0xFF4A5450), text3 = Color(0xFF646D68), textInvert = Color(0xFFFFFFFF), border = Color(0xFFE4DFD4), accent = Color(0xFF2F6B3A), accentWarm = Color(0xFFA8542E), anchor = Color(0xFF1B2A4A), anchorFill = Color(0xFF1B2A4A), onAnchor = Color(0xFFFFFFFF))
    val Dark = MzTheme(bg = Color(0xFF12161F), surface = Color(0xFF1A2030), surfaceSunk = Color(0xFF12161F), surfaceInvert = Color(0xFFECEAE4), text = Color(0xFFECEAE4), text2 = Color(0xFFA8AFB8), text3 = Color(0xFF8A929B), textInvert = Color(0xFF12161F), border = Color(0xFF3A4557), accent = Color(0xFF58B06A), accentWarm = Color(0xFFDE8A5E), anchor = Color(0xFF93A9D6), anchorFill = Color(0xFF1B2A4A), onAnchor = Color(0xFFECEAE4))
    fun current(darkTheme: Boolean) = if (darkTheme) Dark else Light
  }
}

object MzFontFamily {
  // Swap FontFamily.Default for a FontFamily(Font(R.font.montserrat...)) once the face is bundled.
  val sans = FontFamily.Default
  val mono = FontFamily.Default
}

/** Composite type styles. Font sizes are in sp so they scale with the system font-size setting. */
object MzFont {
  val display = TextStyle(fontFamily = MzFontFamily.sans, fontSize = 34.sp, fontWeight = FontWeight(800), lineHeight = 37.4.sp, letterSpacing = -0.025.em)
  val title1 = TextStyle(fontFamily = MzFontFamily.sans, fontSize = 26.sp, fontWeight = FontWeight(800), lineHeight = 29.9.sp, letterSpacing = -0.02.em)
  val title2 = TextStyle(fontFamily = MzFontFamily.sans, fontSize = 21.sp, fontWeight = FontWeight(700), lineHeight = 25.2.sp, letterSpacing = -0.015.em)
  val title3 = TextStyle(fontFamily = MzFontFamily.sans, fontSize = 18.sp, fontWeight = FontWeight(700), lineHeight = 22.5.sp, letterSpacing = -0.01.em)
  val bodyLg = TextStyle(fontFamily = MzFontFamily.sans, fontSize = 17.sp, fontWeight = FontWeight(400), lineHeight = 26.35.sp, letterSpacing = 0.em)
  val body = TextStyle(fontFamily = MzFontFamily.sans, fontSize = 16.sp, fontWeight = FontWeight(400), lineHeight = 24.8.sp, letterSpacing = 0.em)
  val bodyEmph = TextStyle(fontFamily = MzFontFamily.sans, fontSize = 16.sp, fontWeight = FontWeight(600), lineHeight = 24.8.sp, letterSpacing = 0.em)
  val bodySm = TextStyle(fontFamily = MzFontFamily.sans, fontSize = 14.sp, fontWeight = FontWeight(400), lineHeight = 21.sp, letterSpacing = 0.em)
  val caption = TextStyle(fontFamily = MzFontFamily.sans, fontSize = 13.sp, fontWeight = FontWeight(400), lineHeight = 18.85.sp, letterSpacing = 0.em)
  val label = TextStyle(fontFamily = MzFontFamily.sans, fontSize = 11.sp, fontWeight = FontWeight(700), lineHeight = 15.4.sp, letterSpacing = 0.12.em)
  val numeric = TextStyle(fontFamily = MzFontFamily.mono, fontSize = 14.sp, fontWeight = FontWeight(500), lineHeight = 19.6.sp, letterSpacing = 0.02.em)
}

object MzSpace {
  val xxxs = 2.dp
  val xxs = 4.dp
  val xs = 8.dp
  val sm = 12.dp
  val md = 16.dp
  val lg = 24.dp
  val xl = 40.dp
  val xxl = 60.dp
}

object MzRadius {
  val sm = 4.dp
  val md = 8.dp
  val lg = 12.dp
  val full = 999.dp
}

object MzTouch {
  val min = 44.dp
  val minSpaced = 48.dp
}

object MzIconSize {
  val sm = 18.dp
  val md = 20.dp
  val lg = 24.dp
  val xl = 28.dp
}

/** Material Symbols Outlined glyph names (see BRAND.md icon standardisation). */
object MzIcon {
  const val verified = "verified"
  const val partial = "shield_with_heart"
  const val failed = "error"
  const val restricted = "lock"
  const val consent = "handshake"
  const val audit = "history"
  const val revoke = "block"
  const val dispute = "flag"
  const val delegate = "supervisor_account"
  const val document = "badge"
  const val payment = "payments"
  const val language = "translate"
  const val signLanguage = "sign_language"
  const val assist = "support_agent"
  const val location = "location_on"
  const val offline = "cloud_off"
}

object MzDuration {
  const val instantMs = 100
  const val quickMs = 180
  const val baseMs = 280
  const val slowMs = 380
  const val deliberateMs = 1100
}

object MzEasing {
  val standard = CubicBezierEasing(0.2f, 0.8f, 0.3f, 1f)
  val overshoot = CubicBezierEasing(0.2f, 1.5f, 0.4f, 1f)
  val exit = CubicBezierEasing(0.4f, 0f, 1f, 1f)
}

data class MzElevationSpec(val offsetXDp: Float, val offsetYDp: Float, val blurDp: Float, val color: Color)
object MzElevation {
  val none = MzElevationSpec(0f, 0f, 0f, Color(0x00000000))
  val card = MzElevationSpec(0f, 1f, 3f, Color(0x1F000000))
  val lift = MzElevationSpec(0f, 8f, 24f, Color(0x24000000))
}

