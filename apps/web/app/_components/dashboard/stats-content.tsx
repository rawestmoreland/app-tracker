'use client';

import { Analytics } from '@/lib/types/dashboard';
import { GhostIcon } from 'lucide-react';

const StatCard = ({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) => {
  return (
    <div className="bg-background rounded-lg p-6 shadow">
      <div className="flex items-start">
        {icon}
        <div className="ml-4">
          <p className="text-muted-foreground text-sm font-medium">{title}</p>
          <p className="text-foreground text-2xl font-semibold">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default function StatsContent({ analytics }: { analytics: Analytics }) {
  if (!analytics) return null;

  return (
    <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
      {/* Total Applications */}
      <StatCard
        title="Total Applications"
        value={analytics.totalApplications.toString()}
        icon={
          <div className="rounded-lg bg-blue-100 p-2">
            <svg
              className="h-6 w-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
        }
      />

      {/* Response Rate */}
      <StatCard
        title="Response Rate"
        value={analytics.responseRate.toFixed(1)}
        icon={
          <div className="rounded-lg bg-green-100 p-2">
            <svg
              className="h-6 w-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
        }
      />

      {/* Applications This Week */}
      <StatCard
        title="Applications This Week"
        value={analytics.applicationsThisWeek.toString()}
        icon={
          <div className="rounded-lg bg-purple-100 p-2">
            <svg
              className="h-6 w-6 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        }
      />

      {/* Ghost Rate */}
      <StatCard
        title="Ghost Rate"
        value={analytics.ghostRate.toFixed(2)}
        icon={
          <div className="rounded-lg bg-yellow-100 p-2">
            <GhostIcon className="h-6 w-6 text-yellow-600" />
          </div>
        }
      />
    </div>
  );
}
