import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { ActivityTracker } from '@/lib/services/activity-tracker';

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
    const days = parseInt(searchParams.get('days') || '90'); // Default to 90 days for Sankey

    // Get Sankey diagram data and transition stats
    const [sankeyData, transitionStats] = await Promise.all([
      ActivityTracker.generateUserSankeyData(dbUser.id, days),
      ActivityTracker.getStatusTransitionStats(dbUser.id, days),
    ]);

    return NextResponse.json({
      sankeyData,
      transitionStats,
      period: `${days} days`,
    });
  } catch (error) {
    console.error('Error fetching Sankey data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Sankey data' },
      { status: 500 }
    );
  }
}