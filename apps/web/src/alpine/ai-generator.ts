/**
 * Alpine.js data module: AI Generator (PROTA, PROSEM, KKTP, Modul Ajar).
 * Contains form data, generation state, and submission logic.
 */
export function aiGeneratorData(): string {
  return `
            isGenerating: false,
            lastGenerated: null,
            formData: {
              schoolName: '',
              teacherName: '',
              subject: '',
              grade: '',
              kurikulum: 'Merdeka',
              academicYear: '2024/2025',
              topic: '',
              objectives: '',
              criteria: '',
              cp: '',
              atp: '',
              learningStyle: 'visual',
              focus: 'konsep',
              difficulty: 'menengah',
              semester1: true,
              semester2: true,
            },

            async submitForm() {
              this.isGenerating = true;
              this.lastGenerated = null;

              const typeMap = {
                'ai-prota': 'prota',
                'ai-prosem': 'prosem',
                'ai-modul': 'modul',
                'ai-kktp': 'kktp'
              };
              const type = typeMap[this.currentView];

              const endpoints = {
                prota: '/api/documents/generate-prota',
                prosem: '/api/documents/generate-prosem',
                modul: '/api/documents/generate-modul-ajar',
                kktp: '/api/documents/generate-kktp',
              };
              try {
                const response = await fetch(endpoints[type], {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    ...this.formData,
                    type,
                    apiKey: this.settings.apiKey,
                    baseUrl: this.settings.baseUrl
                  }),
                });
                if (response.ok) {
                   const result = await response.json();
                   this.lastGenerated = '<h2 class="text-xl font-bold mb-4">' + result.title + '</h2>' +
                     '<div class="prose max-w-none dark:prose-invert">' +
                        '<div class="whitespace-pre-wrap">' + result.content + '</div>' +
                     '</div>';
                   await this.loadDocuments();
                } else {
                  const error = await response.json();
                  alert('Error: ' + (error.error || 'Gagal menghasilkan konten'));
                }
              } catch (e) {
                console.error(e);
                alert('Gagal menghasilkan konten: ' + e.message);
              }
              finally { this.isGenerating = false; }
            },
  `;
}
