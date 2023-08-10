var tsConfigs = ['./tsconfig.json'];

var ruleOverrides = {};

module.exports = {
  overrides: [
    {
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
      },
      plugins: ['@typescript-eslint', 'prettier', 'promise'],
      rules: {
        'prettier/prettier': 'error',
      },
      files: ['*.ts', '*.tsx'],
    },
    {
      extends: ['eslint:recommended', 'plugin:import/typescript'],
      parserOptions: {
        sourceType: 'module',
      },
      files: ['./*.mjs', './*.js'],
      rules: ruleOverrides,
    },
  ],
  env: {
    es6: true,
  },
  root: true,
};
