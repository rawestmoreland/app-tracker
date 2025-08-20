import { Suspense } from 'react';
import { AppTrackerLoading } from '@/components/ui/loading';
import { ActivityLog } from '@/app/_components/activity-log';

export default function ActivityPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Activity Log</h1>
        <p className="text-muted-foreground">
          Track all your activities across the platform
        </p>
      </div>

      <Suspense fallback={<AppTrackerLoading />}>
        <ActivityLog
          showStats={true}
          showFilters={true}
          limit={100}
          className="w-full"
        />
      </Suspense>
    </div>
  );
}
