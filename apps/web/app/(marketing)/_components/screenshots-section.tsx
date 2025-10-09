'use client';

import ApplicationsTable from '@/app/_components/dashboard/applications-table';
import StatsContent from '@/app/_components/dashboard/stats-content';
import { CompaniesTable } from '@/app/(dashboard)/dashboard/companies/_components/companies-table';
import { ApplicationStatus, CompanySize, RemoteType } from '@prisma/client';
import { DashboardApplication, Analytics } from '@/lib/types/dashboard';
import { UserPreferences } from '@/lib/types/user';

// Mock data
const mockUserPreferences: UserPreferences = {
  ghostThreshold: 604800, // 7 days in seconds
  receiveEmailNotifications: true,
  dataOptOut: false,
  currency: 'USD',
};

const mockAnalytics: Analytics = {
  totalApplications: 42,
  responseRate: 35.7,
  overallResponseRate: 42.3,
  applicationsThisWeek: 8,
  successRate: 14.3,
  ghostRate: 12.5,
};

// Generate dates within the last 30 days to avoid ghosted status
const getRecentDate = (daysAgo: number) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date;
};

const mockApplications: DashboardApplication[] = [
  {
    id: '1',
    title: 'Senior Software Engineer',
    description: null,
    jobUrl: null,
    lowSalary: 120000,
    highSalary: 180000,
    currency: 'USD',
    location: 'San Francisco, CA',
    remote: RemoteType.REMOTE,
    status: ApplicationStatus.TECHNICAL_INTERVIEW,
    appliedAt: getRecentDate(5),
    referredBy: null,
    firstResponseAt: getRecentDate(3),
    interviewInviteAt: getRecentDate(2),
    firstInterviewAt: null,
    finalDecisionAt: null,
    lastContactAt: getRecentDate(1),
    responseTimeHours: 48,
    interviewTimeHours: null,
    totalProcessHours: null,
    createdAt: getRecentDate(5),
    updatedAt: getRecentDate(1),
    userId: 'user1',
    companyId: 'company1',
    archived: false,
    resumeId: null,
    company: {
      id: 'company1',
      name: 'TechCorp',
      website: 'https://techcorp.example.com',
      description: 'Leading technology company',
      plainTextDescription: 'Leading technology company',
      industry: 'Software',
      size: CompanySize.ENTERPRISE,
      location: 'San Francisco, CA',
      logo: null,
      createdAt: getRecentDate(30),
      updatedAt: getRecentDate(30),
      isGlobal: false,
      createdBy: 'user1',
      visibility: 'PRIVATE' as const,
    },
    interviews: [
      {
        id: 'int1',
        type: 'PHONE_SCREEN' as const,
        format: 'VIDEO' as const,
        meetingLink: null,
        scheduledAt: getRecentDate(-2), // Future date
        duration: 60,
        feedback: null,
        outcome: null,
        createdAt: getRecentDate(2),
        updatedAt: getRecentDate(2),
        applicationId: '1',
        userId: 'user1',
        archived: false,
      },
      {
        id: 'int2',
        type: 'TECHNICAL' as const,
        format: 'VIDEO' as const,
        meetingLink: null,
        scheduledAt: getRecentDate(-5), // Future date
        duration: 90,
        feedback: null,
        outcome: null,
        createdAt: getRecentDate(1),
        updatedAt: getRecentDate(1),
        applicationId: '1',
        userId: 'user1',
        archived: false,
      },
    ],
    activities: [
      {
        id: 'act1',
        type: 'APPLICATION_STATUS_CHANGED' as const,
        action: 'Status changed to Technical Interview',
        entityType: 'APPLICATION' as const,
        entityId: '1',
        entityName: 'Senior Software Engineer',
        description: 'Application status updated',
        metadata: null,
        fromStatus: ApplicationStatus.APPLIED,
        toStatus: ApplicationStatus.TECHNICAL_INTERVIEW,
        isProgression: true,
        stageOrder: 2,
        ipAddress: null,
        userAgent: null,
        platform: null,
        createdAt: getRecentDate(1), // Recent activity
        userId: 'user1',
        applicationId: '1',
        companyId: null,
        contactId: null,
        interviewId: null,
        noteId: null,
        offerId: null,
      },
    ],
  },
  {
    id: '2',
    title: 'Full Stack Developer',
    description: null,
    jobUrl: null,
    lowSalary: 100000,
    highSalary: 150000,
    currency: 'USD',
    location: 'Austin, TX',
    remote: RemoteType.HYBRID,
    status: ApplicationStatus.APPLIED,
    appliedAt: getRecentDate(3),
    referredBy: null,
    firstResponseAt: null,
    interviewInviteAt: null,
    firstInterviewAt: null,
    finalDecisionAt: null,
    lastContactAt: getRecentDate(3),
    responseTimeHours: null,
    interviewTimeHours: null,
    totalProcessHours: null,
    createdAt: getRecentDate(3),
    updatedAt: getRecentDate(3),
    userId: 'user1',
    companyId: 'company2',
    archived: false,
    resumeId: null,
    company: {
      id: 'company2',
      name: 'InnovateCo',
      website: 'https://innovateco.example.com',
      description: 'Innovation-driven startup',
      plainTextDescription: 'Innovation-driven startup',
      industry: 'Technology',
      size: CompanySize.LARGE,
      location: 'Austin, TX',
      logo: null,
      createdAt: getRecentDate(30),
      updatedAt: getRecentDate(30),
      isGlobal: false,
      createdBy: 'user1',
      visibility: 'PRIVATE' as const,
    },
    interviews: [],
    activities: [
      {
        id: 'act2',
        type: 'APPLICATION_CREATED' as const,
        action: 'Created application',
        entityType: 'APPLICATION' as const,
        entityId: '2',
        entityName: 'Full Stack Developer',
        description: 'Application created',
        metadata: null,
        fromStatus: null,
        toStatus: ApplicationStatus.APPLIED,
        isProgression: true,
        stageOrder: 1,
        ipAddress: null,
        userAgent: null,
        platform: null,
        createdAt: getRecentDate(3), // Recent activity
        userId: 'user1',
        applicationId: '2',
        companyId: null,
        contactId: null,
        interviewId: null,
        noteId: null,
        offerId: null,
      },
    ],
  },
  {
    id: '3',
    title: 'Frontend Engineer',
    description: null,
    jobUrl: null,
    lowSalary: 110000,
    highSalary: 160000,
    currency: 'USD',
    location: 'New York, NY',
    remote: RemoteType.REMOTE,
    status: ApplicationStatus.OFFER_RECEIVED,
    appliedAt: getRecentDate(12),
    referredBy: null,
    firstResponseAt: getRecentDate(10),
    interviewInviteAt: getRecentDate(8),
    firstInterviewAt: getRecentDate(6),
    finalDecisionAt: null,
    lastContactAt: getRecentDate(1),
    responseTimeHours: 48,
    interviewTimeHours: 48,
    totalProcessHours: 264,
    createdAt: getRecentDate(12),
    updatedAt: getRecentDate(1),
    userId: 'user1',
    companyId: 'company3',
    archived: false,
    resumeId: null,
    company: {
      id: 'company3',
      name: 'StartupXYZ',
      website: 'https://startupxyz.example.com',
      description: 'Fast-growing fintech startup',
      plainTextDescription: 'Fast-growing fintech startup',
      industry: 'Fintech',
      size: CompanySize.STARTUP,
      location: 'New York, NY',
      logo: null,
      createdAt: getRecentDate(30),
      updatedAt: getRecentDate(30),
      isGlobal: false,
      createdBy: 'user1',
      visibility: 'PRIVATE' as const,
    },
    interviews: [
      {
        id: 'int3',
        type: 'PHONE_SCREEN' as const,
        format: 'PHONE' as const,
        meetingLink: null,
        scheduledAt: getRecentDate(6),
        duration: 30,
        feedback: 'Great communication',
        outcome: 'PASSED' as const,
        createdAt: getRecentDate(8),
        updatedAt: getRecentDate(6),
        applicationId: '3',
        userId: 'user1',
        archived: false,
      },
      {
        id: 'int4',
        type: 'TECHNICAL' as const,
        format: 'VIDEO' as const,
        meetingLink: null,
        scheduledAt: getRecentDate(4),
        duration: 120,
        feedback: null,
        outcome: 'PASSED' as const,
        createdAt: getRecentDate(6),
        updatedAt: getRecentDate(4),
        applicationId: '3',
        userId: 'user1',
        archived: false,
      },
      {
        id: 'int5',
        type: 'FINAL_ROUND' as const,
        format: 'VIDEO' as const,
        meetingLink: null,
        scheduledAt: getRecentDate(2),
        duration: 90,
        feedback: null,
        outcome: 'PASSED' as const,
        createdAt: getRecentDate(4),
        updatedAt: getRecentDate(2),
        applicationId: '3',
        userId: 'user1',
        archived: false,
      },
    ],
    activities: [
      {
        id: 'act3',
        type: 'APPLICATION_STATUS_CHANGED' as const,
        action: 'Status changed to Offer Received',
        entityType: 'APPLICATION' as const,
        entityId: '3',
        entityName: 'Frontend Engineer',
        description: 'Offer received',
        metadata: null,
        fromStatus: ApplicationStatus.ONSITE_INTERVIEW,
        toStatus: ApplicationStatus.OFFER_RECEIVED,
        isProgression: true,
        stageOrder: 8,
        ipAddress: null,
        userAgent: null,
        platform: null,
        createdAt: getRecentDate(1), // Recent activity
        userId: 'user1',
        applicationId: '3',
        companyId: null,
        contactId: null,
        interviewId: null,
        noteId: null,
        offerId: null,
      },
    ],
  },
  {
    id: '4',
    title: 'Backend Developer',
    description: null,
    jobUrl: null,
    lowSalary: 95000,
    highSalary: 140000,
    currency: 'USD',
    location: 'Seattle, WA',
    remote: RemoteType.REMOTE,
    status: ApplicationStatus.APPLIED,
    appliedAt: getRecentDate(25),
    referredBy: null,
    firstResponseAt: null,
    interviewInviteAt: null,
    firstInterviewAt: null,
    finalDecisionAt: null,
    lastContactAt: getRecentDate(25),
    responseTimeHours: null,
    interviewTimeHours: null,
    totalProcessHours: null,
    createdAt: getRecentDate(25),
    updatedAt: getRecentDate(25),
    userId: 'user1',
    companyId: 'company4',
    archived: false,
    resumeId: null,
    company: {
      id: 'company4',
      name: 'CloudSystems',
      website: 'https://cloudsystems.example.com',
      description: 'Cloud infrastructure company',
      plainTextDescription: 'Cloud infrastructure company',
      industry: 'Cloud Computing',
      size: CompanySize.MEDIUM,
      location: 'Seattle, WA',
      logo: null,
      createdAt: getRecentDate(30),
      updatedAt: getRecentDate(30),
      isGlobal: false,
      createdBy: 'user1',
      visibility: 'PRIVATE' as const,
    },
    interviews: [],
    activities: [
      {
        id: 'act4',
        type: 'APPLICATION_CREATED' as const,
        action: 'Created application',
        entityType: 'APPLICATION' as const,
        entityId: '4',
        entityName: 'Backend Developer',
        description: 'Application created',
        metadata: null,
        fromStatus: null,
        toStatus: ApplicationStatus.APPLIED,
        isProgression: true,
        stageOrder: 1,
        ipAddress: null,
        userAgent: null,
        platform: null,
        createdAt: getRecentDate(25), // Old activity - will be ghosted
        userId: 'user1',
        applicationId: '4',
        companyId: null,
        contactId: null,
        interviewId: null,
        noteId: null,
        offerId: null,
      },
    ],
  },
  {
    id: '5',
    title: 'DevOps Engineer',
    description: null,
    jobUrl: null,
    lowSalary: 105000,
    highSalary: 155000,
    currency: 'USD',
    location: 'Remote',
    remote: RemoteType.REMOTE,
    status: ApplicationStatus.UNDER_REVIEW,
    appliedAt: getRecentDate(18),
    referredBy: null,
    firstResponseAt: getRecentDate(16),
    interviewInviteAt: null,
    firstInterviewAt: null,
    finalDecisionAt: null,
    lastContactAt: getRecentDate(16),
    responseTimeHours: 48,
    interviewTimeHours: null,
    totalProcessHours: null,
    createdAt: getRecentDate(18),
    updatedAt: getRecentDate(16),
    userId: 'user1',
    companyId: 'company5',
    archived: false,
    resumeId: null,
    company: {
      id: 'company5',
      name: 'DevOps Pro',
      website: 'https://devopspro.example.com',
      description: 'DevOps consulting and services',
      plainTextDescription: 'DevOps consulting and services',
      industry: 'Technology',
      size: CompanySize.SMALL,
      location: 'Remote',
      logo: null,
      createdAt: getRecentDate(30),
      updatedAt: getRecentDate(30),
      isGlobal: false,
      createdBy: 'user1',
      visibility: 'PRIVATE' as const,
    },
    interviews: [],
    activities: [
      {
        id: 'act5',
        type: 'APPLICATION_STATUS_CHANGED' as const,
        action: 'Status changed to Under Review',
        entityType: 'APPLICATION' as const,
        entityId: '5',
        entityName: 'DevOps Engineer',
        description: 'Application under review',
        metadata: null,
        fromStatus: ApplicationStatus.APPLIED,
        toStatus: ApplicationStatus.UNDER_REVIEW,
        isProgression: true,
        stageOrder: 2,
        ipAddress: null,
        userAgent: null,
        platform: null,
        createdAt: getRecentDate(16), // Old activity - will be ghosted
        userId: 'user1',
        applicationId: '5',
        companyId: null,
        contactId: null,
        interviewId: null,
        noteId: null,
        offerId: null,
      },
    ],
  },
];

const mockCompanies = [
  {
    id: 'company1',
    name: 'TechCorp',
    website: 'https://techcorp.example.com',
    description: 'Leading technology company specializing in cloud solutions',
    industry: 'Software',
    size: 'ENTERPRISE' as const,
    location: 'San Francisco, CA',
    logo: null,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
    applicationCount: 3,
  },
  {
    id: 'company2',
    name: 'InnovateCo',
    website: 'https://innovateco.example.com',
    description: 'Innovation-driven technology startup',
    industry: 'Technology',
    size: 'LARGE' as const,
    location: 'Austin, TX',
    logo: null,
    createdAt: new Date('2025-01-02'),
    updatedAt: new Date('2025-01-02'),
    applicationCount: 2,
  },
  {
    id: 'company3',
    name: 'StartupXYZ',
    website: 'https://startupxyz.example.com',
    description: 'Fast-growing fintech startup',
    industry: 'Fintech',
    size: 'STARTUP' as const,
    location: 'New York, NY',
    logo: null,
    createdAt: new Date('2025-01-03'),
    updatedAt: new Date('2025-01-03'),
    applicationCount: 1,
  },
];

// Browser Frame Component
function BrowserFrame({
  children,
  path,
}: {
  children: React.ReactNode;
  path?: string;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-300 bg-gray-100 shadow-2xl">
      {/* Browser Chrome */}
      <div className="flex items-center gap-2 border-b border-gray-300 bg-gradient-to-b from-gray-200 to-gray-100 px-4 py-3">
        {/* Traffic Lights */}
        <div className="flex gap-2">
          <div className="h-3 w-3 rounded-full bg-red-500" />
          <div className="h-3 w-3 rounded-full bg-yellow-500" />
          <div className="h-3 w-3 rounded-full bg-green-500" />
        </div>
        {/* URL Bar */}
        <div className="ml-4 flex-1 overflow-hidden rounded-md bg-white px-3 py-1 text-sm text-gray-500">
          <div className="flex items-center gap-1 truncate">
            <span className="text-gray-400">🔒</span>
            <span className="truncate">
              apptrack.space/dashboard{path ? `/${path}` : ''}
            </span>
          </div>
        </div>
      </div>
      {/* Content */}
      <div className="bg-white p-6">{children}</div>
    </div>
  );
}

export function ScreenshotsSection() {
  return (
    <section className="bg-gray-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            See It In Action
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Track applications, monitor analytics, and manage companies all in
            one place.
          </p>
        </div>

        {/* Analytics Cards */}
        <div className="mx-auto mt-16 max-w-6xl">
          <div className="mb-8">
            <h3 className="mb-6 text-center text-xl font-semibold text-gray-900">
              Real-Time Analytics Dashboard
            </h3>
            <BrowserFrame>
              <StatsContent analytics={mockAnalytics} />
            </BrowserFrame>
          </div>
        </div>

        {/* Applications Table */}
        <div className="mx-auto mt-16 max-w-6xl">
          <div className="mb-8">
            <h3 className="mb-6 text-center text-xl font-semibold text-gray-900">
              Application Tracking
            </h3>
            <BrowserFrame>
              <ApplicationsTable
                applications={mockApplications}
                userPreferences={mockUserPreferences}
                isDemoMode
              />
            </BrowserFrame>
          </div>
        </div>

        {/* Companies Table */}
        <div className="mx-auto mt-16 max-w-6xl">
          <div className="mb-8">
            <h3 className="mb-6 text-center text-xl font-semibold text-gray-900">
              Company Management
            </h3>
            <BrowserFrame path="companies">
              <CompaniesTable
                companies={mockCompanies}
                totalCount={3}
                currentPage={1}
                totalPages={1}
                hasNextPage={false}
                hasPreviousPage={false}
                initialSearch=""
                isDemoMode
              />
            </BrowserFrame>
          </div>
        </div>
      </div>
    </section>
  );
}
