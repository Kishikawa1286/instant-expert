var tsConfigs = ['./tsconfig.json'];

var ruleOverrides = {};

module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:tailwindcss/recommended',
    'plugin:import/typescript',
    'plugin:react-hooks/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: tsConfigs,
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
    allowImportExportEverywhere: true,
  },
  plugins: ['@typescript-eslint', 'prettier', 'promise'],
  rules: {
    'prettier/prettier': 'error',
  },
};
