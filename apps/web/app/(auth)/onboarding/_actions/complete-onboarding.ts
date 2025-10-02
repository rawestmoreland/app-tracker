'use server';

import { getSignedInUser } from '@/app/lib/auth';
import { prisma } from '@/lib/prisma';
import { clerkClient, currentUser } from '@clerk/nextjs/server';
import { SignupReason } from '@prisma/client';

export const checkUserExists = async () => {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser) {
      return { exists: false };
    }

    const dbUser = await prisma.user.findUnique({
      where: {
        clerkId: clerkUser.id,
      },
    });

    return { exists: !!dbUser };
  } catch (error) {
    console.error('Error checking user exists:', error);
    return { exists: false };
  }
};

export const completeOnboarding = async (data: {
  signupReason: SignupReason;
}) => {
  try {
    const { dbUser } = await getSignedInUser();

    if (!dbUser) {
      console.error('No logged in user found');
      return { message: 'No Logged In User' };
    }

    const client = await clerkClient();

    const res = await client.users.updateUser(dbUser.clerkId, {
      publicMetadata: {
        onboardingComplete: true,
        signupReason: data.signupReason,
      },
    });

    const updatedUser = await prisma.user.update({
      where: {
        id: dbUser.id,
      },
      data: {
        signupReason: data.signupReason,
        onboardingComplete: true,
      },
    });

    return { message: res.publicMetadata, updatedUser };
  } catch (err) {
    console.error('Error in completeOnboarding:', err);
    return { error: 'There was an error updating the user metadata.' };
  }
};
