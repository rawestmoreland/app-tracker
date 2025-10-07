"use client";

import { InterviewType } from "@prisma/client";
import { StatusDropdown, StatusOption } from "./status-dropdown";
import { updateInterviewType } from "@/lib/actions/interview-actions";
import { getInterviewTypeColor } from "@/lib/utils";

const INTERVIEW_TYPE_OPTIONS: StatusOption<InterviewType>[] = [
  { value: InterviewType.PHONE_SCREEN, label: "Phone Screen" },
  { value: InterviewType.TECHNICAL, label: "Technical" },
  { value: InterviewType.BEHAVIORAL, label: "Behavioral" },
  { value: InterviewType.SYSTEM_DESIGN, label: "System Design" },
  { value: InterviewType.CODING_CHALLENGE, label: "Coding Challenge" },
  { value: InterviewType.PAIR_PROGRAMMING, label: "Pair Programming" },
  { value: InterviewType.ONSITE, label: "Onsite" },
  { value: InterviewType.FINAL_ROUND, label: "Final Round" },
  { value: InterviewType.REFERENCE_CHECK, label: "Reference Check" },
  { value: InterviewType.OTHER, label: "Other" },
];

interface InterviewTypeDropdownProps {
  interviewId: string;
  currentType: InterviewType;
}

export function InterviewTypeDropdown({
  interviewId,
  currentType,
}: InterviewTypeDropdownProps) {
  return (
    <StatusDropdown<InterviewType>
      itemId={interviewId}
      currentStatus={currentType}
      statusOptions={INTERVIEW_TYPE_OPTIONS}
      onStatusUpdate={updateInterviewType}
      getStatusColor={getInterviewTypeColor}
    />
  );
}