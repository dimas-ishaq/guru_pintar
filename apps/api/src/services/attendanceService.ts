import { db } from '../db';
import { attendance as attendanceTable } from '@guru-pintar/types/schema';
import { eq, and, gte, lte } from 'drizzle-orm';
import {
  CheckInInputSchema,
  CheckOutInputSchema,
  AttendanceReportResultSchema,
} from '@guru-pintar/types';
import type { CheckInInput, CheckOutInput, AttendanceReportResult } from '@guru-pintar/types';

export class AttendanceServiceError extends Error {
  constructor(
    message: string,
    public statusCode: number = 400
  ) {
    super(message);
    this.name = 'AttendanceServiceError';
  }
}

export interface IAttendanceService {
  checkIn(input: CheckInInput): Promise<{ success: boolean; checkInTime: Date }>;
  checkOut(input: CheckOutInput): Promise<{ success: boolean; checkOutTime: Date }>;
  getReport(userId: number, month: number, year: number): Promise<AttendanceReportResult>;
}

/**
 * Check-in attendance record for a user.
 * Throws AttendanceServiceError if user has already checked in today.
 */
export async function checkIn(input: CheckInInput): Promise<{ success: boolean; checkInTime: Date }> {
  const validatedInput = CheckInInputSchema.parse(input);
  const { userId } = validatedInput;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Check if user already checked in today
  const existingRecord = await db.query.attendance.findFirst({
    where: and(
      eq(attendanceTable.userId, userId),
      gte(attendanceTable.date, today)
    ),
  });

  if (existingRecord?.checkInTime) {
    throw new AttendanceServiceError('Already checked in today', 400);
  }

  await db.insert(attendanceTable).values({
    userId,
    checkInTime: new Date(),
    date: today,
    status: 'present',
  });

  return {
    success: true,
    checkInTime: new Date(),
  };
}

/**
 * Check-out attendance record for a user.
 * Throws AttendanceServiceError if no check-in record is found.
 */
export async function checkOut(input: CheckOutInput): Promise<{ success: boolean; checkOutTime: Date }> {
  const validatedInput = CheckOutInputSchema.parse(input);
  const { userId } = validatedInput;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const record = await db.query.attendance.findFirst({
    where: and(
      eq(attendanceTable.userId, userId),
      gte(attendanceTable.date, today)
    ),
  });

  if (!record) {
    throw new AttendanceServiceError('No check-in record found', 400);
  }

  await db.update(attendanceTable)
    .set({ checkOutTime: new Date() })
    .where(eq(attendanceTable.id, record.id));

  return {
    success: true,
    checkOutTime: new Date(),
  };
}

/**
 * Get attendance report for a user within a specified month and year.
 */
export async function getReport(userId: number, month: number, year: number): Promise<AttendanceReportResult> {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);

  const records = await db.query.attendance.findMany({
    where: and(
      eq(attendanceTable.userId, userId),
      gte(attendanceTable.date, startDate),
      lte(attendanceTable.date, endDate)
    ),
  });

  const summary = {
    present: records.filter(r => r.status === 'present').length,
    absent: records.filter(r => r.status === 'absent').length,
    late: records.filter(r => r.status === 'late').length,
    total: records.length,
  };

  return AttendanceReportResultSchema.parse({
    userId,
    month,
    year,
    summary,
    records,
  });
}
