module.exports = {
  root: true,

  extends: ['@nighttrax/eslint-config-ts'],

  rules: {
    'prettier/prettier': 'error',
    'max-classes-per-file': 0,
    'class-methods-use-this': 0,
  },
};
