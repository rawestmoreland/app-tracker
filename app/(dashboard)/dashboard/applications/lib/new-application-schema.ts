import { ApplicationStatus, RemoteType } from '@prisma/client';
import z from 'zod';

export const schema = z
  .object({
    title: z.string().min(1),
    description: z.string().optional(),
    jobUrl: z.url().optional(),
    lowSalary: z.number().min(0).optional(),
    highSalary: z.number().min(0).optional(),
    currency: z.string(),
    location: z.string().optional(),
    remote: z.enum(RemoteType).optional(),
    status: z.enum(ApplicationStatus).optional(),
    appliedAt: z.date(),
    companyId: z.string().min(1),
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
    }
  );

export type ApplicationFormData = z.infer<typeof schema>;
