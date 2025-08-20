import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'overview';

    switch (type) {
      case 'overview':
        return await getOverviewStats(dbUser.id);
      case 'applications-by-status':
        return await getApplicationsByStatus(dbUser.id);
      case 'applications-by-month':
        return await getApplicationsByMonth(dbUser.id);
      case 'interview-outcomes':
        return await getInterviewOutcomes(dbUser.id);
      case 'company-stats':
        return await getCompanyStats(dbUser.id);
      default:
        return NextResponse.json(
          { error: 'Invalid analytics type' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}

async function getOverviewStats(userId: string) {
  const applications = await prisma.application.findMany({
    where: { userId },
    select: {
      status: true,
      appliedAt: true,
      interviews: {
        select: {
          outcome: true,
        },
      },
    },
  });

  const stats = {
    totalApplications: applications.length,
    activeApplications: applications.filter(
      (app) => !['REJECTED', 'ACCEPTED', 'WITHDRAWN'].includes(app.status)
    ).length,
    totalInterviews: applications.reduce(
      (sum, app) => sum + app.interviews.length,
      0
    ),
    averageResponseTime: 0, // TODO: Calculate based on first interview date
    successRate: 0, // TODO: Calculate based on offers vs total
    ghostRate:
      (applications.filter((app) => app.status === 'GHOSTED')?.length ??
        0 / applications.length) * 100,
  };

  return NextResponse.json(stats);
}

async function getApplicationsByStatus(userId: string) {
  const applications = await prisma.application.findMany({
    where: { userId },
    select: { status: true },
  });

  const statusCounts = applications.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const data = Object.entries(statusCounts).map(([status, count]) => ({
    status,
    count,
  }));

  return NextResponse.json(data);
}

async function getApplicationsByMonth(userId: string) {
  const applications = await prisma.application.findMany({
    where: { userId },
    select: { appliedAt: true },
  });

  const monthCounts = applications.reduce((acc, app) => {
    const month = app.appliedAt.toISOString().slice(0, 7); // YYYY-MM
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const data = Object.entries(monthCounts)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, count]) => ({
      month,
      count,
    }));

  return NextResponse.json(data);
}

async function getInterviewOutcomes(userId: string) {
  const interviews = await prisma.interview.findMany({
    where: { userId },
    select: { outcome: true },
  });

  const outcomeCounts = interviews.reduce((acc, interview) => {
    const outcome = interview.outcome || 'PENDING';
    acc[outcome] = (acc[outcome] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const data = Object.entries(outcomeCounts).map(([outcome, count]) => ({
    outcome,
    count,
  }));

  return NextResponse.json(data);
}

async function getCompanyStats(userId: string) {
  const applications = await prisma.application.findMany({
    where: { userId },
    include: {
      company: {
        select: { name: true },
      },
    },
  });

  const companyCounts = applications.reduce((acc, app) => {
    const companyName = app.company.name;
    acc[companyName] = (acc[companyName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const data = Object.entries(companyCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10) // Top 10 companies
    .map(([company, count]) => ({
      company,
      count,
    }));

  return NextResponse.json(data);
}
