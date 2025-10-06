import { ApplicationStatus, RemoteType, InterviewType, InterviewFormat, InterviewOutcome } from "@prisma/client";
import { FacetOption } from "@/components/ui/faceted-filter";
import {
  BriefcaseIcon,
  CheckCircleIcon,
  ClockIcon,
  HomeIcon,
  MapPinIcon,
  PhoneIcon,
  SearchIcon,
  ShieldCheckIcon,
  XCircleIcon,
  EyeOffIcon,
  UserCheckIcon,
  HandshakeIcon,
  FileTextIcon,
  StopCircleIcon,
  Shield,
  Users,
  VideoIcon,
  CodeIcon,
  LayoutGridIcon,
  AlertCircleIcon,
  CalendarIcon,
  XIcon,
  RotateCcwIcon,
} from "lucide-react";

export const applicationStatusOptions: FacetOption[] = [
  {
    label: "Draft",
    value: ApplicationStatus.DRAFT,
    icon: FileTextIcon,
  },
  {
    label: "Applied",
    value: ApplicationStatus.APPLIED,
    icon: BriefcaseIcon,
  },
  {
    label: "Confirmation Received",
    value: ApplicationStatus.CONFIRMATION_RECEIVED,
    icon: CheckCircleIcon,
  },
  {
    label: "Under Review",
    value: ApplicationStatus.UNDER_REVIEW,
    icon: SearchIcon,
  },
  {
    label: "Phone Screen",
    value: ApplicationStatus.PHONE_SCREEN,
    icon: PhoneIcon,
  },
  {
    label: "Technical Interview",
    value: ApplicationStatus.TECHNICAL_INTERVIEW,
    icon: ShieldCheckIcon,
  },
  {
    label: "Onsite Interview",
    value: ApplicationStatus.ONSITE_INTERVIEW,
    icon: UserCheckIcon,
  },
  {
    label: "Reference Check",
    value: ApplicationStatus.REFERENCE_CHECK,
    icon: UserCheckIcon,
  },
  {
    label: "Offer Received",
    value: ApplicationStatus.OFFER_RECEIVED,
    icon: HandshakeIcon,
  },
  {
    label: "Offer Negotiating",
    value: ApplicationStatus.OFFER_NEGOTIATING,
    icon: HandshakeIcon,
  },
  {
    label: "Accepted",
    value: ApplicationStatus.ACCEPTED,
    icon: CheckCircleIcon,
  },
  {
    label: "Rejected",
    value: ApplicationStatus.REJECTED,
    icon: XCircleIcon,
  },
  {
    label: "Withdrawn",
    value: ApplicationStatus.WITHDRAWN,
    icon: StopCircleIcon,
  },
  {
    label: "Ghosted",
    value: ApplicationStatus.GHOSTED,
    icon: EyeOffIcon,
  },
  {
    label: "Position Filled",
    value: ApplicationStatus.POSITION_FILLED,
    icon: StopCircleIcon,
  },
];

export const remoteTypeOptions: FacetOption[] = [
  {
    label: "On-site",
    value: RemoteType.ON_SITE,
    icon: MapPinIcon,
  },
  {
    label: "Hybrid",
    value: RemoteType.HYBRID,
    icon: HomeIcon,
  },
  {
    label: "Remote",
    value: RemoteType.REMOTE,
    icon: HomeIcon,
  },
  {
    label: "Flexible",
    value: RemoteType.FLEXIBLE,
    icon: ClockIcon,
  },
];

export const companyTypeOptions: FacetOption[] = [
  {
    label: "Global",
    value: "global",
    icon: Shield,
  },
  {
    label: "Private",
    value: "private",
    icon: Users,
  },
];

export const interviewTypeOptions: FacetOption[] = [
  {
    label: "Phone Screen",
    value: InterviewType.PHONE_SCREEN,
    icon: PhoneIcon,
  },
  {
    label: "Technical",
    value: InterviewType.TECHNICAL,
    icon: ShieldCheckIcon,
  },
  {
    label: "Behavioral",
    value: InterviewType.BEHAVIORAL,
    icon: UserCheckIcon,
  },
  {
    label: "System Design",
    value: InterviewType.SYSTEM_DESIGN,
    icon: LayoutGridIcon,
  },
  {
    label: "Coding Challenge",
    value: InterviewType.CODING_CHALLENGE,
    icon: CodeIcon,
  },
  {
    label: "Pair Programming",
    value: InterviewType.PAIR_PROGRAMMING,
    icon: CodeIcon,
  },
  {
    label: "Onsite",
    value: InterviewType.ONSITE,
    icon: MapPinIcon,
  },
  {
    label: "Final Round",
    value: InterviewType.FINAL_ROUND,
    icon: CheckCircleIcon,
  },
  {
    label: "Reference Check",
    value: InterviewType.REFERENCE_CHECK,
    icon: UserCheckIcon,
  },
  {
    label: "Other",
    value: InterviewType.OTHER,
    icon: AlertCircleIcon,
  },
];

export const interviewFormatOptions: FacetOption[] = [
  {
    label: "Phone",
    value: InterviewFormat.PHONE,
    icon: PhoneIcon,
  },
  {
    label: "Video",
    value: InterviewFormat.VIDEO,
    icon: VideoIcon,
  },
  {
    label: "In Person",
    value: InterviewFormat.IN_PERSON,
    icon: MapPinIcon,
  },
  {
    label: "Coding Platform",
    value: InterviewFormat.CODING_PLATFORM,
    icon: CodeIcon,
  },
  {
    label: "Take Home",
    value: InterviewFormat.TAKE_HOME,
    icon: HomeIcon,
  },
  {
    label: "Other",
    value: InterviewFormat.OTHER,
    icon: AlertCircleIcon,
  },
];

export const interviewOutcomeOptions: FacetOption[] = [
  {
    label: "Passed",
    value: InterviewOutcome.PASSED,
    icon: CheckCircleIcon,
  },
  {
    label: "Failed",
    value: InterviewOutcome.FAILED,
    icon: XCircleIcon,
  },
  {
    label: "Pending",
    value: InterviewOutcome.PENDING,
    icon: ClockIcon,
  },
  {
    label: "Cancelled",
    value: InterviewOutcome.CANCELLED,
    icon: XIcon,
  },
  {
    label: "Rescheduled",
    value: InterviewOutcome.RESCHEDULED,
    icon: RotateCcwIcon,
  },
];