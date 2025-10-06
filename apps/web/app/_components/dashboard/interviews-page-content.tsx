'use client';

import { useState } from 'react';
import InterviewsTable from './interviews-table';
import InterviewsCalendar from './interviews-calendar';
import InterviewsViewToggle from './interviews-view-toggle';
import { InterviewType, InterviewFormat, InterviewOutcome } from '@prisma/client';

interface Interview {
  id: string;
  type: InterviewType;
  format: InterviewFormat;
  scheduledAt: Date | null;
  duration: number | null;
  outcome: InterviewOutcome | null;
  application: {
    company: {
      name: string;
    };
  };
}

interface InterviewsPageContentProps {
  interviews: any[];
}

export default function InterviewsPageContent({
  interviews,
}: InterviewsPageContentProps) {
  const [view, setView] = useState<'table' | 'calendar'>('table');

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Interviews</h1>
        <InterviewsViewToggle view={view} onViewChange={setView} />
      </div>

      {view === 'table' ? (
        <InterviewsTable interviews={interviews} />
      ) : (
        <InterviewsCalendar interviews={interviews} />
      )}
    </div>
  );
}
