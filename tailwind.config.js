/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    colors: {
      black: "#000000",
      color1: "#011140",
      color2: "#ACD7F2",
      color3: "#0B8CD5",
      color4: "#2758DA",
      white: "#FFFFFF",
      red: "#BF0404",
      green: "#02731E",
      gray: colors.slate,
    },
    extend: {}
  },
  plugins: []
};