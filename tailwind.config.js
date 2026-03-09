/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1E293B',    // Deep Slate
        secondary: '#4F46E5',  // Indigo
        accent: '#0EA5E9',     // Sky
        surface: '#F8FAFC',    // Lightest Slate
      },
    },
  },
  plugins: [],
}
