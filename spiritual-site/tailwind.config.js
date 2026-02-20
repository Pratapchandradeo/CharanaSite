/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'odia': ['Baloo Bhai 2', 'cursive'],
        'display': ['Cormorant Garamond', 'serif'],
      },
      colors: {
        'jagannath': {
          'red': '#e31b23',
          'black': '#1a1a1a',
          'white': '#ffffff',
          'yellow': '#fbb829',
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}