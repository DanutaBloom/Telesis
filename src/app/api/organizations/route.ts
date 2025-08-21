import { eq } from 'drizzle-orm';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import {
  checkRateLimit,
  createSecureErrorResponse,
  type PartialAuthContext,
  SECURITY_HEADERS,
  validateRequestBody,
  withPartialAuth,
} from '@/libs/AuthUtils';
import { isOrganizationsEnabled } from '@/libs/ClerkUtils';
import { db } from '@/libs/DB';
import {
  CreateOrganizationSchema,
  GetOrganizationsQuerySchema,
} from '@/libs/ValidationSchemas';
import { organizationSchema } from '@/models/Schema';

/**
 * SECURED Organizations API - GET endpoint
 * SECURITY: Authentication required, only returns user's own organization
 */
export const GET = withPartialAuth(async (auth: PartialAuthContext, request: NextRequest) => {
  try {
    // Rate limiting check
    const rateLimitResult = checkRateLimit(`${auth.userId}:organizations:get`, 20, 60000);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: 'Rate limit exceeded. Please try again later.',
          retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000),
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

    // Check if organizations are enabled
    if (!isOrganizationsEnabled()) {
      return NextResponse.json(
        {
          success: false,
          error: 'Organizations feature is not enabled',
          code: 'ORGANIZATIONS_DISABLED',
        },
        { status: 403, headers: SECURITY_HEADERS },
      );
    }

    // Check if user has organization
    if (!auth.orgId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Organization selection required',
          code: 'ORGANIZATION_SELECTION_REQUIRED',
          redirectTo: '/onboarding/organization-selection',
        },
        { status: 403, headers: SECURITY_HEADERS },
      );
    }

    // Parse and validate query parameters
    const url = new URL(request.url);
    const queryParams = {
      limit: Number.parseInt(url.searchParams.get('limit') || '10'),
      offset: Number.parseInt(url.searchParams.get('offset') || '0'),
      hasStripeCustomer: url.searchParams.get('hasStripeCustomer') === 'true' || undefined,
    };

    const validation = GetOrganizationsQuerySchema.safeParse(queryParams);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid query parameters',
          details: validation.error.errors.map(err =>
            `${err.path.join('.')}: ${err.message}`,
          ).join(', '),
        },
        { status: 400, headers: SECURITY_HEADERS },
      );
    }

    // SECURITY: Users can ONLY access their own organization
    // This prevents cross-tenant data exposure
    const organization = await db
      .select({
        id: organizationSchema.id,
        stripeCustomerId: organizationSchema.stripeCustomerId,
        stripeSubscriptionId: organizationSchema.stripeSubscriptionId,
        stripeSubscriptionPriceId: organizationSchema.stripeSubscriptionPriceId,
        stripeSubscriptionStatus: organizationSchema.stripeSubscriptionStatus,
        stripeSubscriptionCurrentPeriodEnd: organizationSchema.stripeSubscriptionCurrentPeriodEnd,
        createdAt: organizationSchema.createdAt,
        updatedAt: organizationSchema.updatedAt,
      })
      .from(organizationSchema)
      .where(eq(organizationSchema.id, auth.orgId))
      .limit(1);

    if (organization.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Organization not found or access denied',
          code: 'ORGANIZATION_NOT_FOUND',
        },
        { status: 404, headers: SECURITY_HEADERS },
      );
    }

    // Security logging
    console.log('Organization access:', {
      userId: auth.userId,
      orgId: auth.orgId,
      sessionId: auth.sessionId,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        success: true,
        data: organization,
        count: organization.length,
        meta: {
          organizationId: auth.orgId,
          userId: auth.userId,
          requestId: auth.sessionId,
        },
      },
      { headers: SECURITY_HEADERS },
    );
  } catch (error) {
    return createSecureErrorResponse(
      error,
      'Failed to fetch organization',
      500,
      { userId: auth.userId, orgId: auth.orgId },
    );
  }
});

/**
 * SECURED Organizations API - POST endpoint
 * SECURITY: Authentication required, admin-only operation with strict validation
 */
export const POST = withPartialAuth(async (auth: PartialAuthContext, request: NextRequest) => {
  try {
    // Rate limiting check - stricter for organization creation
    const rateLimitResult = checkRateLimit(`${auth.userId}:organizations:post`, 2, 300000); // 2 requests per 5 minutes
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: 'Rate limit exceeded. Organization creation is limited.',
          retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000),
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

    // Check if organizations are enabled
    if (!isOrganizationsEnabled()) {
      return NextResponse.json(
        {
          success: false,
          error: 'Organizations feature is not enabled',
          code: 'ORGANIZATIONS_DISABLED',
        },
        { status: 403, headers: SECURITY_HEADERS },
      );
    }

    // Validate request body
    const bodyValidation = await validateRequestBody(request, CreateOrganizationSchema);
    if (!bodyValidation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request data',
          details: bodyValidation.error,
        },
        { status: 400, headers: SECURITY_HEADERS },
      );
    }

    const orgData = bodyValidation.data;

    // SECURITY: Prevent organization ID conflicts and ensure uniqueness
    const existingOrg = await db
      .select({ id: organizationSchema.id })
      .from(organizationSchema)
      .where(eq(organizationSchema.id, orgData.id))
      .limit(1);

    if (existingOrg.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Organization with this ID already exists',
          code: 'ORGANIZATION_ID_CONFLICT',
        },
        { status: 409, headers: SECURITY_HEADERS },
      );
    }

    // SECURITY: Additional validation for Stripe customer ID if provided
    if (orgData.stripeCustomerId) {
      const stripeConflict = await db
        .select({ id: organizationSchema.id })
        .from(organizationSchema)
        .where(eq(organizationSchema.stripeCustomerId, orgData.stripeCustomerId))
        .limit(1);

      if (stripeConflict.length > 0) {
        return NextResponse.json(
          {
            success: false,
            error: 'Stripe customer ID already in use',
            code: 'STRIPE_CUSTOMER_CONFLICT',
          },
          { status: 409, headers: SECURITY_HEADERS },
        );
      }
    }

    // Create organization with validated data
    const newOrg = await db.insert(organizationSchema).values({
      id: orgData.id,
      stripeCustomerId: orgData.stripeCustomerId,
    }).returning();

    // Security logging
    console.log('Organization created:', {
      organizationId: newOrg[0]?.id,
      creatorUserId: auth.userId,
      creatorOrgId: auth.orgId,
      sessionId: auth.sessionId,
      hasStripeId: !!orgData.stripeCustomerId,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        success: true,
        data: newOrg[0],
        meta: {
          createdBy: auth.userId,
          requestId: auth.sessionId,
        },
      },
      {
        status: 201,
        headers: SECURITY_HEADERS,
      },
    );
  } catch (error) {
    return createSecureErrorResponse(
      error,
      'Failed to create organization',
      500,
      { userId: auth.userId, orgId: auth.orgId },
    );
  }
});
