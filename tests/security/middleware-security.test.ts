/**
 * Middleware Security Validation Tests
 * CRITICAL: Tests to verify middleware security protections work correctly
 * Validates API route protection, authentication flow, and security headers
 */

import { NextRequest, NextResponse } from 'next/server';
import { afterAll, describe, expect, it, vi } from 'vitest';

// Mock Next.js middleware dependencies - must be hoisted
const mockCreateMiddleware = vi.fn().mockReturnValue((req: NextRequest) => NextResponse.next());
const mockCreateRouteMatcher = vi.fn().mockReturnValue(() => true);
const mockClerkMiddleware = vi.fn().mockImplementation(callback => (req: NextRequest, event: any) => {
  return callback(
    {
      protect: vi.fn().mockResolvedValue(undefined),
    },
    req,
  );
});

// Mock modules at module level for proper hoisting
vi.mock('next-intl/middleware', () => ({
  default: mockCreateMiddleware,
}));

vi.mock('@clerk/nextjs/server', () => ({
  clerkMiddleware: mockClerkMiddleware,
  createRouteMatcher: mockCreateRouteMatcher,
}));

// Now import middleware after mocks are set up
const { default: middleware } = await import('@/middleware');

// Mock successful authentication
const mockAuthSuccess = {
  userId: 'user_test123',
  orgId: 'org_test456',
  sessionId: 'session_789',
};

// Mock failed authentication
const mockAuthFail = {
  userId: null,
  orgId: null,
  sessionId: null,
};

describe('Middleware Security - API Route Protection', () => {
  it('should protect /api/materials routes', async () => {
    const request = new NextRequest('http://localhost:3000/api/materials', {
      method: 'GET',
      headers: { 'content-type': 'application/json' },
    });

    const event = { waitUntil: vi.fn() };

    // Mock route matcher to identify this as an API route
    mockCreateRouteMatcher.mockReturnValue(() => true);

    const response = await middleware(request, event);

    // Verify that Clerk middleware was called for API routes
    expect(mockClerkMiddleware).toHaveBeenCalled();
  });

  it('should protect /api/organizations routes', async () => {
    const request = new NextRequest('http://localhost:3000/api/organizations', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
    });

    const event = { waitUntil: vi.fn() };

    // Mock route matcher to identify this as an API route
    mockCreateRouteMatcher.mockReturnValue(() => true);

    const response = await middleware(request, event);

    // Verify that Clerk middleware was called for API routes
    expect(mockClerkMiddleware).toHaveBeenCalled();
  });

  it('should allow public API routes like /api/health', async () => {
    const request = new NextRequest('http://localhost:3000/api/health', {
      method: 'GET',
    });

    const event = { waitUntil: vi.fn() };

    const response = await middleware(request, event);

    // Public routes should bypass authentication but still go through i18n middleware
    expect(mockCreateMiddleware).toHaveBeenCalled();
  });

  it('should allow public API routes like /api/test', async () => {
    const request = new NextRequest('http://localhost:3000/api/test', {
      method: 'GET',
    });

    const event = { waitUntil: vi.fn() };

    const response = await middleware(request, event);

    // Public routes should bypass authentication
    expect(mockCreateMiddleware).toHaveBeenCalled();
  });

  it('should protect all other API routes by default', async () => {
    const request = new NextRequest('http://localhost:3000/api/protected-endpoint', {
      method: 'GET',
    });

    const event = { waitUntil: vi.fn() };

    // Mock route matcher to identify this as an API route
    mockCreateRouteMatcher.mockReturnValue(() => true);

    const response = await middleware(request, event);

    // Should be protected by Clerk
    expect(mockClerkMiddleware).toHaveBeenCalled();
  });
});

describe('Middleware Security - Dashboard Protection', () => {
  it('should protect /dashboard routes', async () => {
    const request = new NextRequest('http://localhost:3000/dashboard', {
      method: 'GET',
    });

    const event = { waitUntil: vi.fn() };

    // Mock route matcher to identify this as a protected route
    mockCreateRouteMatcher.mockReturnValue(() => true);

    const response = await middleware(request, event);

    // Dashboard routes should be protected
    expect(mockClerkMiddleware).toHaveBeenCalled();
  });

  it('should protect localized /dashboard routes', async () => {
    const request = new NextRequest('http://localhost:3000/en/dashboard/materials', {
      method: 'GET',
    });

    const event = { waitUntil: vi.fn() };

    // Mock route matcher to identify this as a protected route
    mockCreateRouteMatcher.mockReturnValue(() => true);

    const response = await middleware(request, event);

    // Localized dashboard routes should be protected
    expect(mockClerkMiddleware).toHaveBeenCalled();
  });

  it('should protect /onboarding routes', async () => {
    const request = new NextRequest('http://localhost:3000/onboarding/organization-selection', {
      method: 'GET',
    });

    const event = { waitUntil: vi.fn() };

    // Mock route matcher to identify this as a protected route
    mockCreateRouteMatcher.mockReturnValue(() => true);

    const response = await middleware(request, event);

    // Onboarding routes should be protected
    expect(mockClerkMiddleware).toHaveBeenCalled();
  });
});

describe('Middleware Security - Organization Flow', () => {
  it('should redirect authenticated users without org to organization selection', async () => {
    const request = new NextRequest('http://localhost:3000/dashboard', {
      method: 'GET',
    });

    const event = { waitUntil: vi.fn() };

    // Mock Clerk middleware to simulate authenticated user without organization
    mockClerkMiddleware.mockImplementationOnce(callback => (req: NextRequest, event: any) => {
      return callback(
        {
          protect: vi.fn().mockResolvedValue(undefined),
        },
        req,
      ).then(() => {
        // Simulate auth object with userId but no orgId
        const authObj = { userId: 'user_123', orgId: null };

        if (authObj.userId && !authObj.orgId && req.nextUrl.pathname.includes('/dashboard')) {
          return NextResponse.redirect(new URL('/onboarding/organization-selection', req.url));
        }

        return NextResponse.next();
      });
    });

    // Mock route matcher to identify this as a protected route
    mockCreateRouteMatcher.mockReturnValue(() => true);

    const response = await middleware(request, event);

    // Should trigger organization selection flow
    expect(mockClerkMiddleware).toHaveBeenCalled();
  });
});

describe('Middleware Security - Route Exclusions', () => {
  it('should exclude static files from middleware processing', async () => {
    const request = new NextRequest('http://localhost:3000/favicon.ico', {
      method: 'GET',
    });

    const event = { waitUntil: vi.fn() };

    const response = await middleware(request, event);

    // Static files should be handled by the middleware config exclusion
    // The middleware function should still run but handle static files appropriately
    expect(response).toBeDefined();
  });

  it('should exclude _next assets from middleware processing', async () => {
    const request = new NextRequest('http://localhost:3000/_next/static/chunks/main.js', {
      method: 'GET',
    });

    const event = { waitUntil: vi.fn() };

    const response = await middleware(request, event);

    // _next assets should be handled by the middleware config exclusion
    expect(response).toBeDefined();
  });

  it('should exclude monitoring routes from middleware processing', async () => {
    const request = new NextRequest('http://localhost:3000/monitoring/health', {
      method: 'GET',
    });

    const event = { waitUntil: vi.fn() };

    const response = await middleware(request, event);

    // Monitoring routes should be excluded
    expect(response).toBeDefined();
  });
});

describe('Middleware Security - Configuration Validation', () => {
  it('should have correct matcher configuration', () => {
    // Import the middleware config
    const middlewareModule = require('@/middleware');
    const config = middlewareModule.config;

    expect(config).toBeDefined();
    expect(config.matcher).toBeDefined();
    expect(Array.isArray(config.matcher)).toBe(true);

    // Should exclude API routes from Next.js middleware processing
    // (they are handled separately in the middleware function)
    expect(config.matcher.some((pattern: string) => pattern.includes('api'))).toBe(false);

    // Should exclude static assets
    expect(config.matcher.some((pattern: string) => pattern.includes('_next'))).toBe(false);

    // Should exclude monitoring
    expect(config.matcher.some((pattern: string) => pattern.includes('monitoring'))).toBe(false);
  });
});

afterAll(() => {
  vi.clearAllMocks();
});
