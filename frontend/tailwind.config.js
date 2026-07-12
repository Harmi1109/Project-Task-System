/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1C1E21",
        paper: "#F7F6F3",
        pine: {
          50: "#EAF2F0",
          100: "#CFE3DD",
          400: "#3E8A76",
          500: "#2B6E62",
          600: "#215A50",
          700: "#194840",
        },
        ochre: {
          400: "#E0A24A",
          500: "#D68A34",
          600: "#B06F26",
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
    },
  },
  plugins: [],
};
