import { ApplicationStatus, RemoteType } from "@prisma/client";
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