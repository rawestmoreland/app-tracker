import { ApplicationStatus, InterviewType, InterviewFormat } from '@prisma/client';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getStatusColor(status: string) {
  const colors = {
    APPLIED: 'bg-blue-100 text-blue-800',
    UNDER_REVIEW: 'bg-yellow-100 text-yellow-800',
    PHONE_SCREEN: 'bg-purple-100 text-purple-800',
    TECHNICAL_INTERVIEW: 'bg-indigo-100 text-indigo-800',
    ONSITE_INTERVIEW: 'bg-orange-100 text-orange-800',
    OFFER: 'bg-green-100 text-green-800',
    ACCEPTED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800',
    WITHDRAWN: 'bg-gray-100 text-gray-800',
    GHOSTED: 'bg-gray-100 text-gray-800',
  };
  return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
}

export function getSizeColor(size: string) {
  const colors = {
    STARTUP: 'bg-blue-100 text-blue-800',
    SMALL: 'bg-yellow-100 text-yellow-800',
    MEDIUM: 'bg-purple-100 text-purple-800',
    LARGE: 'bg-green-100 text-green-800',
    ENTERPRISE: 'bg-red-100 text-red-800',
  };
  return colors[size as keyof typeof colors] || 'bg-gray-100 text-gray-800';
}

export function getRemotePolicyColor(remotePolicy: string) {
  const colors = {
    HYBRID: 'bg-indigo-100 text-indigo-800',
    REMOTE: 'bg-green-100 text-green-800',
    ON_SITE: 'bg-orange-100 text-orange-800',
    FLEXIBLE: 'bg-purple-100 text-purple-800',
  };
  return (
    colors[remotePolicy as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  );
}

export function getCompanySizeLabel(size: string) {
  const sizes = {
    STARTUP: 'Startup',
    SMALL: 'Small (1-50)',
    MEDIUM: 'Medium (51-200)',
    LARGE: 'Large (201-1000)',
    ENTERPRISE: 'Enterprise (1000+)',
  };
  return sizes[size as keyof typeof sizes] || size;
}

export function getVisibilityDescription(visibility: string) {
  switch (visibility) {
    case 'PRIVATE':
      return 'Only visible to you';
    case 'PUBLIC':
      return 'Visible to all users';
    case 'GLOBAL':
      return 'Visible to all users and marked as global';
    default:
      return '';
  }
}

export function isTerminalStatus(status: ApplicationStatus) {
  return (
    status === ApplicationStatus.REJECTED ||
    status === ApplicationStatus.WITHDRAWN ||
    status === ApplicationStatus.GHOSTED ||
    status === ApplicationStatus.POSITION_FILLED
  );
}

// Interview type color mapping with hex values for use in non-Tailwind contexts (e.g., FullCalendar)
export const INTERVIEW_TYPE_HEX_COLORS: Record<InterviewType, string> = {
  PHONE_SCREEN: '#1e40af', // blue-800
  TECHNICAL: '#6b21a8', // purple-800
  BEHAVIORAL: '#166534', // green-800
  SYSTEM_DESIGN: '#9a3412', // orange-800
  CODING_CHALLENGE: '#991b1b', // red-800
  PAIR_PROGRAMMING: '#9f1239', // pink-800
  ONSITE: '#3730a3', // indigo-800
  FINAL_ROUND: '#854d0e', // yellow-800
  REFERENCE_CHECK: '#1f2937', // gray-800
  OTHER: '#1e293b', // slate-800
};

export function getInterviewTypeColor(type: InterviewType): string {
  const colors = {
    PHONE_SCREEN: 'bg-blue-100 text-blue-800 border-blue-200',
    TECHNICAL: 'bg-purple-100 text-purple-800 border-purple-200',
    BEHAVIORAL: 'bg-green-100 text-green-800 border-green-200',
    SYSTEM_DESIGN: 'bg-orange-100 text-orange-800 border-orange-200',
    CODING_CHALLENGE: 'bg-red-100 text-red-800 border-red-200',
    PAIR_PROGRAMMING: 'bg-pink-100 text-pink-800 border-pink-200',
    ONSITE: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    FINAL_ROUND: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    REFERENCE_CHECK: 'bg-gray-100 text-gray-800 border-gray-200',
    OTHER: 'bg-slate-100 text-slate-800 border-slate-200',
  };
  return colors[type] || 'bg-gray-100 text-gray-800 border-gray-200';
}

export function getInterviewTypeLabel(type: InterviewType): string {
  return type.replace(/_/g, ' ');
}

export function getInterviewFormatColor(format: InterviewFormat): string {
  const colors = {
    PHONE: 'bg-blue-100 text-blue-800 border-blue-200',
    VIDEO: 'bg-green-100 text-green-800 border-green-200',
    IN_PERSON: 'bg-purple-100 text-purple-800 border-purple-200',
    CODING_PLATFORM: 'bg-orange-100 text-orange-800 border-orange-200',
    TAKE_HOME: 'bg-pink-100 text-pink-800 border-pink-200',
    OTHER: 'bg-gray-100 text-gray-800 border-gray-200',
  };
  return colors[format] || 'bg-gray-100 text-gray-800 border-gray-200';
}

export function getInterviewFormatLabel(format: InterviewFormat): string {
  return format.replace(/_/g, ' ');
}
