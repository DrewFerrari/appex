// AppEx Design System - Component Styles
// Shared component utilities for Customer Portal and Marketing Website

import { theme } from './theme'

// Button Variants
export const buttonVariants = {
  // Primary buttons - use accent blue
  primary: {
    base: 'bg-accent-blue hover:bg-accent-blue/90 text-white font-medium py-2 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-accent-blue focus:ring-offset-2 focus:ring-offset-background-primary',
    disabled: 'opacity-50 cursor-not-allowed',
    loading: 'relative overflow-hidden',
  },
  
  // Secondary buttons - background tertiary with accent border
  secondary: {
    base: 'bg-background-tertiary hover:bg-background-secondary border border-accent-blue text-accent-blue font-medium py-2 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-accent-blue focus:ring-offset-2 focus:ring-offset-background-primary',
    disabled: 'opacity-50 cursor-not-allowed',
  },
  
  // Success buttons - use accent green
  success: {
    base: 'bg-accent-green hover:bg-accent-green/90 text-white font-medium py-2 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-accent-green focus:ring-offset-2 focus:ring-offset-background-primary',
    disabled: 'opacity-50 cursor-not-allowed',
  },
  
  // Ghost buttons - transparent with hover
  ghost: {
    base: 'bg-transparent hover:bg-background-tertiary text-text-primary font-medium py-2 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-accent-blue focus:ring-offset-2 focus:ring-offset-background-primary',
    disabled: 'opacity-50 cursor-not-allowed',
  },
  
  // Link buttons - text only
  link: {
    base: 'bg-transparent hover:bg-transparent text-accent-blue hover:text-accent-blue/80 font-medium py-1 px-0 rounded-none transition-colors focus:outline-none focus:ring-2 focus:ring-accent-blue focus:ring-offset-2 focus:ring-offset-background-primary',
    disabled: 'opacity-50 cursor-not-allowed',
  },
}

// Card Variants
export const cardVariants = {
  default: {
    base: 'bg-background-secondary border border-border rounded-lg shadow-md',
    header: 'bg-background-tertiary border-b border-border px-6 py-4 rounded-t-lg',
    body: 'px-6 py-4',
    footer: 'bg-background-tertiary border-t border-border px-6 py-4 rounded-b-lg',
  },
  
  elevated: {
    base: 'bg-background-secondary border border-border rounded-lg shadow-lg hover:shadow-xl transition-shadow',
    header: 'bg-background-tertiary border-b border-border px-6 py-4 rounded-t-lg',
    body: 'px-6 py-4',
    footer: 'bg-background-tertiary border-t border-border px-6 py-4 rounded-b-lg',
  },
  
  flat: {
    base: 'bg-background-secondary border-0 rounded-lg',
    header: 'bg-background-tertiary border-b border-border px-6 py-4 rounded-t-lg',
    body: 'px-6 py-4',
    footer: 'bg-background-tertiary border-t border-border px-6 py-4 rounded-b-lg',
  },
}

// Input Variants
export const inputVariants = {
  default: {
    base: 'bg-background-tertiary border border-border text-text-primary placeholder-text-muted rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent transition-colors',
    disabled: 'bg-background-primary border-border text-text-disabled cursor-not-allowed',
    error: 'border-status-danger focus:ring-status-danger',
    success: 'border-status-success focus:ring-status-success',
  },
  
  ghost: {
    base: 'bg-transparent border-0 text-text-primary placeholder-text-muted rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-blue transition-colors',
    disabled: 'text-text-disabled cursor-not-allowed',
    error: 'focus:ring-status-danger',
    success: 'focus:ring-status-success',
  },
}

// Badge Variants
export const badgeVariants = {
  default: {
    base: 'bg-background-tertiary text-text-secondary border border-border px-2 py-1 rounded-md text-sm font-medium',
  },
  
  success: {
    base: 'bg-status-success/10 text-status-success border border-status-success/20 px-2 py-1 rounded-md text-sm font-medium',
  },
  
  warning: {
    base: 'bg-status-warning/10 text-status-warning border border-status-warning/20 px-2 py-1 rounded-md text-sm font-medium',
  },
  
  danger: {
    base: 'bg-status-danger/10 text-status-danger border border-status-danger/20 px-2 py-1 rounded-md text-sm font-medium',
  },
  
  info: {
    base: 'bg-status-info/10 text-status-info border border-status-info/20 px-2 py-1 rounded-md text-sm font-medium',
  },
  
  accent: {
    blue: 'bg-accent-blue/10 text-accent-blue border border-accent-blue/20 px-2 py-1 rounded-md text-sm font-medium',
    green: 'bg-accent-green/10 text-accent-green border border-accent-green/20 px-2 py-1 rounded-md text-sm font-medium',
  },
}

// Alert Variants
export const alertVariants = {
  info: {
    base: 'bg-status-info/10 border border-status-info/20 text-status-info px-4 py-3 rounded-lg',
    icon: 'text-status-danger',
  },
  
  success: {
    base: 'bg-status-success/10 border border-status-success/20 text-status-success px-4 py-3 rounded-lg',
    icon: 'text-status-success',
  },
  
  warning: {
    base: 'bg-status-warning/10 border border-status-warning/20 text-status-warning px-4 py-3 rounded-lg',
    icon: 'text-status-warning',
  },
  
  error: {
    base: 'bg-status-danger/10 border border-status-danger/20 text-status-danger px-4 py-3 rounded-lg',
    icon: 'text-status-danger',
  },
}

// Navigation Variants
export const navigationVariants = {
  sidebar: {
    base: 'bg-background-secondary border-r border-border w-64 h-full',
    item: 'flex items-center gap-3 px-3 py-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-background-tertiary transition-colors',
    itemActive: 'flex items-center gap-3 px-3 py-2 rounded-lg text-text-primary bg-background-tertiary',
  },
  
  topbar: {
    base: 'bg-background-secondary border-b border-border h-16',
    item: 'flex items-center gap-2 px-3 py-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-background-tertiary transition-colors',
    itemActive: 'flex items-center gap-2 px-3 py-2 rounded-lg text-text-primary bg-background-tertiary',
  },
}

// Table Variants
export const tableVariants = {
  default: {
    base: 'w-full bg-background-secondary border border-border rounded-lg overflow-hidden',
    header: 'bg-background-tertiary border-b border-border',
    headerCell: 'px-4 py-3 text-left text-text-secondary font-medium text-sm',
    row: 'border-b border-border hover:bg-background-tertiary/50 transition-colors',
    cell: 'px-4 py-3 text-text-primary',
  },
  
  striped: {
    base: 'w-full bg-background-secondary border border-border rounded-lg overflow-hidden',
    header: 'bg-background-tertiary border-b border-border',
    headerCell: 'px-4 py-3 text-left text-text-secondary font-medium text-sm',
    row: 'border-b border-border hover:bg-background-tertiary/50 transition-colors',
    rowStriped: 'border-b border-border bg-background-tertiary/20 hover:bg-background-tertiary/50 transition-colors',
    cell: 'px-4 py-3 text-text-primary',
  },
}

// Modal Variants
export const modalVariants = {
  default: {
    overlay: 'fixed inset-0 bg-black/50 backdrop-blur-sm z-50',
    content: 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background-secondary border border-border rounded-lg shadow-xl max-w-md w-full mx-4',
    header: 'bg-background-tertiary border-b border-border px-6 py-4 rounded-t-lg',
    body: 'px-6 py-4',
    footer: 'bg-background-tertiary border-t border-border px-6 py-4 rounded-b-lg flex gap-3 justify-end',
  },
  
  fullscreen: {
    overlay: 'fixed inset-0 bg-background-primary z-50',
    content: 'fixed inset-4 bg-background-secondary border border-border rounded-lg shadow-xl overflow-hidden',
    header: 'bg-background-tertiary border-b border-border px-6 py-4',
    body: 'px-6 py-4 overflow-auto',
    footer: 'bg-background-tertiary border-t border-border px-6 py-4 flex gap-3 justify-end',
  },
}

// Utility Classes
export const utilities = {
  // Focus styles
  focusRing: 'focus:outline-none focus:ring-2 focus:ring-accent-blue focus:ring-offset-2 focus:ring-offset-background-primary',
  
  // Loading states
  loadingSkeleton: 'animate-pulse bg-background-tertiary rounded',
  
  // Scrollbar
  scrollbar: 'scrollbar-thin scrollbar-thumb-background-tertiary scrollbar-track-background-secondary hover:scrollbar-thumb-accent-blue/20',
  
  // Transitions
  transition: 'transition-colors duration-200 ease-in-out',
  transitionTransform: 'transition-transform duration-200 ease-in-out',
  
  // Text truncation
  truncate: 'truncate',
  lineClamp: {
    2: 'line-clamp-2',
    3: 'line-clamp-3',
    4: 'line-clamp-4',
  },
}

export type ButtonVariant = keyof typeof buttonVariants
export type CardVariant = keyof typeof cardVariants
export type InputVariant = keyof typeof inputVariants
export type BadgeVariant = keyof typeof badgeVariants
export type AlertVariant = keyof typeof alertVariants
export type NavigationVariant = keyof typeof navigationVariants
export type TableVariant = keyof typeof tableVariants
export type ModalVariant = keyof typeof modalVariants
