// eslint.config.js
import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import jest from 'eslint-plugin-jest'
import globals from 'globals'
import eslintConfigPrettier from 'eslint-config-prettier/flat'
import { defineConfig } from 'eslint/config'

export default defineConfig(
  // 1. Ignore generated or irrelevant directories
  {
    name: 'ignores',
    ignores: [
      '**/*.cjs',
      '**/*.mjs',
      '**/*.json',
      '**/node_modules/**',
      '**/dist/**',
      '**/coverage/**',
      'lib/',
      'dist/',
      'coverage/'
    ]
  },

  // 2. Base JavaScript recommended rules
  eslint.configs.recommended,

  // 3. TypeScript recommended rules
  tseslint.configs.recommended,

  // 4. TypeScript rules that require type-checking
  tseslint.configs.recommendedTypeChecked,

  // 5. Supply parser options & globals
  {
    name: 'type-aware-parser-options',
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2023,
        sourceType: 'module',
        project: true,
        projectService: true,
        tsconfigRootDir: import.meta.dirname
      },
      globals: {
        ...globals.node,
        ...globals.jest,
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly'
      }
    }
  },

  // 6. Custom common rules
  {
    name: 'custom-rules',
    rules: {
      camelcase: 'off',
      'no-console': 'off',
      semi: 'off'
    }
  },

  // 7. TypeScript-specific rules
  {
    name: 'typescript-rules',
    files: ['**/*.ts'],
    rules: {
      '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/ban-ts-comment': 'error',
      '@typescript-eslint/explicit-function-return-type': [
        'error',
        { allowExpressions: true }
      ],
      '@typescript-eslint/no-array-constructor': 'error',
      '@typescript-eslint/no-empty-interface': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-useless-constructor': 'error',
      '@typescript-eslint/consistent-type-assertions': 'error',
      '@typescript-eslint/explicit-member-accessibility': [
        'error',
        { accessibility: 'no-public' }
      ],
      '@typescript-eslint/no-extraneous-class': 'error',
      '@typescript-eslint/no-for-in-array': 'error',
      '@typescript-eslint/no-inferrable-types': 'error',
      '@typescript-eslint/no-misused-new': 'error',
      '@typescript-eslint/no-namespace': 'error',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/no-require-imports': 'error',
      '@typescript-eslint/no-unnecessary-qualifier': 'error',
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',
      '@typescript-eslint/no-var-requires': 'error',
      '@typescript-eslint/prefer-for-of': 'warn',
      '@typescript-eslint/prefer-function-type': 'warn',
      '@typescript-eslint/prefer-includes': 'error',
      '@typescript-eslint/prefer-string-starts-ends-with': 'error',
      '@typescript-eslint/promise-function-async': 'error',
      '@typescript-eslint/require-array-sort-compare': 'error',
      '@typescript-eslint/restrict-plus-operands': 'error',
      '@typescript-eslint/space-before-function-paren': 'off',
      '@typescript-eslint/unbound-method': 'error'
    }
  },

  // 8. Jest plugin for test files
  {
    name: 'jest-tests',
    files: ['**/*.test.{js,ts}'],
    plugins: {
      jest
    },
    rules: {
      ...jest.configs.recommended.rules
    }
  },

  // 9. Prettier (always last)
  eslintConfigPrettier
)
