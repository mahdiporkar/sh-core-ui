import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';

export default tseslint.config(
  {
    ignores: [
      'dist/**',
      'storybook-static/**',
      'coverage/**',
      'node_modules/**',
      '*.js',
      '*.cjs',
      'scripts/**',
      'fixtures/**',
      'tests/**/*.cjs',
      'shaparak-core-ui/**',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  {
    languageOptions: {
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
    plugins: { 'react-hooks': reactHooks },
    rules: {
      ...reactHooks.configs.recommended.rules,
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-confusing-void-expression': 'off',
      '@typescript-eslint/no-unnecessary-type-assertion': 'off',
      '@typescript-eslint/unbound-method': 'off',
      'react-hooks/exhaustive-deps': 'off',
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['antd', 'antd/*', 'ag-grid-*'],
              message: 'Vendor imports are confined to src/adapters.',
            },
          ],
        },
      ],
    },
  },
  { files: ['src/adapters/**/*.{ts,tsx}'], rules: { 'no-restricted-imports': 'off' } },
  { files: ['src/components/public.tsx'], rules: { 'no-restricted-imports': 'off' } },
  {
    files: ['*.js', '*.cjs', 'scripts/**/*.mjs', 'fixtures/**/*.{js,cjs}', 'tests/**/*.cjs'],
    ...tseslint.configs.disableTypeChecked,
    languageOptions: {
      parserOptions: { project: false, projectService: false },
      globals: {
        console: 'readonly',
        process: 'readonly',
        module: 'readonly',
        require: 'readonly',
        __dirname: 'readonly',
      },
    },
    rules: { '@typescript-eslint/no-require-imports': 'off' },
  },
);
