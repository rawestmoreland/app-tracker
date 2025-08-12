'use client';

import { useState, useTransition } from 'react';
import { ApplicationStatus } from '@prisma/client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getStatusColor } from '@/lib/utils';
import { updateApplicationStatus } from '@/lib/actions/application-actions';
import { toast } from 'sonner';

const STATUS_OPTIONS = [
  { value: ApplicationStatus.DRAFT, label: 'Draft' },
  { value: ApplicationStatus.APPLIED, label: 'Applied' },
  { value: ApplicationStatus.CONFIRMATION_RECEIVED, label: 'Confirmation Received' },
  { value: ApplicationStatus.UNDER_REVIEW, label: 'Under Review' },
  { value: ApplicationStatus.PHONE_SCREEN, label: 'Phone Screen' },
  { value: ApplicationStatus.TECHNICAL_INTERVIEW, label: 'Technical Interview' },
  { value: ApplicationStatus.ONSITE_INTERVIEW, label: 'Onsite Interview' },
  { value: ApplicationStatus.REFERENCE_CHECK, label: 'Reference Check' },
  { value: ApplicationStatus.OFFER_RECEIVED, label: 'Offer Received' },
  { value: ApplicationStatus.OFFER_NEGOTIATING, label: 'Offer Negotiating' },
  { value: ApplicationStatus.ACCEPTED, label: 'Accepted' },
  { value: ApplicationStatus.REJECTED, label: 'Rejected' },
  { value: ApplicationStatus.WITHDRAWN, label: 'Withdrawn' },
  { value: ApplicationStatus.GHOSTED, label: 'Ghosted' },
  { value: ApplicationStatus.POSITION_FILLED, label: 'Position Filled' },
];

interface StatusDropdownProps {
  applicationId: string;
  currentStatus: ApplicationStatus;
}

export function StatusDropdown({ applicationId, currentStatus }: StatusDropdownProps) {
  const [isPending, startTransition] = useTransition();
  const [optimisticStatus, setOptimisticStatus] = useState(currentStatus);

  const handleStatusChange = (newStatus: ApplicationStatus) => {
    setOptimisticStatus(newStatus);
    
    startTransition(async () => {
      const result = await updateApplicationStatus(applicationId, newStatus);
      
      if (result.error) {
        toast.error(result.error);
        setOptimisticStatus(currentStatus); // Revert on error
      } else {
        toast.success('Status updated successfully');
      }
    });
  };

  const currentLabel = STATUS_OPTIONS.find(option => option.value === optimisticStatus)?.label || optimisticStatus;

  return (
    <Select
      value={optimisticStatus}
      onValueChange={handleStatusChange}
      disabled={isPending}
    >
      <SelectTrigger className="w-fit border-none bg-transparent p-0 h-auto shadow-none">
        <SelectValue asChild>
          <span
            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
              optimisticStatus
            )} ${isPending ? 'opacity-50' : ''}`}
          >
            {currentLabel.replace('_', ' ')}
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {STATUS_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            <span
              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                option.value
              )}`}
            >
              {option.label}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}