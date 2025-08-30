import React, { Suspense } from 'react';
import { AppTrackerLoading } from '@/components/ui/loading';
import ApplicationsTable from '@/app/_components/dashboard/applications-table';
import { getSignedInUser } from '@/app/lib/auth';
import { prisma } from '@/lib/prisma';
import StatsContent from '@/app/_components/dashboard/stats-content';
import { notFound } from 'next/navigation';
import { User } from '@prisma/client';
import { UserPreferences } from '@/lib/types/user';

async function fetchApplications(dbUser: User) {
  const applications = await prisma.application.findMany({
    where: {
      userId: dbUser.id,
      archived: false,
    },
    include: {
      company: true,
      interviews: {
        include: {
          contacts: true,
          notes: true,
        },
      },
      notes: true,
      activities: {
        where: {
          type: 'APPLICATION_STATUS_CHANGED',
          isProgression: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 1,
      },
    },
    orderBy: { appliedAt: 'desc' },
  });

  return applications;
}

async function fetchAnalytics(dbUser: User) {
  const applications = await prisma.application.findMany({
    where: { userId: dbUser.id, archived: false },
    select: {
      status: true,
      appliedAt: true,
      interviews: {
        select: {
          outcome: true,
        },
      },
    },
  });

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const applicationsWithResponses = applications.filter(
    (app) => !['APPLIED', 'GHOSTED'].includes(app.status),
  ).length;
  const responseRate =
    applications.length > 0
      ? (applicationsWithResponses / applications.length) * 100
      : 0;

  const applicationsThisWeek = applications.filter(
    (app) => app.appliedAt >= oneWeekAgo,
  ).length;

  const ghostedApplications =
    applications.filter((app) => app.status === 'GHOSTED')?.length ?? 0;

  const stats = {
    totalApplications: applications.length,
    responseRate,
    applicationsThisWeek,
    averageResponseTime: 0, // TODO: Calculate based on first interview date
    successRate: 0, // TODO: Calculate based on offers vs total
    ghostRate: (ghostedApplications / applications.length) * 100,
  };

  return stats;
}

const fetchUserPreference = async (dbUser: User) => {
  const columnsVisibility = await prisma.userPreference.findUnique({
    where: {
      userId_configName: {
        userId: dbUser.id,
        configName: 'app-table-columns-visibility',
      },
    },
  });

  const paginationSize = await prisma.userPreference.findUnique({
    where: {
      userId_configName: {
        userId: dbUser.id,
        configName: 'app-table-pagination-size',
      },
    },
  });

  const userPreferences = await prisma.userPreference.findUnique({
    where: {
      userId_configName: {
        userId: dbUser.id,
        configName: 'user-preferences',
      },
    },
  });

  return {
    columnsVisibility: columnsVisibility?.configValue as Record<
      string,
      boolean
    >,
    paginationSize: {
      pageSize:
        (paginationSize?.configValue as { pageSize?: number })?.pageSize || 10,
    },
    userPreferences: userPreferences?.configValue as UserPreferences,
  };
};

async function DashboardContent() {
  const { dbUser } = await getSignedInUser();

  if (!dbUser) {
    notFound();
  }

  const applicationsPromise = fetchApplications(dbUser);
  const analyticsPromise = fetchAnalytics(dbUser);
  const userPreferencePromise = fetchUserPreference(dbUser);

  const [applications, analytics, userPreference] = await Promise.all([
    applicationsPromise,
    analyticsPromise,
    userPreferencePromise,
  ]);

  return (
    <div className="space-y-8">
      {/* Analytics Cards */}
      <StatsContent analytics={analytics} />

      {/* Applications Table */}
      <ApplicationsTable
        applications={applications}
        tableConfig={userPreference}
        userPreferences={userPreference.userPreferences}
      />
    </div>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={<AppTrackerLoading />}>
      <DashboardContent />
    </Suspense>
  );
}
