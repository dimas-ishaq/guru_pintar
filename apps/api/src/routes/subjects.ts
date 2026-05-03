import { Hono } from 'hono';
import { db } from '../db';
import { subjects as subjectsTable, majors as majorsTable, classes as classesTable } from '@guru-pintar/types/schema';
import { CreateSubjectInputSchema } from '@guru-pintar/types';
import { eq, and } from 'drizzle-orm';

const router = new Hono();

// GET /api/subjects
router.get('/', async (c) => {
  const user = c.get('user');

  // Admin sees all subjects, regular user sees only their own
  if (user.role === 'admin') {
    const result = await db.select({
      id: subjectsTable.id,
      name: subjectsTable.name,
      code: subjectsTable.code,
      majorId: subjectsTable.majorId,
      classId: subjectsTable.classId,
      userId: subjectsTable.userId,
      createdAt: subjectsTable.createdAt,
      updatedAt: subjectsTable.updatedAt,
      major: {
        id: majorsTable.id,
        name: majorsTable.name,
        code: majorsTable.code,
      },
      class: {
        id: classesTable.id,
        name: classesTable.name,
      }
    })
      .from(subjectsTable)
      .leftJoin(majorsTable, eq(subjectsTable.majorId, majorsTable.id))
      .leftJoin(classesTable, eq(subjectsTable.classId, classesTable.id));
    return c.json(result);
  }

  const result = await db.select({
    id: subjectsTable.id,
    name: subjectsTable.name,
    code: subjectsTable.code,
    majorId: subjectsTable.majorId,
    classId: subjectsTable.classId,
    createdAt: subjectsTable.createdAt,
    updatedAt: subjectsTable.updatedAt,
    major: {
      id: majorsTable.id,
      name: majorsTable.name,
      code: majorsTable.code,
    },
    class: {
      id: classesTable.id,
      name: classesTable.name,
    }
  })
    .from(subjectsTable)
    .leftJoin(majorsTable, eq(subjectsTable.majorId, majorsTable.id))
    .leftJoin(classesTable, eq(subjectsTable.classId, classesTable.id))
    .where(eq(subjectsTable.userId, user.id));

  return c.json(result);
});

// POST /api/subjects
router.post('/', async (c) => {
  const user = c.get('user');
  const body = await c.req.json();
  const validated = CreateSubjectInputSchema.parse(body);

  const [newSubject] = await db.insert(subjectsTable)
    .values({
      userId: user.id,
      majorId: validated.majorId,
      classId: validated.classId,
      name: validated.name,
      code: validated.code,
    })
    .returning();

  return c.json(newSubject, 201);
});

// PUT /api/subjects/:id
router.put('/:id', async (c) => {
  const user = c.get('user');
  const id = parseInt(c.req.param('id'));
  const body = await c.req.json();
  const validated = CreateSubjectInputSchema.parse(body);

  const [updatedSubject] = await db.update(subjectsTable)
    .set({
      majorId: validated.majorId,
      classId: validated.classId,
      name: validated.name,
      code: validated.code,
      updatedAt: new Date(),
    })
    .where(and(eq(subjectsTable.id, id), eq(subjectsTable.userId, user.id)))
    .returning();

  if (!updatedSubject) {
    return c.json({ error: 'Subject not found' }, 404);
  }

  return c.json(updatedSubject);
});

// DELETE /api/subjects/:id
router.delete('/:id', async (c) => {
  const user = c.get('user');
  const id = parseInt(c.req.param('id'));

  const [deletedSubject] = await db.delete(subjectsTable)
    .where(and(eq(subjectsTable.id, id), eq(subjectsTable.userId, user.id)))
    .returning();

  if (!deletedSubject) {
    return c.json({ error: 'Subject not found' }, 404);
  }

  return c.json({ message: 'Subject deleted successfully' });
});

export default router;
