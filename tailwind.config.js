/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'sp-dark-green': '#06705b',
        'sp-light-green': '#72a895',
        'sp-gray': '#0d3b66',
        'sp-white': '#ffffff',
        'sp-black': '#232323',
        'sp-light-yellow': '#f0d784',
        'sp-red': '#8a0a2a',
      },
      fontFamily: {
        'sp-font': ["'Verdana'", 'sans-serif'],
      },
      fontSize: {
        'heading-1': 'clamp(36px, 4vw, 59px)',
        'heading-2': 'clamp(32px, 3.5vw, 54px)',
        'heading-3': 'clamp(24px, 3vw, 38px)',
        'heading-4': 'clamp(20px, 2.5vw, 34px)',
        'heading-5': 'clamp(18px, 2vw, 30px)',
        'heading-6': 'clamp(16px, 1.5vw, 26px)',
        'body-large': 'clamp(18px, 1.2vw, 20px)',
        'icon-large': '100px',
        'icon-medium': '80px',
        'icon-small': '40px',
        'icon-extra-small': '25px',
      },
      borderRadius: {
        'sp-button': '10px',
      },
    },
  },
  plugins: [],
};
