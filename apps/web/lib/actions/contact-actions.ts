'use server';

import { prisma } from '@/lib/prisma';
import { NewContactSchema } from '@/app/_components/dashboard/contacts/new-contact-schema';
import { getSignedInUser } from '@/app/lib/auth';
import { Contact } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { ActivityTracker } from '@/lib/services/activity-tracker';

export async function addContact(data: NewContactSchema): Promise<{
  error?: boolean;
  message?: string;
  contact?: Contact;
}> {
  const { dbUser } = await getSignedInUser();

  if (!dbUser) {
    return {
      error: true,
      message: 'User not found',
    };
  }

  try {
    const contact = await prisma.contact.upsert({
      where: {
        id: data.existingContactId || '',
      },
      create: {
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        title: data.title || '',
        linkedin: data.linkedin || '',
        notes: data.notes || '',
        companyId: data.companyId || undefined,
        interviewId: data.interviewId || undefined,
        userId: dbUser.id,
      },
      update: {
        interviewId: data.interviewId || undefined,
        userId: dbUser.id,
      },
      include: {
        company: true,
      },
    });

    await ActivityTracker.trackContactCreated(
      contact.id,
      contact.name,
      contact.company?.name,
    );

    revalidatePath('/dashboard/contacts/new');
    revalidatePath(`/dashboard/companies/${contact.companyId}`);

    return {
      error: false,
      message: 'Contact added successfully',
      contact,
    };
  } catch (error) {
    console.error(error);
    return {
      error: true,
      message: 'Failed to add contact',
    };
  }
}
