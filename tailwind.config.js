/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        twitter: {
          25: 'rgba(29, 155, 240,0.25)',
          50: 'rgba(29, 155, 240,0.50)',
          75: 'rgba(29, 155, 240,0.75)',
          100: 'rgb(29, 155, 240)',

        }
      }
    },
  },
  plugins: [],
}

