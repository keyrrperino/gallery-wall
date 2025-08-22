// tailwind.config.js

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        headline: ['"novecento-sans-condensed"', 'sans-serif'],
        body: ['"neue-haas-grotesk-display"', 'sans-serif'],
      },
    },
  },
};
