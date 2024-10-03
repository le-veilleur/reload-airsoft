/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.tsx",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: false,
  theme: {
    extend: {
      colors: {
        "gris-bleute": "#e2e7ec",
      },
      backgroundImage: {
        "bgi-card": "url('/public/images/topographic-map-background-design/4031277.jpg')",
      },
      fontFamily: {
        Montserrat: ['Montserrat', 'sans-serif'],
        bioweapon: ['Bioweapon', 'sans-serif'],
        LeagueSpartan: ['League Spartan', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
