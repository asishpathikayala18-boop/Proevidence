// ─────────────────────────────────────────────
//  Providence · Typography System
// ─────────────────────────────────────────────
import { StyleSheet, TextStyle } from 'react-native';
import { Colors } from './colors';

// Fonts: use system fonts (replace with custom cosmic font if loaded)
// Recommended: 'Cinzel' (headings) + 'Raleway' (body)
export const FontFamily = {
  display: 'Cinzel-Regular',      // ceremonial / headings
  displayBold: 'Cinzel-Bold',
  body: 'Raleway-Regular',
  bodyMedium: 'Raleway-Medium',
  bodySemiBold: 'Raleway-SemiBold',
  bodyBold: 'Raleway-Bold',
  mono: 'Courier New',
};

export const FontSize = {
  xs:   10,
  sm:   12,
  base: 14,
  md:   16,
  lg:   18,
  xl:   20,
  '2xl': 24,
  '3xl': 28,
  '4xl': 34,
  '5xl': 42,
  '6xl': 52,
};

export const LineHeight = {
  tight:  1.2,
  normal: 1.5,
  loose:  1.8,
};

export const Typography = StyleSheet.create({
  // Display – used for app title, splash
  displayHero: {
    fontSize: FontSize['6xl'],
    letterSpacing: 6,
    textTransform: 'uppercase',
    color: Colors.text.primary,
  } as TextStyle,

  displayTitle: {
    fontSize: FontSize['4xl'],
    letterSpacing: 4,
    textTransform: 'uppercase',
    color: Colors.text.primary,
  } as TextStyle,

  // Headings
  h1: { fontSize: FontSize['3xl'], letterSpacing: 2, color: Colors.text.primary } as TextStyle,
  h2: { fontSize: FontSize['2xl'], letterSpacing: 1, color: Colors.text.primary } as TextStyle,
  h3: { fontSize: FontSize.xl,    letterSpacing: 0.8, color: Colors.text.primary } as TextStyle,
  h4: { fontSize: FontSize.lg,    letterSpacing: 0.5, color: Colors.text.primary } as TextStyle,

  // Body
  bodyLg: { fontSize: FontSize.lg,   lineHeight: FontSize.lg * 1.6,   color: Colors.text.secondary } as TextStyle,
  body:   { fontSize: FontSize.md,   lineHeight: FontSize.md * 1.6,   color: Colors.text.secondary } as TextStyle,
  bodySm: { fontSize: FontSize.base, lineHeight: FontSize.base * 1.6, color: Colors.text.secondary } as TextStyle,

  // Accent / Label
  label:  { fontSize: FontSize.sm,  letterSpacing: 2, textTransform: 'uppercase', color: Colors.text.muted  } as TextStyle,
  caption:{ fontSize: FontSize.xs,  letterSpacing: 1, color: Colors.text.muted } as TextStyle,

  // Gold accent text
  gold:   { color: Colors.text.gold } as TextStyle,
  accent: { color: Colors.text.accent } as TextStyle,
});

export default Typography;
