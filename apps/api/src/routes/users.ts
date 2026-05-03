import { Hono } from 'hono';
import { db } from '../db';
import { users as usersTable } from '@guru-pintar/types/schema';
import bcrypt from 'bcrypt';
import { eq, and } from 'drizzle-orm';
import { adminMiddleware } from '../middlewares/auth';

const router = new Hono();

// GET /api/users - List all users (admin only)
router.get('/', adminMiddleware, async (c) => {
  const user = c.get('user');

  const result = await db.select({
    id: usersTable.id,
    name: usersTable.name,
    email: usersTable.email,
    role: usersTable.role,
    createdAt: usersTable.createdAt,
  }).from(usersTable);

  return c.json(result);
});

// GET /api/users/:id - Get single user (admin only)
router.get('/:id', adminMiddleware, async (c) => {
  const id = parseInt(c.req.param('id'));

  const [result] = await db.select({
    id: usersTable.id,
    name: usersTable.name,
    email: usersTable.email,
    role: usersTable.role,
    createdAt: usersTable.createdAt,
  }).from(usersTable).where(eq(usersTable.id, id));

  if (!result) return c.json({ error: 'User not found' }, 404);
  return c.json(result);
});

// POST /api/users - Create new user (admin only)
router.post('/', adminMiddleware, async (c) => {
  const body = await c.req.json();

  // Validate input
  if (!body.email || !body.password || !body.name || !body.role) {
    return c.json({ error: 'Email, password, name, and role are required' }, 400);
  }

  // Check email uniqueness
  const [existing] = await db.select().from(usersTable).where(eq(usersTable.email, body.email)).limit(1);
  if (existing) {
    return c.json({ error: 'Email sudah terdaftar' }, 400);
  }

  // Validate role
  if (!['admin', 'guru'].includes(body.role)) {
    return c.json({ error: 'Role must be admin or guru' }, 400);
  }

  const hashedPassword = await bcrypt.hash(body.password, 10);

  const [newUser] = await db.insert(usersTable).values({
    email: body.email,
    password: hashedPassword,
    name: body.name,
    role: body.role,
  }).returning({
    id: usersTable.id,
    name: usersTable.name,
    email: usersTable.email,
    role: usersTable.role,
    createdAt: usersTable.createdAt,
  });

  return c.json(newUser, 201);
});

// PUT /api/users/:id - Update user (admin only)
router.put('/:id', adminMiddleware, async (c) => {
  const id = parseInt(c.req.param('id'));
  const body = await c.req.json();

  // Check if user exists
  const [existing] = await db.select().from(usersTable).where(eq(usersTable.id, id)).limit(1);
  if (!existing) {
    return c.json({ error: 'User not found' }, 404);
  }

  // Build update object
  const updateData: any = {
    updatedAt: new Date(),
  };

  if (body.name) updateData.name = body.name;
  if (body.email) {
    // Check email uniqueness (excluding current user)
    const [emailCheck] = await db.select().from(usersTable)
      .where(and(eq(usersTable.email, body.email), eq(usersTable.id, id))).limit(1);
    if (!emailCheck) {
      const [otherEmail] = await db.select().from(usersTable)
        .where(eq(usersTable.email, body.email)).limit(1);
      if (otherEmail && otherEmail.id !== id) {
        return c.json({ error: 'Email sudah digunakan user lain' }, 400);
      }
    }
    updateData.email = body.email;
  }
  if (body.role) {
    if (!['admin', 'guru'].includes(body.role)) {
      return c.json({ error: 'Role must be admin or guru' }, 400);
    }
    updateData.role = body.role;
  }
  if (body.password) {
    updateData.password = await bcrypt.hash(body.password, 10);
  }

  const [updatedUser] = await db.update(usersTable)
    .set(updateData)
    .where(eq(usersTable.id, id))
    .returning({
      id: usersTable.id,
      name: usersTable.name,
      email: usersTable.email,
      role: usersTable.role,
      createdAt: usersTable.createdAt,
    });

  return c.json(updatedUser);
});

// DELETE /api/users/:id - Delete user (admin only)
router.delete('/:id', adminMiddleware, async (c) => {
  const id = parseInt(c.req.param('id'));
  const currentUser = c.get('user');

  // Prevent self-deletion
  if (id === currentUser.id) {
    return c.json({ error: 'Tidak dapat menghapus akun sendiri' }, 400);
  }

  const [deleted] = await db.delete(usersTable)
    .where(eq(usersTable.id, id))
    .returning({ id: usersTable.id });

  if (!deleted) return c.json({ error: 'User not found' }, 404);
  return c.json({ message: 'User deleted successfully' });
});

export default router;
