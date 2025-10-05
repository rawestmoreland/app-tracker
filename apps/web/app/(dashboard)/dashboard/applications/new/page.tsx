import { Suspense } from 'react';
import { Loading } from '@/components/ui/loading';
import NewApplicationContent from './components/new-application-content';
import { prisma } from '@/lib/prisma';
import { getSignedInUser } from '@/app/lib/auth';
import { Metadata } from 'next';
import { unauthorized } from 'next/navigation';
import { User } from '@prisma/client';
import { UserPreferences } from '@/lib/types/user';

export const metadata: Metadata = {
  title: 'App Track - New Application',
  description: 'Create a new application',
};

// Loading fallback component for the new application form
function NewApplicationLoading() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="mb-2 h-4 w-32 animate-pulse rounded bg-gray-200"></div>
          <div className="h-8 w-64 animate-pulse rounded bg-gray-200"></div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <div className="space-y-6">
            <Loading variant="dots" size="lg" className="py-8" />
            <div className="text-center text-gray-500">
              Preparing application form...
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

async function fetchCompanies(dbUser: User) {
  const companies = await prisma.company.findMany({
    where: {
      OR: [
        { visibility: 'GLOBAL' },
        { visibility: 'PUBLIC' },
        { visibility: 'PRIVATE', createdBy: dbUser.id },
        { createdBy: dbUser.id },
      ],
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      applications: {
        where: { userId: dbUser.id },
      },
      contacts: {
        where: { userId: dbUser.id },
      },
    },
  });

  return companies;
}

async function fetchUserPrefs(dbUser: User) {
  const userPrefs = await prisma.userPreference.findUnique({
    where: {
      userId_configName: {
        userId: dbUser.id,
        configName: 'user-preferences',
      },
    },
  });
  return userPrefs?.configValue as UserPreferences;
}

export default async function NewApplication() {
  const { dbUser } = await getSignedInUser();
  if (!dbUser) {
    return unauthorized();
  }

  const prefsPromise = fetchUserPrefs(dbUser);
  const companiesPromise = fetchCompanies(dbUser);

  const [companies, userPrefs] = await Promise.all([
    companiesPromise,
    prefsPromise,
  ]);

  return (
    <Suspense fallback={<NewApplicationLoading />}>
      <NewApplicationContent
        companies={companies}
        defaultCurrency={userPrefs?.currency ?? 'USD'}
      />
    </Suspense>
  );
}
