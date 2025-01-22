const path = require('path');

module.exports = {
  root: true,
  env: { browser: true, es2024: true },
  extends: [
    'airbnb',
    'airbnb-typescript',
    'airbnb/hooks',
    'eslint:recommended',
    'plugin:import/recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:react/jsx-runtime',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    c,
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
  plugins: ['react-refresh', '@typescript-eslint', 'prettier', 'import'],
  rules: {
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    'react/display-name': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    'import/prefer-default-export': 'off',
    'import/no-unresolved': [2, { caseSensitive: false }],
    'react/jsx-props-no-spreading': 'off',
    //*
    // 'import/no-unresolved': ['error', { commonjs: true }],
    // 'import/no-extraneous-dependencies': 'error',
    'node/no-missing-require': 'off',
    'node/no-extraneous-import': 'off',
    eqeqeq: ['error', 'always'],
    curly: ['error', 'multi-line'],
    'import/order': [
      'error',
      {
        groups: [['builtin', 'external'], ['internal'], ['parent', 'sibling', 'index']],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
    // 'import/order': [
    //   'error',
    //   {
    //     groups: ['builtin', 'external', 'internal', ['sibling', 'parent'], 'index', 'object', 'type'],
    //     'newlines-between': 'always',
    //     alphabetize: {
    //       order: 'asc',
    //       caseInsensitive: true,
    //     },
    //   },
    // ],
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {
        project: path.join(__dirname, './tsconfig.json'),
      },
      alias: {
        map: [
          ['@', path.join(__dirname, './src/')],
          ['@images', path.join(__dirname, './src/assets/images/')],
          ['@styles', path.join(__dirname, './src/assets/styles/')],
          ['@components', path.join(__dirname, './src/components/')],
          ['@hooks', path.join(__dirname, './src/hooks/')],
          ['@modules', path.join(__dirname, './src/modules/')],
          ['@routes', path.join(__dirname, './src/routes/')],
          ['@services', path.join(__dirname, './src/services/')],
          ['@secure', path.join(__dirname, './src/services/secure/')],
          ['@types', path.join(__dirname, './src/types/')],
          ['@utils', path.join(__dirname, './src/utils/')],
          // ['@', './src'],
          // ['@images', './src/assets/images'],
          // ['@styles', './src/assets/styles'],
          // ['@components', './src/components'],
          // ['@hooks', './src/hooks'],
          // ['@modules', './src/modules'],
          // ['@routes', './src/routes'],
          // ['@services', './src/services'],
          // ['@secure', './src/services/secure'],
          // ['@types', './src/types'],
          // ['@utils', './src/utils'],
        ],
        extensions: ['.js', '.jsx', '.ts', '.d.ts', '.tsx'],
      },
    },
  },
};
