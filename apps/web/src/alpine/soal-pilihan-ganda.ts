/**
 * Alpine.js data module: Soal Pilihan Ganda Generator
 * Generates multiple choice questions using AI with pedagogy criteria
 */
export function soalPilihanGandaData(): string {
  return `
            // Form data model
            soalPGForm: {
              topik: '',
              cp: '',
              levelBloom: 'C3',
              konteksIndustri: '',
              jumlahSoal: 5,
            },

            // UI state
            isGeneratingSoalPG: false,
            generatedSoalPG: [],

            // System prompt for AI as professional item writer
            systemPromptSoalPG: \`Anda adalah pakar pembuat soal ujian (Item Writer) untuk tingkat SMK Jurusan PPLG (Pengembangan Perangkat Lunak dan Gim).
Tugas Anda adalah membuat soal pilihan ganda yang berkualitas tinggi, valid secara pedagogi, dan relevan dengan industri IT.

Kriteria Kualitas Soal:
1. Validitas: Soal harus sesuai dengan Capaian Pembelajaran (CP).
2. Pengecoh (Distractors): Pilihan jawaban salah harus masuk akal (plausible), tidak konyol, dan mencerminkan kesalahan umum siswa (misalnya salah logika looping atau typo sintaks).
3. Level Kognitif: Fokus pada C3 (Aplikasi), C4 (Analisis), dan C5 (Evaluasi) sesuai taksonomi Bloom.
4. Kode Program: Jika soal pemrograman, gunakan potongan kode yang bersih dan gunakan standar industri (misal: camelCase, indentasi benar).
5. Bahasa: Gunakan Bahasa Indonesia yang baku dan teknis namun mudah dipahami siswa.\`,

            // User prompt template
            userPromptSoalPG(topik, cp, levelBloom, konteksIndustri, jumlahSoal) {
              return \`Buatkan soal pilihan ganda dengan detail sebagai berikut:

Topik: \${topik}
Capaian Pembelajaran (CP): \${cp}
Level Kognitif: \${levelBloom}
Konteks/Studi Kasus: \${konteksIndustri}
Jumlah Soal: \${jumlahSoal}
Jumlah Opsi: 5 (A, B, C, D, E)

INSTRUKSI PENTING:
- Berikan output HANYA dalam format JSON array
- JANGAN tambahkan teks apapun di luar JSON
- JANGAN tambahkan markdown code blocks
- JANGAN tambahkan penjelasan atau komentar
- Format harus valid JSON yang bisa diparse langsung

Struktur JSON yang diharapkan:
[
  {
    "nomor": 1,
    "pertanyaan": "Apa itu variable dalam pemrograman?",
    "kode_snippet": "",
    "opsi": {
      "A": "Tempat menyimpan data",
      "B": "Fungsi matematika",
      "C": "Tipe data",
      "D": "Operator",
      "E": "Keyword"
    },
    "jawaban_benar": "A",
    "penjelasan": "Variable adalah tempat untuk menyimpan data dalam memori komputer."
  }
]

Output HANYA JSON array, tidak ada yang lain.\`;
            },

            // Submit form to generate questions
            async submitSoalPilihanGanda() {
              if (!this.soalPGForm.topik || !this.soalPGForm.cp || !this.soalPGForm.jumlahSoal) {
                alert('Mohon lengkapi data soal!');
                return;
              }

              this.isGeneratingSoalPG = true;
              this.generatedSoalPG = [];

              try {
                const prompt = this.userPromptSoalPG(
                  this.soalPGForm.topik,
                  this.soalPGForm.cp,
                  this.soalPGForm.levelBloom,
                  this.soalPGForm.konteksIndustri,
                  this.soalPGForm.jumlahSoal
                );

                const response = await this.authFetch('/api/soal-pilihan-ganda/generate', {
                  method: 'POST',
                  body: JSON.stringify({
                    systemPrompt: this.systemPromptSoalPG,
                    userPrompt: prompt,
                    apiKey: this.settings.apiKey,
                    baseUrl: this.settings.baseUrl,
                    model: this.settings.selectedModel
                  }),
                });

                if (response.ok) {
                  const result = await response.json();
                  const rawContent = (result.content || '').trim();
                  const normalizedContent = rawContent
                    .replace(/\\\$/g, '$')
                    .replace(/\\_/g, '_');
                  console.log('AI Raw Response:', rawContent);
                  if (!normalizedContent) {
                    throw new Error('Respon AI kosong. Cek API key, base URL, dan model yang dipakai.');
                  }
                  // Parse JSON from AI response
                  let questions = [];
                  try {
                    // First try to parse the entire response as JSON
                    questions = JSON.parse(normalizedContent);
                  } catch (e) {
                    // If that fails, try to extract JSON array from the response
                    try {
                      // Find the outermost JSON array boundaries and parse that slice
                      const firstBracket = normalizedContent.indexOf('[');
                      const lastBracket = normalizedContent.lastIndexOf(']');
                      if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
                        const arraySlice = normalizedContent.slice(firstBracket, lastBracket + 1);
                        questions = JSON.parse(arraySlice);
                      } else {
                        // Try to find any JSON object/array in the response
                        const anyJsonMatch = normalizedContent.match(/(\[[\s\S]*\]|\{[\s\S]*\})/);
                        if (anyJsonMatch) {
                          questions = JSON.parse(anyJsonMatch[0]);
                          // If it's a single object, wrap it in an array
                          if (!Array.isArray(questions)) {
                            questions = [questions];
                          }
                        } else {
                          throw new Error('No JSON found in response');
                        }
                      }
                    } catch (e2) {
                      console.error('AI Response:', normalizedContent);
                      console.error('Parse error:', e2);
                      console.error('Response ends with:', normalizedContent.slice(-40));
                      throw new Error('Gagal memparse jawaban AI. Pastikan format JSON benar. Response: ' + normalizedContent.substring(0, 200) + '...');
                    }
                  }

                  // Process questions and add default properties
                  this.generatedSoalPG = questions.map((q, idx) => ({
                    nomor: q.nomor || idx + 1,
                    pertanyaan: q.pertanyaan || '',
                    kode_snippet: q.kode_snippet || '',
                    opsi: q.opsi || { A: '', B: '', C: '', D: '', E: '' },
                    jawaban_benar: q.jawaban_benar || '',
                    penjelasan: q.penjelasan || '',
                    selectedAnswer: '',
                    showExplanation: false,
                  }));

                  // Save to localStorage
                  this.saveSoalPilihanGanda();
                } else {
                  const error = await response.json();
                  alert('Error: ' + (error.error || 'Gagal membuat soal'));
                }
              } catch (e) {
                console.error(e);
                alert('Gagal membuat soal: ' + e.message);
              } finally {
                this.isGeneratingSoalPG = false;
              }
            },

            // Save form data to localStorage (autosave)
            saveFormData() {
              const data = {
                topik: this.soalPGForm.topik,
                cp: this.soalPGForm.cp,
                levelBloom: this.soalPGForm.levelBloom,
                konteksIndustri: this.soalPGForm.konteksIndustri,
                jumlahSoal: this.soalPGForm.jumlahSoal,
                timestamp: new Date().toISOString(),
              };
              localStorage.setItem('soal_pilihan_ganda_form', JSON.stringify(data));
            },

            // Save questions to localStorage
            saveSoalPilihanGanda() {
              const data = {
                topik: this.soalPGForm.topik,
                cp: this.soalPGForm.cp,
                levelBloom: this.soalPGForm.levelBloom,
                konteksIndustri: this.soalPGForm.konteksIndustri,
                questions: this.generatedSoalPG,
                timestamp: new Date().toISOString(),
              };
              localStorage.setItem('soal_pilihan_ganda', JSON.stringify(data));
            },

            // Reset form to default values and clear saved form data
            resetFormData() {
              this.soalPGForm.topik = '';
              this.soalPGForm.cp = '';
              this.soalPGForm.levelBloom = 'C3';
              this.soalPGForm.konteksIndustri = '';
              this.soalPGForm.jumlahSoal = 5;
              this.generatedSoalPG = [];
              // Clear saved form data from localStorage
              localStorage.removeItem('soal_pilihan_ganda_form');
              // Optionally clear full data too if user wants fresh start
              localStorage.removeItem('soal_pilihan_ganda');
            },

            // Load saved questions from localStorage
            loadSoalPilihanGanda() {
              // Load form data first
              const formData = localStorage.getItem('soal_pilihan_ganda_form');
              if (formData) {
                try {
                  const data = JSON.parse(formData);
                  this.soalPGForm.topik = data.topik || '';
                  this.soalPGForm.cp = data.cp || '';
                  this.soalPGForm.levelBloom = data.levelBloom || 'C3';
                  this.soalPGForm.konteksIndustri = data.konteksIndustri || '';
                  this.soalPGForm.jumlahSoal = data.jumlahSoal || 5;
                } catch (e) {
                  console.error('Failed to load form data:', e);
                }
              }

              // Load full data if exists (includes questions and form)
              const fullData = localStorage.getItem('soal_pilihan_ganda');
              if (fullData) {
                try {
                  const data = JSON.parse(fullData);
                  this.soalPGForm.topik = data.topik || '';
                  this.soalPGForm.cp = data.cp || '';
                  this.soalPGForm.levelBloom = data.levelBloom || 'C3';
                  this.soalPGForm.konteksIndustri = data.konteksIndustri || '';
                  this.generatedSoalPG = data.questions || [];
                } catch (e) {
                  console.error('Failed to load saved questions:', e);
                }
              }
            },
  `;
}
