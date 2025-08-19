import { ApplicationStatus, RemoteType } from '@prisma/client';
import z from 'zod';

export const schema = z
  .object({
    title: z.string().min(1),
    description: z.string().optional(),
    jobUrl: z.url().optional().or(z.literal('')),
    lowSalary: z.number().min(0).optional(),
    highSalary: z.number().min(0).optional(),
    currency: z.string(),
    location: z.string().optional(),
    remote: z.enum(RemoteType).optional(),
    status: z.enum(ApplicationStatus).optional(),
    appliedAt: z.date(),
    // Company fields - either existing company or new company
    companyId: z.string().optional(),
    companyName: z.string().optional(),
    companyUrl: z.url().optional().or(z.literal('')),
    referredBy: z.string().max(255).optional(),
  })
  .refine(
    (data) => {
      if (data.lowSalary && data.highSalary) {
        return data.highSalary >= data.lowSalary;
      }
      return true;
    },
    {
      message: 'High salary must be greater than or equal to low salary',
      path: ['highSalary'],
    },
  )
  .refine(
    (data) => {
      // Either companyId must be provided OR both companyName and companyUrl must be provided
      if (data.companyId) {
        return true; // Existing company selected
      }
      if (data.companyName && data.companyName.trim()) {
        return true; // New company being created
      }
      return false;
    },
    {
      message: 'Please select an existing company or enter a new company name',
      path: ['companyName'],
    },
  );

export type ApplicationFormData = z.infer<typeof schema>;
