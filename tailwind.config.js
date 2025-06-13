
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#030014",
        "light-100": "#cecefb",
        "light-200": "#a8b5db",
        "gray-100": "#9ca4ab",
        "dark-100": "#0f0d23",
      },
      fontFamily: {
        sans: ["DM Sans", "sans-serif"],
        bebas: ["Bebas Neue", "sans-serif"],
      },
      backgroundImage: {
        "hero-pattern": "url('/hero-bg.png')",
      },
      screens: {
        xs: "480px", 
      },
    },
  },
  plugins: [],
};
