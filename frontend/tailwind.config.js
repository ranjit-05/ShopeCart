export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Bodoni Moda"', '"Playfair Display"', 'Didot', 'Georgia', 'serif'],
        display: ['"Bodoni Moda"', '"Playfair Display"', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      letterSpacing: {
        'tightest': '-0.04em',
        'wider': '0.08em',
        'widest': '0.18em',
        'ultra': '0.28em',
        'mega': '0.38em',
      },
      colors: {
        noir: {
          50: '#f8f8f8',
          100: '#f0f0f0',
          200: '#e2e2e2',
          300: '#c8c8c8',
          400: '#9b9b9b',
          500: '#6d6d6d',
          600: '#464646',
          700: '#2b2b2b',
          800: '#1a1a1a',
          900: '#111111',
          950: '#080808',
        },
      },
    },
  },
  plugins: [],
}
