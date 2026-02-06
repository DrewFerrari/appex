# AppEx Design System

A comprehensive dark-first design system for the AppEx Customer Portal and Marketing Website.

## Overview

The AppEx Design System provides:
- **Dark-first theme** with carefully selected color palettes
- **Consistent styling** across all AppEx applications
- **Accessibility-first** approach with high contrast and reduced motion support
- **Component utilities** for rapid development
- **Responsive design** with mobile-first approach

## Theme Configuration

### Colors

#### Backgrounds (Dark-First)
- **Primary**: `#0f172a` - Deep dark blue for main backgrounds
- **Secondary**: `#1e293b` - Lighter dark blue for panels
- **Tertiary**: `#334155` - Cards and elevated surfaces

#### Text Colors
- **Primary**: `#ffffff` - Main text content
- **Secondary**: `#f8fafc` - Secondary text and labels
- **Muted**: `#94a3b8` - Disabled and helper text
- **Disabled**: `#64748b` - Disabled elements

#### Accent Colors (CTAs & Highlights)
- **Blue**: `#3b82f6` - Primary CTAs and interactive elements
- **Green**: `#10b981` - Success states and financial indicators

#### Status Colors
- **Success**: `#10b981` (Green)
- **Warning**: `#f59e0b` (Amber)
- **Danger**: `#ef4444` (Red)
- **Info**: `#3b82f6` (Blue)

### Typography

- **Font Family**: Inter, system-ui, sans-serif
- **Monospace**: JetBrains Mono, monospace
- **Responsive**: Font sizes scale appropriately on mobile devices

### Spacing & Sizing

- **Border Radius**: 0.5rem (8px) default
- **Custom utilities** for consistent spacing throughout applications

## Usage

### Customer Portal (React + Vite)

```tsx
// Using Tailwind classes
<button className="bg-accent-blue hover:bg-accent-blue/90 text-white px-4 py-2 rounded-lg">
  Primary Button
</button>

// Using CSS variables
<div style={{ backgroundColor: 'var(--background-primary)' }}>
  Content
</div>
```

### Marketing Website (Next.js)

```tsx
// Using Tailwind classes
<button className="bg-accent-blue hover:bg-accent-blue/90 text-white px-4 py-2 rounded-lg">
  Primary Button
</button>

// Using utility classes
<div className="bg-background-primary text-text-primary">
  Content
</div>
```

## Component Variants

### Buttons
- **Primary**: `bg-accent-blue text-white`
- **Secondary**: `bg-background-tertiary border-accent-blue text-accent-blue`
- **Success**: `bg-accent-green text-white`
- **Ghost**: `bg-transparent hover:bg-background-tertiary`

### Cards
- **Default**: `bg-background-secondary border border-border rounded-lg`
- **Elevated**: Adds shadow and hover effects
- **Flat**: No borders, minimal styling

### Status Badges
- **Success**: `bg-status-success/10 text-status-success border border-status-success/20`
- **Warning**: `bg-status-warning/10 text-status-warning border border-status-warning/20`
- **Error**: `bg-status-danger/10 text-status-danger border border-status-danger/20`
- **Info**: `bg-status-info/10 text-status-info border border-status-info/20`

## Accessibility Features

### High Contrast Mode
- Enhanced borders and text colors for users with high contrast preferences

### Reduced Motion
- All animations and transitions respect `prefers-reduced-motion`

### Focus Management
- Consistent focus rings with `focus-ring` utility class
- Keyboard navigation support

### Responsive Design
- Mobile-first approach
- Responsive typography scaling
- Touch-friendly interactive elements

## CSS Custom Properties

The design system uses CSS custom properties for runtime theming:

```css
:root {
  --background-primary: #0f172a;
  --background-secondary: #1e293b;
  --background-tertiary: #334155;
  --text-primary: #ffffff;
  --text-secondary: #f8fafc;
  --accent-blue: #3b82f6;
  --accent-green: #10b981;
  --status-success: #10b981;
  --status-warning: #f59e0b;
  --status-danger: #ef4444;
  --border-color: #334155;
  --ring-color: #3b82f6;
}
```

## File Structure

```
design-system/
├── theme.ts          # TypeScript theme configuration
├── components.ts     # Component variant definitions
└── README.md         # This documentation
```

## Implementation Notes

### Customer Portal
- **Config**: `tailwind.config.js`
- **Styles**: `src/index.css`
- **Framework**: React + Vite

### Marketing Website
- **Config**: `tailwind.config.js`
- **Styles**: `src/app/globals.css`
- **Framework**: Next.js

Both applications share the same color palette and design principles, ensuring consistency across the AppEx ecosystem.

## Migration Guide

When updating existing components:

1. Replace old color classes with new semantic ones
2. Use CSS variables for dynamic theming
3. Apply accessibility utilities (`focus-ring`, `scrollbar-thin`)
4. Test in high contrast and reduced motion modes

## Best Practices

1. **Use semantic color names** (`status-success`, `accent-blue`) instead of literal colors
2. **Leverage CSS variables** for dynamic theming
3. **Apply accessibility utilities** for better user experience
4. **Test across devices** with responsive design utilities
5. **Maintain consistency** using the defined component variants

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- CSS custom properties supported
- Tailwind CSS utilities for broader compatibility
- Graceful degradation for older browsers
