import tsEslint from 'typescript-eslint';
import js from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default tsEslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tsEslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { caughtErrors: 'none' }],
      '@typescript-eslint/consistent-type-imports': 'error',
    },
  },
  eslintPluginPrettierRecommended,
);
