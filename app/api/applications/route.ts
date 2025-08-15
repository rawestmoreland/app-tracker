import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { EventType, EventSource } from '@prisma/client';
import { getStageOrder } from '@/lib/application-flow';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });
    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const applications = await prisma.application.findMany({
      where: { userId: dbUser.id },
      include: {
        company: true,
        interviews: {
          include: {
            contacts: true,
            notes: true,
          },
        },
        notes: true,
      },
      orderBy: { appliedAt: 'desc' },
    });

    return NextResponse.json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });
    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await request.json();
    const {
      title,
      description,
      jobUrl,
      lowSalary,
      highSalary,
      currency,
      location,
      remote,
      status,
      appliedAt,
      companyId,
    } = body;

    // Validate required fields
    if (!title || !companyId || !appliedAt) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create application and initial activity log entry in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const application = await tx.application.create({
        data: {
          title,
          description,
          jobUrl,
          lowSalary,
          highSalary,
          currency,
          location,
          remote,
          status: status || 'APPLIED',
          appliedAt: new Date(appliedAt),
          userId: dbUser.id,
          companyId,
        },
        include: {
          company: true,
        },
      });

      // Create initial activity log entry
      await tx.applicationEvent.create({
        data: {
          type: EventType.APPLICATION_SUBMITTED,
          title: 'Application submitted',
          content: `Application submitted for ${title} at ${application.company.name}`,
          occurredAt: new Date(appliedAt),
          source: EventSource.OTHER,
          applicationId: application.id,
          userId: dbUser.id,
        },
      });

      // Create initial status transition for sankey diagram tracking
      await tx.applicationStatusTransition.create({
        data: {
          fromStatus: null, // Initial transition has no "from" status
          toStatus: status || 'APPLIED',
          transitionAt: new Date(appliedAt),
          reason: 'Initial application submission',
          isProgression: true, // Initial application is always progressive
          stageOrder: getStageOrder(status || 'APPLIED'),
          applicationId: application.id,
          userId: dbUser.id,
        },
      });

      return application;
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error creating application:', error);
    return NextResponse.json(
      { error: 'Failed to create application' },
      { status: 500 }
    );
  }
}
