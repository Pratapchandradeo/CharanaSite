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
          'display': ['Cormorant Garamond', 'serif'],
        },
        colors: {
          'spiritual': {
            50: '#f5f3f0',
            100: '#e8e2d9',
            200: '#d1c5b3',
            300: '#baa88d',
            400: '#a38b67',
            500: '#8c6e41',
            600: '#705834',
            700: '#544227',
            800: '#382c1a',
            900: '#1c160d',
          }
        }
      },
    },
    plugins: [],
  }