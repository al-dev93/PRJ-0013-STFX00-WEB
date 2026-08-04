import path from 'node:path';
import { fileURLToPath } from 'node:url';

import js from '@eslint/js';
import globals from 'globals';
import importPlugin from 'eslint-plugin-import';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import { reactRefresh } from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

const projectRoot = path.dirname(fileURLToPath(import.meta.url));
const tsconfigPath = path.join(projectRoot, 'tsconfig.eslint.json');

export default tseslint.config(
  {
    ignores: ['dist/**', 'coverage/**', 'node_modules/**', '.eslintrc.cjs'],
  },

  {
    files: ['**/*.{js,cjs,mjs}'],

    ...js.configs.recommended,

    languageOptions: {
      globals: globals.node,
    },
  },

  ...tseslint.configs.recommended,

  {
    files: ['src/**/*.{js,jsx,ts,tsx}'],

    plugins: {
      'react-hooks': reactHooks,
    },

    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },

  {
    files: ['src/**/*.{ts,tsx}'],

    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
    },

    plugins: {
      import: importPlugin,
    },

    settings: {
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx'],
      },

      'import/resolver': {
        typescript: {
          project: tsconfigPath,
          alwaysTryTypes: true,
        },
      },

      'import/internal-regex': '^@(?:/|components/|hooks/|images/|modules/|routes/|services/|utils/)',
    },

    rules: {
      '@typescript-eslint/explicit-module-boundary-types': 'off',

      'import/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: true,
        },
      ],

      'import/prefer-default-export': 'off',

      'import/no-unresolved': [
        'error',
        {
          ignore: ['\\.(?:css|scss|sass|less|svg|png|jpe?g|gif|webp|woff2?|ttf)$'],
        },
      ],

      /*
       * Désactivation temporaire pendant la migration.
       * La règle sera réintroduite selon la convention existante du projet.
       */
      'import/order': 'off',

      eqeqeq: ['error', 'always'],
      curly: ['error', 'multi-line'],
    },
  },

  {
    files: ['src/**/*.{jsx,tsx}'],

    ...reactPlugin.configs.flat.recommended,

    languageOptions: {
      ...reactPlugin.configs.flat.recommended.languageOptions,
      globals: globals.browser,
    },

    plugins: {
      ...reactPlugin.configs.flat.recommended.plugins,
      'jsx-a11y': jsxA11y,
      'react-refresh': reactRefresh.plugin,
    },

    settings: {
      react: {
        version: 'detect',
      },
    },

    rules: {
      ...reactPlugin.configs.flat.recommended.rules,
      ...reactPlugin.configs.flat['jsx-runtime'].rules,
      ...jsxA11y.flatConfigs.recommended.rules,

      'react-refresh/only-export-components': [
        'warn',
        {
          allowConstantExport: true,
        },
      ],

      'react/display-name': 'off',
      'react/jsx-props-no-spreading': 'off',
    },
  },

  prettierRecommended,
);
