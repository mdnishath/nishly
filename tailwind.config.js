/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        all: "0px 0px 15px -3px rgba(0,0,0,0.2)",
      },
      colors: {
        greenDark: "#075E54",
        greenLight: "#25D366",
        dark: "#334155",
      },
    },
    fontFamily: {
      pop: ["Poppins", "sans-serif"],
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
