import eslint from '@eslint/js'
import typescriptEslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import github from 'eslint-plugin-github'
import jest from 'eslint-plugin-jest'
import globals from 'globals'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
export default [
  eslint.configs.recommended, // Base ESLint recommendations
  eslintPluginPrettierRecommended,
  // Common Settings for All Files
  {
    plugins: {
      '@typescript-eslint': typescriptEslint,
      jest
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2023,
        sourceType: 'module',
        project: ['./tsconfig.json'] // Adjust this path if needed
        //  tsconfigRootDir: process.cwd()
      },
      globals: {
        ...globals.node,
        ...globals.jest,
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly'
      }
    },
    rules: {
      camelcase: 'off',
      'no-console': 'off',
      semi: 'off',
      'eslint-comments/no-use': 'off',
      'eslint-comments/no-unused-disable': 'off',
      'i18n-text/no-en': 'off',
      'import/no-namespace': 'off'
      //'@typescript-eslint/semi': ['error', 'never']
    }
  },
  {
    ignores: [
      '**/*.cjs', // Ignore CommonJS files
      '**/*.mjs', // Ignore ESM configuration files
      '**/node_modules/**',
      '**/dist/**',
      '**/coverage/**',
      '**/*.json',
      'lib/',
      'dist/',
      'node_modules/',
      'coverage/'
    ]
  },

  // TypeScript-Specific Settings
  {
    files: ['*.ts'],
    rules: {
      ...typescriptEslint.configs.recommended.rules,
      '@typescript-eslint/array-type': [
        'error',
        {
          default: 'array-simple'
        }
      ],
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/ban-ts-comment': 'error',
      '@typescript-eslint/explicit-function-return-type': [
        'error',
        {
          allowExpressions: true
        }
      ],
      '@typescript-eslint/no-array-constructor': 'error',
      '@typescript-eslint/no-empty-interface': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-useless-constructor': 'error',
      '@typescript-eslint/consistent-type-assertions': 'error',
      '@typescript-eslint/explicit-member-accessibility': [
        'error',
        {
          accessibility: 'no-public'
        }
      ],
      //'@typescript-eslint/func-call-spacing': ['error', 'never'],
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
      //'@typescript-eslint/type-annotation-spacing': 'error',
      '@typescript-eslint/unbound-method': 'error'
    }
  },

  // Jest Rules
  {
    files: ['*.test.js', '*.test.ts'],
    rules: {
      ...jest.configs.recommended.rules
    }
  },

  // GitHub Rules
  ...github.getFlatConfigs().typescript
]
