// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";
import eslintConfigPrettier from "eslint-config-prettier";

export default tseslint.config(
  {
    ignores: ["**/dist/", "docs/.vitepress/cache/", "**/.nuxt/", "**/.output/"],
  },

  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  // @ts-expect-error Incorrect type export from vue eslint
  ...pluginVue.configs["flat/essential"],
  eslintConfigPrettier,

  // ==== Styling rules ====
  {
    rules: {
      "spaced-comment": ["error", "always", { markers: ["/"] }],
      curly: "error",
      "@typescript-eslint/consistent-type-definitions": "error",
      "@typescript-eslint/array-type": ["error", { default: "array-simple" }],

      // FIXME: ts eslint yield "You have used a rule which requires parserServices to be generated" error
      // Disable for now
      //
      // "@typescript-eslint/consistent-type-imports": [
      //   "error",
      //   { fixStyle: "inline-type-imports" },
      // ],
      "@typescript-eslint/no-import-type-side-effects": "error",
    },
  },

  // ==== Relax rules ====
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "all",
          argsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
    },
  },

  // ==== Strict rules ====
  {
    rules: {
      eqeqeq: ["error", "smart"],
      "no-console": ["error"],
      "no-duplicate-imports": "error",
      // Ref: https://github.com/typescript-eslint/typescript-eslint/issues/3797
      "valid-typeof": "error",
    },
  },

  // ==== Nuxt-specific overrides ====
  {
    files: ["packages/example-nuxt*/**/*.{ts,vue}"],
    rules: {
      "no-undef": "off",
    },
  },
);
