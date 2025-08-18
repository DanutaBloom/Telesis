import { NextResponse } from 'next/server';

import { db } from '@/libs/DB';

export async function GET() {
  const healthCheck = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    database: {
      connected: false,
      type: 'unknown',
      error: null as string | null,
    },
    environment: {
      nodeEnv: process.env.NODE_ENV,
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      hasClerkKeys: !!(process.env.CLERK_SECRET_KEY && process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY),
      hasStripeKeys: !!(process.env.STRIPE_SECRET_KEY && process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY),
    },
    services: {
      database: 'unknown',
      authentication: 'unknown',
      payments: 'unknown',
    },
  };

  // Test database connectivity
  try {
    await db.execute('SELECT 1 as test');
    healthCheck.database.connected = true;
    healthCheck.database.type = process.env.DATABASE_URL ? 'postgresql' : 'pglite';
    healthCheck.services.database = 'operational';
  } catch (error) {
    console.error('Database health check failed:', error);
    healthCheck.database.connected = false;
    healthCheck.database.error = error instanceof Error ? error.message : 'Unknown error';
    healthCheck.services.database = 'degraded';
    healthCheck.status = 'degraded';
  }

  // Check service configurations
  if (healthCheck.environment.hasClerkKeys) {
    healthCheck.services.authentication = 'configured';
  } else {
    healthCheck.services.authentication = 'not-configured';
  }

  if (healthCheck.environment.hasStripeKeys) {
    healthCheck.services.payments = 'configured';
  } else {
    healthCheck.services.payments = 'not-configured';
  }

  const httpStatus = healthCheck.status === 'healthy' ? 200 : 503;
  return NextResponse.json(healthCheck, { status: httpStatus });
}
