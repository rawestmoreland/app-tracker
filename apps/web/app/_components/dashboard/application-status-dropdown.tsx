"use client";

import { ApplicationStatus, ResponseType } from "@prisma/client";
import { StatusDropdown, StatusOption } from "./status-dropdown";
import { updateApplicationStatus } from "@/lib/actions/application-actions";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const APPLICATION_STATUS_OPTIONS: StatusOption<ApplicationStatus>[] = [
  { value: ApplicationStatus.DRAFT, label: "Draft" },
  { value: ApplicationStatus.APPLIED, label: "Applied" },
  {
    value: ApplicationStatus.CONFIRMATION_RECEIVED,
    label: "Confirmation Received",
  },
  { value: ApplicationStatus.UNDER_REVIEW, label: "Under Review" },
  { value: ApplicationStatus.PHONE_SCREEN, label: "Phone Screen" },
  {
    value: ApplicationStatus.TECHNICAL_INTERVIEW,
    label: "Technical Interview",
  },
  { value: ApplicationStatus.ONSITE_INTERVIEW, label: "Onsite Interview" },
  { value: ApplicationStatus.REFERENCE_CHECK, label: "Reference Check" },
  { value: ApplicationStatus.OFFER_RECEIVED, label: "Offer Received" },
  { value: ApplicationStatus.OFFER_NEGOTIATING, label: "Offer Negotiating" },
  { value: ApplicationStatus.ACCEPTED, label: "Accepted" },
  { value: ApplicationStatus.REJECTED, label: "Rejected" },
  { value: ApplicationStatus.WITHDRAWN, label: "Withdrawn" },
  { value: ApplicationStatus.GHOSTED, label: "Ghosted" },
  { value: ApplicationStatus.POSITION_FILLED, label: "Position Filled" },
];

interface ApplicationStatusDropdownProps {
  applicationId: string;
  currentStatus: ApplicationStatus;
}

export function ApplicationStatusDropdown({
  applicationId,
  currentStatus,
}: ApplicationStatusDropdownProps) {
  const [showResponseTypeDialog, setShowResponseTypeDialog] = useState(false);
  const [selectedResponseType, setSelectedResponseType] = useState<ResponseType>(ResponseType.HUMAN);
  const [pendingStatus, setPendingStatus] = useState<ApplicationStatus | null>(null);

  const handleStatusUpdate = async (itemId: string, newStatus: ApplicationStatus): Promise<{ error?: string }> => {
    // If changing from APPLIED to CONFIRMATION_RECEIVED, show response type dialog
    if (currentStatus === ApplicationStatus.APPLIED && newStatus === ApplicationStatus.CONFIRMATION_RECEIVED) {
      setPendingStatus(newStatus);
      setShowResponseTypeDialog(true);
      return {}; // Don't update yet, wait for response type selection
    }
    
    // For all other status changes, proceed normally
    const result = await updateApplicationStatus(itemId, newStatus);
    return { error: result.error };
  };

  const handleConfirmResponseType = async () => {
    if (!pendingStatus) return;
    
    setShowResponseTypeDialog(false);
    const result = await updateApplicationStatus(applicationId, pendingStatus, selectedResponseType);
    setPendingStatus(null);
    return result;
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
      />
      
      <Dialog open={showResponseTypeDialog} onOpenChange={setShowResponseTypeDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Response Type</DialogTitle>
            <DialogDescription>
              Was this confirmation received from a human or an automated system?
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <RadioGroup
              value={selectedResponseType}
              onValueChange={(value: string) => setSelectedResponseType(value as ResponseType)}
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
              <Button variant="outline" onClick={handleCancelResponseType}>
                Cancel
              </Button>
              <Button onClick={handleConfirmResponseType}>
                Update Status
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}