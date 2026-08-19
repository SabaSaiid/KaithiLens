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
        },
        antique: {
          gold: '#D4AF37',
          amber: '#D97706',
          bronze: '#8C6D46',
          ink: '#1E1E24',
          seal: '#991B1B',
        },
        slate: {
          850: '#151E2E',
          950: '#0B0F19',
        }
      },
      fontFamily: {
        kaithi: ['"Noto Sans Kaithi"', 'serif'],
        devanagari: ['"Noto Sans Devanagari"', 'sans-serif'],
        cinzel: ['"Cinzel"', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'gold-glow': '0 0 25px -5px rgba(212, 175, 55, 0.25)',
        'parchment-inset': 'inset 0 2px 8px 0 rgba(60, 40, 20, 0.12)',
      }
    },
  },
  plugins: [],
}
