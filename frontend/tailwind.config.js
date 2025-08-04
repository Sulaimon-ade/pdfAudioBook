/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FFF8DC',
        'chocolate': {
          50: '#FAF5F0',
          100: '#F4E6D7',
          200: '#E6C2A6',
          300: '#D2A574',
          400: '#C4914A',
          500: '#B8860B',
          600: '#A0522D',
          700: '#8B4513',
          800: '#654321',
          900: '#3E2723'
        },
        amber: {
          50: '#FFFBF0',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F'
        }
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
      },
    },
  },
  plugins: [],
};