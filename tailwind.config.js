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
        'button-base': ['DINPro-CondBlack', 'sans-serif',],
        'text-base': ['DINPro-Medium', 'sans-serif',],
        'h1-bold': ['Brothers-Bold', 'sans-serif',],
        'h1-regular': ['Brothers-Regular', 'sans-serif',],
      },
    },
  },
  plugins: [],
};
