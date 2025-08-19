import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { EventType, EventSource } from '@prisma/client';
import { ActivityTracker } from '@/lib/services/activity-tracker';

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
      { status: 500 },
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
      companyName,
      companyUrl,
    } = body;

    // Validate required fields
    if (!title || !appliedAt) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    // Validate company information
    if (!companyId && !companyName) {
      return NextResponse.json(
        { error: 'Either companyId or companyName must be provided' },
        { status: 400 },
      );
    }

    // Create application in a transaction
    const result = await prisma.$transaction(async (tx) => {
      let finalCompanyId = companyId;

      // If no companyId provided, create a new company
      if (!companyId && companyName) {
        const newCompany = await tx.company.create({
          data: {
            name: companyName.trim(),
            website: companyUrl || null,
            visibility: 'PRIVATE',
            createdBy: dbUser.id,
          },
        });
        finalCompanyId = newCompany.id;
      }

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
          companyId: finalCompanyId,
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

      return application;
    });

    // Track both the application creation and initial status using consolidated activity tracking
    await Promise.all([
      ActivityTracker.trackApplicationCreated(
        result.id,
        result.title,
        result.company.name,
      ),
      ActivityTracker.trackApplicationInitialStatus(
        result.id,
        result.title,
        status || 'APPLIED',
        new Date(appliedAt),
      ),
    ]);

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error creating application:', error);
    return NextResponse.json(
      { error: 'Failed to create application' },
      { status: 500 },
    );
  }
}
