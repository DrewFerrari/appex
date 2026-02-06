/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                background: {
                    primary: 'var(--background-primary)',      // Deep dark blue (main background)
                    secondary: 'var(--background-secondary)',    // Lighter dark blue (cards, panels)
                    tertiary: 'var(--background-tertiary)',     // Elevated surfaces (modals, dropdowns)
                    overlay: 'rgba(15, 23, 42, 0.8)', // Modal overlays
                },
                text: {
                    primary: 'var(--text-primary)',      // Main text
                    secondary: 'var(--text-secondary)',    // Secondary text
                    muted: 'var(--text-muted)',        // Muted/disabled text
                    disabled: '#64748b',     // Disabled state
                    link: '#3b82f6',         // Links
                },
                accent: {
                    blue: '#3b82f6',         // Primary CTAs, main actions
                    blueHover: '#2563eb',    // Blue hover state
                    green: '#10b981',        // Success, earnings, money
                    greenHover: '#059669',   // Green hover state
                    purple: '#8b5cf6',       // Premium features
                    gold: '#f59e0b',         // Gold tier, achievements
                },
                status: {
                    success: '#10b981',      // Successful actions, positive metrics
                    successBg: 'rgba(16, 185, 129, 0.1)',
                    warning: '#f59e0b',      // Warnings, pending states
                    warningBg: 'rgba(245, 158, 11, 0.1)',
                    error: '#ef4444',        // Errors, rejected states
                    errorBg: 'rgba(239, 68, 68, 0.1)',
                    info: '#3b82f6',         // Informational messages
                    infoBg: 'rgba(59, 130, 246, 0.1)',
                },
                tiers: {
                    bronze: '#cd7f32',
                    bronzeBg: 'rgba(205, 127, 50, 0.1)',
                    silver: '#c0c0c0',
                    silverBg: 'rgba(192, 192, 192, 0.1)',
                    gold: '#ffd700',
                    goldBg: 'rgba(255, 215, 0, 0.1)',
                    platinum: '#e5e4e2',
                    platinumBg: 'rgba(229, 228, 226, 0.1)',
                },
                border: {
                    default: '#334155',
                    light: '#475569',
                    focus: '#3b82f6',
                },
            },
            backgroundImage: {
                'gradient-primary': 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                'gradient-success': 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                'gradient-gold': 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            borderRadius: {
                'sm': '0.25rem',
                'md': '0.5rem',
                'lg': '0.75rem',
                'xl': '1rem',
            },
        },
    },
    plugins: [],
}
