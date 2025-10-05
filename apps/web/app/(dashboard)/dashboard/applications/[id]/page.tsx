import { getSignedInUser } from '@/app/lib/auth';
import { prisma } from '@/lib/prisma';

import { notFound } from 'next/navigation';
import ApplicationContent from './components/application-content';
import { User } from '@prisma/client';
import { UserPreferences } from '@/lib/types/user';
import { unstable_cache } from 'next/cache';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { dbUser } = await getSignedInUser();
  if (!dbUser) {
    return {
      title: 'App Track',
      description: 'Track your job applications and interviews with App Track',
    };
  }
  const { id } = await params;
  const application = await fetchApplication(dbUser, id);
  return {
    title: `${application?.title} - App Track`,
    description: `View ${application?.title}`,
  };
}

const fetchCompanies = async () => {
  const { dbUser } = await getSignedInUser();
  if (!dbUser) {
    return [];
  }

  const getCachedCompanies = unstable_cache(
    async () => {
      const { dbUser } = await getSignedInUser();
      if (!dbUser) {
        return [];
      }
      return prisma.company.findMany({
        include: {
          applications: {
            select: {
              id: true,
            },
            where: {
              userId: dbUser.id,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    },
    ['companies-with-apps', dbUser.id],
    {
      revalidate: 60,
      tags: ['companies, applications'],
    },
  );
  const companies = await getCachedCompanies();

  return companies;
};

const fetchApplication = async (dbUser: User, id: string) => {
  const application = await prisma.application.findUnique({
    where: { id, userId: dbUser.id },
    include: {
      connectedResume: true,
      company: true,
      interviews: {
        include: {
          contacts: true,
          notes: true,
        },
      },
      notes: true,
      events: {
        orderBy: {
          occurredAt: 'desc',
        },
      },
    },
  });

  if (!application) {
    notFound();
  }

  return application;
};

const fetchResumes = async (dbUser: User) => {
  const resumes = await prisma.resume.findMany({
    where: { userId: dbUser.id },
  });

  return resumes;
};

const fetchUserPrefs = async (dbUser: User) => {
  const userPrefs = await prisma.userPreference.findUnique({
    where: {
      userId_configName: {
        userId: dbUser.id,
        configName: 'user-preferences',
      },
    },
  });
  return userPrefs?.configValue as UserPreferences;
};

export default async function ApplicationDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { dbUser } = await getSignedInUser();

  if (!id || !dbUser) {
    notFound();
  }

  const applicationPromise = fetchApplication(dbUser, id);
  const companiesPromise = fetchCompanies();
  const userPrefsPromise = fetchUserPrefs(dbUser);
  const resumesPromise = fetchResumes(dbUser);

  const [application, companies, resumes, userPrefs] = await Promise.all([
    applicationPromise,
    companiesPromise,
    resumesPromise,
    userPrefsPromise,
  ]);

  return (
    <ApplicationContent
      application={application}
      companies={companies}
      resumes={resumes}
      defaultCurrency={userPrefs?.currency ?? 'USD'}
    />
  );
}
