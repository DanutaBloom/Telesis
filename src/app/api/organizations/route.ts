import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { db } from '@/libs/DB';
import { organizationSchema } from '@/models/Schema';

export async function GET() {
  try {
    const organizations = await db.select().from(organizationSchema).limit(10);

    return NextResponse.json({
      success: true,
      data: organizations,
      count: organizations.length,
    });
  } catch (error) {
    console.error('Failed to fetch organizations:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const newOrg = await db.insert(organizationSchema).values({
      id: body.id || `org-${Date.now()}`,
      stripeCustomerId: body.stripeCustomerId || null,
    }).returning();

    return NextResponse.json({
      success: true,
      data: newOrg[0],
    });
  } catch (error) {
    console.error('Failed to create organization:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
