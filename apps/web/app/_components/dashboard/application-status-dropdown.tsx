"use client";

import { ApplicationStatus } from "@prisma/client";
import { StatusDropdown, StatusOption } from "./status-dropdown";
import { updateApplicationStatus } from "@/lib/actions/application-actions";

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
  return (
    <StatusDropdown<ApplicationStatus>
      itemId={applicationId}
      currentStatus={currentStatus}
      statusOptions={APPLICATION_STATUS_OPTIONS}
      onStatusUpdate={updateApplicationStatus}
    />
  );
}