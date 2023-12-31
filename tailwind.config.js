/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Montserrat", "sans-serif"],
      },
      colors: {
        yankeeBlue: "#19283F",
        champagnePink: "#F3DACE",
        powderBlue: "#B3E5E9",
        alabaster: "#F2F5E5",
        diamond: "#C4E1FF",
        keyLime: "#DFF296",
        princetonOrange: "#F97F29",
      },
      screens: {
        md: "930px",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
