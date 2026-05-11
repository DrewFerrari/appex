/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        appex: {
          cyan: '#00E5FF',
          blue: '#0A2540',
          purple: '#B535F6',
          navy: '#0A1128',
          dark: '#1C2541',
          charcoal: '#121926'
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'appex-gradient': 'linear-gradient(135deg, #0A2540 0%, #B535F6 100%)',
        'appex-accent': 'linear-gradient(135deg, #00E5FF 0%, #B535F6 100%)',
      },
    },
  },
  plugins: [],
}
