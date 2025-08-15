'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { ApplicationStatus, EventType, EventSource } from '@prisma/client';
import { getSignedInUser } from '@/app/lib/auth';
import { R2Service } from '../r2';
import { NoteFormData } from '@/app/(dashboard)/dashboard/applications/lib/new-note-schema';
import { ApplicationFormData } from '@/app/(dashboard)/dashboard/applications/lib/new-application-schema';
import { isProgressiveTransition, getStageOrder } from '../application-flow';

// Helper function to map ApplicationStatus to EventType
function getEventTypeFromStatus(status: ApplicationStatus): EventType {
  const statusToEventMap: Record<ApplicationStatus, EventType> = {
    DRAFT: EventType.OTHER,
    APPLIED: EventType.APPLICATION_SUBMITTED,
    CONFIRMATION_RECEIVED: EventType.CONFIRMATION_RECEIVED,
    UNDER_REVIEW: EventType.RESUME_REVIEWED,
    PHONE_SCREEN: EventType.PHONE_SCREEN_INVITE,
    TECHNICAL_INTERVIEW: EventType.TECHNICAL_INVITE,
    ONSITE_INTERVIEW: EventType.ONSITE_INVITE,
    REFERENCE_CHECK: EventType.REFERENCE_CHECK,
    OFFER_RECEIVED: EventType.OFFER_RECEIVED,
    OFFER_NEGOTIATING: EventType.NEGOTIATION_STARTED,
    ACCEPTED: EventType.OFFER_ACCEPTED,
    REJECTED: EventType.REJECTION_RECEIVED,
    WITHDRAWN: EventType.WITHDRAWN,
    GHOSTED: EventType.OTHER,
    POSITION_FILLED: EventType.POSITION_FILLED,
  };

  return statusToEventMap[status];
}

// Helper function to get event title from status
function getEventTitleFromStatus(status: ApplicationStatus): string {
  const statusToTitleMap: Record<ApplicationStatus, string> = {
    DRAFT: 'Application draft created',
    APPLIED: 'Application submitted',
    CONFIRMATION_RECEIVED: 'Application confirmation received',
    UNDER_REVIEW: 'Application under review',
    PHONE_SCREEN: 'Phone screen invitation',
    TECHNICAL_INTERVIEW: 'Technical interview invitation',
    ONSITE_INTERVIEW: 'Onsite interview invitation',
    REFERENCE_CHECK: 'Reference check initiated',
    OFFER_RECEIVED: 'Job offer received',
    OFFER_NEGOTIATING: 'Offer negotiation started',
    ACCEPTED: 'Offer accepted',
    REJECTED: 'Application rejected',
    WITHDRAWN: 'Application withdrawn',
    GHOSTED: 'No response received',
    POSITION_FILLED: 'Position filled by another candidate',
  };

  return statusToTitleMap[status];
}

export async function updateApplicationStatus(
  applicationId: string,
  status: ApplicationStatus
) {
  try {
    const { dbUser } = await getSignedInUser();

    if (!dbUser) {
      return { error: 'Unauthorized' };
    }

    if (!status || !Object.values(ApplicationStatus).includes(status)) {
      return { error: 'Invalid status provided' };
    }

    // Check if application belongs to the user
    const existingApplication = await prisma.application.findFirst({
      where: {
        id: applicationId,
        userId: dbUser.id,
      },
    });

    if (!existingApplication) {
      return { error: 'Application not found' };
    }

    // Only create activity log if status actually changed
    const statusChanged = existingApplication.status !== status;

    // Update the application status
    const updatedApplication = await prisma.application.update({
      where: {
        id: applicationId,
      },
      data: {
        status,
        updatedAt: new Date(),
      },
    });

    // Create activity log entry and status transition if status changed
    if (statusChanged) {
      const transitionTime = new Date();

      // Create traditional activity log entry
      await prisma.applicationEvent.create({
        data: {
          type: getEventTypeFromStatus(status),
          title: getEventTitleFromStatus(status),
          content: `Status changed from ${existingApplication.status.replace(
            /_/g,
            ' '
          )} to ${status.replace(/_/g, ' ')}`,
          occurredAt: transitionTime,
          source: EventSource.OTHER,
          applicationId,
          userId: dbUser.id,
        },
      });

      // Create status transition entry for sankey diagram tracking
      await prisma.applicationStatusTransition.create({
        data: {
          fromStatus: existingApplication.status,
          toStatus: status,
          transitionAt: transitionTime,
          reason: `Status update via application interface`,
          isProgression: isProgressiveTransition(existingApplication.status, status),
          stageOrder: getStageOrder(status),
          applicationId,
          userId: dbUser.id,
        },
      });
    }

    // Revalidate the dashboard page
    revalidatePath('/dashboard');
    revalidatePath(`/dashboard/applications/${applicationId}`);

    return { success: true, application: updatedApplication };
  } catch (error) {
    console.error('Error updating application status:', error);
    return { error: 'Failed to update application status' };
  }
}

// New function to manually add activity log entries
export async function addActivityLogEntry(
  applicationId: string,
  data: {
    type: EventType;
    title: string;
    content?: string;
    occurredAt: Date;
    source: EventSource;
  }
) {
  try {
    const { dbUser } = await getSignedInUser();

    if (!dbUser) {
      return { error: 'Unauthorized' };
    }

    // Check if application belongs to the user
    const existingApplication = await prisma.application.findFirst({
      where: {
        id: applicationId,
        userId: dbUser.id,
      },
    });

    if (!existingApplication) {
      return { error: 'Application not found' };
    }

    // Create the activity log entry
    const event = await prisma.applicationEvent.create({
      data: {
        type: data.type,
        title: data.title,
        content: data.content,
        occurredAt: data.occurredAt,
        source: data.source,
        applicationId,
        userId: dbUser.id,
      },
    });

    // Revalidate the application page
    revalidatePath(`/dashboard/applications/${applicationId}`);

    return { success: true, event };
  } catch (error) {
    console.error('Error adding activity log entry:', error);
    return { error: 'Failed to add activity log entry' };
  }
}

export async function deleteApplication(id: string) {
  const { dbUser } = await getSignedInUser();

  if (!dbUser) {
    throw new Error('Unauthorized');
  }

  try {
    await prisma.application.delete({
      where: { id, userId: dbUser.id },
    });

    return { success: true };
  } catch (error) {
    console.error('Error deleting application:', error);
    return { success: false, error: 'Failed to delete application' };
  }
}

export async function updateApplication(id: string, data: ApplicationFormData) {
  const { dbUser } = await getSignedInUser();

  if (!dbUser) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    await prisma.application.update({
      where: { id, userId: dbUser.id },
      data,
    });

    revalidatePath(`/dashboard/applications/${id}`);
    return { success: true };
  } catch (error) {
    console.error('Error updating application:', error);
    return { success: false, error: 'Failed to update application' };
  }
}

export async function addNote(id: string, data: NoteFormData) {
  const { dbUser } = await getSignedInUser();

  if (!dbUser) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    const note = await prisma.note.create({
      data: {
        content: data.content,
        type: data.type,
        userId: dbUser.id,
        applicationId: id,
        interviewId: data.interviewId,
      },
      include: {
        application: {
          include: { company: true },
        },
        interview: {
          include: { application: { include: { company: true } } },
        },
      },
    });

    revalidatePath(`/dashboard/applications/${id}`);
    return { success: true, note };
  } catch (error) {
    console.error('Error adding note:', error);
    return { success: false, error: 'Failed to add note' };
  }
}

export async function deleteResume(id: string) {
  const { dbUser } = await getSignedInUser();

  if (!dbUser) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    // Get the application and verify ownership
    const application = await prisma.application.findFirst({
      where: { id, userId: dbUser.id },
    });

    if (!application) {
      return { success: false, error: 'Application not found' };
    }

    if (!application.resume) {
      return { success: false, error: 'No resume to delete' };
    }

    // Delete from R2
    await R2Service.deleteFile(application.resume);

    // Update application to remove resume info
    await prisma.application.update({
      where: { id },
      data: { resume: null, resumeName: null },
    });

    revalidatePath(`/dashboard/applications/${id}`);

    return { success: true };
  } catch (error) {
    console.error('Error deleting resume:', error);
    return { success: false, error: 'Failed to delete resume' };
  }
}
