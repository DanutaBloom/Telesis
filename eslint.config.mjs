import antfu from '@antfu/eslint-config';
import nextPlugin from '@next/eslint-plugin-next';
import jestDom from 'eslint-plugin-jest-dom';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import playwright from 'eslint-plugin-playwright';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import tailwind from 'eslint-plugin-tailwindcss';
import testingLibrary from 'eslint-plugin-testing-library';

export default antfu({
  react: true,
  typescript: true,

  lessOpinionated: true,
  isInEditor: false,

  stylistic: {
    semi: true,
  },

  formatters: {
    css: true,
  },

  ignores: [
    // Build outputs and generated files
    '.next/**/*',
    'out/**/*',
    'build/**/*',
    'dist/**/*',
    'coverage/**/*',
    'storybook-static/**/*',
    'test-results/**/*',
    'playwright-report/**/*',
    'node_modules/**/*',
    
    // Generated files
    'migrations/**/*',
    'next-env.d.ts',
    '*.config.js',
    '*.config.mjs',
    
    // Documentation and markdown files
    '**/*.md',
    'docs/**/*',
    'README.md',
    'CHANGELOG.md',
    'LICENSE',
    
    // Package files
    'package-lock.json',
    'pnpm-lock.yaml',
    'yarn.lock',
    
    // Environment and config files
    '.env*',
    '*.log',
    
    // Specific files that cause issues
    'public/**/*',
    'scripts/bundle-monitor.js',
  ],
}, ...tailwind.configs['flat/recommended'], jsxA11y.flatConfigs.recommended, {
  plugins: {
    '@next/next': nextPlugin,
  },
  rules: {
    ...nextPlugin.configs.recommended.rules,
    ...nextPlugin.configs['core-web-vitals'].rules,
  },
}, {
  plugins: {
    'simple-import-sort': simpleImportSort,
  },
  rules: {
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
  },
}, {
  files: [
    '**/*.test.ts?(x)',
  ],
  ...testingLibrary.configs['flat/react'],
  ...jestDom.configs['flat/recommended'],
}, {
  files: [
    '**/*.spec.ts',
    '**/*.e2e.ts',
  ],
  ...playwright.configs['flat/recommended'],
}, {
  rules: {
    // Import organization
    'import/order': 'off', // Avoid conflicts with `simple-import-sort` plugin
    'sort-imports': 'off', // Avoid conflicts with `simple-import-sort` plugin
    
    // Style rules
    'style/brace-style': ['error', '1tbs'], // Use the default brace style
    'style/indent': 'off', // Disable problematic indent rule causing stack overflow
    
    // TypeScript rules
    'ts/consistent-type-definitions': ['error', 'type'], // Use `type` instead of `interface`
    
    // React rules
    'react/prefer-destructuring-assignment': 'off', // Vscode doesn't support automatically destructuring, it's a pain to add a new variable
    
    // Node.js rules
    'node/prefer-global/process': 'off', // Allow using `process.env`
    
    // Console rules - allow in development, error in production
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    
    // Unused variables - allow underscore prefix
    'no-unused-vars': 'off', // Turn off base rule
    'unused-imports/no-unused-vars': [
      'error',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
        caughtErrors: 'all',
        caughtErrorsIgnorePattern: '^_',
        destructuredArrayIgnorePattern: '^_',
      },
    ],
    
    // Test rules
    'test/padding-around-all': 'error', // Add padding in test files
    'test/prefer-lowercase-title': 'off', // Allow using uppercase titles in test titles
  },
}, {
  files: [
    '**/scripts/**/*.js',
    '**/scripts/**/*.mjs', 
    '**/scripts/**/*.ts',
    'scripts/*.js',
    'scripts/*.mjs',
    'scripts/*.ts',
  ],
  rules: {
    // Allow console in scripts
    'no-console': 'off',
    // Allow unused variables in scripts (they might be used for debugging)
    'unused-imports/no-unused-vars': 'off',
    'no-unused-vars': 'off',
  },
}, {
  files: [
    '**/*.test.ts',
    '**/*.test.tsx',
    '**/*.spec.ts',
    '**/*.spec.tsx',
    'vitest-setup.ts',
    'tests/**/*.ts',
    'tests/**/*.tsx',
  ],
  rules: {
    // Allow console in tests for debugging
    'no-console': 'off',
    // Allow global in test setup
    'no-restricted-globals': 'off',
    // Allow require in tests
    'ts/no-require-imports': 'off',
    // Allow unused variables in tests (mocks, etc.)
    'unused-imports/no-unused-vars': [
      'error',
      {
        vars: 'all',
        varsIgnorePattern: '^(_|mock|Mock)',
        args: 'after-used',
        argsIgnorePattern: '^(_|req|res|next|event)',
        caughtErrors: 'all',
        caughtErrorsIgnorePattern: '^_',
        destructuredArrayIgnorePattern: '^_',
      },
    ],
  },
});
