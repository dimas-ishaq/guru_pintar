import { Hono } from 'hono';
import { db } from '../db';
import { classes as classesTable, majors as majorsTable } from '@guru-pintar/types/schema';
import { CreateClassInputSchema } from '@guru-pintar/types';
import { eq, and } from 'drizzle-orm';

const router = new Hono();

// GET /api/classes
router.get('/', async (c) => {
  const user = c.get('user');

  // Join classes with majors to get major info
  // Admin sees all classes, regular user sees only their own
  const baseQuery = db.select({
    id: classesTable.id,
    name: classesTable.name,
    majorId: classesTable.majorId,
    userId: classesTable.userId,
    createdAt: classesTable.createdAt,
    major: {
      id: majorsTable.id,
      name: majorsTable.name,
      code: majorsTable.code
    }
  })
  .from(classesTable)
  .leftJoin(majorsTable, eq(classesTable.majorId, majorsTable.id));

  if (user.role === 'admin') {
    return c.json(await baseQuery);
  }
  return c.json(await baseQuery.where(eq(classesTable.userId, user.id)));
});

// POST /api/classes
router.post('/', async (c) => {
  const user = c.get('user');
  const body = await c.req.json();
  const validated = CreateClassInputSchema.parse(body);

  const [newClass] = await db.insert(classesTable).values({
    userId: user.id,
    majorId: validated.majorId,
    name: validated.name,
  }).returning();

  return c.json(newClass, 201);
});

// PUT /api/classes/:id
router.put('/:id', async (c) => {
  const user = c.get('user');
  const id = parseInt(c.req.param('id'));
  const body = await c.req.json();
  const validated = CreateClassInputSchema.parse(body);

  const [updatedClass] = await db.update(classesTable)
    .set({
      majorId: validated.majorId,
      name: validated.name,
      updatedAt: new Date()
    })
    .where(and(eq(classesTable.id, id), eq(classesTable.userId, user.id)))
    .returning();

  if (!updatedClass) return c.json({ error: 'Class not found' }, 404);
  return c.json(updatedClass);
});

// DELETE /api/classes/:id
router.delete('/:id', async (c) => {
  const user = c.get('user');
  const id = parseInt(c.req.param('id'));

  const [deletedClass] = await db.delete(classesTable)
    .where(and(eq(classesTable.id, id), eq(classesTable.userId, user.id)))
    .returning();

  if (!deletedClass) return c.json({ error: 'Class not found' }, 404);
  return c.json({ message: 'Class deleted successfully' });
});

export default router;
