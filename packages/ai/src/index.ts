import OpenAI from 'openai';
import { AIGeneratorOutput } from '@guru-pintar/types';
import { searchKurikulumMerdeka, formatSearchContext } from './duckduckgo';

export interface AIConfig {
  apiKey?: string;
  baseUrl?: string;
}

function createOpenAIClient(config?: AIConfig): OpenAI {
  return new OpenAI({
    apiKey: config?.apiKey ?? process.env.OPENAI_API_KEY ?? process.env.AI_OPENAPI_KEY,
    baseURL: config?.baseUrl ?? process.env.AI_OPENAPI_URL,
  });
}

export async function generateProta(
  input: {
    schoolName?: string;
    teacherName?: string;
    subject: string;
    grade: string;
    year?: string;
    cp?: string;
    semester1?: boolean;
    semester2?: boolean;
  },
  config?: AIConfig
): Promise<AIGeneratorOutput> {
  const openai = createOpenAIClient(config);

  const phaseMatch = input.grade.match(/[A-F]$/);
  const phase = phaseMatch ? phaseMatch[0] : 'E';

  let searchContext = '';
  try {
    const searchResults = await searchKurikulumMerdeka(input.subject, phase, { maxResults: 5 });
    searchContext = formatSearchContext(searchResults);
  } catch (err) {
    console.warn('Search failed:', err);
  }

  const semesters = [];
  if (input.semester1) semesters.push('Semester 1');
  if (input.semester2) semesters.push('Semester 2');
  const semesterText = semesters.length > 0 ? semesters.join(' dan ') : 'Seluruh Tahun';

  let cpText = '';
  if (input.cp) {
    cpText = '\n## Capaian Pembelajaran:\n' + input.cp.split('\n').filter(l => l.trim()).map((cp, i) => (i+1) + '. ' + cp).join('\n');
  }

  const prompt = 'Buatkan Program Tahunan (PROTA) untuk ' + input.subject + ' kelas ' + input.grade + ' semester ' + semesterText + '. ' + cpText + '\n\n' + (input.schoolName ? 'Sekolah: ' + input.schoolName : '') + (input.teacherName ? 'Guru: ' + input.teacherName : '') + '\n\n' + searchContext + '\n\n' +
    'Format output: Tabel materi dengan alokasi waktu per bulan, dengan pembagian Semester 1 dan Semester 2.';

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    max_tokens: 4000,
  });

  const content = response.choices[0].message.content || '';

  return {
    title: 'PROTA - ' + input.subject + ' ' + input.grade,
    description: 'Program Tahunan untuk ' + input.subject,
    content,
    metadata: {
      type: 'prota',
      subject: input.subject,
      grade: input.grade,
      year: input.year || String(new Date().getFullYear()),
      cp: input.cp,
      semester: semesters,
    },
  };
}

export async function generateProsem(
  input: {
    schoolName?: string;
    teacherName?: string;
    subject: string;
    grade: string;
    semester: number;
  },
  config?: AIConfig
): Promise<AIGeneratorOutput> {
  const openai = createOpenAIClient(config);
  const prompt = 'Generate PROSEM for ' + input.subject + ' grade ' + input.grade + ' semester ' + input.semester;
  const response = await openai.chat.completions.create({ model: 'gpt-4', messages: [{ role: 'user', content: prompt }] });
  return {
    title: 'PROSEM - ' + input.subject,
    description: 'Program Semester',
    content: response.choices[0].message.content || '',
    metadata: { type: 'prosem', ...input },
  };
}

export async function generateModulAjar(
  input: {
    schoolName?: string;
    teacherName?: string;
    subject: string;
    grade: string;
    topic: string;
    duration: string;
  },
  config?: AIConfig
): Promise<AIGeneratorOutput> {
  const openai = createOpenAIClient(config);
  const prompt = 'Generate Modul Ajar for ' + input.topic;
  const response = await openai.chat.completions.create({ model: 'gpt-4', messages: [{ role: 'user', content: prompt }] });
  return {
    title: 'Modul Ajar - ' + input.topic,
    description: 'Teaching Module',
    content: response.choices[0].message.content || '',
    metadata: { type: 'modul_ajar', ...input },
  };
}

export async function generateKKTP(
  input: {
    schoolName?: string;
    teacherName?: string;
    subject: string;
    grade: string;
  },
  config?: AIConfig
): Promise<AIGeneratorOutput> {
  const openai = createOpenAIClient(config);
  const prompt = 'Generate KKTP for ' + input.subject;
  const response = await openai.chat.completions.create({ model: 'gpt-4', messages: [{ role: 'user', content: prompt }] });
  return {
    title: 'KKTP - ' + input.subject,
    description: 'Kriteria Ketuntasan',
    content: response.choices[0].message.content || '',
    metadata: { type: 'kktp', ...input },
  };
}
