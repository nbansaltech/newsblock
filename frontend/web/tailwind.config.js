/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}", // Include JSX files
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00FFFF', // Neon cyan
        secondary: '#FF00FF', // Neon magenta
        background: '#000000', // Black
        surface: '#1A1A1A', // Dark gray
      },
      fontFamily: {
        sciFi: ['"Orbitron"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
