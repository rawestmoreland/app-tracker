'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { ApplicationStatus, EventType, EventSource } from '@prisma/client';
import { getSignedInUser } from '@/app/lib/auth';
import { R2Service } from '../r2';
import { NoteFormData } from '@/app/(dashboard)/dashboard/applications/lib/new-note-schema';
import { ApplicationFormData } from '@/app/(dashboard)/dashboard/applications/lib/new-application-schema';
import { ActivityTracker } from '../services/activity-tracker';

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
  status: ApplicationStatus,
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
            ' ',
          )} to ${status.replace(/_/g, ' ')}`,
          occurredAt: transitionTime,
          source: EventSource.OTHER,
          applicationId,
          userId: dbUser.id,
        },
      });

      // Create the activity entry
      await ActivityTracker.trackApplicationStatusChanged(
        applicationId,
        updatedApplication.title,
        existingApplication.status,
        status,
        `Status update via application interface`,
      );
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
  },
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

  const existingApplication = await prisma.application.findFirst({
    where: { id, userId: dbUser.id },
  });

  if (!existingApplication) {
    return { success: false, error: 'Application not found' };
  }

  const statusChanged = existingApplication.status !== data.status;

  try {
    // Handle company creation if needed
    let finalCompanyId = data.companyId;

    if (!data.companyId && data.companyName) {
      const newCompany = await prisma.company.create({
        data: {
          name: data.companyName.trim(),
          website: data.companyUrl || null,
          visibility: 'PRIVATE',
          createdBy: dbUser.id,
        },
      });
      finalCompanyId = newCompany.id;
    }

    // Prepare update data - exclude new company fields
    const { companyName, companyUrl, ...updateData } = data;
    updateData.companyId = finalCompanyId;

    await prisma.application.update({
      where: { id },
      data: updateData,
    });

    if (statusChanged) {
      const transitionTime = new Date();

      // Create traditional activity log entry
      await prisma.applicationEvent.create({
        data: {
          type: getEventTypeFromStatus(data.status!),
          title: getEventTitleFromStatus(data.status!),
          content: `Status changed from ${existingApplication.status.replace(
            /_/g,
            ' ',
          )} to ${data.status!.replace(/_/g, ' ') ?? ''}`,
          occurredAt: transitionTime,
          source: EventSource.OTHER,
          applicationId: id,
          userId: dbUser.id,
        },
      });

      // Create the activity entry
      await ActivityTracker.trackApplicationStatusChanged(
        id,
        data.title,
        existingApplication.status,
        data.status!,
        `Status update via application interface`,
      );
    }

    revalidatePath(`/dashboard/applications/${id}`);
    return { success: true };
  } catch (error) {
    console.error('Error updating application:', error);
    return { success: false, error: 'Failed to update application' };
  }
}

export async function addNote(applicationId: string, data: NoteFormData) {
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
        applicationId: applicationId,
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

    await ActivityTracker.trackNoteCreated(
      note.id,
      note.type,
      note.application?.company.name,
    );

    revalidatePath(`/dashboard/applications/${applicationId}`);
    return { success: true, note };
  } catch (error) {
    console.error('Error adding note:', error);
    return { success: false, error: 'Failed to add note' };
  }
}

export async function updateNote(noteId: string, data: NoteFormData) {
  const { dbUser } = await getSignedInUser();

  if (!dbUser) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    const note = await prisma.note.update({
      where: {
        id: noteId,
        userId: dbUser.id, // Ensure user owns the note
      },
      data: {
        content: data.content,
        type: data.type,
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

    // Revalidate the appropriate path based on where the note is associated
    if (note.applicationId) {
      revalidatePath(`/dashboard/applications/${note.applicationId}`);
    } else if (note.companyId) {
      revalidatePath(`/dashboard/companies/${note.companyId}`);
    }

    return { success: true, note };
  } catch (error) {
    console.error('Error updating note:', error);
    return { success: false, error: 'Failed to update note' };
  }
}

export async function deleteNote(noteId: string) {
  const { dbUser } = await getSignedInUser();

  if (!dbUser) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    const note = await prisma.note.findFirst({
      where: {
        id: noteId,
        userId: dbUser.id, // Ensure user owns the note
      },
      include: {
        application: true,
        company: true,
      },
    });

    if (!note) {
      return { success: false, error: 'Note not found' };
    }

    await prisma.note.delete({
      where: { id: noteId },
    });

    // Revalidate the appropriate path based on where the note was associated
    if (note.interviewId) {
      revalidatePath(`/dashboard/interviews/${note.interviewId}`);
    } else if (note.companyId) {
      revalidatePath(`/dashboard/companies/${note.companyId}`);
    }

    return { success: true };
  } catch (error) {
    console.error('Error deleting note:', error);
    return { success: false, error: 'Failed to delete note' };
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

export async function archiveApplications(applicationIds: string[]) {
  try {
    const { dbUser } = await getSignedInUser();

    if (!dbUser) {
      return { error: 'Unauthorized' };
    }

    if (!applicationIds || applicationIds.length === 0) {
      return { error: 'No applications provided' };
    }

    // Verify all applications belong to the user
    const applications = await prisma.application.findMany({
      where: {
        id: { in: applicationIds },
        userId: dbUser.id,
      },
      include: {
        company: true,
      },
    });

    if (applications.length !== applicationIds.length) {
      return { error: 'Some applications not found or unauthorized' };
    }

    // Archive all applications
    await prisma.application.updateMany({
      where: {
        id: { in: applicationIds },
        userId: dbUser.id,
      },
      data: {
        archived: true,
        updatedAt: new Date(),
      },
    });

    // Create activity log entries for each archived application
    const activityPromises = applications.map(async (application) => {
      await prisma.applicationEvent.create({
        data: {
          type: EventType.OTHER,
          title: 'Application archived',
          content: `Application archived via bulk action`,
          occurredAt: new Date(),
          source: EventSource.OTHER,
          applicationId: application.id,
          userId: dbUser.id,
        },
      });

      await ActivityTracker.trackApplicationArchived(
        application.id,
        application.title,
        application.company.name,
      );
    });

    await Promise.all(activityPromises);

    // Revalidate the dashboard page
    revalidatePath('/dashboard');

    return {
      success: true,
      message: `Successfully archived ${applicationIds.length} application${applicationIds.length > 1 ? 's' : ''}`,
    };
  } catch (error) {
    console.error('Error archiving applications:', error);
    return { error: 'Failed to archive applications' };
  }
}

export async function updateApplicationResume(
  applicationId: string,
  resumeId: string | null,
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

    // If resumeId is provided, verify it belongs to the user
    if (resumeId) {
      const resume = await prisma.resume.findFirst({
        where: {
          id: resumeId,
          userId: dbUser.id,
        },
      });

      if (!resume) {
        return { error: 'Resume not found or unauthorized' };
      }
    }

    // Update the application resumeId
    const updatedApplication = await prisma.application.update({
      where: {
        id: applicationId,
      },
      data: {
        resumeId,
        updatedAt: new Date(),
      },
    });

    // Create activity log entry
    await prisma.applicationEvent.create({
      data: {
        type: EventType.OTHER,
        title: resumeId ? 'Resume selected' : 'Resume removed',
        content: resumeId
          ? 'Resume selected for this application'
          : 'Resume removed from this application',
        occurredAt: new Date(),
        source: EventSource.OTHER,
        applicationId,
        userId: dbUser.id,
      },
    });

    // Revalidate the application page
    revalidatePath(`/dashboard/applications/${applicationId}`);

    return { success: true, application: updatedApplication };
  } catch (error) {
    console.error('Error updating application resume:', error);
    return { error: 'Failed to update application resume' };
  }
}
