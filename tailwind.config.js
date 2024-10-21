/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "cinema-blue": {
          DEFAULT: "#0d253f",
          light: "#1e3a5f",
          lighter: "#2a4d7d", // New lighter shade
        },
        "cinema-gold": {
          DEFAULT: "#ffc107",
          dark: "#e6ac00",
          darker: "#cc9900",
        },
      },
    },
  },
  plugins: [],
};
