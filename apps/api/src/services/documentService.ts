import { db } from '../db';
import { documents as documentsTable } from '@guru-pintar/types/schema';
import { generateProta, generateProsem, generateModulAjar, generateKKTP } from '@guru-pintar/ai';
import { AIGeneratorOutput } from '@guru-pintar/types';
import { eq, desc } from 'drizzle-orm';
import { z, ZodError } from 'zod';
import {
  ProtaInputSchema,
  ProsemInputSchema,
  ModulAjarInputSchema,
  KKTPInputSchema,
  SaveAnalisisCPInputSchema,
} from '@guru-pintar/types';
import type {
  ProtaInput,
  ProsemInput,
  ModulAjarInput,
  KKTPInput,
  SaveAnalisisCPInput,
} from '@guru-pintar/types';

export class DocumentServiceError extends Error {
  constructor(
    message: string,
    public statusCode: number = 400
  ) {
    super(message);
    this.name = 'DocumentServiceError';
  }
}

/**
 * Create a PROTA (Program Tahunan) document via AI and persist it to the database.
 */
export async function createProtaDocument(input: ProtaInput): Promise<AIGeneratorOutput> {
  try {
    const validatedInput = ProtaInputSchema.parse(input);
    const { userId, apiKey, baseUrl, ...aiInput } = validatedInput;

    const result = await generateProta(aiInput, { apiKey, baseUrl });

    await db.insert(documentsTable).values({
      userId,
      type: 'prota',
      title: result.title,
      content: result.content,
      metadata: result.metadata,
    });

    return result;
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new DocumentServiceError('Invalid input: ' + error.message, 400);
    }
    throw new DocumentServiceError('Failed to generate PROTA: ' + error.message, 500);
  }
}

/**
 * Create a PROSEM (Program Semester) document via AI and persist it.
 */
export async function createProsemDocument(input: ProsemInput): Promise<AIGeneratorOutput> {
  try {
    const validatedInput = ProsemInputSchema.parse(input);
    const { userId, apiKey, baseUrl, ...aiInput } = validatedInput;

    const result = await generateProsem(aiInput, { apiKey, baseUrl });

    await db.insert(documentsTable).values({
      userId,
      type: 'prosem',
      title: result.title,
      content: result.content,
      metadata: result.metadata,
    });

    return result;
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new DocumentServiceError('Invalid input: ' + error.message, 400);
    }
    throw new DocumentServiceError('Failed to generate PROSEM: ' + error.message, 500);
  }
}

/**
 * Create a Modul Ajar document via AI and persist it.
 */
export async function createModulAjarDocument(input: ModulAjarInput): Promise<AIGeneratorOutput> {
  try {
    const validatedInput = ModulAjarInputSchema.parse(input);
    const { userId, apiKey, baseUrl, ...aiInput } = validatedInput;

    const result = await generateModulAjar(aiInput, { apiKey, baseUrl });

    await db.insert(documentsTable).values({
      userId,
      type: 'modul_ajar',
      title: result.title,
      content: result.content,
      metadata: result.metadata,
    });

    return result;
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new DocumentServiceError('Invalid input: ' + error.message, 400);
    }
    throw new DocumentServiceError('Failed to generate Modul Ajar: ' + error.message, 500);
  }
}

/**
 * Create a KKTP document via AI and persist it.
 */
export async function createKKTPDocument(input: KKTPInput): Promise<AIGeneratorOutput> {
  try {
    const validatedInput = KKTPInputSchema.parse(input);
    const { userId, apiKey, baseUrl, ...aiInput } = validatedInput;

    const result = await generateKKTP(aiInput, { apiKey, baseUrl });

    await db.insert(documentsTable).values({
      userId,
      type: 'kktp',
      title: result.title,
      content: result.content,
      metadata: result.metadata,
    });

    return result;
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new DocumentServiceError('Invalid input: ' + error.message, 400);
    }
    throw new DocumentServiceError('Failed to generate KKTP: ' + error.message, 500);
  }
}

/**
 * Save an externally generated Analisis CP document to the database.
 */
export async function saveAnalisisCP(input: SaveAnalisisCPInput) {
  try {
    const validatedInput = SaveAnalisisCPInputSchema.parse(input);
    const { userId, title, content, metadata } = validatedInput;

    const [result] = await db.insert(documentsTable).values({
      userId,
      type: 'analisis_cp',
      title,
      content,
      metadata: metadata || {},
    }).returning();

    return result;
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new DocumentServiceError('Invalid input: ' + error.message, 400);
    }
    throw new DocumentServiceError('Failed to save Analisis CP: ' + error.message, 500);
  }
}

/**
 * Fetch all documents belonging to a specific user.
 */
export async function getUserDocuments(userId: number) {
  try {
    const docs = await db.query.documents.findMany({
      where: eq(documentsTable.userId, userId),
      orderBy: (documents, { desc }) => [desc(documents.createdAt)],
    });
    return docs;
  } catch (error) {
    throw new DocumentServiceError('Failed to fetch documents: ' + error.message, 500);
  }
}
