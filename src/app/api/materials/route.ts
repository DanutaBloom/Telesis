import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { eq, and } from 'drizzle-orm';

import { db } from '@/libs/DB';
import { materialsSchema } from '@/models/Schema';
import { 
  withPartialAuth, 
  validateRequestBody, 
  createSecureErrorResponse,
  checkRateLimit,
  SECURITY_HEADERS,
  type PartialAuthContext
} from '@/libs/AuthUtils';
import { isOrganizationsEnabled } from '@/libs/ClerkUtils';
import { 
  CreateMaterialSchema, 
  GetMaterialsQuerySchema
} from '@/libs/ValidationSchemas';

/**
 * SECURED Materials API - GET endpoint
 * SECURITY: Authentication required, organization-scoped data access
 */
export const GET = withPartialAuth(async (auth: PartialAuthContext, request: NextRequest) => {
  try {
    // Rate limiting check
    const rateLimitResult = checkRateLimit(`${auth.userId}:materials:get`, 50, 60000);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Rate limit exceeded. Please try again later.',
          retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)
        },
        { 
          status: 429,
          headers: {
            ...SECURITY_HEADERS,
            'Retry-After': Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString()
          }
        }
      );
    }

    // Check if organizations are enabled and handle auth accordingly
    const organizationsEnabled = isOrganizationsEnabled();
    
    if (organizationsEnabled && !auth.orgId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Organization selection required',
          code: 'ORGANIZATION_SELECTION_REQUIRED',
          redirectTo: '/onboarding/organization-selection'
        },
        { status: 403, headers: SECURITY_HEADERS }
      );
    }

    // Parse and validate query parameters
    const url = new URL(request.url);
    const queryParams = {
      organizationId: organizationsEnabled 
        ? (url.searchParams.get('organizationId') || auth.orgId)
        : url.searchParams.get('organizationId') || null,
      trainerId: url.searchParams.get('trainerId'),
      status: url.searchParams.get('status'),
      fileType: url.searchParams.get('fileType'),
      limit: parseInt(url.searchParams.get('limit') || '10'),
      offset: parseInt(url.searchParams.get('offset') || '0'),
    };

    const validation = GetMaterialsQuerySchema.safeParse(queryParams);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid query parameters',
          details: validation.error.errors.map(err => 
            `${err.path.join('.')}: ${err.message}`
          ).join(', ')
        },
        { status: 400, headers: SECURITY_HEADERS }
      );
    }

    const query = validation.data;

    // SECURITY: Enforce organization boundary when organizations are enabled
    if (organizationsEnabled) {
      if (query.organizationId && query.organizationId !== auth.orgId) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Access denied: Cannot access materials from other organizations',
            code: 'FORBIDDEN_CROSS_TENANT_ACCESS'
          },
          { status: 403, headers: SECURITY_HEADERS }
        );
      }
    }

    // Build secure query with appropriate filtering
    const filters = [];
    
    // Add organization filter if organizations are enabled
    if (organizationsEnabled && auth.orgId) {
      filters.push(eq(materialsSchema.organizationId, auth.orgId));
    } else if (!organizationsEnabled) {
      // When organizations are disabled, filter by user
      filters.push(eq(materialsSchema.trainerId, auth.userId));
    }
    
    if (query.trainerId) {
      filters.push(eq(materialsSchema.trainerId, query.trainerId));
    }
    if (query.status) {
      filters.push(eq(materialsSchema.status, query.status));
    }
    if (query.fileType) {
      filters.push(eq(materialsSchema.fileType, query.fileType));
    }

    // Build query with all filters and apply pagination
    const materials = await db
      .select({
        id: materialsSchema.id,
        organizationId: materialsSchema.organizationId,
        trainerId: materialsSchema.trainerId,
        title: materialsSchema.title,
        description: materialsSchema.description,
        fileType: materialsSchema.fileType,
        fileSize: materialsSchema.fileSize,
        status: materialsSchema.status,
        createdAt: materialsSchema.createdAt,
        updatedAt: materialsSchema.updatedAt,
      })
      .from(materialsSchema)
      .where(and(...filters))
      .limit(query.limit)
      .offset(query.offset);

    // Security logging
    console.log('Materials access:', {
      userId: auth.userId,
      orgId: auth.orgId,
      sessionId: auth.sessionId,
      count: materials.length,
      filters: query,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        success: true,
        data: materials,
        count: materials.length,
        pagination: {
          limit: query.limit,
          offset: query.offset,
          hasMore: materials.length === query.limit,
        },
        meta: {
          organizationId: auth.orgId || null,
          requestId: auth.sessionId,
        },
      },
      { headers: SECURITY_HEADERS }
    );

  } catch (error) {
    return createSecureErrorResponse(
      error,
      'Failed to fetch materials',
      500,
      { userId: auth.userId, orgId: auth.orgId }
    );
  }
});

/**
 * SECURED Materials API - POST endpoint  
 * SECURITY: Authentication required, input validation, organization enforcement
 */
export const POST = withPartialAuth(async (auth: PartialAuthContext, request: NextRequest) => {
  try {
    // Rate limiting check
    const rateLimitResult = checkRateLimit(`${auth.userId}:materials:post`, 10, 60000);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Rate limit exceeded. Please try again later.',
          retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)
        },
        { 
          status: 429,
          headers: {
            ...SECURITY_HEADERS,
            'Retry-After': Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString()
          }
        }
      );
    }

    // Check if organizations are enabled and handle auth accordingly
    const organizationsEnabled = isOrganizationsEnabled();
    
    if (organizationsEnabled && !auth.orgId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Organization selection required',
          code: 'ORGANIZATION_SELECTION_REQUIRED',
          redirectTo: '/onboarding/organization-selection'
        },
        { status: 403, headers: SECURITY_HEADERS }
      );
    }

    // Validate request body
    const bodyValidation = await validateRequestBody(request, CreateMaterialSchema);
    if (!bodyValidation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request data',
          details: bodyValidation.error
        },
        { status: 400, headers: SECURITY_HEADERS }
      );
    }

    const materialData = bodyValidation.data;

    // SECURITY: Enforce organization boundary when organizations are enabled
    if (organizationsEnabled) {
      if (materialData.organizationId !== auth.orgId) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Access denied: Cannot create materials for other organizations',
            code: 'FORBIDDEN_CROSS_TENANT_CREATE'
          },
          { status: 403, headers: SECURITY_HEADERS }
        );
      }
    }

    // SECURITY: Validate trainer ID matches authenticated user (if provided)
    if (materialData.trainerId !== auth.userId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Access denied: Cannot create materials for other trainers',
          code: 'FORBIDDEN_IMPERSONATION'
        },
        { status: 403, headers: SECURITY_HEADERS }
      );
    }

    // Create material with validated data
    const insertData = {
      organizationId: organizationsEnabled 
        ? (materialData.organizationId as string)
        : (auth.orgId || 'default'), // Fallback for disabled organizations
      trainerId: materialData.trainerId as string,
      title: materialData.title as string,
      description: materialData.description as string | null,
      fileType: materialData.fileType as string | null,
      originalUri: materialData.originalUri as string,
      fileSize: materialData.fileSize as number | null,
      status: 'uploaded' as const,
    };
    
    const newMaterial = await db.insert(materialsSchema).values(insertData).returning();

    // Security logging
    console.log('Material created:', {
      materialId: newMaterial[0]?.id,
      userId: auth.userId,
      orgId: auth.orgId,
      sessionId: auth.sessionId,
      title: materialData.title,
      fileType: materialData.fileType,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        success: true,
        data: newMaterial[0],
        meta: {
          organizationId: auth.orgId,
          trainerId: auth.userId,
          requestId: auth.sessionId,
        },
      },
      { 
        status: 201,
        headers: SECURITY_HEADERS 
      }
    );

  } catch (error) {
    return createSecureErrorResponse(
      error,
      'Failed to create material',
      500,
      { userId: auth.userId, orgId: auth.orgId }
    );
  }
});
