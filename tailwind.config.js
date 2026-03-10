/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0f172a',    // Deep Navy
        secondary: '#0891b2',  // Cyan/Teal
        accent: '#f59e0b',     // Amber
        surface: '#f1f5f9',    // Slate surface
      },
    },
  },
  plugins: [],
}
