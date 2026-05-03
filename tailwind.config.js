/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        charcoal: '#050505',
        cream: '#f4eee2',
        red: '#c9261f',
        gold: '#dca62e',
      },
      boxShadow: {
        red: '8px 8px 0 #7f1712',
        black: '10px 10px 0 rgba(0, 0, 0, 0.55)',
      },
    },
  },
  plugins: [],
}
