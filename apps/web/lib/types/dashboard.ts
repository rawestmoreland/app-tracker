import { Activity, Application, Company, Interview } from '@prisma/client';

export type DashboardApplication = Application & {
  company: Company;
  interviews: Interview[];
  activities: Activity[];
};

export type Analytics = {
  totalApplications: number;
  responseRate: number; // Human response rate only
  overallResponseRate: number; // All responses (human + automated)
  applicationsThisWeek: number;
  successRate: number;
  ghostRate: number;
};
