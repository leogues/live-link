/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        gray: {
          100: "#F6F6F6",
          200: "#F1F0F0",
          300: "#CDD1D6",
          400: "#ACACAC",
          500: "#A8A8A8",
          600: "#9E9E9E",
          700: "#8D8F98",
          800: "#7E7E7E",
          850: "#373131",
          900: "#292D32",
        },
        blue: {
          50: "#DFEBFF",
          100: "#C4C8DA",
          700: "#1A71FF",
          800: "#0060FF",
        },
        darkBlue: {
          400: "#1E2757",
          600: "#242737",
          650: "#25293B",
          700: "#1C1F2E",
          900: "#161929",
        },
        red: {
          200: "#FFC8C8",
          600: "#EB5757",
          800: "#FF4949",
        },
      },
      keyframes: {
        overlayShow: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
      },
      animation: {
        overlayShow: "overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};
