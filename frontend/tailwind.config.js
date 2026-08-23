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
        parchment: {
          50: '#FAF7EE',
          100: '#F4EEDA',
          200: '#E9DEC0',
          300: '#DECBA3',
          400: '#CEB27B',
          500: '#B89655',
          600: '#9B783E',
          700: '#7B5B2E',
          800: '#5F4423',
          900: '#3D2B16',
          950: '#23180C',
        },
        antique: {
          gold: '#D4AF37',
          'gold-light': '#F3E5AB',
          'gold-dark': '#996515',
          amber: '#D97706',
          bronze: '#8C6D46',
          ink: '#1E1E24',
          seal: '#991B1B',
          'seal-light': '#DC2626',
        },
        slate: {
          850: '#151E2E',
          950: '#090D16',
        }
      },
      fontFamily: {
        kaithi: ['"Noto Sans Kaithi"', 'serif'],
        devanagari: ['"Noto Sans Devanagari"', 'sans-serif'],
        cinzel: ['"Cinzel"', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'gold-glow': '0 0 25px -5px rgba(212, 175, 55, 0.3)',
        'gold-glow-lg': '0 0 40px -2px rgba(212, 175, 55, 0.4)',
        'parchment-inset': 'inset 0 2px 8px 0 rgba(60, 40, 20, 0.12)',
        'parchment-deep': '0 10px 30px -5px rgba(95, 68, 35, 0.2), 0 0 0 1px rgba(184, 150, 85, 0.3)',
      },
      animation: {
        'scanline': 'scan 2.5s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gold-shimmer': 'goldShimmer 3s ease infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        scan: {
          '0%, 100%': { top: '0%' },
          '50%': { top: '95%' },
        },
        goldShimmer: {
          '0%, 100%': { opacity: '0.8', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.02)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        }
      }
    },
  },
  plugins: [],
}
