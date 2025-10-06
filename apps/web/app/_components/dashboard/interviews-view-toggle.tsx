'use client';

import { Calendar, Table } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface InterviewsViewToggleProps {
  view: 'table' | 'calendar';
  onViewChange: (view: 'table' | 'calendar') => void;
}

export default function InterviewsViewToggle({
  view,
  onViewChange,
}: InterviewsViewToggleProps) {
  return (
    <div className="inline-flex rounded-lg border bg-muted p-1">
      <Button
        variant={view === 'table' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('table')}
        className="gap-2"
      >
        <Table className="h-4 w-4" />
        Table
      </Button>
      <Button
        variant={view === 'calendar' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('calendar')}
        className="gap-2"
      >
        <Calendar className="h-4 w-4" />
        Calendar
      </Button>
    </div>
  );
}
