/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}", // Include JSX files
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00D9FF', // Bright cyan
        secondary: '#FF0080', // Hot pink
        accent: '#7B61FF', // Purple accent
        background: '#0A0E27', // Deep blue-black
        surface: '#1A1F3A', // Dark blue-gray
        'surface-light': '#252B47', // Lighter surface
      },
      fontFamily: {
        sciFi: ['"Orbitron"', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};
