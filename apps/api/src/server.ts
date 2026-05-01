import { Hono } from 'hono';
import { serve } from 'bun';
import app from './index';

const port = parseInt(process.env.PORT || '3000');

console.log(`🚀 API Server running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
