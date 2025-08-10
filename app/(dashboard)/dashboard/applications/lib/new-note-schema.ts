import { NoteType } from '@prisma/client';
import z from 'zod';

export const noteSchema = z.object({
  content: z.string().min(1),
  type: z.enum(NoteType),
  interviewId: z.string().optional(),
  applicationId: z.string().optional(),
});

export type NoteFormData = z.infer<typeof noteSchema>;
