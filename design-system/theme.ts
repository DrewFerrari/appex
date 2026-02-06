// AppEx Design System - Dark-First Theme Configuration
// Shared across Customer Portal and Marketing Website

export const theme = {
  // Background Colors
  backgrounds: {
    primary: '#0f172a', // Deep dark blue
    secondary: '#1e293b', // Lighter dark blue
    tertiary: '#334155', // Cards/elevated surfaces
  },

  // Text Colors
  text: {
    primary: '#ffffff',    // Main text
    secondary: '#f8fafc',  // Secondary text
    muted: '#94a3b8',      // Muted/disabled text
    disabled: '#64748b',   // Disabled text
  },

  // Accent Colors (CTAs, highlights)
  accent: {
    blue: '#3b82f6',   // Primary CTAs
    green: '#10b981',  // Success/money
  },

  // Status Colors
  status: {
    success: '#10b981', // Green
    warning: '#f59e0b', // Amber
    danger: '#ef4444',  // Red
    info: '#3b82f6',    // Blue
  },

  // Semantic Color Mappings
  colors: {
    // Primary brand colors
    primary: '#3b82f6',
    secondary: '#10b981',
    
    // Background hierarchy
    background: {
      DEFAULT: '#0f172a',
      primary: '#0f172a',
      secondary: '#1e293b',
      tertiary: '#334155',
    },
    
    // Text hierarchy
    foreground: {
      DEFAULT: '#ffffff',
      primary: '#ffffff',
      secondary: '#f8fafc',
      muted: '#94a3b8',
      disabled: '#64748b',
    },
    
    // Interactive elements
    accent: {
      DEFAULT: '#3b82f6',
      blue: '#3b82f6',
      green: '#10b981',
      foreground: '#ffffff',
    },
    
    // Status system
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
    
    // Border and input
    border: '#334155',
    input: '#1e293b',
    ring: '#3b82f6',
  },

  // Typography
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'monospace'],
    },
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem' }],
      sm: ['0.875rem', { lineHeight: '1.25rem' }],
      base: ['1rem', { lineHeight: '1.5rem' }],
      lg: ['1.125rem', { lineHeight: '1.75rem' }],
      xl: ['1.25rem', { lineHeight: '1.75rem' }],
      '2xl': ['1.5rem', { lineHeight: '2rem' }],
      '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      '5xl': ['3rem', { lineHeight: '1' }],
      '6xl': ['3.75rem', { lineHeight: '1' }],
    },
    fontWeight: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },

  // Spacing
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
  },

  // Border Radius
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    full: '9999px',
  },

  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  },

  // Animation
  animation: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
    },
    easing: {
      ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },

  // Breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
} as const

// CSS Custom Properties for runtime theme switching
export const cssVariables = {
  // Backgrounds
  '--background-primary': theme.backgrounds.primary,
  '--background-secondary': theme.backgrounds.secondary,
  '--background-tertiary': theme.backgrounds.tertiary,
  
  // Text
  '--text-primary': theme.text.primary,
  '--text-secondary': theme.text.secondary,
  '--text-muted': theme.text.muted,
  '--text-disabled': theme.text.disabled,
  
  // Accents
  '--accent-blue': theme.accent.blue,
  '--accent-green': theme.accent.green,
  
  // Status
  '--status-success': theme.status.success,
  '--status-warning': theme.status.warning,
  '--status-danger': theme.status.danger,
  '--status-info': theme.status.info,
  
  // Borders
  '--border-color': theme.colors.border,
  '--ring-color': theme.colors.ring,
  
  // Spacing
  '--radius': theme.borderRadius.lg,
} as const

export type Theme = typeof theme
