import { verifyWebhook } from '@clerk/nextjs/webhooks';
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Resend } from 'resend';
import { WelcomeTemplate } from '@/components/email/welcome-template';

export async function POST(req: NextRequest) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const evt = await verifyWebhook(req);
    const { id } = evt.data;
    const eventType = evt.type;
    console.log(
      `Received webhook with ID ${id} and event type of ${eventType}`,
    );

    if (eventType === 'user.created') {
      const { id, email_addresses, first_name, last_name } = evt.data;
      const newUser = await prisma.user.upsert({
        where: { clerkId: id },
        update: {},
        create: {
          clerkId: id,
          email: email_addresses[0].email_address,
          name: `${first_name ?? ''} ${last_name ?? ''}`.trim(),
        },
      });

      await prisma.userPreference.createMany({
        data: [
          {
            userId: newUser.id,
            configName: 'app-table-columns-visibility',
            configValue: {
              title: true,
              'company.name': true,
              status: true,
              remote: true,
              appliedAt: true,
              interviews: true,
            },
          },
          {
            userId: newUser.id,
            configName: 'app-table-pagination-size',
            configValue: {
              pageSize: 10,
            },
          },
          {
            userId: newUser.id,
            configName: 'user-preferences',
            configValue: {
              ghostThreshold: 5 * 24 * 60 * 60,
            },
          },
        ],
      });

      // Add the contact to resend
      await resend.contacts.create({
        email: email_addresses[0].email_address,
        firstName: first_name,
        lastName: last_name,
        audienceId: process.env.RESEND_AUDIENCE_ID!,
      });

      // Send the welcome email
      await resend.emails
        .send({
          from: 'Richard from App Track <richard@apptrack.space>',
          replyTo: 'richard@westmorelandcreative.com',
          to: [email_addresses[0].email_address],
          subject: 'Welcome to App Track',
          react: WelcomeTemplate({
            firstName: first_name ?? '',
            lastName: last_name ?? '',
          }),
        })
        .catch(console.error);
    }

    if (eventType === 'user.deleted') {
      const user = await prisma.user.findUnique({
        where: { clerkId: id },
      });

      if (!user) {
        return new Response('User not found', { status: 404 });
      }

      await prisma.user.delete({
        where: { clerkId: id },
      });

      await resend.contacts.remove({
        email: user.email,
        audienceId: process.env.RESEND_AUDIENCE_ID!,
      });
    }

    return new Response('Webhook received', { status: 200 });
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error verifying webhook', { status: 400 });
  }
}
