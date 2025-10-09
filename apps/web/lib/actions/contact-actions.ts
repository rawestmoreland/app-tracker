'use server';

import { prisma } from '@/lib/prisma';
import { NewContactSchema } from '@/app/_components/dashboard/contacts/new-contact-schema';
import { getSignedInUser } from '@/app/lib/auth';
import { Company, Contact } from '@prisma/client';
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
    let contact: Contact & { company: Company | null };
    await prisma.$transaction(async (tx) => {
      if (data.existingContactId && data.interviewId) {
        // Add existing contact to interview
        await tx.interviewContact.create({
          data: {
            interviewId: data.interviewId,
            contactId: data.existingContactId,
          },
        });
        contact = await tx.contact.findUnique({
          where: { id: data.existingContactId },
          include: { company: true },
        });
      } else {
        // Create new contact
        contact = await tx.contact.create({
          data: {
            name: data.name || '',
            email: data.email || '',
            phone: data.phone || '',
            title: data.title || '',
            linkedin: data.linkedin || '',
            notes: data.notes || '',
            companyId: data.companyId || '',
            userId: dbUser.id,
            interviewContacts: {
              create: {
                interviewId: data.interviewId || '',
              },
            },
          },
          include: {
            company: true,
          },
        });
        await ActivityTracker.trackContactCreated(
          contact.id,
          contact.name,
          contact.company.name || '',
        );
      }
    });

    revalidatePath(`/dashboard/companies/${contact.companyId}`);
    revalidatePath('/dashboard/contacts/new');

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
