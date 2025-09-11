'use server';

import { prisma } from '@/lib/prisma';
import { ApplicationFlowData } from '@/lib/types/sankey';
import { getSignedInUser } from '@/app/lib/auth';
import { APPLICATION_FLOW_STAGES } from '../application-flow';
import { ApplicationStatus } from '@prisma/client';

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

    // Build bridged transitions for each application
    const bridgedTransitions = new Map<string, ApplicationFlowData>();

    applicationActivities.forEach((activities, applicationId) => {
      // Sort activities by creation time (ascending) to get chronological order
      const sortedActivities = activities.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );

      // Find the bridged path by skipping terminal statuses, but include final terminal transitions
      let lastNonTerminalStatus: string | null = null;
      let lastActivity = sortedActivities[sortedActivities.length - 1];

      for (const activity of sortedActivities) {
        if (!activity.fromStatus || !activity.toStatus) continue;

        const fromStatusIsTerminal =
          APPLICATION_FLOW_STAGES[activity.fromStatus as ApplicationStatus]
            .isTerminal;
        const toStatusIsTerminal =
          APPLICATION_FLOW_STAGES[activity.toStatus as ApplicationStatus]
            .isTerminal;

        if (!toStatusIsTerminal) {
          // This is a non-terminal status
          if (
            lastNonTerminalStatus &&
            lastNonTerminalStatus !== activity.toStatus
          ) {
            // Create a bridged transition from the last non-terminal status to this one
            const key = `${lastNonTerminalStatus}->${activity.toStatus}`;

            if (bridgedTransitions.has(key)) {
              const existing = bridgedTransitions.get(key)!;
              existing.count += 1;
              existing.applications?.push({
                id: activity.application!.id,
                title: activity.application!.title,
                company: activity.application!.company.name,
                appliedAt: activity.application!.appliedAt,
              });
            } else {
              bridgedTransitions.set(key, {
                fromStatus: lastNonTerminalStatus,
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
          lastNonTerminalStatus = activity.toStatus;
        } else if (!fromStatusIsTerminal) {
          // If we're moving to a terminal status from a non-terminal status,
          // we need to remember the non-terminal status for potential bridging
          lastNonTerminalStatus = activity.fromStatus;
        }
        // If both are terminal, we skip entirely
      }

      // If the application ends in a terminal status, include that final transition
      if (lastActivity && lastActivity.fromStatus && lastActivity.toStatus) {
        const lastToStatusIsTerminal =
          APPLICATION_FLOW_STAGES[lastActivity.toStatus as ApplicationStatus]
            .isTerminal;
        const lastFromStatusIsTerminal =
          APPLICATION_FLOW_STAGES[lastActivity.fromStatus as ApplicationStatus]
            .isTerminal;

        if (lastToStatusIsTerminal && !lastFromStatusIsTerminal) {
          // This application ends in a terminal status from a non-terminal status
          const key = `${lastActivity.fromStatus}->${lastActivity.toStatus}`;

          if (bridgedTransitions.has(key)) {
            const existing = bridgedTransitions.get(key)!;
            existing.count += 1;
            existing.applications?.push({
              id: lastActivity.application!.id,
              title: lastActivity.application!.title,
              company: lastActivity.application!.company.name,
              appliedAt: lastActivity.application!.appliedAt,
            });
          } else {
            bridgedTransitions.set(key, {
              fromStatus: lastActivity.fromStatus,
              toStatus: lastActivity.toStatus,
              count: 1,
              applications: [
                {
                  id: lastActivity.application!.id,
                  title: lastActivity.application!.title,
                  company: lastActivity.application!.company.name,
                  appliedAt: lastActivity.application!.appliedAt,
                },
              ],
            });
          }
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
