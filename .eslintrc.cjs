module.exports = {
  root: true,
  env: {
    es2021: true,
    node: true,
  },

  parser: "vue-eslint-parser",
  parserOptions: {
    ecmaVersion: "latest",
    parser: "@typescript-eslint/parser",
    sourceType: "module",
  },

  plugins: ["@typescript-eslint", "vue"],

  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:vue/vue3-essential",
    "prettier",
  ],

  rules: {
    // ==== Styling rules ====
    "spaced-comment": ["error", "always", { markers: ["/"] }],
    curly: "error",
    "@typescript-eslint/consistent-type-definitions": "error",
    "@typescript-eslint/array-type": ["error", { default: "array-simple" }],

    // ==== Strict rules ====
    eqeqeq: ["error", "smart"],
    "no-console": ["error"],
    "no-duplicate-imports": "error",
    // Ref: https://github.com/typescript-eslint/typescript-eslint/issues/3797
    "valid-typeof": "error",
  },
};
