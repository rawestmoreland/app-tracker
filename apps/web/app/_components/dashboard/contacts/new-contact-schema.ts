import z from 'zod';

export const newContactSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  email: z.email({ message: 'Invalid email address' }),
  phone: z.string().optional(),
  title: z.string().min(1, { message: 'Title is required' }),
  linkedin: z
    .url({ message: 'Invalid LinkedIn URL' })
    .optional()
    .or(z.literal('')),
  notes: z.string().optional(),
  companyId: z.string(),
  interviewId: z.string().optional(),
});

export type NewContactSchema = z.infer<typeof newContactSchema>;
