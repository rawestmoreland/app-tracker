import { auth, currentUser, User } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { User as PrismaUser } from '@prisma/client';
import { cache } from 'react';

type ServerAuthRequest = {
  clerkUserId: string;
};

type ServerAuthResponse = {
  dbUser: PrismaUser;
};

async function _getJobTrackerServerAuth({ clerkUser }: { clerkUser: User }) {
  let dbUser = await prisma.user.findUnique({
    where: {
      clerkId: clerkUser.id,
    },
  });

  // Create user on-the-fly if not found (for testing environments)
  if (
    !dbUser &&
    (process.env.NODE_ENV === 'test' || process.env.VERCEL_ENV === 'preview')
  ) {
    dbUser = await prisma.user.create({
      data: {
        clerkId: clerkUser.id,
        email: clerkUser.emailAddresses[0].emailAddress || 'test@example.com',
        name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim(),
      },
    });

    // Create default user preferences
    await prisma.userPreference.createMany({
      data: [
        {
          userId: dbUser.id,
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
          userId: dbUser.id,
          configName: 'app-table-pagination-size',
          configValue: {
            pageSize: 10,
          },
        },
        {
          userId: dbUser.id,
          configName: 'user-preferences',
          configValue: {
            ghostThreshold: 5 * 24 * 60 * 60,
          },
        },
      ],
    });
  }

  if (!dbUser) {
    throw new Error('User not found');
  }

  return {
    dbUser,
  };
}

export const getJobTrackerServerAuth = cache(_getJobTrackerServerAuth);

export async function getSignedInUser() {
  const authResult = await currentUser();
  if (!authResult || !authResult.id) {
    throw new Error('User not found');
  }
  const { dbUser } = await getJobTrackerServerAuth({
    clerkUser: authResult,
  });
  return { dbUser };
}
