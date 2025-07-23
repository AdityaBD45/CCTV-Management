import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function PATCH(request, context) {
  const { params } = context; // ✅ Do not destructure inline

  try {
    const incidentId = Number(params?.id); // ✅ optional chaining just in case

    if (isNaN(incidentId)) {
      return NextResponse.json({ error: 'Invalid incident ID' }, { status: 400 });
    }

    const updatedIncident = await prisma.incident.update({
      where: { id: incidentId },
      data: { resolved: true },
      include: { camera: true },
    });

    return NextResponse.json(updatedIncident);
  } catch (error) {
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Incident not found' }, { status: 404 });
    }

    return NextResponse.json({ error: 'Failed to resolve incident' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
