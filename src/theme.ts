/**
 * JustRefer Design Tokens
 * Inspired by Carry.com — clean, minimal, black-and-white-heavy design
 * with strategic green accents for the JustRefer brand.
 */

export const tokens = {
  colors: {
    // Core palette
    black: '#000000',
    white: '#FFFFFF',
    offWhite: '#FAFAFA',

    // Primary brand
    primary: '#0F3D2E',       // Dark forest green — primary buttons, active states
    primaryHover: '#0B2E22',  // Darker green for hover
    accent: '#1F9D55',        // Bright green — success, positive values, highlights
    accentLight: '#E6F4EC',   // Light green tint — badges, icon backgrounds

    // Neutral grays
    gray50: '#F9FAFB',
    gray100: '#F3F4F6',
    gray200: '#E5E7EB',
    gray300: '#D1D5DB',
    gray400: '#9CA3AF',
    gray500: '#6B7280',
    gray600: '#4B5563',
    gray700: '#374151',
    gray800: '#1F2937',
    gray900: '#111827',

    // Background
    pageBg: '#FFFFFF',
    sectionBg: '#FAFAFA',
    cardBg: '#FFFFFF',

    // Borders
    border: '#E5E7EB',
    borderLight: '#F3F4F6',

    // Status
    success: '#1F9D55',
    successBg: '#E6F4EC',
    warning: '#F59E0B',
    warningBg: '#FEF3E2',
    info: '#3B82F6',
    infoBg: '#E8F0FE',
    error: '#EF4444',
    errorBg: '#FDECEC',
  },

  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    fontFamilyMono: "'SF Mono', 'Fira Code', 'Fira Mono', 'Roboto Mono', monospace",

    // Font sizes
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '30px',
    '4xl': '36px',
    '5xl': '48px',
    '6xl': '60px',

    // Font weights
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },

  spacing: {
    0: '0px',
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    5: '20px',
    6: '24px',
    8: '32px',
    10: '40px',
    12: '48px',
    16: '64px',
    20: '80px',
    24: '96px',
  },

  radii: {
    none: '0px',
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },

  shadows: {
    sm: '0 1px 2px rgba(0,0,0,0.05)',
    md: '0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -2px rgba(0,0,0,0.05)',
    lg: '0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -4px rgba(0,0,0,0.04)',
    xl: '0 20px 25px -5px rgba(0,0,0,0.08), 0 8px 10px -6px rgba(0,0,0,0.04)',
  },

  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },
} as const

export type Tokens = typeof tokens
