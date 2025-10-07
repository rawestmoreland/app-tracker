'use client';

import { useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import type { EventInput } from '@fullcalendar/core';
import {
  InterviewType,
  InterviewFormat,
  InterviewOutcome,
} from '@prisma/client';
import { INTERVIEW_TYPE_HEX_COLORS } from '@/lib/utils';

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

interface InterviewsCalendarProps {
  interviews: Interview[];
}

export default function InterviewsCalendar({
  interviews,
}: InterviewsCalendarProps) {
  const calendarRef = useRef<FullCalendar>(null);

  const events: EventInput[] = interviews
    .filter((interview) => interview.scheduledAt)
    .map((interview) => {
      const startDate = new Date(interview.scheduledAt!);
      const endDate = interview.duration
        ? new Date(startDate.getTime() + interview.duration * 60000)
        : new Date(startDate.getTime() + 60 * 60000); // Default 1 hour

      return {
        id: interview.id,
        title: `${interview.application.company.name} - ${interview.type.replace('_', ' ')}`,
        start: startDate,
        end: endDate,
        backgroundColor: getEventColor(interview.outcome, interview.type),
        borderColor: getEventColor(interview.outcome, interview.type),
        extendedProps: {
          format: interview.format.replace('_', ' '),
          outcome: interview.outcome?.replace('_', ' '),
          type: interview.type.replace('_', ' '),
        },
      };
    });

  return (
    <div className="bg-card rounded-lg border p-6">
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        initialEvents={events}
        headerToolbar={{
          left: 'prev,next todayBtnUC',
          center: 'title',
          right: 'dayGridMonth,dayGridWeek',
        }}
        views={{
          dayGridMonth: {
            buttonText: 'Month',
          },
          dayGridWeek: {
            buttonText: 'Week',
          },
        }}
        customButtons={{
          todayBtnUC: {
            text: 'Today',
            click: () => {
              const today = new Date();
              calendarRef.current?.getApi().gotoDate(today);
            },
          },
        }}
        height="auto"
        eventClick={(info) => {
          // Navigate to interview detail page
          window.location.href = `/dashboard/interviews/${info.event.id}`;
        }}
      />
    </div>
  );
}

function getEventColor(
  outcome: InterviewOutcome | null,
  type: InterviewType,
): string {
  if (outcome === 'PASSED') return '#22c55e'; // green
  if (outcome === 'FAILED') return '#ef4444'; // red
  if (outcome === 'PENDING') return '#f59e0b'; // amber

  // Use the same colors as the interview type badge
  return INTERVIEW_TYPE_HEX_COLORS[type] || '#6b7280';
}
