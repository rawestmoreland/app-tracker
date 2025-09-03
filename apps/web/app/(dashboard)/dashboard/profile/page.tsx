import { Suspense } from 'react';
import ProfileContent from './_components/ProfileContent';
import { getSignedInUser } from '@/app/lib/auth';
import { prisma } from '@/lib/prisma';
import { User } from '@prisma/client';
import { unauthorized } from 'next/navigation';
import { UserPreferences } from '@/lib/types/user';
import { Loading } from '@/components/ui/loading';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'App Track - Profile',
  description: 'Manage your profile and preferences',
};

async function fetchUserPreferences(dbUser: User) {
  const userPrefs = await prisma.userPreference.findUnique({
    where: {
      userId_configName: {
        userId: dbUser.id,
        configName: 'user-preferences',
      },
    },
  });

  if (!userPrefs?.configValue) {
    return {
      ghostThreshold: 5 * 24 * 60 * 60,
      receiveEmailNotifications: false,
    };
  }

  return userPrefs.configValue as UserPreferences;
}

function ProfileLoading() {
  return (
    <div className="flex flex-col gap-4">
      <Loading variant="dots" size="lg" />
    </div>
  );
}

export default async function ProfilePage() {
  const { dbUser } = await getSignedInUser();

  if (!dbUser) {
    return unauthorized();
  }

  const userPrefs = await fetchUserPreferences(dbUser);

  return (
    <Suspense fallback={<ProfileLoading />}>
      <ProfileContent userPrefs={userPrefs} />
    </Suspense>
  );
}
