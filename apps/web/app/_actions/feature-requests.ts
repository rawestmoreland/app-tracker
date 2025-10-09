'use server';

import { getSignedInUser } from '../lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { formSchema } from '@/components/feedback-dialog';
import { Resend } from 'resend';
import {
  FeatureRequestTemplate,
  FeatureRequestThankYouTemplate,
} from '@/components/email/feature-request-template';

export async function createFeatureRequest(data: z.infer<typeof formSchema>) {
  const { dbUser } = await getSignedInUser();

  if (!dbUser) {
    return {
      error: 'User not found or not authenticated',
    };
  }

  try {
    const featureRequest = await prisma.featureRequest.create({
      data: {
        ...data,
        userId: dbUser.id,
      },
    });

    const resend = new Resend(process.env.RESEND_API_KEY);

    // Send an email to Richard
    await resend.emails.send({
      from: 'Richard from Jobble <richard@jobble.app>',
      replyTo: 'richard@westmorelandcreative.com',
      to: ['richard@westmorelandcreative.com'],
      subject: 'New App Track Feature Request',
      react: FeatureRequestTemplate({ featureRequest }),
    });

    // Send an email to the user
    await resend.emails.send({
      from: 'Richard from Jobble <richard@jobble.app>',
      replyTo: 'richard@westmorelandcreative.com',
      to: [dbUser.email],
      subject: 'Thank you for your feature request',
      react: FeatureRequestThankYouTemplate({ featureRequest }),
    });

    return {
      success: true,
      featureRequest,
    };
  } catch (error) {
    console.error(error);
    return {
      error: 'Failed to create feature request',
    };
  }
}
