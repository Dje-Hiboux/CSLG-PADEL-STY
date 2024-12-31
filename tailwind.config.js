/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FDF5F3',
          100: '#FAE8E4',
          200: '#F5D0C9',
          300: '#EFB3A7',
          400: '#E08D7A',
          500: '#A0522D', // Sienna - couleur principale
          600: '#8E4726',
          700: '#733A1F',
          800: '#5C2E18',
          900: '#4A2513',
        },
        dark: {
          100: '#1F1B1A', // Plus foncé avec une teinte chaude
          200: '#171312',
          300: '#0F0C0B',
          400: '#070505',
        },
      },
      fontFamily: {
        sans: ['Space Grotesk', 'sans-serif'],
      },
    },
  },
  plugins: [],
};