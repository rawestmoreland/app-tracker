'use client';

import { InterviewFormat } from '@prisma/client';
import { StatusDropdown, StatusOption } from './status-dropdown';
import { updateInterviewFormat } from '@/lib/actions/interview-actions';
import { getInterviewFormatColor } from '@/lib/utils';

const INTERVIEW_FORMAT_OPTIONS: StatusOption<InterviewFormat>[] = [
  { value: InterviewFormat.PHONE, label: 'Phone' },
  { value: InterviewFormat.VIDEO, label: 'Video' },
  { value: InterviewFormat.IN_PERSON, label: 'In Person' },
  { value: InterviewFormat.CODING_PLATFORM, label: 'Coding Platform' },
  { value: InterviewFormat.TAKE_HOME, label: 'Take Home' },
  { value: InterviewFormat.OTHER, label: 'Other' },
];

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