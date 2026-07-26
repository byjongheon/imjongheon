import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import astro from "eslint-plugin-astro";

export default [
  js.configs.recommended,

  ...tseslint.configs.recommended,

  ...astro.configs.recommended,

  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },

  {
    files: ["**/*.astro"],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
      },
    },
  },

  {
    ignores: ["dist", ".astro", "node_modules"],
  },
];
