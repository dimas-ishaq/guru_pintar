import { Hono } from 'hono';
import { z } from 'zod';

const router = new Hono();

/**
 * POST /api/soal-essay/generate
 * Generate essay questions using AI
 */
router.post('/generate', async (c) => {
  try {
    const body = await c.req.json();

    // Validate input
    const inputSchema = z.object({
      subject: z.string(),
      topic: z.string(),
      learningGoal: z.string(),
      stimulusType: z.enum(['teks', 'skenario', 'data', 'kasus']),
      questionLevel: z.enum(['L2', 'L3']),
      totalQuestions: z.number().min(1).max(5),
      apiKey: z.string().optional(),
      baseUrl: z.string().optional(),
    });

    const { subject, topic, learningGoal, stimulusType, questionLevel, totalQuestions, apiKey, baseUrl } = inputSchema.parse(body);

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

    // System prompt for essay generation
    const systemPrompt = `Anda adalah Spesialis Evaluasi Pendidikan dan Konsultan Kurikulum Merdeka di Indonesia.
Keahlian Anda adalah menyusun soal Essay yang menguji kemampuan berpikir tingkat tinggi (HOTS).

KRITERIA SOAL ESSAY BERKUALITAS:
1. BERBASIS STIMULUS: Soal wajib memiliki stimulus berupa teks, skenario, kasus, atau data. Siswa harus menganalisis stimulus tersebut untuk menjawab.
2. LEVEL KOGNITIF: Fokus pada level L2 (Aplikasi) atau L3 (Analisis, Evaluasi, Kreasi).
3. BAHASA: Gunakan Bahasa Indonesia yang baku (EYD) namun tetap komunikatif bagi level sekolah yang bersangkutan.
4. STRUKTUR LENGKAP: Setiap soal harus disertai dengan Kunci Jawaban yang ideal dan Rubrik Penilaian (skor 1-4) untuk menjaga objektivitas penilaian guru.`;

    // User prompt
    const userPrompt = `Buatkan ${totalQuestions} soal essay ${questionLevel} untuk:
- Mata Pelajaran: ${subject}
- Topik: ${topic}
- Tujuan Pembelajaran: ${learningGoal}
- Jenis Stimulus: ${stimulusType}

Format output JSON TANPA teks lain:
[
  {
    "nomor": 1,
    "stimulus": "... (teks/kasus/data/skenario yang relevan) ...",
    "pertanyaan": "...",
    "kunci_jawaban": "... jawaban ideal yang lengkap ...",
    "rubrik": {
      "4": "... (kriteria sangat baik) ...",
      "3": "... (kriteria baik) ...",
      "2": "... (kriteria cukup) ...",
      "1": "... (kriteria kurang) ..."
    }
  }
]

PENTING: Berikan HANYA array JSON tanpa teks pembuka atau penutup.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 3500,
    });

    const content = response.choices[0]?.message?.content || '';
    if (!content.trim()) {
      console.error('Empty AI response for soal-essay', {
        model: 'gpt-4',
        baseURL: finalBaseUrl,
        hasApiKey: Boolean(apiKey || process.env.OPENAI_API_KEY || process.env.AI_OPENAPI_KEY),
        response,
      });
      return c.json(
        {
          error: 'AI returned an empty response',
          details: {
            model: 'gpt-4',
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
    console.error('Error generating essay questions:', error);
    return c.json({ error: 'Failed to generate essay questions: ' + (error as Error).message }, 500);
  }
});

export default router;
