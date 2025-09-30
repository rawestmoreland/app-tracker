import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const routeParams = await params;
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const application = await prisma.application.findFirst({
      where: { id: routeParams.id, userId: dbUser.id },
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
    });

    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 },
      );
    }

    return NextResponse.json(application);
  } catch (error) {
    console.error('Error fetching application:', error);
    return NextResponse.json(
      { error: 'Failed to fetch application' },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const routeParams = await params;

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
      resumeId,
      referredBy,
    } = body;

    const application = await prisma.application.updateMany({
      where: { id: routeParams.id, userId: dbUser.id },
      data: {
        title,
        description,
        jobUrl,
        lowSalary,
        highSalary,
        currency,
        location,
        remote,
        status,
        appliedAt: appliedAt ? new Date(appliedAt) : undefined,
        companyId,
        resumeId,
        referredBy,
      },
    });

    if (application.count === 0) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 },
      );
    }

    const updatedApplication = await prisma.application.findFirst({
      where: { id: routeParams.id },
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
    });

    return NextResponse.json(updatedApplication);
  } catch (error) {
    console.error('Error updating application:', error);
    return NextResponse.json(
      { error: 'Failed to update application' },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const routeParams = await params;

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });
    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const application = await prisma.application.deleteMany({
      where: { id: routeParams.id, userId: dbUser.id },
    });

    if (application.count === 0) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 },
      );
    }

    return NextResponse.json({ message: 'Application deleted successfully' });
  } catch (error) {
    console.error('Error deleting application:', error);
    return NextResponse.json(
      { error: 'Failed to delete application' },
      { status: 500 },
    );
  }
}
