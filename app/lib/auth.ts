import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { User as PrismaUser } from '@prisma/client';
import { cache } from 'react';

type ServerAuthRequest = {
  clerkUserId: string;
};

type ServerAuthResponse = {
  dbUser: PrismaUser;
};

async function _getJobTrackerServerAuth({
  clerkUserId,
}: ServerAuthRequest): Promise<ServerAuthResponse> {
  const dbUser = await prisma.user.findUniqueOrThrow({
    where: {
      clerkId: clerkUserId,
    },
  });

  return {
    dbUser,
  };
}

export const getJobTrackerServerAuth = cache(_getJobTrackerServerAuth);

export async function getSignedInUser() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error('User not found');
  }
  const { dbUser } = await getJobTrackerServerAuth({
    clerkUserId: userId,
  });
  return { dbUser };
}
