'use server';

import { getSignedInUser } from '@/app/lib/auth';
import { prisma } from '@/lib/prisma';
import { clerkClient } from '@clerk/nextjs/server';
import { SignupReason } from '@prisma/client';

export const completeOnboarding = async (data: {
  signupReason: SignupReason;
}) => {
  try {
    const { dbUser } = await getSignedInUser();

    if (!dbUser) {
      console.error('No logged in user found');
      return { message: 'No Logged In User' };
    }

    console.log('Updating user metadata for:', dbUser.clerkId);
    const client = await clerkClient();

    const res = await client.users.updateUser(dbUser.clerkId, {
      publicMetadata: {
        onboardingComplete: true,
        signupReason: data.signupReason,
      },
    });

    console.log('Clerk user updated:', res.publicMetadata);

    const updatedUser = await prisma.user.update({
      where: {
        id: dbUser.id,
      },
      data: {
        signupReason: data.signupReason,
        onboardingComplete: true,
      },
    });

    console.log('Database user updated:', updatedUser.id);

    return { message: res.publicMetadata, updatedUser };
  } catch (err) {
    console.error('Error in completeOnboarding:', err);
    return { error: 'There was an error updating the user metadata.' };
  }
};
