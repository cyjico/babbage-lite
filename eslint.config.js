import globals from 'globals';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';
import solid from 'eslint-plugin-solid/configs/typescript';
import * as tsParser from '@typescript-eslint/parser';
import tailwindcss from 'eslint-plugin-tailwindcss';

/** @type {import('eslint').Linter.Config[]} */
export default [
  ...tailwindcss.configs['flat/recommended'],
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    languageOptions: { globals: globals.browser },
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    ...solid,
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: 'tsconfig.app.json',
      },
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      // noUnusedLocals, noUnusedParameters
      '@typescript-eslint/no-unused-vars': 'off',
      // noFallthroughCasesInSwitch
      '@typescript-eslint/no-fallthrough': 'warn',
      'no-fallthrough': 'off',
      // NOTE: noUncheckedSideEffectImports does not work on my end
      '@typescript-eslint/no-import-type-side-effects': 'error',
    },
  },
  {
    files: ['postcss.config.*'],
    languageOptions: {
      globals: globals.node,
    },
  },
  prettierConfig,
];
