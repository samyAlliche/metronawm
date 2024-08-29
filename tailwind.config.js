/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js}",
    "./public/*.{html,js}",
    // Add paths to your files where Tailwind classes will be used
  ],
  theme: {
    extend: {
      fontFamily: {
        "ds-digital": ['"DS-Digital"', "sans-serif"],
      },
      dropShadow: {
        glow: [
          "0 0px 20px rgba(255,255, 255, 0.35)",
          "0 0px 65px rgba(255, 255,255, 0.2)",
        ],
      },
    },
  },
  plugins: [],
};
