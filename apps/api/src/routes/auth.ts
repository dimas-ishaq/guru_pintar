import { Hono } from 'hono';
import { z } from 'zod';
import { login, register, AuthServiceError } from '../services/authService';
import { LoginSchema, RegisterSchema } from '@guru-pintar/types';

const router = new Hono();

/**
 * POST /api/auth/login
 * Login a user and return JWT token
 */
router.post('/login', async (c) => {
  try {
    const body = await c.req.json();
    const input = LoginSchema.parse(body);
    const result = await login(input);
    return c.json(result);
  } catch (error) {
    console.error('Login error:', error);
    if (error instanceof z.ZodError) {
      const detail = error.errors.map(e => e.message).join(', ');
      return c.json({ error: `Input tidak valid: ${detail}` }, 400);
    }
    if (error instanceof AuthServiceError) {
      return c.json({ error: error.message }, error.statusCode);
    }
    return c.json({ error: 'Login gagal: Terjadi kesalahan pada server' }, 400);
  }
});

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post('/register', async (c) => {
  try {
    const body = await c.req.json();
    const input = RegisterSchema.parse(body);
    const result = await register(input);
    return c.json(result, 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: 'Invalid input', details: error.errors }, 400);
    }
    if (error instanceof AuthServiceError) {
      return c.json({ error: error.message }, error.statusCode);
    }
    return c.json({ error: 'Registration failed' }, 400);
  }
});

export default router;
