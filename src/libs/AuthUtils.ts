import { auth } from '@clerk/nextjs/server';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import type { z } from 'zod';

/**
 * Security utilities for API authentication and authorization
 * Implements OWASP security best practices for authentication
 */

export type AuthContext = {
  userId: string;
  orgId: string;
  sessionId: string;
};

export type PartialAuthContext = {
  userId: string;
  orgId: string | null;
  sessionId: string;
};

/**
 * Authenticates the current request using Clerk
 * SECURITY: Validates both user authentication AND organization membership
 */
export async function authenticateRequest(): Promise<AuthContext | null> {
  try {
    const authObj = await auth();

    if (!authObj.userId || !authObj.orgId || !authObj.sessionId) {
      return null;
    }

    return {
      userId: authObj.userId,
      orgId: authObj.orgId,
      sessionId: authObj.sessionId,
    };
  } catch (error) {
    console.error('Authentication failed:', error);
    return null;
  }
}

/**
 * Authenticates the current request using Clerk (flexible - allows missing orgId)
 * SECURITY: Validates user authentication, organization membership is optional
 * Use for endpoints that can work before organization selection
 */
export async function authenticateRequestPartial(): Promise<PartialAuthContext | null> {
  try {
    const authObj = await auth();

    if (!authObj.userId || !authObj.sessionId) {
      return null;
    }

    return {
      userId: authObj.userId,
      orgId: authObj.orgId || null,
      sessionId: authObj.sessionId,
    };
  } catch (error) {
    console.error('Authentication failed:', error);
    return null;
  }
}

/**
 * Middleware wrapper for API routes requiring authentication
 * SECURITY: Prevents authentication bypass attacks (OWASP A01)
 */
export function withAuth<T extends any[]>(
  handler: (auth: AuthContext, ...args: T) => Promise<NextResponse>,
) {
  return async (...args: T): Promise<NextResponse> => {
    try {
      const authContext = await authenticateRequest();

      if (!authContext) {
        return NextResponse.json(
          {
            success: false,
            error: 'Authentication required',
            code: 'UNAUTHORIZED',
          },
          {
            status: 401,
            headers: {
              'WWW-Authenticate': 'Bearer',
              'Cache-Control': 'no-store',
            },
          },
        );
      }

      return await handler(authContext, ...args);
    } catch (error) {
      console.error('Auth middleware error:', error);
      return NextResponse.json(
        {
          success: false,
          error: 'Authentication error',
          code: 'AUTH_ERROR',
        },
        { status: 500 },
      );
    }
  };
}

/**
 * Middleware wrapper for API routes requiring authentication (flexible - allows missing orgId)
 * SECURITY: Validates user authentication, handles organization selection gracefully
 * Use for endpoints that need to work before organization selection
 */
export function withPartialAuth<T extends any[]>(
  handler: (auth: PartialAuthContext, ...args: T) => Promise<NextResponse>,
) {
  return async (...args: T): Promise<NextResponse> => {
    try {
      const authContext = await authenticateRequestPartial();

      if (!authContext) {
        return NextResponse.json(
          {
            success: false,
            error: 'Authentication required',
            code: 'UNAUTHORIZED',
          },
          {
            status: 401,
            headers: {
              'WWW-Authenticate': 'Bearer',
              'Cache-Control': 'no-store',
            },
          },
        );
      }

      // If orgId is missing, return a more specific error code
      if (!authContext.orgId) {
        return NextResponse.json(
          {
            success: false,
            error: 'Organization selection required',
            code: 'ORGANIZATION_SELECTION_REQUIRED',
            redirectTo: '/onboarding/organization-selection',
          },
          {
            status: 428, // Precondition Required
            headers: {
              'Cache-Control': 'no-store',
            },
          },
        );
      }

      return await handler(authContext as AuthContext, ...args);
    } catch (error) {
      console.error('Auth middleware error:', error);
      return NextResponse.json(
        {
          success: false,
          error: 'Authentication error',
          code: 'AUTH_ERROR',
        },
        { status: 500 },
      );
    }
  };
}

/**
 * Validates organization access for the authenticated user
 * SECURITY: Prevents cross-tenant data exposure (OWASP A01)
 */
export function validateOrganizationAccess(
  userOrgId: string,
  requestedOrgId: string,
): boolean {
  if (!userOrgId || !requestedOrgId) {
    return false;
  }

  // Strict organization boundary enforcement
  return userOrgId === requestedOrgId;
}

/**
 * Sanitizes and validates request body using Zod schema
 * SECURITY: Prevents XSS and injection attacks (OWASP A03)
 */
export async function validateRequestBody<T>(
  request: NextRequest,
  schema: z.ZodSchema<T>,
): Promise<{ success: true; data: T } | { success: false; error: string }> {
  try {
    const contentType = request.headers.get('content-type');

    if (!contentType || !contentType.includes('application/json')) {
      return {
        success: false,
        error: 'Content-Type must be application/json',
      };
    }

    const body = await request.json();
    const result = schema.safeParse(body);

    if (!result.success) {
      const errors = result.error.errors.map(err =>
        `${err.path.join('.')}: ${err.message}`,
      ).join(', ');

      return {
        success: false,
        error: `Validation failed: ${errors}`,
      };
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Invalid JSON format',
    };
  }
}

/**
 * Security headers for API responses
 * SECURITY: Prevents XSS and clickjacking attacks (OWASP A05)
 */
export const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Cache-Control': 'no-store, no-cache, must-revalidate',
  'Pragma': 'no-cache',
} as const;

/**
 * Creates secure error response with logging
 * SECURITY: Prevents information disclosure while maintaining audit trail
 */
export function createSecureErrorResponse(
  error: unknown,
  userMessage: string,
  statusCode: number = 500,
  context?: Record<string, any>,
): NextResponse {
  // Log full error details for security monitoring
  const errorDetails = {
    message: error instanceof Error ? error.message : 'Unknown error',
    stack: error instanceof Error ? error.stack : undefined,
    timestamp: new Date().toISOString(),
    context,
  };

  console.error('API Security Error:', errorDetails);

  // Return sanitized error to client
  return NextResponse.json(
    {
      success: false,
      error: userMessage,
      timestamp: new Date().toISOString(),
    },
    {
      status: statusCode,
      headers: SECURITY_HEADERS,
    },
  );
}

/**
 * Rate limiting check (basic implementation)
 * SECURITY: Prevents DoS attacks
 */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(
  identifier: string,
  maxRequests: number = 100,
  windowMs: number = 60000, // 1 minute
): { allowed: boolean; resetTime: number } {
  const now = Date.now();
  const windowStart = now - windowMs;

  // Clean old entries
  for (const [key, value] of rateLimitMap.entries()) {
    if (value.resetTime < windowStart) {
      rateLimitMap.delete(key);
    }
  }

  const current = rateLimitMap.get(identifier);

  if (!current || current.resetTime < windowStart) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs });
    return { allowed: true, resetTime: now + windowMs };
  }

  if (current.count >= maxRequests) {
    return { allowed: false, resetTime: current.resetTime };
  }

  current.count++;
  return { allowed: true, resetTime: current.resetTime };
}
