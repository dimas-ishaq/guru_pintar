import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
  role: z.enum(['admin', 'guru']).default('guru'),
});

export const CheckInInputSchema = z.object({
  status: z.string().default('present'),
});

export const CheckOutInputSchema = z.object({
  // No fields needed for checkout usually, just the timestamp
});

export const AttendanceReportInputSchema = z.object({
  startDate: z.string(),
  endDate: z.string(),
  classId: z.number().optional(),
});

export const ProtaInputSchema = z.object({
  subject: z.string(),
  grade: z.string(),
  year: z.string(),
  cp: z.string(),
});

export const ProsemInputSchema = z.object({
  subject: z.string(),
  grade: z.string(),
  semester: z.string(),
  year: z.string(),
  cp: z.string(),
});

export const ModulAjarInputSchema = z.object({
  subject: z.string(),
  grade: z.string(),
  topic: z.string(),
  tp: z.string(),
});

export const KKTPInputSchema = z.object({
  subject: z.string(),
  grade: z.string(),
  tp: z.string(),
});

export const SaveAnalisisCPInputSchema = z.object({
  title: z.string(),
  content: z.string(),
  metadata: z.record(z.any()).optional(),
});

export const CreateMajorInputSchema = z.object({
  name: z.string().min(1),
  code: z.string().min(1),
  description: z.string().optional(),
});

export const CreateClassInputSchema = z.object({
  majorId: z.number().nullable(),
  name: z.string().min(1),
  grade: z.string().min(1),
});

export const CreateSubjectInputSchema = z.object({
  majorId: z.number().nullable(),
  classId: z.number().nullable(),
  name: z.string().min(1),
  code: z.string().min(1),
});

// Type exports
export type LoginInput = z.infer<typeof LoginSchema>;
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type CheckInInput = z.infer<typeof CheckInInputSchema>;
export type CheckOutInput = z.infer<typeof CheckOutInputSchema>;
export type AttendanceReportInput = z.infer<typeof AttendanceReportInputSchema>;
export type CreateMajorInput = z.infer<typeof CreateMajorInputSchema>;
export type CreateClassInput = z.infer<typeof CreateClassInputSchema>;
export type ProtaInput = z.infer<typeof ProtaInputSchema>;
export type ProsemInput = z.infer<typeof ProsemInputSchema>;
export type ModulAjarInput = z.infer<typeof ModulAjarInputSchema>;
export type KKTPInput = z.infer<typeof KKTPInputSchema>;
export type SaveAnalisisCPInput = z.infer<typeof SaveAnalisisCPInputSchema>;
export type CreateSubjectInput = z.infer<typeof CreateSubjectInputSchema>;
