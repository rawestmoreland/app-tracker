import React, { Suspense } from 'react';
import { AppTrackerLoading } from '@/components/ui/loading';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'App Track - Application Flow',
  description:
    'Visualize how your job applications progress through different statuses using this Sankey diagram.',
};

function ApplicationFlowContent() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Application Flow</h1>
        <p className="mt-1 text-sm text-gray-500">
          Visualize how your job applications progress through different
          statuses using this Sankey diagram.
        </p>
      </div>
    </div>
  );
}

export default function ApplicationFlowPage() {
  return (
    <Suspense fallback={<AppTrackerLoading />}>
      <ApplicationFlowContent />
    </Suspense>
  );
}
