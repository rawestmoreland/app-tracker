'use server';

import { prisma } from '@/lib/prisma';
import { getSignedInUser } from '@/app/lib/auth';
import { generateSankeyData, SankeyData } from '../application-flow';
import { ApplicationStatus } from '@prisma/client';

/**
 * Get sankey diagram data for the current user's application flow
 */
export async function getUserApplicationFlowData(): Promise<{ 
  success: boolean; 
  data?: SankeyData; 
  error?: string 
}> {
  try {
    const { dbUser } = await getSignedInUser();

    if (!dbUser) {
      return { success: false, error: 'Unauthorized' };
    }

    // Get all status transitions for the user
    const transitions = await prisma.applicationStatusTransition.groupBy({
      by: ['fromStatus', 'toStatus'],
      where: {
        userId: dbUser.id,
      },
      _count: {
        id: true,
      },
    });

    // Transform the data for sankey diagram
    const sankeyTransitions = transitions.map(transition => ({
      fromStatus: transition.fromStatus,
      toStatus: transition.toStatus,
      count: transition._count.id,
    }));

    const sankeyData = generateSankeyData(sankeyTransitions);

    return { success: true, data: sankeyData };
  } catch (error) {
    console.error('Error generating application flow data:', error);
    return { success: false, error: 'Failed to generate flow data' };
  }
}

/**
 * Get conversion rates at each stage of the application process
 */
export async function getApplicationConversionRates(): Promise<{
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

    // Get all applications and their final status
    const applications = await prisma.application.findMany({
      where: {
        userId: dbUser.id,
      },
      select: {
        id: true,
        status: true,
        statusTransitions: {
          orderBy: {
            transitionAt: 'asc',
          },
        },
      },
    });

    // Analyze progression through each stage
    const stageAnalysis = new Map<ApplicationStatus, {
      applicationsAtStage: number;
      progressedToNext: number;
      droppedOff: number;
    }>();

    applications.forEach(app => {
      const transitions = app.statusTransitions;
      
      // Track which stages this application went through
      const stagesReached = new Set<ApplicationStatus>();
      
      // Add initial stage if there are transitions
      if (transitions.length > 0) {
        const firstTransition = transitions[0];
        if (firstTransition.fromStatus) {
          stagesReached.add(firstTransition.fromStatus);
        }
      }
      
      // Add all stages from transitions
      transitions.forEach(transition => {
        stagesReached.add(transition.toStatus);
      });

      // For each stage reached, determine if application progressed further
      Array.from(stagesReached).forEach(stage => {
        if (!stageAnalysis.has(stage)) {
          stageAnalysis.set(stage, {
            applicationsAtStage: 0,
            progressedToNext: 0,
            droppedOff: 0,
          });
        }

        const analysis = stageAnalysis.get(stage)!;
        analysis.applicationsAtStage++;

        // Check if application progressed beyond this stage
        const hasProgressedBeyond = transitions.some(transition => 
          transition.fromStatus === stage && transition.isProgression
        );

        if (hasProgressedBeyond) {
          analysis.progressedToNext++;
        } else {
          analysis.droppedOff++;
        }
      });
    });

    // Convert to array with conversion rates
    const conversionData = Array.from(stageAnalysis.entries()).map(([stage, analysis]) => ({
      stage,
      applicationsAtStage: analysis.applicationsAtStage,
      progressedToNext: analysis.progressedToNext,
      conversionRate: analysis.applicationsAtStage > 0 
        ? (analysis.progressedToNext / analysis.applicationsAtStage) * 100 
        : 0,
      droppedOff: analysis.droppedOff,
    }));

    return { success: true, data: conversionData };
  } catch (error) {
    console.error('Error calculating conversion rates:', error);
    return { success: false, error: 'Failed to calculate conversion rates' };
  }
}

/**
 * Get summary statistics for hiring success
 */
export async function getHiringSuccessStats(): Promise<{
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

    // Get all applications
    const applications = await prisma.application.findMany({
      where: {
        userId: dbUser.id,
      },
      select: {
        id: true,
        status: true,
        appliedAt: true,
        statusTransitions: {
          where: {
            toStatus: 'ACCEPTED',
          },
          orderBy: {
            transitionAt: 'desc',
          },
          take: 1,
        },
      },
    });

    const totalApplications = applications.length;
    const hiredApplications = applications.filter(app => app.status === 'ACCEPTED');
    const totalHired = hiredApplications.length;
    const hiringRate = totalApplications > 0 ? (totalHired / totalApplications) * 100 : 0;

    // Calculate average time to hire
    let totalTimeToHire = 0;
    let hiredCount = 0;
    
    hiredApplications.forEach(app => {
      if (app.statusTransitions.length > 0) {
        const hiredDate = app.statusTransitions[0].transitionAt;
        const appliedDate = app.appliedAt;
        const timeDiff = hiredDate.getTime() - appliedDate.getTime();
        const daysDiff = timeDiff / (1000 * 3600 * 24);
        totalTimeToHire += daysDiff;
        hiredCount++;
      }
    });

    const averageTimeToHire = hiredCount > 0 ? totalTimeToHire / hiredCount : 0;

    // Find most common drop-off stage
    const rejectedApplications = applications.filter(app => 
      ['REJECTED', 'WITHDRAWN', 'GHOSTED', 'POSITION_FILLED'].includes(app.status)
    );

    const dropOffCounts = new Map<ApplicationStatus, number>();
    rejectedApplications.forEach(app => {
      dropOffCounts.set(app.status as ApplicationStatus, 
        (dropOffCounts.get(app.status as ApplicationStatus) || 0) + 1
      );
    });

    let mostCommonDropOffStage: ApplicationStatus | null = null;
    let maxCount = 0;
    dropOffCounts.forEach((count, stage) => {
      if (count > maxCount) {
        maxCount = count;
        mostCommonDropOffStage = stage;
      }
    });

    return {
      success: true,
      data: {
        totalApplications,
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