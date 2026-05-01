/**
 * Alpine.js data module: Analisis CP & ATP.
 * Contains CP analysis form state, ATP generation logic, and helper functions.
 */
export function analisisCPData(): string {
  return `
              cpForm: {
                mapel: '',
                fase: '',
                nama_sekolah: '',
                nama_guru: '',
                nama_kepsek: '',
                tahun_ajaran: '2024/2025',
                mode: 'Tahunan',
                semester: '1',
                kurikulum: 'Merdeka',
                jp: '',
                jp_duration: '45'
              },
            elements: [{ name: '', cp: '', materi: '' }],
            isAnalyzing: false,
            isSaving: false,
            analisisResult: null,
            initAnalisisCP() {
              // Load from localStorage
              const savedForm = localStorage.getItem('cpForm');
              if (savedForm) {
                try {
                  const parsed = JSON.parse(savedForm);
                  Object.assign(this.cpForm, parsed);
                } catch(e) {}
              }
              const savedElements = localStorage.getItem('cpElements');
              if (savedElements) {
                try {
                  this.elements = JSON.parse(savedElements);
                } catch(e) {}
              }

              // Watch for changes (simple periodic save or manual save calls)
              this.$watch('cpForm', (val) => localStorage.setItem('cpForm', JSON.stringify(val)));
              this.$watch('elements', (val) => localStorage.setItem('cpElements', JSON.stringify(val)));
            },

            resetForm() {
              if (confirm('Apakah Anda yakin ingin mengosongkan seluruh formulir?')) {
                this.cpForm = {
                  mapel: '',
                  fase: '',
                  nama_sekolah: '',
                  nama_guru: '',
                  nama_kepsek: '',
                  tahun_ajaran: '2024/2025',
                  mode: 'Tahunan',
                  semester: '1',
                  kurikulum: 'Merdeka',
                  jp: '',
                  jp_duration: '45'
                };
                this.elements = [{ name: '', cp: '', materi: '' }];
                this.analisisResult = null;
                localStorage.removeItem('cpForm');
                localStorage.removeItem('cpElements');
              }
            },

            addElement() {
              this.elements.push({ name: '', cp: '', materi: '' });
            },

            removeElement(index) {
              this.elements.splice(index, 1);
              if (this.elements.length === 0) this.elements.push({ name: '', cp: '' });
            },

            async generateATP() {
              this.isAnalyzing = true;
              this.analisisResult = null;
              try {
                if (!this.settings.apiKey) {
                  alert('API Key OpenAI belum diatur. Silakan atur di menu Pengaturan.');
                  this.isAnalyzing = false;
                  return;
                }
                
                let elemenNames = [];
                let cpDetails = [];
                
                if (this.elements && this.elements.length) {
                  this.elements.forEach((item, idx) => {
                    if (item.name && item.name.trim()) {
                      elemenNames.push(item.name.trim());
                      cpDetails.push('Elemen ' + (idx + 1) + ': ' + item.name.trim() + '\\nCP: ' + (item.cp || '-') + '\\nMateri Utama (Opsional): ' + (item.materi || 'Generate otomatis berdasarkan CP'));
                    }
                  });
                }

                const elemenText = elemenNames.join(', ') || '-';
                const cpTextCombined = cpDetails.join('\\n\\n') || '-';

                let prompt = this.settings.promptAnalisisCP || '';
                prompt = prompt.replace('{{mapel}}', this.cpForm.mapel || '-');
                prompt = prompt.replace('{{fase}}', this.cpForm.fase || '-');
                prompt = prompt.replace('{{elemen}}', elemenText);
                prompt = prompt.replace('{{cp_text}}', cpTextCombined);
                prompt = prompt.replace('{{mode}}', this.cpForm.mode || 'Tahunan');
                prompt = prompt.replace('{{semester}}', this.cpForm.semester || '-');
                prompt = prompt.replace('{{jp}}', (this.cpForm.jp || '-') + ' JP');
                prompt = prompt.replace('{{jp_duration}}', (this.cpForm.jp_duration || '45') + ' menit');

                let response;
                if (this.settings.provider === 'google') {
                  const modelName = this.settings.selectedModel || 'gemini-1.5-flash';
                  const googleUrl = 'https://generativelanguage.googleapis.com/v1beta/models/' + modelName + ':generateContent?key=' + this.settings.apiKey;
                  response = await fetch(googleUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      contents: [{
                        parts: [{ text: prompt + '\\n\\nTolong berikan analisis CP dan ATP berdasarkan instruksi di atas. Berikan output HANYA dalam format JSON.' }]
                      }],
                      generationConfig: {
                        response_mime_type: 'application/json'
                      }
                    })
                  });
                } else {
                  const baseUrl = this.settings.baseUrl || 'https://api.openai.com/v1';
                  response = await fetch(baseUrl + '/chat/completions', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': 'Bearer ' + this.settings.apiKey
                    },
                    body: JSON.stringify({
                      model: this.settings.selectedModel || 'gpt-4o-mini',
                      messages: [
                        { role: 'system', content: prompt },
                        { role: 'user', content: 'Tolong berikan analisis CP dan ATP berdasarkan instruksi di atas. Berikan output HANYA dalam format JSON.' }
                      ],
                      response_format: { type: 'json_object' }
                    })
                  });
                }

                if (!response.ok) {
                  const errData = await response.json();
                  throw new Error(errData.error?.message || (this.settings.provider === 'google' ? errData[0]?.error?.message : 'Gagal memanggil API AI'));
                }

                const data = await response.json();
                let content = '';
                if (this.settings.provider === 'google') {
                  if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
                    console.error('Google AI Error Response:', data);
                    throw new Error('Respon dari Google AI kosong atau diblokir.');
                  }
                  content = data.candidates[0].content.parts[0].text;
                } else {
                  content = data.choices[0].message.content;
                }
                
                console.log('AI Response Content:', content);
                
                // Robust JSON extraction
                try {
                  const firstBrace = content.indexOf('{');
                  const lastBrace = content.lastIndexOf('}');
                  if (firstBrace !== -1 && lastBrace !== -1) {
                    const jsonStr = content.substring(firstBrace, lastBrace + 1);
                    const rawResult = JSON.parse(jsonStr);
                    console.log('Raw Parsed Result:', rawResult);

                    // Normalization logic
                    let normalized = {
                      skor_keselarasan: rawResult.skor_keselarasan || rawResult.skor || 100,
                      atp_table: []
                    };

                    // Try to find the array of ATP items
                    let sourceArray = [];
                    if (Array.isArray(rawResult.atp_table)) sourceArray = rawResult.atp_table;
                    else if (Array.isArray(rawResult.saran_tp)) sourceArray = rawResult.saran_tp;
                    else if (Array.isArray(rawResult.atp)) sourceArray = rawResult.atp;
                    else {
                      const firstArrayKey = Object.keys(rawResult).find(key => Array.isArray(rawResult[key]));
                      if (firstArrayKey) sourceArray = rawResult[firstArrayKey];
                    }

                    // Transform sourceArray into normalized.atp_table
                    const firstElementName = elemenNames[0] || 'Umum';
                    normalized.atp_table = sourceArray.map((item, idx) => {
                      if (typeof item === 'string') {
                        // Coba ekstrak materi jika ada pemisah ":"
                        let extractedMateri = 'Materi Belum Terdeteksi';
                        let tpText = item;
                        
                        if (item.includes(':')) {
                          const parts = item.split(':');
                          if (parts.length > 1 && parts[0].length < 40) {
                            extractedMateri = parts[0].trim();
                            tpText = parts.slice(1).join(':').trim();
                          }
                        }

                        return {
                          semester: idx < (sourceArray.length / 2) ? '1' : '2',
                          elemen: firstElementName,
                          taksonomi: 'C3 - Menerapkan',
                          tp: tpText,
                          materi: extractedMateri,
                          jp: '12',
                          p5: '',
                          catatan_ai: 'Format respons AI tidak standar.'
                        };
                      }
                      if (typeof item === 'object' && item !== null) {
                        return {
                          semester: item.semester || (idx < (sourceArray.length / 2) ? '1' : '2'),
                          elemen: item.elemen || firstElementName,
                          taksonomi: item.taksonomi || item.bloom || item.level_kognitif || 'C3 - Menerapkan',
                          tp: item.tp || item.tujuan_pembelajaran || item.tujuan || '',
                          materi: item.materi || item.topik || item.materi_esensial || item.pokok_bahasan || 'Materi Belum Terisi',
                          jp: item.jp || item.jam_pelajaran || '12',
                          p5: item.p5 || item.dimensi_p5 || '',
                          catatan_ai: item.catatan_ai || item.insight || item.keterangan || ''
                        };
                      }
                      return item;
                    });

                    this.analisisResult = normalized;
                    console.log('Normalized Result:', this.analisisResult);
                  } else {
                    throw new Error('Tidak dapat menemukan format data JSON dalam respon AI.');
                  }
                } catch (e) {
                  console.error('JSON Parse Error:', e);
                  throw new Error('Format respon AI tidak valid atau tidak lengkap.');
                }
                
              } catch (error) {
                console.error('Error generating ATP:', error);
                alert('Gagal menghasilkan analisis: ' + (error instanceof Error ? error.message : 'Unknown error'));
              } finally {
                this.isAnalyzing = false;
              }
            },

            async saveToDatabase() {
              if (!this.analisisResult) return;
              this.isSaving = true;
              try {
                const token = localStorage.getItem('token');
                if (!token) {
                  alert('Sesi Anda telah berakhir. Silakan login kembali.');
                  return;
                }

                // Decode token to get userId (simple decode as we don't have a library)
                const payloadBase64 = token.split('.')[1];
                const payload = JSON.parse(atob(payloadBase64));
                const userId = payload.id;

                const response = await fetch('/api/documents/save-analisis-cp', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                  },
                  body: JSON.stringify({
                    userId: userId,
                    title: 'Analisis CP & ATP: ' + (this.cpForm.mapel || 'Tanpa Judul'),
                    content: JSON.stringify(this.analisisResult),
                    metadata: {
                      ...this.cpForm,
                      elements: this.elements
                    }
                  })
                });

                if (!response.ok) throw new Error('Gagal menyimpan ke database');
                
                alert('Analisis berhasil disimpan ke database!');
              } catch (error) {
                console.error('Save error:', error);
                alert('Gagal menyimpan: ' + error.message);
              } finally {
                this.isSaving = false;
              }
            },

            exportToPDF() {
              const element = document.getElementById('export-container');
              if (!element) return;
              
              const opt = {
                margin: 10,
                filename: 'Analisis_CP_ATP_' + (this.cpForm.mapel || 'Dokumen') + '.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
              };
              
              // @ts-ignore
              html2pdf().set(opt).from(element).save();
            },

            exportToWord() {
              const element = document.getElementById('export-container');
              if (!element) return;

              const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML to Word</title></head><body>";
              const footer = "</body></html>";
              const sourceHTML = header + element.innerHTML + footer;
              
              const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
              const fileDownload = document.createElement("a");
              document.body.appendChild(fileDownload);
              fileDownload.href = source;
              fileDownload.download = 'Analisis_CP_ATP_' + (this.cpForm.mapel || 'Dokumen') + '.doc';
              fileDownload.click();
              document.body.removeChild(fileDownload);
            },

  `;
}
