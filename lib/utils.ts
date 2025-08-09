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
