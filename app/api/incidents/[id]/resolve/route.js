import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// PATCH /api/incidents/:id/resolve
export async function PATCH(request, { params }) {
  try {
    const incidentId = parseInt(params.id);
    
    // Validate incident ID
    if (isNaN(incidentId)) {
      return NextResponse.json(
        { error: 'Invalid incident ID' },
        { status: 400 }
      );
    }
    
    // Update incident to resolved = true
    const updatedIncident = await prisma.incident.update({
      where: {
        id: incidentId
      },
      data: {
        resolved: true
      },
      include: {
        camera: true  // Include camera details in response
      }
    });
    
    return NextResponse.json(updatedIncident);
    
  } catch (error) {
    console.error('Error resolving incident:', error);
    
    // Handle case where incident doesn't exist
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Incident not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to resolve incident' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
