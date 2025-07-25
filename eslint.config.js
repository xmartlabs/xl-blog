import js from '@eslint/js';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default [
  js.configs.recommended,
  prettierConfig,
  {
    plugins: {
      prettier,
    },
    rules: {
      'prettier/prettier': 'error',
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
  },
];
