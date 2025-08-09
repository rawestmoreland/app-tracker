import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

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

    const interviews = await prisma.interview.findMany({
      where: { userId: dbUser.id },
      include: {
        application: {
          include: { company: true },
        },
        contacts: true,
        notes: true,
      },
      orderBy: { scheduledAt: 'desc' },
    });

    return NextResponse.json(interviews);
  } catch (error) {
    console.error('Error fetching interviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch interviews' },
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
      type,
      format,
      scheduledAt,
      duration,
      feedback,
      outcome,
      applicationId,
    } = body;

    if (!type || !format || !applicationId) {
      return NextResponse.json(
        { error: 'Type, format, and applicationId are required' },
        { status: 400 }
      );
    }

    const interview = await prisma.interview.create({
      data: {
        type,
        format,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        duration,
        feedback,
        outcome,
        userId: dbUser.id,
        applicationId,
      },
      include: {
        application: {
          include: { company: true },
        },
        contacts: true,
        notes: true,
      },
    });

    return NextResponse.json(interview, { status: 201 });
  } catch (error) {
    console.error('Error creating interview:', error);
    return NextResponse.json(
      { error: 'Failed to create interview' },
      { status: 500 }
    );
  }
}
