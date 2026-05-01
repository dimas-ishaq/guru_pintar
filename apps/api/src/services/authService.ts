import { db } from '../db';
import { users as usersTable } from '@guru-pintar/types/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z, ZodError } from 'zod';
import {
  LoginSchema,
  RegisterSchema,
} from '@guru-pintar/types';
import type { LoginInput, RegisterInput } from '@guru-pintar/types';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export class AuthServiceError extends Error {
  constructor(
    message: string,
    public statusCode: number = 400
  ) {
    super(message);
    this.name = 'AuthServiceError';
  }
}

/**
 * Login a user and return JWT token.
 */
export async function login(input: LoginInput) {
  const validatedInput = LoginSchema.parse(input);
  const { email, password } = validatedInput;

  const results = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
  const user = results[0];

  if (!user) {
    throw new AuthServiceError('Email tidak terdaftar', 401);
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    throw new AuthServiceError('Kata sandi salah', 401);
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  };
}

/**
 * Register a new user.
 */
export async function register(input: RegisterInput) {
  const validatedInput = RegisterSchema.parse(input);
  const { email, password, name, role } = validatedInput;

  const existingUser = await db.query.users.findFirst({
    where: eq(usersTable.email, email),
  });

  if (existingUser) {
    throw new AuthServiceError('Email already registered', 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await db.insert(usersTable).values({
    email,
    password: hashedPassword,
    name,
    role,
  });

  const token = jwt.sign(
    { id: result.insertId, email, role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  return {
    token,
    user: {
      id: result.insertId,
      email,
      name,
      role,
    },
  };
}
