import { NextResponse } from 'next/server';

import { checkRateLimit, SECURITY_HEADERS } from '@/libs/AuthUtils';
import { db } from '@/libs/DB';
import { SECURITY_HEADERS, checkRateLimit } from '@/libs/AuthUtils';

/**
 * SECURED Health Check API
 * SECURITY: Removes sensitive information disclosure while maintaining operational visibility
 */
export async function GET(request: Request) {
  try {
    // Rate limiting for health endpoint
    const clientIp = request.headers.get('x-forwarded-for')
      || request.headers.get('x-real-ip')
      || 'unknown';

    const rateLimitResult = checkRateLimit(`health:${clientIp}`, 30, 60000); // 30 requests per minute
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          status: 'rate_limited',
          timestamp: new Date().toISOString(),
        },
        {
          status: 429,
          headers: {
            ...SECURITY_HEADERS,
            'Retry-After': Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString(),
          },
        },
      );
    }

    const healthCheck = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0', // Safe to expose
      services: {
        database: 'unknown',
        authentication: 'unknown',
        payments: 'unknown',
      },
    };

    // Test database connectivity - NO sensitive info in errors
    try {
      await db.execute('SELECT 1 as test');
      healthCheck.services.database = 'operational';
    } catch (error) {
      // SECURITY: Log full error server-side but don't expose to client
      console.error('Database health check failed:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString(),
        clientIp,
      });

      healthCheck.services.database = 'degraded';
      healthCheck.status = 'degraded';
    }

    // Check service configurations - NO environment variable exposure
    try {
      // SECURITY: Only check if keys exist, don't expose any values or specifics
      const hasClerkKeys = !!(process.env.CLERK_SECRET_KEY && process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
      const hasStripeKeys = !!(process.env.STRIPE_SECRET_KEY && process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

      healthCheck.services.authentication = hasClerkKeys ? 'configured' : 'not-configured';
      healthCheck.services.payments = hasStripeKeys ? 'configured' : 'not-configured';
    } catch (error) {
      // SECURITY: Log configuration check errors but don't expose them
      console.error('Service configuration check failed:', error);
      healthCheck.services.authentication = 'unknown';
      healthCheck.services.payments = 'unknown';
    }

    const httpStatus = healthCheck.status === 'healthy' ? 200 : 503;

    // SECURITY: Log health check access for monitoring
    console.log('Health check accessed:', {
      status: healthCheck.status,
      clientIp,
      userAgent: request.headers.get('user-agent'),
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(healthCheck, {
      status: httpStatus,
      headers: {
        ...SECURITY_HEADERS,
        'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
      },
    });
  } catch (error) {
    // SECURITY: Log the full error server-side
    console.error('Health check endpoint error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    });

    // Return minimal error information to client
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
      },
      {
        status: 500,
        headers: SECURITY_HEADERS,
      },
    );
  }
}
