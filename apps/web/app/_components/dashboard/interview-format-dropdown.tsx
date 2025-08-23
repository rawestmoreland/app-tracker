'use client';

import { InterviewFormat } from '@prisma/client';
import { StatusDropdown, StatusOption } from './status-dropdown';
import { updateInterviewFormat } from '@/lib/actions/interview-actions';

const INTERVIEW_FORMAT_OPTIONS: StatusOption<InterviewFormat>[] = [
  { value: InterviewFormat.PHONE, label: 'Phone' },
  { value: InterviewFormat.VIDEO, label: 'Video' },
  { value: InterviewFormat.IN_PERSON, label: 'In Person' },
  { value: InterviewFormat.CODING_PLATFORM, label: 'Coding Platform' },
  { value: InterviewFormat.TAKE_HOME, label: 'Take Home' },
  { value: InterviewFormat.OTHER, label: 'Other' },
];

const getInterviewFormatColor = (format: InterviewFormat): string => {
  switch (format) {
    case InterviewFormat.PHONE:
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case InterviewFormat.VIDEO:
      return 'bg-green-100 text-green-800 border-green-200';
    case InterviewFormat.IN_PERSON:
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case InterviewFormat.CODING_PLATFORM:
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case InterviewFormat.TAKE_HOME:
      return 'bg-pink-100 text-pink-800 border-pink-200';
    case InterviewFormat.OTHER:
      return 'bg-gray-100 text-gray-800 border-gray-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

interface InterviewFormatDropdownProps {
  interviewId: string;
  currentFormat: InterviewFormat;
}

export function InterviewFormatDropdown({
  interviewId,
  currentFormat,
}: InterviewFormatDropdownProps) {
  return (
    <StatusDropdown<InterviewFormat>
      itemId={interviewId}
      currentStatus={currentFormat}
      statusOptions={INTERVIEW_FORMAT_OPTIONS}
      onStatusUpdate={updateInterviewFormat}
      getStatusColor={getInterviewFormatColor}
    />
  );
}