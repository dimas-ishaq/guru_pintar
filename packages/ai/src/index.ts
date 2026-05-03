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

export async function generateLKPD(
  input: {
    schoolName?: string;
    teacherName?: string;
    subject: string;
    grade: string;
    topic: string;
    cp?: string;
    activityType?: string;
    meetings?: string;
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

  let cpText = '';
  if (input.cp) {
    cpText = '\n## Capaian Pembelajaran:\n' + input.cp;
  }

  const activityTypeText = input.activityType === 'kelompok' ? 'Kegiatan Kelompok' : 'Kegiatan Individu';
  const meetingsText = input.meetings || '1';

  const prompt = `Buatkan Lembar Kerja Peserta Didik (LKPD) untuk:

Mata Pelajaran: ${input.subject}
Kelas/Fase: ${input.grade}
Topik: ${input.topic}
Jenis Kegiatan: ${activityTypeText}
Jumlah Pertemuan: ${meetingsText}
${cpText}

${searchContext}

Format LKPD yang dihasilkan harus mencakup:
1. **Identitas LKPD** (Nama Sekolah, Mata Pelajaran, Kelas, Topik, Alokasi Waktu)
2. **Kompetensi Awal** (Prasyarat yang harus dimiliki siswa)
3. **Tujuan Pembelajaran** (Tujuan yang ingin dicapai setelah mengerjakan LKPD)
4. **Petunjuk Umum** (Langkah-langkah pengerjaan LKPD)
5. **Kegiatan Pembelajaran**:
   - Kegiatan Pendahuluan (Apersepsi dan motivasi)
   - Kegiatan Inti (Langkah-langkah kegiatan ${activityTypeText.toLowerCase()})
   - Kegiatan Penutup (Refleksi dan penyimpulan)
6. **Lembar Kerja** (Soal/tugas yang harus dikerjakan siswa)
7. **Penilaian** (Rubrik atau kriteria penilaian)

Pastikan LKPD sesuai dengan Kurikulum Merdeka dan mengedepankan pembelajaran berbasis proyek/penemuan.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    max_tokens: 4000,
  });

  const content = response.choices[0].message.content || '';

  return {
    title: 'LKPD - ' + input.topic,
    description: 'Lembar Kerja Peserta Didik untuk ' + input.topic,
    content,
    metadata: {
      type: 'lkpd',
      subject: input.subject,
      grade: input.grade,
      topic: input.topic,
      cp: input.cp,
      activityType: input.activityType,
      meetings: input.meetings,
    },
  };
}

export async function generateEssay(
  input: {
    subject: string;
    topic: string;
    learningGoal: string;
    stimulusType: string;
    questionLevel: string;
    totalQuestions: number;
  },
  config?: AIConfig
): Promise<AIGeneratorOutput> {
  const openai = createOpenAIClient(config);

  const prompt = `Anda adalah pakar pembuat soal essay untuk SMK PPLG, dengan fokus HOTS. Buat ${input.totalQuestions} soal essay ${input.questionLevel} yang memiliki stimulus (${input.stimulusType}) dan menguji kemampuan berpikir tingkat tinggi.

Mata Pelajaran: ${input.subject}
Topik: ${input.topic}
Tujuan Pembelajaran: ${input.learningGoal}

Format output JSON TANPA teks lain:
[
  {
    "nomor": 1,
    "stimulus": "... (teks/kasus/data) ...",
    "pertanyaan": "...",
    "kunci_jawaban": "... jawaban ideal ...",
    "rubrik": {
      "4": "... (kriteria skor 4) ...",
      "3": "...",
      "2": "...",
      "1": "..."
    }
  }
]

Pastikan bahasa Indonesia baku, stimulus relevan, dan rubrik menilai pada skala 1-4.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    max_tokens: 3500,
  });

  const content = response.choices[0]?.message?.content || '';

  return {
    title: 'Soal Essay - ' + input.topic,
    description: 'Soal Essay untuk ' + input.subject,
    content,
    metadata: {
      type: 'soal_essay',
      subject: input.subject,
      topic: input.topic,
      learningGoal: input.learningGoal,
      stimulusType: input.stimulusType,
      questionLevel: input.questionLevel,
      totalQuestions: input.totalQuestions,
    },
  };
}
