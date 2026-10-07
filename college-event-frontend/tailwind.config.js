/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'Roboto', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#ecfeff',
          100: '#cffafe',
          500: '#0891b2',
          600: '#0e7490',
          700: '#155e75',
          900: '#164e63',
        },
        ink: '#172033',
      },
      boxShadow: {
        soft: '0 18px 55px rgba(15, 23, 42, 0.10)',
        lift: '0 16px 34px rgba(15, 23, 42, 0.12)',
      },
    },
  },
  plugins: [],
}
