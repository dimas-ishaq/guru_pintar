import { Hono } from 'hono';
import { z } from 'zod';
import {
  checkIn as checkInService,
  checkOut as checkOutService,
  getReport as getReportService,
  AttendanceServiceError,
} from '../services/attendanceService';
import {
  CheckInInputSchema,
  CheckOutInputSchema,
} from '@guru-pintar/types';

const router = new Hono();

/**
 * POST /api/attendance/check-in
 * Check in a user for attendance
 */
router.post('/check-in', async (c) => {
  try {
    const body = await c.req.json();
    const input = CheckInInputSchema.parse(body);

    const result = await checkInService(input);
    return c.json(result, 201);

  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: 'Invalid input', details: error.errors }, 400);
    }
    if (error instanceof AttendanceServiceError) {
      return c.json({ error: error.message }, error.statusCode);
    }
    return c.json({ error: 'Check-in failed' }, 400);
  }
});

/**
 * POST /api/attendance/check-out
 * Check out a user from attendance
 */
router.post('/check-out', async (c) => {
  try {
    const body = await c.req.json();
    const input = CheckOutInputSchema.parse(body);

    const result = await checkOutService(input);
    return c.json(result);

  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: 'Invalid input', details: error.errors }, 400);
    }
    if (error instanceof AttendanceServiceError) {
      return c.json({ error: error.message }, error.statusCode);
    }
    return c.json({ error: 'Check-out failed' }, 400);
  }
});

/**
 * GET /api/attendance/report/:userId?month&year
 * Get attendance report for a user
 */
router.get('/report/:userId', async (c) => {
  try {
    const userId = parseInt(c.req.param('userId'));
    const month = parseInt(c.req.query('month') ?? String(new Date().getMonth() + 1));
    const year = parseInt(c.req.query('year') ?? String(new Date().getFullYear()));

    const report = await getReportService(userId, month, year);
    return c.json(report);

  } catch (error) {
    if (error instanceof AttendanceServiceError) {
      return c.json({ error: error.message }, error.statusCode);
    }
    return c.json({ error: 'Failed to fetch report' }, 400);
  }
});

export default router;
