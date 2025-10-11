'use server';

import {
  InterviewOutcome,
  InterviewType,
  InterviewFormat,
  InterviewFeeling,
} from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getSignedInUser } from '@/app/lib/auth';

export async function updateInterviewOutcome(
  interviewId: string,
  outcome: InterviewOutcome,
): Promise<{ error?: string; success?: boolean }> {
  try {
    const { dbUser } = await getSignedInUser();
    if (!dbUser) {
      return { error: 'Unauthorized' };
    }

    const interview = await prisma.interview.findFirst({
      where: {
        id: interviewId,
        userId: dbUser.id,
      },
    });

    if (!interview) {
      return { error: 'Interview not found' };
    }

    await prisma.interview.update({
      where: { id: interviewId },
      data: { outcome },
    });

    revalidatePath('/dashboard/interviews');
    revalidatePath(`/dashboard/interviews/${interviewId}`);
    revalidatePath('/dashboard/applications');

    return { success: true };
  } catch (error) {
    console.error('Failed to update interview outcome:', error);
    return { error: 'Failed to update interview outcome' };
  }
}

export async function updateInterviewType(
  interviewId: string,
  type: InterviewType,
): Promise<{ error?: string; success?: boolean }> {
  try {
    const { dbUser } = await getSignedInUser();
    if (!dbUser) {
      return { error: 'Unauthorized' };
    }

    const interview = await prisma.interview.findFirst({
      where: {
        id: interviewId,
        userId: dbUser.id,
      },
    });

    if (!interview) {
      return { error: 'Interview not found' };
    }

    await prisma.interview.update({
      where: { id: interviewId },
      data: { type },
    });

    revalidatePath('/dashboard/interviews');
    revalidatePath(`/dashboard/interviews/${interviewId}`);
    revalidatePath('/dashboard/applications');

    return { success: true };
  } catch (error) {
    console.error('Failed to update interview type:', error);
    return { error: 'Failed to update interview type' };
  }
}

export async function updateInterviewFormat(
  interviewId: string,
  format: InterviewFormat,
): Promise<{ error?: string; success?: boolean }> {
  try {
    const { dbUser } = await getSignedInUser();
    if (!dbUser) {
      return { error: 'Unauthorized' };
    }

    const interview = await prisma.interview.findFirst({
      where: {
        id: interviewId,
        userId: dbUser.id,
      },
    });

    if (!interview) {
      return { error: 'Interview not found' };
    }

    await prisma.interview.update({
      where: { id: interviewId },
      data: { format },
    });

    revalidatePath('/dashboard/interviews');
    revalidatePath(`/dashboard/interviews/${interviewId}`);
    revalidatePath('/dashboard/applications');

    return { success: true };
  } catch (error) {
    console.error('Failed to update interview format:', error);
    return { error: 'Failed to update interview format' };
  }
}

export async function updateInterviewScheduledAt(
  interviewId: string,
  scheduledAt: Date | null,
): Promise<{ error?: string; success?: boolean }> {
  try {
    const { dbUser } = await getSignedInUser();
    if (!dbUser) {
      return { error: 'Unauthorized' };
    }

    const interview = await prisma.interview.findFirst({
      where: {
        id: interviewId,
        userId: dbUser.id,
      },
    });

    if (!interview) {
      return { error: 'Interview not found' };
    }

    await prisma.interview.update({
      where: { id: interviewId },
      data: { scheduledAt },
    });

    revalidatePath('/dashboard/interviews');
    revalidatePath(`/dashboard/interviews/${interviewId}`);
    revalidatePath('/dashboard/applications');

    return { success: true };
  } catch (error) {
    console.error('Failed to update interview scheduled date:', error);
    return { error: 'Failed to update interview scheduled date' };
  }
}

export async function updateInterviewDuration(
  interviewId: string,
  duration: number | null,
): Promise<{ error?: string; success?: boolean }> {
  try {
    const { dbUser } = await getSignedInUser();
    if (!dbUser) {
      return { error: 'Unauthorized' };
    }

    const interview = await prisma.interview.findFirst({
      where: {
        id: interviewId,
        userId: dbUser.id,
      },
    });

    if (!interview) {
      return { error: 'Interview not found' };
    }

    await prisma.interview.update({
      where: { id: interviewId },
      data: { duration },
    });

    revalidatePath('/dashboard/interviews');
    revalidatePath(`/dashboard/interviews/${interviewId}`);
    revalidatePath('/dashboard/applications');

    return { success: true };
  } catch (error) {
    console.error('Failed to update interview duration:', error);
    return { error: 'Failed to update interview duration' };
  }
}

export async function updateInterviewFeeling(
  interviewId: string,
  feeling: InterviewFeeling | null,
): Promise<{ error?: string; success?: boolean }> {
  try {
    const { dbUser } = await getSignedInUser();
    if (!dbUser) {
      return { error: 'Unauthorized' };
    }

    const interview = await prisma.interview.findFirst({
      where: {
        id: interviewId,
        userId: dbUser.id,
      },
    });

    if (!interview) {
      return { error: 'Interview not found' };
    }

    await prisma.interview.update({
      where: { id: interviewId },
      data: { feeling },
    });

    revalidatePath('/dashboard/interviews');
    revalidatePath(`/dashboard/interviews/${interviewId}`);
    revalidatePath('/dashboard/applications');

    return { success: true };
  } catch (error) {
    console.error('Failed to update interview feeling:', error);
    return { error: 'Failed to update interview feeling' };
  }
}

export async function deleteInterview(
  interviewId: string,
  hardDelete: boolean = false,
): Promise<{
  error?: string;
  success?: boolean;
}> {
  try {
    const { dbUser } = await getSignedInUser();
    if (!dbUser) {
      return { error: 'Unauthorized' };
    }

    const interview = await prisma.interview.findFirst({
      where: { id: interviewId, userId: dbUser.id },
    });

    if (!interview) {
      return { error: 'Interview not found' };
    }

    if (hardDelete) {
      await prisma.interview.delete({
        where: { id: interviewId, userId: dbUser.id },
      });
    } else {
      await prisma.interview.update({
        where: { id: interviewId },
        data: { archived: true },
      });
    }

    revalidatePath('/dashboard/interviews');
    revalidatePath(`/dashboard/interviews/${interviewId}`);
    revalidatePath('/dashboard/applications');

    return { success: true };
  } catch (error) {
    console.error('Failed to delete interview:', error);
  }
}

export async function getInterviews() {
  try {
    const { dbUser } = await getSignedInUser();
    if (!dbUser) {
      throw new Error('Unauthorized');
    }

    const interviews = await prisma.interview.findMany({
      where: {
        userId: dbUser.id,
        archived: false,
      },
      include: {
        application: {
          include: {
            company: true,
          },
        },
        activities: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
      orderBy: {
        scheduledAt: 'desc',
      },
    });

    return interviews;
  } catch (error) {
    console.error('Failed to fetch interviews:', error);
    throw error;
  }
}

export async function archiveInterviews(
  interviewIds: string[],
): Promise<{
  success?: boolean;
  error?: string;
  message?: string;
}> {
  try {
    const { dbUser } = await getSignedInUser();
    if (!dbUser) {
      return { error: 'Unauthorized' };
    }

    await prisma.interview.updateMany({
      where: {
        id: {
          in: interviewIds,
        },
        userId: dbUser.id,
      },
      data: {
        archived: true,
      },
    });

    revalidatePath('/dashboard/interviews');

    return {
      success: true,
      message: `${interviewIds.length} interview${interviewIds.length === 1 ? '' : 's'} archived successfully`,
    };
  } catch (error) {
    console.error('Failed to archive interviews:', error);
    return { error: 'Failed to archive interviews' };
  }
}
