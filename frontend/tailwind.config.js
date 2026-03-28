/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-dark': '#0f172a',
        'brand-light': '#f8fafc',
        'priority-high': '#ef4444',
        'priority-medium': '#f59e0b',
        'priority-low': '#10b981'
      },
      fontFamily: {
        'sans': ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
