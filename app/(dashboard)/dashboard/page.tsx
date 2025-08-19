import { Suspense } from 'react';
import { AppTrackerLoading } from '@/components/ui/loading';
import ApplicationsTable from '@/app/_components/dashboard/applications-table';
import { getSignedInUser } from '@/app/lib/auth';
import { prisma } from '@/lib/prisma';
import StatsContent from '@/app/_components/dashboard/stats-content';
import { notFound } from 'next/navigation';
import { User } from '@prisma/client';

async function fetchApplications(dbUser: User) {
  const applications = await prisma.application.findMany({
    where: {
      userId: dbUser.id,
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
    },
    orderBy: { appliedAt: 'desc' },
  });

  return applications;
}

async function fetchAnalytics(dbUser: User) {
  const applications = await prisma.application.findMany({
    where: { userId: dbUser.id },
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

  const stats = {
    totalApplications: applications.length,
    activeApplications: applications.filter(
      (app) => !['REJECTED', 'ACCEPTED', 'WITHDRAWN'].includes(app.status),
    ).length,
    totalInterviews: applications.reduce(
      (sum, app) => sum + app.interviews.length,
      0,
    ),
    averageResponseTime: 0, // TODO: Calculate based on first interview date
    successRate: 0, // TODO: Calculate based on offers vs total
    ghostRate:
      (applications.filter((app) => app.status === 'GHOSTED')?.length ??
        0 / applications.length) * 100,
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

  return {
    columnsVisibility: columnsVisibility?.configValue as Record<
      string,
      boolean
    >,
    paginationSize: {
      pageSize:
        (paginationSize?.configValue as { pageSize?: number })?.pageSize || 10,
    },
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
    <div>
      {/* Analytics Cards */}
      <StatsContent analytics={analytics} />

      {/* Applications Table */}
      <ApplicationsTable
        applications={applications}
        tableConfig={userPreference}
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
