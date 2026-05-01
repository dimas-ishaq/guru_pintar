import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';

// Routes
import authRoutes from './routes/auth';
import attendanceRoutes from './routes/attendance';
import documentRoutes from './routes/documents';
import classesRoutes from './routes/classes';
import majorsRoutes from './routes/majors';

// Middlewares
import { authMiddleware } from './middlewares/auth';

const app = new Hono();

// Global middlewares
app.use(cors());
app.use(logger());

// Health check
app.get('/', (c) => {
  return c.json({
    message: 'AI Teacher Admin Platform API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Public routes
app.route('/api/auth', authRoutes);

// Protected routes (require authentication)
app.use('/api/attendance/*', authMiddleware);
app.route('/api/attendance', attendanceRoutes);

app.use('/api/documents/*', authMiddleware);
app.route('/api/documents', documentRoutes);

app.use('/api/classes/*', authMiddleware);
app.route('/api/classes', classesRoutes);

app.use('/api/majors/*', authMiddleware);
app.route('/api/majors', majorsRoutes);

export default app;
