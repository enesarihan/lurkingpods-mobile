/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#AE8EFF',
        background: '#000000',
        foreground: '#FFFFFF',
      },
    },
  },
  plugins: [],
}

