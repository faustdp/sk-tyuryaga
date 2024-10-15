import eslint from '@eslint/js'
import prettier from 'eslint-config-prettier'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import svelte from 'eslint-plugin-svelte'
import tailwind from 'eslint-plugin-tailwindcss'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...svelte.configs['flat/recommended'],
  ...tailwind.configs['flat/recommended'],
  prettier,
  ...svelte.configs['flat/prettier'],
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    files: ['**/*.{ts,js,svelte}'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
      },
    },
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      '@typescript-eslint/no-explicit-any': 0,
      '@typescript-eslint/explicit-function-return-type': 0,
      '@typescript-eslint/no-empty-function': 0,
      'consistent-return': 0,
      'comma-dangle': [1, 'always-multiline'],
      'no-undef': 0,
      'no-case-declarations': 0,
      'no-console': 0,
      'no-dupe-keys': 0,
      'no-unused-vars': 0,
      'no-param-reassign': [2, { props: false }],
      'no-empty': ['error', { allowEmptyCatch: true }],
      'no-loss-of-precision': 'off',
      // 'max-len': [
      //   'error',
      //   {
      //     code: 120,
      //     comments: 0,
      //     ignorePattern: '(d="([\\s\\S]*?)")|(<!--)',
      //     ignoreStrings: true,
      //     ignoreTemplateLiterals: true,
      //     ignoreRegExpLiterals: true,
      //     ignoreComments: true,
      //   },
      // ],
      'simple-import-sort/imports': 'warn',
    },
  },
  {
    ignores: ['build/', '.svelte-kit/', 'dist/'],
  },
)
