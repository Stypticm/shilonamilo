import globals from 'globals';
import pluginJs from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import pluginReact from 'eslint-plugin-react';
import pluginPrettier from 'eslint-plugin-prettier';

export default [
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
      },
      globals: globals.browser,
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      react: pluginReact,
      prettier: pluginPrettier,
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'prettier/prettier': 'error',
    },
  },
  {
    files: ['**/*.js', '**/*.jsx'],
    rules: {
      ...pluginJs.configs.recommended.rules, // Включаем рекомендуемые правила JS
    },
  },
  // Рекомендуемые конфигурации для TypeScript
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      ...tsPlugin.configs.recommended.rules, // Включаем рекомендуемые правила TS
    },
  },
  // Рекомендуемые конфигурации для React
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    rules: {
      ...pluginReact.configs.flat.recommended.rules, // Включаем рекомендуемые правила React
    },
  },
];
