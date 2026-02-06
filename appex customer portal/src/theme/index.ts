export const theme = {
  // Backgrounds
  background: {
    primary: '#0f172a',    // Deep dark blue
    secondary: '#1e293b',  // Lighter dark blue
    tertiary: '#334155',   // Cards/elevated surfaces
  },
  
  // Text
  text: {
    primary: '#ffffff',
    secondary: '#f8fafc',
    muted: '#94a3b8',
    disabled: '#64748b',
  },
  
  // Accent Colors
  accent: {
    blue: '#3b82f6',      // Primary CTAs
    green: '#10b981',     // Success/money
    purple: '#8b5cf6',    // Premium features
  },
  
  // Status Colors
  status: {
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },
  
  // Currency Colors
  currency: {
    usd: '#10b981',
    zwl: '#f59e0b',
    zar: '#8b5cf6',
  }
}

export type Theme = typeof theme
