/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fffbe6',
          100: '#fff3b3',
          200: '#ffe980',
          300: '#ffe04d',
          400: '#ffd61a',
          500: '#facc15', // MachoBeast Electric Gold
          600: '#ca9e03',
          700: '#997300',
          800: '#664c00',
          900: '#332500',
          dark: '#111318',
          black: '#090a0f',
          accent: '#FFB800'
        },
        navy: {
          50: '#f0f7ff',
          100: '#e0effe',
          800: '#0f172a',
          900: '#0b0f19',
          950: '#05070d'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Outfit', 'Inter', 'sans-serif']
      },
      boxShadow: {
        'card': '0 2px 12px 0 rgba(0, 0, 0, 0.05)',
        'card-hover': '0 8px 24px -4px rgba(0, 0, 0, 0.12)',
        'gold-glow': '0 0 20px rgba(250, 204, 21, 0.35)'
      }
    }
  },
  plugins: []
};
