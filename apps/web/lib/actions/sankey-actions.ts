'use server';

import { prisma } from '@/lib/prisma';
import { ApplicationFlowData } from '@/lib/types/sankey';
import { getSignedInUser } from '@/app/lib/auth';

export async function getApplicationFlowData(): Promise<ApplicationFlowData[]> {
  try {
    const { dbUser } = await getSignedInUser();

    if (!dbUser) {
      throw new Error('User not authenticated');
    }

    // Query activities for status changes, excluding transitions from null to APPLIED
    const statusChangeActivities = await prisma.activity.findMany({
      where: {
        userId: dbUser.id,
        type: 'APPLICATION_STATUS_CHANGED',
        fromStatus: { not: null },
        toStatus: { not: null },
        NOT: {
          AND: [{ fromStatus: null }, { toStatus: 'APPLIED' }],
        },
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
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Group activities by application to build bridged paths
    const applicationActivities = new Map<
      string,
      typeof statusChangeActivities
    >();

    statusChangeActivities.forEach((activity) => {
      if (!activity.applicationId) return;

      if (!applicationActivities.has(activity.applicationId)) {
        applicationActivities.set(activity.applicationId, []);
      }
      applicationActivities.get(activity.applicationId)!.push(activity);
    });

    // Build bridged transitions for each application using intelligent bridging
    const bridgedTransitions = new Map<string, ApplicationFlowData>();
    const terminalStatuses = ['ACCEPTED', 'REJECTED', 'WITHDRAWN', 'GHOSTED', 'POSITION_FILLED'];

    applicationActivities.forEach((activities) => {
      // Sort activities by creation time (ascending) to get chronological order
      const sortedActivities = activities.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );

      // Find the last meaningful state before terminal transitions
      let lastMeaningfulState: string | null = null;

      // First, try to find the last non-terminal state
      for (const activity of sortedActivities) {
        if (!terminalStatuses.includes(activity.toStatus!)) {
          lastMeaningfulState = activity.toStatus;
        } else {
          break; // Stop at first terminal state
        }
      }

      // If no non-terminal state found, use the fromStatus of the first terminal transition
      if (!lastMeaningfulState && sortedActivities.length > 0) {
        const firstTerminalTransition = sortedActivities.find(activity =>
          terminalStatuses.includes(activity.toStatus!)
        );
        if (firstTerminalTransition && firstTerminalTransition.fromStatus) {
          lastMeaningfulState = firstTerminalTransition.fromStatus;
        }
      }

      // Process each transition
      for (let i = 0; i < sortedActivities.length; i++) {
        const activity = sortedActivities[i];
        if (!activity.fromStatus || !activity.toStatus) continue;

        // Check if this is a problematic transition
        const isTerminalToTerminal = terminalStatuses.includes(activity.fromStatus) &&
          terminalStatuses.includes(activity.toStatus);
        const isTerminalToNonTerminal = terminalStatuses.includes(activity.fromStatus) &&
          !terminalStatuses.includes(activity.toStatus);

        let transitionKey: string;
        let fromStatus: string;

        if (isTerminalToTerminal || isTerminalToNonTerminal) {
          // Bridge using the last meaningful state if available
          if (lastMeaningfulState) {
            fromStatus = lastMeaningfulState;
            transitionKey = `${fromStatus}->${activity.toStatus}`;
          } else {
            // Skip transitions that have no meaningful progression to show
            continue;
          }
        } else {
          // Normal transition - keep as is
          fromStatus = activity.fromStatus;
          transitionKey = `${fromStatus}->${activity.toStatus}`;
        }

        // Update or create the transition entry
        if (bridgedTransitions.has(transitionKey)) {
          const existing = bridgedTransitions.get(transitionKey)!;
          existing.count += 1;
          existing.applications?.push({
            id: activity.application!.id,
            title: activity.application!.title,
            company: activity.application!.company.name,
            appliedAt: activity.application!.appliedAt,
          });
        } else {
          bridgedTransitions.set(transitionKey, {
            fromStatus: fromStatus,
            toStatus: activity.toStatus,
            count: 1,
            applications: [
              {
                id: activity.application!.id,
                title: activity.application!.title,
                company: activity.application!.company.name,
                appliedAt: activity.application!.appliedAt,
              },
            ],
          });
        }
      }
    });

    const flowMap = bridgedTransitions;

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
