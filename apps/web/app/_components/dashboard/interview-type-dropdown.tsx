"use client";

import { InterviewType } from "@prisma/client";
import { StatusDropdown, StatusOption } from "./status-dropdown";
import { updateInterviewType } from "@/lib/actions/interview-actions";

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

const getInterviewTypeColor = (type: InterviewType): string => {
  switch (type) {
    case InterviewType.PHONE_SCREEN:
      return "bg-blue-100 text-blue-800 border-blue-200";
    case InterviewType.TECHNICAL:
      return "bg-purple-100 text-purple-800 border-purple-200";
    case InterviewType.BEHAVIORAL:
      return "bg-green-100 text-green-800 border-green-200";
    case InterviewType.SYSTEM_DESIGN:
      return "bg-orange-100 text-orange-800 border-orange-200";
    case InterviewType.CODING_CHALLENGE:
      return "bg-red-100 text-red-800 border-red-200";
    case InterviewType.PAIR_PROGRAMMING:
      return "bg-pink-100 text-pink-800 border-pink-200";
    case InterviewType.ONSITE:
      return "bg-indigo-100 text-indigo-800 border-indigo-200";
    case InterviewType.FINAL_ROUND:
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case InterviewType.REFERENCE_CHECK:
      return "bg-gray-100 text-gray-800 border-gray-200";
    case InterviewType.OTHER:
      return "bg-slate-100 text-slate-800 border-slate-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

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