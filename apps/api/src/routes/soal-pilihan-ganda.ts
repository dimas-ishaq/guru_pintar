import { Hono } from 'hono';
import { z } from 'zod';

const router = new Hono();

/**
 * POST /api/soal-pilihan-ganda/generate
 * Generate multiple choice questions using AI
 */
router.post('/generate', async (c) => {
  try {
    const body = await c.req.json();

    // Validate input
    const inputSchema = z.object({
      systemPrompt: z.string(),
      userPrompt: z.string(),
      apiKey: z.string().optional(),
      baseUrl: z.string().optional(),
      model: z.string().optional(),
    });

    const { systemPrompt, userPrompt, apiKey, baseUrl, model } = inputSchema.parse(body);

    // Create OpenAI client (works with OpenAI-compatible APIs like Nvidia)
    const { default: OpenAI } = await import('openai');

    // Determine base URL based on common patterns or use provided baseUrl
    let finalBaseUrl = baseUrl;
    if (!finalBaseUrl) {
      if (apiKey?.startsWith('nvapi-')) {
        finalBaseUrl = 'https://integrate.api.nvidia.com/v1';
      } else {
        finalBaseUrl = process.env.AI_OPENAPI_URL || 'https://api.openai.com/v1';
      }
    }

    const openai = new OpenAI({
      apiKey: apiKey || process.env.OPENAI_API_KEY || process.env.AI_OPENAPI_KEY,
      baseURL: finalBaseUrl,
    });

    // Generate questions using Chat Completions
    const response = await openai.chat.completions.create({
      model: model || 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 4000,
    });

    const content = response.choices[0]?.message?.content || '';
    if (!content.trim()) {
      console.error('Empty AI response for soal-pilihan-ganda', {
        model: model || 'gpt-4o-mini',
        baseURL: finalBaseUrl,
        hasApiKey: Boolean(apiKey || process.env.OPENAI_API_KEY || process.env.AI_OPENAPI_KEY),
        response,
      });
      return c.json(
        {
          error: 'AI returned an empty response',
          details: {
            model: model || 'gpt-4o-mini',
            baseURL: finalBaseUrl,
          },
        },
        502
      );
    }

    return c.json({ content }, 200);

  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: 'Invalid input', details: error.errors }, 400);
    }
    console.error('Error generating questions:', error);
    return c.json({ error: 'Failed to generate questions: ' + (error as Error).message }, 500);
  }
});

export default router;
