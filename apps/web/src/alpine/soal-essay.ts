/**
 * Alpine.js data module: Soal Essay Generator
 * Generates essay questions with HOTS focus using AI
 */
export function soalEssayData(): string {
  return `
            // Form data model
            essayForm: {
              subject: '',
              topic: '',
              learningGoal: '',
              stimulusType: 'teks',
              questionLevel: 'L3',
              totalQuestions: 3,
            },

            // UI state
            isGeneratingEssay: false,
            generatedEssay: [],

            // Submit form to generate essay questions
            async submitSoalEssay() {
              if (!this.essayForm.subject || !this.essayForm.topic || !this.essayForm.learningGoal) {
                alert('Mohon lengkapi data soal!');
                return;
              }

              this.isGeneratingEssay = true;
              this.generatedEssay = [];

              try {
                const response = await fetch('/api/soal-essay/generate', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    ...this.essayForm,
                    apiKey: this.settings.apiKey,
                    baseUrl: this.settings.baseUrl
                  }),
                });

                if (response.ok) {
                  const result = await response.json();
                  // Parse JSON response
                  let questions = [];
                  try {
                    questions = JSON.parse(result.content);
                  } catch (e) {
                    throw new Error('Gagal memparse jawaban AI. Pastikan format JSON benar.');
                  }

                  // Process and enhance questions
                  this.generatedEssay = questions.map((q, idx) => ({
                    nomor: q.nomor || idx + 1,
                    stimulus: q.stimulus || '',
                    pertanyaan: q.pertanyaan || '',
                    kunci_jawaban: q.kunci_jawaban || '',
                    rubrik: q.rubrik || { '4': 'Baik sekali', '3': 'Baik', '2': 'Cukup', '1': 'Kurang' },
                  }));

                  // Save to localStorage
                  this.saveSoalEssay();
                } else {
                  const error = await response.json();
                  alert('Error: ' + (error.error || 'Gagal membuat soal'));
                }
              } catch (e) {
                console.error(e);
                alert('Gagal membuat soal: ' + e.message);
              } finally {
                this.isGeneratingEssay = false;
              }
            },

            // Save questions to localStorage
            saveSoalEssay() {
              const data = {
                subject: this.essayForm.subject,
                topic: this.essayForm.topic,
                learningGoal: this.essayForm.learningGoal,
                stimulusType: this.essayForm.stimulusType,
                questionLevel: this.essayForm.questionLevel,
                questions: this.generatedEssay,
                timestamp: new Date().toISOString(),
              };
              localStorage.setItem('soal_essay', JSON.stringify(data));
            },

            // Load saved questions from localStorage
            loadSoalEssay() {
              const saved = localStorage.getItem('soal_essay');
              if (saved) {
                try {
                  const data = JSON.parse(saved);
                  this.essayForm.subject = data.subject || '';
                  this.essayForm.topic = data.topic || '';
                  this.essayForm.learningGoal = data.learningGoal || '';
                  this.essayForm.stimulusType = data.stimulusType || 'teks';
                  this.essayForm.questionLevel = data.questionLevel || 'L3';
                  this.generatedEssay = data.questions || [];
                } catch (e) {
                  console.error('Failed to load saved questions:', e);
                }
              }
            },
  `;
}
