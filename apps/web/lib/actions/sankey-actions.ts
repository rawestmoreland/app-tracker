'use server';

import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';
import { ApplicationFlowData } from '@/lib/types/sankey';

const prisma = new PrismaClient();

export async function getApplicationFlowData(): Promise<ApplicationFlowData[]> {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      throw new Error('User not authenticated');
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Query activities for status changes, excluding transitions from null to APPLIED
    const statusChangeActivities = await prisma.activity.findMany({
      where: {
        userId: user.id,
        type: 'APPLICATION_STATUS_CHANGED',
        fromStatus: { not: null },
        toStatus: { not: null },
        NOT: {
          AND: [
            { fromStatus: null },
            { toStatus: 'APPLIED' }
          ]
        }
      },
      include: {
        application: {
          include: {
            company: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    // Group by status transitions and count
    const flowMap = new Map<string, ApplicationFlowData>();

    statusChangeActivities.forEach(activity => {
      if (!activity.fromStatus || !activity.toStatus || !activity.application) {
        return;
      }

      const key = `${activity.fromStatus}->${activity.toStatus}`;
      
      if (flowMap.has(key)) {
        const existing = flowMap.get(key)!;
        existing.count += 1;
        existing.applications?.push({
          id: activity.application.id,
          title: activity.application.title,
          company: activity.application.company.name,
          appliedAt: activity.application.appliedAt,
        });
      } else {
        flowMap.set(key, {
          fromStatus: activity.fromStatus,
          toStatus: activity.toStatus,
          count: 1,
          applications: [{
            id: activity.application.id,
            title: activity.application.title,
            company: activity.application.company.name,
            appliedAt: activity.application.appliedAt,
          }],
        });
      }
    });

    // Note: Applications in APPLIED status without status change activities represent 
    // the starting point of our sankey chart (source nodes). They don't need explicit 
    // flow entries as the chart will start from APPLIED status transitions.

    return Array.from(flowMap.values());
  } catch (error) {
    console.error('Error fetching application flow data:', error);
    return [];
  } finally {
    await prisma.$disconnect();
  }
}