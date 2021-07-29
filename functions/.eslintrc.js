module.exports = {
  root: false,
  env: {
    es6: false,
    node: false,
  },
  extends: [
    "eslint:recommended",
    "google",
  ],
  rules: {
    quotes: ["error", "double"],
  },
};
