import { Hono } from 'hono';
import { db } from '../db';
import { majors as majorsTable } from '@guru-pintar/types/schema';
import { CreateMajorInputSchema } from '@guru-pintar/types';
import { eq, and } from 'drizzle-orm';

const router = new Hono();

// GET /api/majors
router.get('/', async (c) => {
  const user = c.get('user');
  const result = await db.select().from(majorsTable).where(eq(majorsTable.userId, user.id));
  return c.json(result);
});

// POST /api/majors
router.post('/', async (c) => {
  const user = c.get('user');
  const body = await c.req.json();
  const validated = CreateMajorInputSchema.parse(body);

  const [newMajor] = await db.insert(majorsTable).values({
    userId: user.id,
    name: validated.name,
    code: validated.code,
    description: validated.description,
  }).returning();

  return c.json(newMajor, 201);
});

// PUT /api/majors/:id
router.put('/:id', async (c) => {
  const user = c.get('user');
  const id = parseInt(c.req.param('id'));
  const body = await c.req.json();
  const validated = CreateMajorInputSchema.parse(body);

  const [updatedMajor] = await db.update(majorsTable)
    .set({ 
      name: validated.name, 
      code: validated.code,
      description: validated.description,
      updatedAt: new Date()
    })
    .where(and(eq(majorsTable.id, id), eq(majorsTable.userId, user.id)))
    .returning();

  if (!updatedMajor) return c.json({ error: 'Major not found' }, 404);
  return c.json(updatedMajor);
});

// DELETE /api/majors/:id
router.delete('/:id', async (c) => {
  const user = c.get('user');
  const id = parseInt(c.req.param('id'));

  const [deletedMajor] = await db.delete(majorsTable)
    .where(and(eq(majorsTable.id, id), eq(majorsTable.userId, user.id)))
    .returning();

  if (!deletedMajor) return c.json({ error: 'Major not found' }, 404);
  return c.json({ message: 'Major deleted successfully' });
});

export default router;
