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
        headline: ['"Novecento Sans"', 'sans-serif'],
        body: ['"Neue Haas Grotesk"', 'sans-serif'],
      },
    },
  },
};
