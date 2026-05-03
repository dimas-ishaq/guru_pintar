import { Hono } from 'hono';
import { z } from 'zod';
import {
  createProtaDocument,
  createProsemDocument,
  createModulAjarDocument,
  createKKTPDocument,
  createLKPDDocument,
  saveAnalisisCP,
  getUserDocuments,
  DocumentServiceError,
} from '../services/documentService';
import {
  ProtaInputSchema,
  ProsemInputSchema,
  ModulAjarInputSchema,
  KKTPInputSchema,
  LKPDInputSchema,
  SaveAnalisisCPInputSchema,
} from '@guru-pintar/types';

const router = new Hono();

/**
 * POST /api/documents/generate-prota
 * Generate and save a PROTA (Program Tahunan) document
 */
router.post('/generate-prota', async (c) => {
  try {
    const body = await c.req.json();
    const input = ProtaInputSchema.parse(body);

    const result = await createProtaDocument(input);
    return c.json(result, 201);

  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: 'Invalid input', details: error.errors }, 400);
    }
    if (error instanceof DocumentServiceError) {
      return c.json({ error: error.message }, error.statusCode);
    }
    return c.json({ error: 'Failed to generate PROTA' }, 500);
  }
});

/**
 * POST /api/documents/generate-prosem
 * Generate and save a PROSEM (Program Semester) document
 */
router.post('/generate-prosem', async (c) => {
  try {
    const body = await c.req.json();
    const input = ProsemInputSchema.parse(body);

    const result = await createProsemDocument(input);
    return c.json(result, 201);

  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: 'Invalid input', details: error.errors }, 400);
    }
    if (error instanceof DocumentServiceError) {
      return c.json({ error: error.message }, error.statusCode);
    }
    return c.json({ error: 'Failed to generate PROSEM' }, 500);
  }
});

/**
 * POST /api/documents/generate-modul-ajar
 * Generate and save a Modul Ajar document
 */
router.post('/generate-modul-ajar', async (c) => {
  try {
    const body = await c.req.json();
    const input = ModulAjarInputSchema.parse(body);

    const result = await createModulAjarDocument(input);
    return c.json(result, 201);

  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: 'Invalid input', details: error.errors }, 400);
    }
    if (error instanceof DocumentServiceError) {
      return c.json({ error: error.message }, error.statusCode);
    }
    return c.json({ error: 'Failed to generate Modul Ajar' }, 500);
  }
});

/**
 * POST /api/documents/generate-kktp
 * Generate and save a KKTP document
 */
router.post('/generate-kktp', async (c) => {
  try {
    const body = await c.req.json();
    const input = KKTPInputSchema.parse(body);

    const result = await createKKTPDocument(input);
    return c.json(result, 201);

  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: 'Invalid input', details: error.errors }, 400);
    }
    if (error instanceof DocumentServiceError) {
      return c.json({ error: error.message }, error.statusCode);
    }
    return c.json({ error: 'Failed to generate KKTP' }, 500);
  }
});

/**
 * POST /api/documents/generate-lkpd
 * Generate and save an LKPD document
 */
router.post('/generate-lkpd', async (c) => {
  try {
    const body = await c.req.json();
    const input = LKPDInputSchema.parse(body);

    const result = await createLKPDDocument(input);
    return c.json(result, 201);

  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: 'Invalid input', details: error.errors }, 400);
    }
    if (error instanceof DocumentServiceError) {
      return c.json({ error: error.message }, error.statusCode);
    }
    return c.json({ error: 'Failed to generate LKPD' }, 500);
  }
});

/**
 * POST /api/documents/save-analisis-cp
 * Save an externally generated Analisis CP document
 */
router.post('/save-analisis-cp', async (c) => {
  try {
    const body = await c.req.json();
    const input = SaveAnalisisCPInputSchema.parse(body);

    const result = await saveAnalisisCP(input);
    return c.json(result, 201);

  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: 'Invalid input', details: error.errors }, 400);
    }
    if (error instanceof DocumentServiceError) {
      return c.json({ error: error.message }, error.statusCode);
    }
    return c.json({ error: 'Failed to save Analisis CP' }, 500);
  }
});

/**
 * GET /api/documents/list
 * Get all documents for current user, or all documents if admin
 */
router.get('/list/:userId', async (c) => {
  try {
    const currentUser = c.get('user');
    const userId = parseInt(c.req.param('userId'));

    if (isNaN(userId) || userId <= 0) {
      return c.json({ error: 'Invalid userId' }, 400);
    }

    // Only allow admin to view other users' documents
    if (currentUser.role !== 'admin' && currentUser.id !== userId) {
      return c.json({ error: 'Access denied' }, 403);
    }

    const documents = await getUserDocuments(userId);
    return c.json({ userId, documents });

  } catch (error) {
    if (error instanceof DocumentServiceError) {
      return c.json({ error: error.message }, error.statusCode);
    }
    return c.json({ error: 'Failed to fetch documents' }, 500);
  }
});

export default router;
