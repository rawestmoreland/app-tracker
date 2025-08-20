import { verifyWebhook } from '@clerk/nextjs/webhooks';
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ApplicationStatus, RemoteType } from '@prisma/client';

export async function POST(req: NextRequest) {
  try {
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
        ],
      });
    }

    if (eventType === 'user.deleted') {
      await prisma.user.delete({
        where: { clerkId: id },
      });
    }

    return new Response('Webhook received', { status: 200 });
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error verifying webhook', { status: 400 });
  }
}
