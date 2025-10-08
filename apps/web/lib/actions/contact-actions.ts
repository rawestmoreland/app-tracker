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
    const contact = await prisma.contact.create({
      data: {
        ...data,
        interviewId: data.interviewId || undefined,
        companyId: data.companyId || undefined,
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
