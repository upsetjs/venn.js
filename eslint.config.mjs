import js from "@eslint/js";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import jest from "eslint-plugin-jest";
import globals from "globals";

export default [
  js.configs.recommended,
  eslintPluginPrettierRecommended,
  jest.configs['flat/recommended'],
  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      "no-console": "off",
      "no-unused-vars": "warn"
    }
  }
];