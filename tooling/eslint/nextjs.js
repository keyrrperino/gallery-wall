/** @type {import('eslint').Linter.Config} */
const config = {
  extends: [
    "plugin:@next/next/core-web-vitals",
    "plugin:tailwindcss/recommended",
  ],
  plugins: ["tailwindcss"],
  rules: {
    "all": "off",
    "@next/next/no-html-link-for-pages": "off",
    "@typescript-eslint/require-await": "off",
    "react/jsx-curly-brace-presence": [
      "error",
      { props: "never", children: "never" },
    ],
    "tailwindcss/no-custom-classname": [2, {
      "whitelist": [
        "font-button-base",
        "h1-heading-bold",
        "number-slide",
        "keen-slider__slide",
        "keen-slider"
      ]
    }]
  },
};

module.exports = config;
