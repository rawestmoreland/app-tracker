'use server';

import { getSignedInUser } from '@/app/lib/auth';
import { ActivityTracker } from '@/lib/services/activity-tracker';
import { SankeyData } from '../application-flow';
import { ApplicationStatus } from '@prisma/client';

/**
 * Get sankey diagram data for the current user's application flow
 */
export async function getUserApplicationFlowData(days?: number): Promise<{
  success: boolean;
  data?: SankeyData;
  error?: string;
}> {
  try {
    const { dbUser } = await getSignedInUser();

    if (!dbUser) {
      return { success: false, error: 'Unauthorized' };
    }

    // Use the new ActivityTracker method for fast Sankey data generation
    const sankeyData = await ActivityTracker.generateUserSankeyData(dbUser.id, days);

    return { success: true, data: sankeyData };
  } catch (error) {
    console.error('Error generating application flow data:', error);
    return { success: false, error: 'Failed to generate flow data' };
  }
}

/**
 * Get conversion rates at each stage of the application process
 */
export async function getApplicationConversionRates(days?: number): Promise<{
  success: boolean;
  data?: Array<{
    stage: ApplicationStatus;
    applicationsAtStage: number;
    progressedToNext: number;
    conversionRate: number;
    droppedOff: number;
  }>;
  error?: string;
}> {
  try {
    const { dbUser } = await getSignedInUser();

    if (!dbUser) {
      return { success: false, error: 'Unauthorized' };
    }

    // Get status transitions using the new ActivityTracker
    const transitions = await ActivityTracker.getUserStatusTransitions(dbUser.id, days || 90);

    // Import the progression analysis function
    const { isProgressiveTransition } = await import('@/lib/application-flow');

    // Analyze progression through each stage
    const stageAnalysis = new Map<
      ApplicationStatus,
      {
        applicationsAtStage: number;
        progressedToNext: number;
        droppedOff: number;
      }
    >();

    // Count transitions from each stage
    transitions.forEach(({ fromStatus, toStatus, count }) => {
      if (fromStatus) {
        // Initialize stage if not exists
        if (!stageAnalysis.has(fromStatus)) {
          stageAnalysis.set(fromStatus, {
            applicationsAtStage: 0,
            progressedToNext: 0,
            droppedOff: 0,
          });
        }

        const analysis = stageAnalysis.get(fromStatus)!;
        analysis.applicationsAtStage += count;
        
        // Count as progression if this is a positive transition
        const isProgression = isProgressiveTransition(fromStatus, toStatus);
        if (isProgression) {
          analysis.progressedToNext += count;
        } else {
          analysis.droppedOff += count;
        }
      }
    });

    // Convert to array with conversion rates
    const conversionData = Array.from(stageAnalysis.entries()).map(
      ([stage, analysis]) => ({
        stage,
        applicationsAtStage: analysis.applicationsAtStage,
        progressedToNext: analysis.progressedToNext,
        conversionRate:
          analysis.applicationsAtStage > 0
            ? (analysis.progressedToNext / analysis.applicationsAtStage) * 100
            : 0,
        droppedOff: analysis.droppedOff,
      }),
    ).filter(data => data.applicationsAtStage > 0); // Only include stages with data

    return { success: true, data: conversionData };
  } catch (error) {
    console.error('Error calculating conversion rates:', error);
    return { success: false, error: 'Failed to calculate conversion rates' };
  }
}

/**
 * Get summary statistics for hiring success
 */
export async function getHiringSuccessStats(days?: number): Promise<{
  success: boolean;
  data?: {
    totalApplications: number;
    totalHired: number;
    hiringRate: number;
    averageTimeToHire: number; // in days
    mostCommonDropOffStage: ApplicationStatus | null;
  };
  error?: string;
}> {
  try {
    const { dbUser } = await getSignedInUser();

    if (!dbUser) {
      return { success: false, error: 'Unauthorized' };
    }

    // Get transition statistics using the new ActivityTracker
    const transitionStats = await ActivityTracker.getStatusTransitionStats(dbUser.id, days || 90);
    
    // Calculate total applications from initial status transitions
    const transitions = await ActivityTracker.getUserStatusTransitions(dbUser.id, days || 90);
    const initialApplications = transitions
      .filter(t => t.fromStatus === null) // Initial applications
      .reduce((sum, t) => sum + t.count, 0);

    // Get hired count from final statuses
    const totalHired = transitionStats.finalStatuses['ACCEPTED'] || 0;
    const hiringRate = initialApplications > 0 ? (totalHired / initialApplications) * 100 : 0;

    // Calculate average time to hire using activity data
    // Get all applications that were accepted and their timelines
    const { prisma } = await import('@/lib/prisma');
    const acceptedApplications = await prisma.application.findMany({
      where: {
        userId: dbUser.id,
        status: 'ACCEPTED',
        ...(days && {
          appliedAt: {
            gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000)
          }
        })
      },
      select: {
        id: true,
        appliedAt: true,
        activities: {
          where: {
            type: 'APPLICATION_STATUS_CHANGED',
            toStatus: 'ACCEPTED'
          },
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: { createdAt: true }
        }
      }
    });

    let totalTimeToHire = 0;
    let hiredCount = 0;

    acceptedApplications.forEach((app) => {
      if (app.activities.length > 0) {
        const hiredDate = app.activities[0].createdAt;
        const appliedDate = app.appliedAt;
        const timeDiff = hiredDate.getTime() - appliedDate.getTime();
        const daysDiff = timeDiff / (1000 * 3600 * 24);
        totalTimeToHire += daysDiff;
        hiredCount++;
      }
    });

    const averageTimeToHire = hiredCount > 0 ? totalTimeToHire / hiredCount : 0;

    // Find most common drop-off stage from transition stats
    const negativeStatuses: ApplicationStatus[] = ['REJECTED', 'WITHDRAWN', 'GHOSTED', 'POSITION_FILLED'];
    let mostCommonDropOffStage: ApplicationStatus | null = null;
    let maxCount = 0;

    negativeStatuses.forEach(status => {
      const count = transitionStats.finalStatuses[status] || 0;
      if (count > maxCount) {
        maxCount = count;
        mostCommonDropOffStage = status;
      }
    });

    return {
      success: true,
      data: {
        totalApplications: initialApplications,
        totalHired,
        hiringRate,
        averageTimeToHire,
        mostCommonDropOffStage,
      },
    };
  } catch (error) {
    console.error('Error calculating hiring success stats:', error);
    return { success: false, error: 'Failed to calculate hiring statistics' };
  }
}
