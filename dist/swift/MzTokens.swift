// GENERATED FILE. Do not hand-edit — edit tokens.json and run `node scripts/build-tokens.mjs`.
import SwiftUI

enum MzColor {
  static let ink = Color(red: 0.0863, green: 0.098, blue: 0.102)
  static let ink2 = Color(red: 0.2902, green: 0.3294, blue: 0.3137)
  static let ink3 = Color(red: 0.3922, green: 0.4275, blue: 0.4078)
  static let bone = Color(red: 0.9608, green: 0.9529, blue: 0.9294)
  static let bone2 = Color(red: 0.9176, green: 0.902, blue: 0.8627)
  static let white = Color(red: 1, green: 1, blue: 1)
  static let indigo = Color(red: 0.1059, green: 0.1647, blue: 0.2902)
  static let indigo2 = Color(red: 0.1725, green: 0.2471, blue: 0.4)
  static let indigoLt = Color(red: 0.5765, green: 0.6627, blue: 0.8392)
  static let aloe = Color(red: 0.1843, green: 0.4196, blue: 0.2275)
  static let aloeLt = Color(red: 0.2275, green: 0.4902, blue: 0.2667)
  static let aloeBr = Color(red: 0.3451, green: 0.6902, blue: 0.4157)
  static let maize = Color(red: 0.9843, green: 0.7725, blue: 0.2863)
  static let ochre = Color(red: 0.6588, green: 0.3294, blue: 0.1804)
  static let ochreBr = Color(red: 0.8706, green: 0.5412, blue: 0.3686)
  static let crit = Color(red: 0.702, green: 0.1529, blue: 0.1176)
  static let critBr = Color(red: 0.8941, green: 0.4588, blue: 0.4157)
  static let caution = Color(red: 0.5608, green: 0.3686, blue: 0.0392)
  static let cautionBr = Color(red: 0.9137, green: 0.7373, blue: 0.3333)
  static let info = Color(red: 0.1725, green: 0.3647, blue: 0.5412)
  static let infoBr = Color(red: 0.498, green: 0.6667, blue: 0.8314)
  static let night = Color(red: 0.0706, green: 0.0863, blue: 0.1216)
  static let night2 = Color(red: 0.102, green: 0.1255, blue: 0.1882)
  static let night3 = Color(red: 0.2275, green: 0.2706, blue: 0.3412)
  static let chalk = Color(red: 0.9255, green: 0.9176, blue: 0.8941)
  static let chalk2 = Color(red: 0.6588, green: 0.6863, blue: 0.7216)
  static let chalk3 = Color(red: 0.5412, green: 0.5725, blue: 0.6078)
  static let rule = Color(red: 0.8941, green: 0.8745, blue: 0.8314)
}

/// Meaning-carrying colours. Static — safe to use directly (each already resolves per-theme where relevant).
enum MzSemanticColor {
  static let successLight = Color(red: 0.1843, green: 0.4196, blue: 0.2275)
  static let criticalLight = Color(red: 0.702, green: 0.1529, blue: 0.1176)
  static let infoLight = Color(red: 0.1725, green: 0.3647, blue: 0.5412)
  static let successDark = Color(red: 0.3451, green: 0.6902, blue: 0.4157)
  static let criticalDark = Color(red: 0.8941, green: 0.4588, blue: 0.4157)
  static let infoDark = Color(red: 0.498, green: 0.6667, blue: 0.8314)
  static let cautionText = Color(red: 0.5608, green: 0.3686, blue: 0.0392)
  static let cautionFill = Color(red: 0.9843, green: 0.7725, blue: 0.2863)
  static let restricted = Color(red: 0.6588, green: 0.3294, blue: 0.1804)

  static func resolved(_ colorScheme: ColorScheme) -> Resolved { colorScheme == .dark ? dark : light }

  struct Resolved {
    let success: Color
    let critical: Color
    let info: Color
  }

  static let light = Resolved(success: successLight, critical: criticalLight, info: infoLight)
  static let dark = Resolved(success: successDark, critical: criticalDark, info: infoDark)
}

/// Theme-resolved surface/text colours. Components MUST use these (via `MzTheme.current(for:)`), never MzColor directly.
struct MzTheme {
  let bg: Color
  let surface: Color
  let surfaceSunk: Color
  let surfaceInvert: Color
  let text: Color
  let text2: Color
  let text3: Color
  let textInvert: Color
  let border: Color
  let accent: Color
  let accentWarm: Color
  let anchor: Color
  let anchorFill: Color
  let onAnchor: Color

  static let light = MzTheme(bg: Color(red: 0.9608, green: 0.9529, blue: 0.9294), surface: Color(red: 1, green: 1, blue: 1), surfaceSunk: Color(red: 0.9176, green: 0.902, blue: 0.8627), surfaceInvert: Color(red: 0.1059, green: 0.1647, blue: 0.2902), text: Color(red: 0.0863, green: 0.098, blue: 0.102), text2: Color(red: 0.2902, green: 0.3294, blue: 0.3137), text3: Color(red: 0.3922, green: 0.4275, blue: 0.4078), textInvert: Color(red: 1, green: 1, blue: 1), border: Color(red: 0.8941, green: 0.8745, blue: 0.8314), accent: Color(red: 0.1843, green: 0.4196, blue: 0.2275), accentWarm: Color(red: 0.6588, green: 0.3294, blue: 0.1804), anchor: Color(red: 0.1059, green: 0.1647, blue: 0.2902), anchorFill: Color(red: 0.1059, green: 0.1647, blue: 0.2902), onAnchor: Color(red: 1, green: 1, blue: 1))
  static let dark = MzTheme(bg: Color(red: 0.0706, green: 0.0863, blue: 0.1216), surface: Color(red: 0.102, green: 0.1255, blue: 0.1882), surfaceSunk: Color(red: 0.0706, green: 0.0863, blue: 0.1216), surfaceInvert: Color(red: 0.9255, green: 0.9176, blue: 0.8941), text: Color(red: 0.9255, green: 0.9176, blue: 0.8941), text2: Color(red: 0.6588, green: 0.6863, blue: 0.7216), text3: Color(red: 0.5412, green: 0.5725, blue: 0.6078), textInvert: Color(red: 0.0706, green: 0.0863, blue: 0.1216), border: Color(red: 0.2275, green: 0.2706, blue: 0.3412), accent: Color(red: 0.3451, green: 0.6902, blue: 0.4157), accentWarm: Color(red: 0.8706, green: 0.5412, blue: 0.3686), anchor: Color(red: 0.5765, green: 0.6627, blue: 0.8392), anchorFill: Color(red: 0.1059, green: 0.1647, blue: 0.2902), onAnchor: Color(red: 0.9255, green: 0.9176, blue: 0.8941))

  static func current(for colorScheme: ColorScheme) -> MzTheme { colorScheme == .dark ? .dark : .light }
}

// SwiftUI's Font.Weight has no public integer initializer, so the numeric weight scale
// (font.weight.regular=400 ... black=800) maps onto its named cases explicitly:
extension Font.Weight {
  static let mzRegular = Font.Weight.regular
  static let mzMedium = Font.Weight.medium
  static let mzSemibold = Font.Weight.semibold
  static let mzBold = Font.Weight.bold
  static let mzBlack = Font.Weight.black
}

/// Composite type styles. Uses Font.custom(relativeTo:) so sizes scale with Dynamic Type.
enum MzFont {
  static let display = Font.custom(MzFontFamily.sans, size: 34, relativeTo: .body).weight(.mzBlack)
  static let title1 = Font.custom(MzFontFamily.sans, size: 26, relativeTo: .body).weight(.mzBlack)
  static let title2 = Font.custom(MzFontFamily.sans, size: 21, relativeTo: .body).weight(.mzBold)
  static let title3 = Font.custom(MzFontFamily.sans, size: 18, relativeTo: .body).weight(.mzBold)
  static let bodyLg = Font.custom(MzFontFamily.sans, size: 17, relativeTo: .body).weight(.mzRegular)
  static let body = Font.custom(MzFontFamily.sans, size: 16, relativeTo: .body).weight(.mzRegular)
  static let bodyEmph = Font.custom(MzFontFamily.sans, size: 16, relativeTo: .body).weight(.mzSemibold)
  static let bodySm = Font.custom(MzFontFamily.sans, size: 14, relativeTo: .body).weight(.mzRegular)
  static let caption = Font.custom(MzFontFamily.sans, size: 13, relativeTo: .body).weight(.mzRegular)
  static let label = Font.custom(MzFontFamily.sans, size: 11, relativeTo: .body).weight(.mzBold)
  static let numeric = Font.custom(MzFontFamily.mono, size: 14, relativeTo: .body).weight(.mzMedium)
}

enum MzFontFamily {
  static let sans = "Montserrat" // full fallback stack: Montserrat, system-ui, -apple-system, Segoe UI, Roboto, sans-serif
  static let mono = "ui-monospace" // full fallback stack: ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, monospace
}

enum MzSpace {
  static let xxxs: CGFloat = 2
  static let xxs: CGFloat = 4
  static let xs: CGFloat = 8
  static let sm: CGFloat = 12
  static let md: CGFloat = 16
  static let lg: CGFloat = 24
  static let xl: CGFloat = 40
  static let xxl: CGFloat = 60
}

enum MzRadius {
  static let sm: CGFloat = 4
  static let md: CGFloat = 8
  static let lg: CGFloat = 12
  static let full: CGFloat = 999
}

enum MzTouch {
  static let min: CGFloat = 44
  static let minSpaced: CGFloat = 48
}

enum MzIconSize {
  static let sm: CGFloat = 18
  static let md: CGFloat = 20
  static let lg: CGFloat = 24
  static let xl: CGFloat = 28
}

/// Fluent UI System Icons glyph names (see BRAND.md §6). Render the matching SVG asset.
enum MzIcon {
  static let verified = "checkmark_circle"
  static let partial = "shield"
  static let failed = "error_circle"
  static let restricted = "lock_closed"
  static let consent = "handshake"
  static let audit = "history"
  static let revoke = "prohibited"
  static let dispute = "flag"
  static let delegate = "people_swap"
  static let document = "document"
  static let payment = "payment"
  static let language = "translate"
  static let signLanguage = "hand_wave"
  static let assist = "person_support"
  static let location = "location"
  static let offline = "cloud_off"
}

enum MzDuration {
  static let instant: TimeInterval = 0.1
  static let quick: TimeInterval = 0.18
  static let base: TimeInterval = 0.28
  static let slow: TimeInterval = 0.38
  static let deliberate: TimeInterval = 1.1
}

/// Cubic-bezier control points (x1, y1, x2, y2). Feed into Animation.timingCurve(_:_:_:_:duration:).
enum MzEasing {
  static let standard: (Double, Double, Double, Double) = (0.2, 0.8, 0.3, 1)
  static let overshoot: (Double, Double, Double, Double) = (0.2, 1.5, 0.4, 1)
  static let exit: (Double, Double, Double, Double) = (0.4, 0, 1, 1)
}

struct MzElevation {
  let offsetX: CGFloat; let offsetY: CGFloat; let blur: CGFloat; let color: Color
  static let none = MzElevation(offsetX: 0, offsetY: 0, blur: 0, color: Color(red: 0, green: 0, blue: 0, opacity: 0))
  static let card = MzElevation(offsetX: 0, offsetY: 1, blur: 3, color: Color(red: 0, green: 0, blue: 0, opacity: 0.1216))
  static let lift = MzElevation(offsetX: 0, offsetY: 8, blur: 24, color: Color(red: 0, green: 0, blue: 0, opacity: 0.1412))
}

