import { nighttraxTS } from '@nighttrax/eslint-config-ts';

export default nighttraxTS([
  {
    rules: {
      // We use `any` liberally so we have to turn off these otherwise useful rules.
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
    },
  },
]);
