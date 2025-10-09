'use client';

import { InterviewOutcome } from '@prisma/client';
import { StatusDropdown, StatusOption } from './status-dropdown';
import { updateInterviewOutcome } from '@/lib/actions/interview-actions';

const INTERVIEW_OUTCOME_OPTIONS: StatusOption<InterviewOutcome>[] = [
  { value: InterviewOutcome.PENDING, label: 'Pending' },
  { value: InterviewOutcome.PASSED, label: 'Passed' },
  { value: InterviewOutcome.FAILED, label: 'Failed' },
  { value: InterviewOutcome.CANCELLED, label: 'Cancelled' },
  { value: InterviewOutcome.RESCHEDULED, label: 'Rescheduled' },
];

const getInterviewOutcomeColor = (outcome: InterviewOutcome): string => {
  switch (outcome) {
    case InterviewOutcome.PENDING:
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case InterviewOutcome.PASSED:
      return 'bg-green-100 text-green-800 border-green-200';
    case InterviewOutcome.FAILED:
      return 'bg-red-100 text-red-800 border-red-200';
    case InterviewOutcome.CANCELLED:
      return 'bg-gray-100 text-gray-800 border-gray-200';
    case InterviewOutcome.RESCHEDULED:
      return 'bg-blue-100 text-blue-800 border-blue-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

interface InterviewStatusDropdownProps {
  interviewId: string;
  currentOutcome: InterviewOutcome | null;
}

export function InterviewStatusDropdown({
  interviewId,
  currentOutcome,
}: InterviewStatusDropdownProps) {
  return (
    <StatusDropdown<InterviewOutcome>
      itemId={interviewId}
      currentStatus={currentOutcome}
      statusOptions={INTERVIEW_OUTCOME_OPTIONS}
      onStatusUpdate={updateInterviewOutcome}
      getStatusColor={getInterviewOutcomeColor}
    />
  );
}
