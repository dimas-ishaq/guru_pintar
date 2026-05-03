import { Hono } from 'hono';
import { serve } from 'bun';

// View modules
import { renderPage, renderAuthPage } from './views/layout';
import { loginView } from './views/login';
import { dashboardView } from './views/dashboard';
import { analisisCPView } from './views/analisis-cp';
import { aiGeneratorView } from './views/ai-generator';
import { attendanceView } from './views/attendance';
import { jurusanView } from './views/jurusan';
import { settingsView } from './views/settings';
import { studentsView } from './views/students';
import { kelasView } from './views/kelas';
import { subjectsView } from './views/subjects';

const app = new Hono();

// Proxy /api requests to the API server (running on port 3001)
app.all('/api/*', async (c) => {
  const url = new URL(c.req.url);
  const targetUrl = 'http://localhost:3001' + url.pathname + url.search;

  const response = await fetch(targetUrl, {
    method: c.req.method,
    headers: c.req.header(),
    body: c.req.method !== 'GET' && c.req.method !== 'HEAD' ? await c.req.blob() : undefined,
  });

  return c.body(response.body, {
    status: response.status,
    headers: response.headers,
  });
});

// Compose all views into a single page
app.get('/', (c) => {
  const content = [
    dashboardView(),
    aiGeneratorView(),
    analisisCPView(),
    attendanceView(),
    jurusanView(),
    settingsView(),
    studentsView(),
    kelasView(),
        subjectsView(),
  ].join('\n');

  return c.html(renderPage(content));
});

// Login Page
app.get('/login', (c) => {
  return c.html(renderAuthPage(loginView()));
});

const port = parseInt(process.env.PORT || '3000');
console.log('🚀 Frontend running on http://localhost:' + port);

serve({
  fetch: app.fetch,
  port,
});
