/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{html,js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: "#FAF6F1",
          100: "#F5EDE4",
          200: "#EDE1D4",
          300: "#E4D1C1",
          400: "#D6BFA9",
          500: "#C8AD94",
          600: "#B49A81",
          700: "#9C836B",
          800: "#806B55",
          900: "#65533F",
        },
      },
    },
  },
  plugins: [],
};
