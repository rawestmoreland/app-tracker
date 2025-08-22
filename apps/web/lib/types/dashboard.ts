import { Application, Company, Interview } from '@prisma/client';

export type DashboardApplication = Application & {
  company: Company;
  interviews: Interview[];
};

export type Analytics = {
  totalApplications: number;
  responseRate: number;
  applicationsThisWeek: number;
  successRate: number;
  ghostRate: number;
};
