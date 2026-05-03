import { z } from 'zod';

export const UserSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  name: z.string(),
  role: z.enum(['admin', 'guru']),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const AttendanceSchema = z.object({
  id: z.number(),
  userId: z.number(),
  checkInTime: z.date().nullable(),
  checkOutTime: z.date().nullable(),
  date: z.date(),
  status: z.string(),
  createdAt: z.date(),
});

export const MajorSchema = z.object({
  id: z.number(),
  userId: z.number(),
  name: z.string(),
  code: z.string(),
  description: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const ClassSchema = z.object({
  id: z.number(),
  userId: z.number(),
  majorId: z.number().nullable(),
  name: z.string(),
  grade: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const DocumentSchema = z.object({
  id: z.number(),
  userId: z.number(),
  type: z.enum(['prota', 'prosem', 'modul_ajar', 'kktp', 'analisis_cp', 'lkpd', 'soal_essay']),
  title: z.string(),
  content: z.string(),
  metadata: z.record(z.any()).nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const SubjectsSchema = z.object({
  id: z.number(),
  userId: z.number(),
  majorId: z.number().nullable(),
  classId: z.number().nullable(),
  name: z.string(),
  code: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const AIGeneratorOutputSchema = z.object({
  title: z.string(),
  description: z.string(),
  content: z.string(),
  metadata: z.record(z.any()).optional(),
});

export const AttendanceReportResultSchema = z.object({
  studentId: z.number(),
  studentName: z.string(),
  presentCount: z.number(),
  absentCount: z.number(),
  lateCount: z.number(),
  percentage: z.number(),
});

export type User = z.infer<typeof UserSchema>;
export type Attendance = z.infer<typeof AttendanceSchema>;
export type Jurusan = z.infer<typeof MajorSchema>;
export type Kelas = z.infer<typeof ClassSchema>;
export type Subject = z.infer<typeof SubjectsSchema>;
export type Document = z.infer<typeof DocumentSchema>;
export type AIGeneratorOutput = z.infer<typeof AIGeneratorOutputSchema>;
export type AttendanceReportResult = z.infer<typeof AttendanceReportResultSchema>;

// Re-export request schemas and types
export * from './requestSchemas';
