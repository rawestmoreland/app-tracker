'use server';

import { InterviewOutcome, InterviewType } from '@prisma/client';
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
