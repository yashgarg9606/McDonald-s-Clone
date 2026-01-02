/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        mcdonalds: {
          red: '#FF0000',
          yellow: '#FFC72C',
          darkRed: '#DA020E',
        },
      },
    },
  },
  plugins: [],
}

