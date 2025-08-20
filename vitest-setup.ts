import '@testing-library/jest-dom/vitest';
import '@/styles/global.css';
import { cleanup } from '@testing-library/react';

import failOnConsole from 'vitest-fail-on-console';
import { beforeAll, afterEach, vi } from 'vitest';
import React from 'react';

// Console failure configuration - less strict for development
failOnConsole({
  shouldFailOnDebug: false, // Allow debug statements in tests
  shouldFailOnError: true,
  shouldFailOnInfo: false,  // Allow info logs for test debugging
  shouldFailOnLog: false,   // Allow console.log for debugging
  shouldFailOnWarn: true,
});

// Set up environment variables for testing
process.env.BILLING_PLAN_ENV = 'test';
// NODE_ENV is already set to 'test' by vitest
process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = 'pk_test_mock';
process.env.CLERK_SECRET_KEY = 'sk_test_mock';

// Global test setup
beforeAll(() => {
  // Mock next/navigation for tests
  vi.mock('next/navigation', () => ({
    useRouter: () => ({
      push: vi.fn(),
      replace: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
      prefetch: vi.fn(),
    }),
    usePathname: () => '/',
    useSearchParams: () => new URLSearchParams(),
  }));

  // Mock Clerk for authentication tests
  vi.mock('@clerk/nextjs', () => ({
    useAuth: () => ({
      isLoaded: true,
      isSignedIn: true,
      userId: 'user_test123',
      sessionId: 'session_test123',
      orgId: 'org_test123',
      orgRole: 'admin',
      orgSlug: 'test-org',
      signOut: vi.fn(),
    }),
    useUser: () => ({
      isLoaded: true,
      isSignedIn: true,
      user: {
        id: 'user_test123',
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        emailAddresses: [{ emailAddress: 'test@test.com' }],
      },
    }),
    useOrganization: () => ({
      isLoaded: true,
      organization: {
        id: 'org_test123',
        name: 'Test Organization',
        slug: 'test-org',
      },
    }),
    SignIn: ({ children }: { children?: React.ReactNode }) => children || React.createElement('div', null, 'Sign In Mock'),
    SignUp: ({ children }: { children?: React.ReactNode }) => children || React.createElement('div', null, 'Sign Up Mock'),
    UserButton: () => React.createElement('div', null, 'User Button Mock'),
    OrganizationSwitcher: () => React.createElement('div', null, 'Org Switcher Mock'),
    ClerkProvider: ({ children }: { children: React.ReactNode }) => React.createElement('div', null, children),
  }));

  // Mock window.matchMedia for responsive tests - only in jsdom environment
  if (typeof window !== 'undefined') {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(), // deprecated
        removeListener: vi.fn(), // deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  }

  // Mock ResizeObserver for components that use it
  if (typeof global !== 'undefined') {
    global.ResizeObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }));

    // Mock IntersectionObserver for lazy loading components  
    global.IntersectionObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }));
  }
});

// Clean up after each test
afterEach(() => {
  cleanup(); // Clean up React components
  vi.clearAllMocks();
});
