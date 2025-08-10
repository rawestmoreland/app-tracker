import { Suspense } from 'react';
import { JobTrackerLoading } from '@/components/ui/loading';
import ApplicationsTable from './components/dashboard/applications-table';
import { getSignedInUser } from './lib/auth';
import { prisma } from '@/lib/prisma';
import StatsContent from './components/dashboard/stats-content';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusIcon } from 'lucide-react';

async function fetchApplications() {
  const { dbUser } = await getSignedInUser();

  if (!dbUser) {
    throw new Error('User not found');
  }

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

async function fetchAnalytics() {
  const { dbUser } = await getSignedInUser();

  if (!dbUser) {
    throw new Error('User not found');
  }

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
      (app) => !['REJECTED', 'ACCEPTED', 'WITHDRAWN'].includes(app.status)
    ).length,
    totalInterviews: applications.reduce(
      (sum, app) => sum + app.interviews.length,
      0
    ),
    averageResponseTime: 0, // TODO: Calculate based on first interview date
    successRate: 0, // TODO: Calculate based on offers vs total
    ghostRate:
      (applications.filter((app) => app.status === 'GHOSTED')?.length ??
        0 / applications.length) * 100,
  };

  return stats;
}

async function DashboardContent() {
  const applicationsPromise = fetchApplications();
  const analyticsPromise = fetchAnalytics();

  const [applications, analytics] = await Promise.all([
    applicationsPromise,
    analyticsPromise,
  ]);

  return (
    <div>
      {/* Analytics Cards */}
      <StatsContent analytics={analytics} />

      {/* Applications Table */}
      <div className='bg-white rounded-lg shadow'>
        <div className='px-6 py-4 border-b border-gray-200'>
          <div className='flex justify-between items-center'>
            <h2 className='text-xl font-semibold text-gray-900'>
              Recent Applications
            </h2>
            <div>
              <Button asChild>
                <Link href='/applications/new'>
                  <PlusIcon />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <ApplicationsTable applications={applications} />
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={<JobTrackerLoading />}>
      <DashboardContent />
    </Suspense>
  );
}
