/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        hotel: {
          50: '#faf8f5',
          100: '#f5f0e8',
          200: '#ebe0d0',
          300: '#dcbe9b',
          400: '#c89d6b',
          500: '#b88247',
          600: '#9e6734',
          700: '#7f4e29',
          800: '#673e24',
          900: '#543320',
          950: '#2e190e',
        },
        navy: {
          800: '#1e293b',
          900: '#0f172a',
          950: '#090d16',
        },
        charcoal: {
          800: '#1e1e1e',
          900: '#141414',
          950: '#0d0d0d',
        },
        cream: '#F4F1EB',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        body: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', '-apple-system', 'sans-serif'],
        heading: ['"Plus Jakarta Sans"', 'Inter', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
