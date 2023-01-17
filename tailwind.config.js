/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      maxWidth: {
        container: "1440px",
      },
      colors: {
        primary: "#6C63FF",
        chat: "#e2e0ff",
      },
      boxShadow: {
        bar: "0px 0px 70px -7px rgba(0,0,0,0.7)",
        all: "0px 0px 40px -1px rgba(108,99,255,0.2)",
        btn: "0px 5px 20px -1px rgba(108,99,255,0.7)",
        profile: "0px 5px 20px -1px rgba(108,99,255,0.5)",
      },
    },
    fontFamily: {
      pop: ["Poppins", "sans-serif"],
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
