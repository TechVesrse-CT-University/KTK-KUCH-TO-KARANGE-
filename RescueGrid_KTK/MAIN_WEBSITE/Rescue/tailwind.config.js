
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Add your custom colors based on CSS variables
        'emergency-red': '#DC2626',
        'safe-green': '#10B981',
        'warning-yellow': '#FACC15',
        'light-gray': '#F9FAFB',
        'charcoal-black': '#111827',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'heading': ['Montserrat', 'sans-serif'],
      }
    },
  },
  plugins: [],
}