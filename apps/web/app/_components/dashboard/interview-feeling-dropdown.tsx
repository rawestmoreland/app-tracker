'use client';

import { InterviewFeeling } from '@prisma/client';
import { StatusDropdown, StatusOption } from './status-dropdown';
import { updateInterviewFeeling } from '@/lib/actions/interview-actions';

const INTERVIEW_FEELING_OPTIONS: StatusOption<InterviewFeeling | null>[] = [
  { value: null, label: 'Not Set' },
  { value: InterviewFeeling.EXCELLENT, label: 'Excellent' },
  { value: InterviewFeeling.CONFIDENT, label: 'Confident' },
  { value: InterviewFeeling.POSITIVE, label: 'Positive' },
  { value: InterviewFeeling.NEUTRAL, label: 'Neutral' },
  { value: InterviewFeeling.UNCERTAIN, label: 'Uncertain' },
  { value: InterviewFeeling.DIFFICULT, label: 'Difficult' },
  { value: InterviewFeeling.POOR, label: 'Poor' },
];

const getInterviewFeelingColor = (feeling: InterviewFeeling | null): string => {
  if (!feeling) {
    return 'bg-gray-100 text-gray-800 border-gray-200';
  }

  switch (feeling) {
    case InterviewFeeling.EXCELLENT:
      return 'bg-green-100 text-green-800 border-green-200';
    case InterviewFeeling.CONFIDENT:
      return 'bg-green-100 text-green-800 border-green-200';
    case InterviewFeeling.POSITIVE:
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case InterviewFeeling.NEUTRAL:
      return 'bg-gray-100 text-gray-800 border-gray-200';
    case InterviewFeeling.UNCERTAIN:
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case InterviewFeeling.DIFFICULT:
      return 'bg-red-100 text-red-800 border-red-200';
    case InterviewFeeling.POOR:
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

interface InterviewFeelingDropdownProps {
  interviewId: string;
  currentFeeling: InterviewFeeling | null;
}

export function InterviewFeelingDropdown({
  interviewId,
  currentFeeling,
}: InterviewFeelingDropdownProps) {
  return (
    <StatusDropdown<InterviewFeeling | null>
      itemId={interviewId}
      currentStatus={currentFeeling}
      statusOptions={INTERVIEW_FEELING_OPTIONS}
      onStatusUpdate={updateInterviewFeeling}
      getStatusColor={getInterviewFeelingColor}
    />
  );
}
