module.exports = {
  'root': true,

  'extends': [
    '@nighttrax/eslint-config-ts',
    'prettier',
    'prettier/react',
    'prettier/@typescript-eslint'
  ],

  'plugins': ['prettier'],

  'rules': {
    'prettier/prettier': 'error',
    'no-useless-constructor': 0,
    'no-empty-function': 0
  }
};
