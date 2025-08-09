'use server';

import { getSignedInUser } from '@/app/lib/auth';
import { prisma } from '@/lib/prisma';
import { ApplicationFormData } from '../../lib/new-application-schema';
import { revalidatePath } from 'next/cache';
import { NoteFormData } from '../../lib/new-note-schema';
import { R2Service } from '@/lib/r2';

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

    revalidatePath(`/applications/${id}`);
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

    revalidatePath(`/applications/${id}`);
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

    revalidatePath(`/applications/${id}`);

    return { success: true };
  } catch (error) {
    console.error('Error deleting resume:', error);
    return { success: false, error: 'Failed to delete resume' };
  }
}
