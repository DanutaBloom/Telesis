import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { db } from '@/libs/DB';
import { materialsSchema } from '@/models/Schema';

export async function GET() {
  try {
    const materials = await db.select().from(materialsSchema).limit(10);

    return NextResponse.json({
      success: true,
      data: materials,
      count: materials.length,
    });
  } catch (error) {
    console.error('Failed to fetch materials:', error);

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

    const newMaterial = await db.insert(materialsSchema).values({
      organizationId: body.organizationId || 'test-org-1',
      trainerId: body.trainerId || 'test-trainer-1',
      title: body.title || 'Test Material',
      description: body.description || 'A test learning material',
      fileType: body.fileType || 'pdf',
      originalUri: body.originalUri || '/test/path/material.pdf',
      status: 'uploaded',
    }).returning();

    return NextResponse.json({
      success: true,
      data: newMaterial[0],
    });
  } catch (error) {
    console.error('Failed to create material:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
