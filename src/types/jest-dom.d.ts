/// <reference types="@testing-library/jest-dom" />

// Augment the global expect interface to include jest-dom matchers for Vitest
import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers';

declare global {
  namespace Vi {
    interface JestAssertion<T = any>
      extends jest.Matchers<void, T>,
        TestingLibraryMatchers<T, void> {}
  }
}
