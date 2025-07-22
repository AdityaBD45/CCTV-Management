import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// GET /api/incidents?resolved=false
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const resolvedParam = searchParams.get('resolved');
    
    // Build where clause based on resolved parameter
    const whereClause = {};
    if (resolvedParam !== null) {
      whereClause.resolved = resolvedParam === 'true';
    }
    
    // Fetch incidents with camera information, ordered by newest first
    const incidents = await prisma.incident.findMany({
      where: whereClause,
      include: {
        camera: true  // Include camera details (name, location)
      },
      orderBy: {
        tsStart: 'desc'  // Newest incidents first
      }
    });
    
    return NextResponse.json(incidents);
    
  } catch (error) {
    console.error('Error fetching incidents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch incidents' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
