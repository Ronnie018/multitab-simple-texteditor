/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    colors: {
      blue_main: "#022DEE",
      blue_dark: "#040267",
      blue_light: "#5F7CFF",
      light_focus: "#2E54FF",
      white_ish: "#EDEDED",
      white: "#fff",
      black: "#000",
      dark_gray: "#232323",
    },
  },
  plugins: [require("daisyui")],
};
