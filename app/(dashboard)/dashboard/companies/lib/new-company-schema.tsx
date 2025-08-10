import { CompanySize } from '@prisma/client';
import z from 'zod';

export const companySchema = z.object({
  name: z.string().min(1, 'Company name is required').max(255),
  website: z.url('Please enter a valid URL').optional().or(z.literal('')),
  description: z.string().max(2000),
  industry: z.string().max(255),
  size: z.enum(Object.values(CompanySize) as [string, ...string[]]),
  location: z.string().max(255),
  logo: z.url('Please enter a valid URL').optional().or(z.literal('')),
  visibility: z.enum(['PRIVATE', 'PUBLIC']),
  isGlobal: z.boolean().optional(),
});

export type CompanyFormData = z.infer<typeof companySchema>;
