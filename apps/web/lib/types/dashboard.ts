import { Application, Company, Interview } from '@prisma/client';

export type DashboardApplication = Application & {
  company: Company;
  interviews: Interview[];
};

export type Analytics = {
  totalApplications: number;
  activeApplications: number;
  totalInterviews: number;
  successRate: number;
  ghostRate: number;
};
