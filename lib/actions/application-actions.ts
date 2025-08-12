'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { ApplicationStatus } from '@prisma/client';
import { getSignedInUser } from '@/app/lib/auth';
import { R2Service } from '../r2';
import { NoteFormData } from '@/app/(dashboard)/dashboard/applications/lib/new-note-schema';
import { ApplicationFormData } from '@/app/(dashboard)/dashboard/applications/lib/new-application-schema';

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

    // Revalidate the dashboard page
    revalidatePath('/dashboard');
    revalidatePath(`/dashboard/applications/${applicationId}`);

    return { success: true, application: updatedApplication };
  } catch (error) {
    console.error('Error updating application status:', error);
    return { error: 'Failed to update application status' };
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
