import z from 'zod';

export const newContactSchema = z
  .object({
    existingContactId: z.string().optional(),
    name: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
    title: z.string().optional(),
    linkedin: z.string().optional(),
    notes: z.string().optional(),
    companyId: z.string().optional(),
    interviewId: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // If existing contact is selected, we don't need to validate new contact fields
    if (data.existingContactId) {
      return;
    }

    // If no existing contact, validate all required new contact fields
    if (!data.name || data.name.trim() === '') {
      ctx.addIssue({
        code: 'custom',
        message: 'Name is required',
        path: ['name'],
      });
    }

    if (!data.email || data.email.trim() === '') {
      ctx.addIssue({
        code: 'custom',
        message: 'Email is required',
        path: ['email'],
      });
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      ctx.addIssue({
        code: 'custom',
        message: 'Invalid email address',
        path: ['email'],
      });
    }

    if (!data.title || data.title.trim() === '') {
      ctx.addIssue({
        code: 'custom',
        message: 'Title is required',
        path: ['title'],
      });
    }

    if (!data.companyId) {
      ctx.addIssue({
        code: 'custom',
        message: 'Company is required',
        path: ['companyId'],
      });
    }

    if (data.linkedin && data.linkedin.trim() !== '') {
      try {
        new URL(data.linkedin);
      } catch {
        ctx.addIssue({
          code: 'custom',
          message: 'Invalid LinkedIn URL',
          path: ['linkedin'],
        });
      }
    }
  });

export type NewContactSchema = z.infer<typeof newContactSchema>;
