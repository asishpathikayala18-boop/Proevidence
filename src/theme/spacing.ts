// ─────────────────────────────────────────────
//  Providence · Spacing, Border Radius, Shadows
// ─────────────────────────────────────────────
import { Colors } from './colors';

export const Spacing = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 56,
  '5xl': 72,
};

export const Radius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  '3xl': 28,
  full: 9999,
};

// Shadow elevation presets
export const Shadows = {
  none: {},

  sm: {
    shadowColor: Colors.glow.purple,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 3,
  },

  md: {
    shadowColor: Colors.glow.purple,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 6,
  },

  lg: {
    shadowColor: Colors.glow.purple,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 10,
  },

  gold: {
    shadowColor: Colors.glow.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.7,
    shadowRadius: 14,
    elevation: 8,
  },

  glow: {
    shadowColor: Colors.glow.purple,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 30,
    elevation: 12,
  },
};

// Border styles
export const Borders = {
  glass: {
    borderWidth: 1,
    borderColor: 'rgba(155,126,255,0.2)',
  },
  goldThin: {
    borderWidth: 1,
    borderColor: 'rgba(232,160,32,0.4)',
  },
  goldMedium: {
    borderWidth: 1.5,
    borderColor: 'rgba(232,160,32,0.6)',
  },
  purpleGlow: {
    borderWidth: 1,
    borderColor: 'rgba(106,61,232,0.5)',
  },
};

export const Layout = {
  screenPaddingH: Spacing.base,
  screenPaddingV: Spacing.lg,
  cardPadding: Spacing.lg,
  headerHeight: 64,
  tabBarHeight: 70,
};
