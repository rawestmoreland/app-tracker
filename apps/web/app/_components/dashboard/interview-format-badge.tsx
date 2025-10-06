import { InterviewFormat } from '@prisma/client';
import { getInterviewFormatColor, getInterviewFormatLabel } from '@/lib/utils';

interface InterviewFormatBadgeProps {
  format: InterviewFormat;
}

export function InterviewFormatBadge({ format }: InterviewFormatBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getInterviewFormatColor(format)}`}
    >
      {getInterviewFormatLabel(format)}
    </span>
  );
}
