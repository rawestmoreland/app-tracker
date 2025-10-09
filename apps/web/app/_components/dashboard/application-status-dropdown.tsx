'use client';

import { ApplicationStatus, ResponseType } from '@prisma/client';
import { StatusDropdown, StatusOption } from './status-dropdown';
import { updateApplicationStatus } from '@/lib/actions/application-actions';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { toast } from 'sonner';

const APPLICATION_STATUS_OPTIONS: StatusOption<ApplicationStatus>[] = [
  { value: ApplicationStatus.DRAFT, label: 'Draft' },
  { value: ApplicationStatus.APPLIED, label: 'Applied' },
  {
    value: ApplicationStatus.CONFIRMATION_RECEIVED,
    label: 'Confirmation Received',
  },
  { value: ApplicationStatus.UNDER_REVIEW, label: 'Under Review' },
  { value: ApplicationStatus.PHONE_SCREEN, label: 'Phone Screen' },
  {
    value: ApplicationStatus.TECHNICAL_INTERVIEW,
    label: 'Technical Interview',
  },
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

interface ApplicationStatusDropdownProps {
  applicationId: string;
  currentStatus: ApplicationStatus;
}

export function ApplicationStatusDropdown({
  applicationId,
  currentStatus,
}: ApplicationStatusDropdownProps) {
  const [showDateDialog, setShowDateDialog] = useState(false);
  const [showResponseTypeDialog, setShowResponseTypeDialog] = useState(false);
  const [selectedResponseType, setSelectedResponseType] =
    useState<ResponseType>(ResponseType.HUMAN);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [pendingStatus, setPendingStatus] = useState<ApplicationStatus | null>(
    null,
  );
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusUpdate = async (
    itemId: string,
    newStatus: ApplicationStatus,
  ): Promise<{ error?: string }> => {
    // Always show date dialog first for all status changes
    setPendingStatus(newStatus);
    setSelectedDate(new Date()); // Reset to today's date
    setShowDateDialog(true);
    return { error: 'cancelled' }; // Return error to prevent optimistic update
  };

  const handleConfirmDate = () => {
    if (!pendingStatus) return;

    // Check if we need to show response type dialog
    if (
      currentStatus === ApplicationStatus.APPLIED &&
      pendingStatus === ApplicationStatus.CONFIRMATION_RECEIVED
    ) {
      setShowDateDialog(false);
      setShowResponseTypeDialog(true);
    } else {
      // No response type needed, update directly
      handleFinalUpdate();
    }
  };

  const handleConfirmResponseType = async () => {
    if (!pendingStatus) return;
    setShowResponseTypeDialog(false);
    await handleFinalUpdate();
  };

  const handleFinalUpdate = async () => {
    if (!pendingStatus) return;

    setIsUpdating(true);

    try {
      // Convert selectedDate to GMT/Zulu time
      const gmtDate = new Date(
        Date.UTC(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          selectedDate.getDate(),
          0,
          0,
          0,
          0,
        ),
      );

      const result = await updateApplicationStatus(
        applicationId,
        pendingStatus,
        currentStatus === ApplicationStatus.APPLIED &&
          pendingStatus === ApplicationStatus.CONFIRMATION_RECEIVED
          ? selectedResponseType
          : undefined,
        gmtDate,
      );

      setShowDateDialog(false);
      setPendingStatus(null);

      // Show toast based on result
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success('Status updated successfully');
      }

      return result;
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelDate = () => {
    setShowDateDialog(false);
    setPendingStatus(null);
  };

  const handleCancelResponseType = () => {
    setShowResponseTypeDialog(false);
    setPendingStatus(null);
  };

  return (
    <>
      <StatusDropdown<ApplicationStatus>
        itemId={applicationId}
        currentStatus={currentStatus}
        statusOptions={APPLICATION_STATUS_OPTIONS}
        onStatusUpdate={handleStatusUpdate}
        disabled={isUpdating}
      />

      {/* Date Selection Dialog */}
      <Dialog open={showDateDialog} onOpenChange={setShowDateDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>When did this status change occur?</DialogTitle>
            <DialogDescription>
              Select the date when this status change happened. The default is
              today.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                disabled={(date) => date > new Date()}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={handleCancelDate}
                disabled={isUpdating}
              >
                Cancel
              </Button>
              <Button onClick={handleConfirmDate} disabled={isUpdating}>
                Continue
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Response Type Dialog */}
      <Dialog
        open={showResponseTypeDialog}
        onOpenChange={setShowResponseTypeDialog}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Response Type</DialogTitle>
            <DialogDescription>
              Was this confirmation received from a human or an automated
              system?
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <RadioGroup
              value={selectedResponseType}
              onValueChange={(value: string) =>
                setSelectedResponseType(value as ResponseType)
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={ResponseType.HUMAN} id="human" />
                <Label htmlFor="human">Human Response</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={ResponseType.AUTOMATED} id="automated" />
                <Label htmlFor="automated">Automated Response</Label>
              </div>
            </RadioGroup>

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={handleCancelResponseType}
                disabled={isUpdating}
              >
                Cancel
              </Button>
              <Button onClick={handleConfirmResponseType} disabled={isUpdating}>
                {isUpdating ? 'Updating...' : 'Update Status'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
