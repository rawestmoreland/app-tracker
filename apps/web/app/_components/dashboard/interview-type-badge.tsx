import { InterviewType } from '@prisma/client';
import { getInterviewTypeColor, getInterviewTypeLabel } from '@/lib/utils';

interface InterviewTypeBadgeProps {
  type: InterviewType;
}

export function InterviewTypeBadge({ type }: InterviewTypeBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getInterviewTypeColor(type)}`}
    >
      {getInterviewTypeLabel(type)}
    </span>
  );
}
