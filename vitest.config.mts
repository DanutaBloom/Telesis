import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  css: {
    postcss: './postcss.config.js',
  },
  test: {
    globals: true, // This is needed by @testing-library to be cleaned up after each test
    include: ['src/**/*.test.{js,jsx,ts,tsx}', 'tests/**/*.test.{js,jsx,ts,tsx}'],
    exclude: ['**/cssTestUtils.test.tsx'],
    coverage: {
      enabled: true,
      provider: 'v8',
      include: ['src/**/*'],
      exclude: [
        'src/**/*.stories.{js,jsx,ts,tsx}', 
        '**/*.d.ts',
        'src/test-utils/**',
        'src/**/*.config.*',
        'src/instrumentation.ts',
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
      reporter: ['text', 'json', 'html'],
      reportOnFailure: true,
    },
    // Use projects instead of deprecated environmentMatchGlobs
    environment: 'jsdom', // Default environment for React components
    setupFiles: ['./vitest-setup.ts'],
    // Security and performance testing configurations
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: true, // Better for security tests with shared state
      },
    },
    testTimeout: 10000, // 10s timeout for integration tests
    hookTimeout: 5000, // 5s timeout for setup/teardown
    // Reporter configuration for CI/CD
    reporters: process.env.CI 
      ? ['junit', 'github-actions'] 
      : ['verbose', 'html'],
    outputFile: {
      junit: './test-results/junit.xml',
      html: './test-results/html/index.html',
    },
  },
});
