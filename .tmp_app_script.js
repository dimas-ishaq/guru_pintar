
        window.app = function app() {
          return {
            currentView: 'dashboard',
            darkMode: false,
            sidebarCollapsed: false,
            groupState: {
              ai: true,
              management: true
            },

            toggleGroup(id) {
              this.groupState[id] = !this.groupState[id];
            },

            toggleDarkMode() {
              this.darkMode = !this.darkMode;
              document.documentElement.classList.toggle('dark', this.darkMode);
              localStorage.setItem('darkMode', this.darkMode ? 'dark' : 'light');
            },

            navItems: [
              { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
              {
                id: 'soal',
                label: 'Bank Soal',
                icon: 'quiz',
                isGroup: true,
                children: [
                  { id: 'soal-essay', label: 'Soal Essay', icon: 'edit_note' },
                  { id: 'soal-pilihan-ganda', label: 'Pilihan Ganda', icon: 'list_alt' },
                ]
              },
              {
                id: 'ai',
                label: 'Generator AI',
                icon: 'auto_awesome',
                isGroup: true,
                children: [
                  { id: 'analisis-cp', label: 'Analisis CP & ATP', icon: 'psychology' },
                  { id: 'ai-prota', label: 'PROTA', icon: 'description' },
                  { id: 'ai-prosem', label: 'PROSEM', icon: 'calendar_today' },
                  { id: 'ai-kktp', label: 'KKTP', icon: 'check_circle' },
                  { id: 'ai-modul', label: 'Modul Ajar', icon: 'school' },
                                    { id: 'ai-lkpd', label: 'LKPD', icon: 'assignment' },
                                  ]
              },
              { id: 'attendance', label: 'Kehadiran', icon: 'fact_check' },
              { id: 'profile', label: 'Profil', icon: 'person' },
              {
                id: 'management',
                label: 'Manajemen Data',
                icon: 'folder_managed',
                isGroup: true,
                children: [
                  { id: 'jurusan', label: 'Jurusan', icon: 'school' },
                  { id: 'kelas', label: 'Kelas', icon: 'class' },
                  { id: 'mata-pelajaran', label: 'Mata Pelajaran', icon: 'school' },
                  { id: 'data-siswa', label: 'Data Siswa', icon: 'people' },
                ]
              },
              { id: 'account', label: 'Manajemen Akun', icon: 'people' },
              { id: 'settings', label: 'Pengaturan', icon: 'settings' },
            ],

            // ── Dashboard ──────────────────────────
            
            documents: [],

            async loadDocuments() {
                          try {
                            const token = localStorage.getItem('token');
                            if (!token) { this.logout(); return; }
                            const response = await fetch('/api/documents/list/1', {
                              headers: { 'Authorization': 'Bearer ' + token }
                            });
                            if (response.status === 401) { alert('Sesi berakhir.'); this.logout(); return; }
                            const data = await response.json();
                            this.documents = data.documents || [];
                          } catch (e) { console.error(e); }
                        },
  

            // ── Analisis CP & ATP ───────────────────
            
              cpForm: {
                              mapel: '',
                              fase: '',
                              jurusan: '',
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
                                  jurusan: '',
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
                      cpDetails.push('Elemen ' + (idx + 1) + ': ' + item.name.trim() + '\nCP: ' + (item.cp || '-') + '\nMateri Utama (Opsional): ' + (item.materi || 'Generate otomatis berdasarkan CP'));
                    }
                  });
                }

                const elemenText = elemenNames.join(', ') || '-';
                const cpTextCombined = cpDetails.join('\n\n') || '-';

                let prompt = this.settings.promptAnalisisCP || '';
                                prompt = prompt.replace('{{mapel}}', this.cpForm.mapel || '-');
                                prompt = prompt.replace('{{fase}}', this.cpForm.fase || '-');
                                prompt = prompt.replace('{{jurusan}}', this.cpForm.jurusan || '-');
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
                        parts: [{ text: prompt + '\n\nTolong berikan analisis CP dan ATP berdasarkan instruksi di atas. Berikan output HANYA dalam format JSON.' }]
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
                                      var element = document.getElementById('export-container');
                                      if (!element) return;

                                      // Inject inline styles for clean table rendering in PDF
                                      var styleEl = document.createElement('style');
                                      styleEl.innerHTML = 'table { border-collapse: collapse; width: 100%; } th, td { border: 1px solid #333; padding: 6px; font-size: 9pt; } th { background: #e8e8e8; font-weight: bold; }';
                                      element.appendChild(styleEl);

                                      var opt = {
                                        margin: 8,
                                        filename: 'Analisis_CP_ATP_' + (this.cpForm && this.cpForm.mapel ? this.cpForm.mapel : 'Dokumen') + '.pdf',
                                        image: { type: 'jpeg', quality: 0.95 },
                                        html2canvas: { scale: 2, useCORS: true },
                                        jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
                                      };

                                      // @ts-ignore
                                      html2pdf().set(opt).from(element).save().finally(function() {
                                        element.removeChild(styleEl);
                                      });
                                    },

            exportToWord() {
                                      const rows = this.analisisResult && this.analisisResult.atp_table ? this.analisisResult.atp_table : [];
                                      if (!rows || rows.length === 0) {
                                        alert('Tidak ada data ATP untuk diekspor.');
                                        return;
                                      }

                                      // Escape XML special characters
                                      var esc = function(s) {
                                        return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
                                      };

                                      // Build Word document XML
                                      var tahunAjaran = this.cpForm && this.cpForm.tahun_ajaran ? this.cpForm.tahun_ajaran : '-';
                                      var namaSekolah = this.cpForm && this.cpForm.nama_sekolah ? this.cpForm.nama_sekolah : '-';
                                      var namaGuru = this.cpForm && this.cpForm.nama_guru ? this.cpForm.nama_guru : '-';
                                      var mapel = this.cpForm && this.cpForm.mapel ? this.cpForm.mapel : '-';
                                      var jurusan = this.cpForm && this.cpForm.jurusan ? this.cpForm.jurusan : '-';

                                      var docHeader = [
                                        '<?xml version="1.0" encoding="UTF-8"?>',
                                        '<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">',
                                        '  <w:body>',
                                        '    <w:p><w:r><w:t>ANALISIS CP &amp; ATP</w:t></w:r></w:p>',
                                        '    <w:p><w:r><w:t>Tahun Ajaran: ' + esc(tahunAjaran) + '</w:t></w:r></w:p>',
                                        '    <w:p><w:r><w:t>Sekolah: ' + esc(namaSekolah) + ' | Guru: ' + esc(namaGuru) + ' | Mapel: ' + esc(mapel) + '</w:t></w:r></w:p>',
                                        '    <w:p><w:r><w:t>Jurusan: ' + esc(jurusan) + '</w:t></w:r></w:p>',
                                        '    <w:p/>'
                                      ].join('\\n');

                                      var tblHeader = [
                                        '    <w:tbl>',
                                        '      <w:tblPr>',
                                        '        <w:tblW w:w="0" w:type="auto"/>',
                                        '        <w:tblBorders>',
                                        '          <w:top w:val="single" w:sz="4" w:color="auto"/>',
                                        '          <w:left w:val="single" w:sz="4" w:color="auto"/>',
                                        '          <w:bottom w:val="single" w:sz="4" w:color="auto"/>',
                                        '          <w:right w:val="single" w:sz="4" w:color="auto"/>',
                                        '          <w:insideH w:val="single" w:sz="4" w:color="auto"/>',
                                        '          <w:insideV w:val="single" w:sz="4" w:color="auto"/>',
                                        '        </w:tblBorders>',
                                        '      </w:tblPr>',
                                        '      <w:tr>',
                                        '        <w:tc><w:p><w:r><w:t>Elemen</w:t></w:r></w:p></w:tc>',
                                        '        <w:tc><w:p><w:r><w:t>Taksonomi</w:t></w:r></w:p></w:tc>',
                                        '        <w:tc><w:p><w:r><w:t>Tujuan Pembelajaran (TP)</w:t></w:r></w:p></w:tc>',
                                        '        <w:tc><w:p><w:r><w:t>Materi</w:t></w:r></w:p></w:tc>',
                                        '        <w:tc><w:p><w:r><w:t>JP</w:t></w:r></w:p></w:tc>',
                                        '        <w:tc><w:p><w:r><w:t>P5 / Catatan AI</w:t></w:r></w:p></w:tc>',
                                        '      </w:tr>'
                                      ].join('\\n');

                                      var tblRows = '';
                                      for (var i = 0; i < rows.length; i++) {
                                        var item = rows[i];
                                        var p5cat = item.p5 ? item.p5 + ' / ' + (item.catatan_ai || '') : (item.catatan_ai || '');
                                        tblRows += [
                                          '      <w:tr>',
                                          '        <w:tc><w:p><w:r><w:t>' + esc(item.elemen) + '</w:t></w:r></w:p></w:tc>',
                                          '        <w:tc><w:p><w:r><w:t>' + esc(item.taksonomi) + '</w:t></w:r></w:p></w:tc>',
                                          '        <w:tc><w:p><w:r><w:t>' + esc(item.tp) + '</w:t></w:r></w:p></w:tc>',
                                          '        <w:tc><w:p><w:r><w:t>' + esc(item.materi) + '</w:t></w:r></w:p></w:tc>',
                                          '        <w:tc><w:p><w:r><w:t>' + esc(item.jp) + '</w:t></w:r></w:p></w:tc>',
                                          '        <w:tc><w:p><w:r><w:t>' + esc(p5cat) + '</w:t></w:r></w:p></w:tc>',
                                          '      </w:tr>'
                                        ].join('\\n') + '\\n';
                                      }

                                      var docFooter = [
                                        '    </w:tbl>',
                                        '    <w:p/>',
                                        '    <w:sectPr><w:pgSz w:w="12240" w:h="15840"/></w:sectPr>',
                                        '  </w:body>',
                                        '</w:document>'
                                      ].join('\\n');

                                      var xmlContent = docHeader + tblHeader + tblRows + docFooter;
                                      var blob = new Blob([xmlContent], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
                                      var url = URL.createObjectURL(blob);
                                      var a = document.createElement('a');
                                      a.href = url;
                                      a.download = 'Analisis_CP_ATP_' + (this.cpForm && this.cpForm.mapel ? this.cpForm.mapel : 'Dokumen') + '.docx';
                                      a.click();
                                      URL.revokeObjectURL(url);
                                    },

  

            // ── AI Generator ────────────────────────
            
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
              activityType: 'individu',
              meetings: '1',
            },

            async submitForm() {
              this.isGenerating = true;
              this.lastGenerated = null;

              const typeMap = {
                              'ai-prota': 'prota',
                              'ai-prosem': 'prosem',
                              'ai-modul': 'modul',
                              'ai-kktp': 'kktp',
                              'ai-lkpd': 'lkpd'
                            };
              const type = typeMap[this.currentView];

              const endpoints = {
                              prota: '/api/documents/generate-prota',
                              prosem: '/api/documents/generate-prosem',
                              modul: '/api/documents/generate-modul-ajar',
                              kktp: '/api/documents/generate-kktp',
                              lkpd: '/api/documents/generate-lkpd',
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
  

            // ── Attendance ──────────────────────────
            
            // Student data (shared with students module)
            students: [],
            // Attendance records stored in localStorage
            attendanceRecords: [],
            // UI state
            selectedDate: new Date().toISOString().split('T')[0],
            selectedJurusanId: null,
            selectedKelas: '',
            isAttendanceModalOpen: false,
            attendanceForm: {
              studentId: null,
              status: 'H' // H=Hadir, I=Izinkan, S=Sakit, D=Dispensasi, P=Preman, A=Alpa
            },

            // View mode: 'grid' or 'table'
            viewMode: 'grid',
            // Search term for table view (minimum 3 characters)
            searchTerm: '',
            // Loading state for filtered results
            filteredStudentsTableLoading: false,
            // Selected students for bulk operations
            selectedStudents: [],

            // Status options with labels and colors
            statusOptions: [
              { code: 'H', label: 'Hadir', class: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
              { code: 'I', label: 'Izinkan', class: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
              { code: 'S', label: 'Sakit', class: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
              { code: 'D', label: 'Dispensasi', class: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
              { code: 'P', label: 'PKL', class: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
              { code: 'A', label: 'Alpa', class: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' }
            ],

            // Methods
            switchToView(mode) {
              this.viewMode = mode;
              // Clear selections when switching views
              if (mode === 'grid') {
                this.selectedStudents = [];
              }
            },

            // Search with 3 character minimum
            handleSearchInput() {
              // Debounce search for better performance
              if (this.searchTimeout) clearTimeout(this.searchTimeout);
              this.searchTimeout = setTimeout(() => {
                this.filteredStudentsTableLoading = this.searchTerm.length >= 3;
              }, 300);
            },

            searchTimeout: null,

            // Get jurusan name by id
            getJurusanName(jurusanId) {
              if (!jurusanId) return '-';
              const j = this.jurusan?.find(j => j.id === jurusanId);
              return j ? j.name : '-';
            },

            // Computed: filtered students for table view with search
            getFilteredStudentsTable() {
              // Require minimum 3 characters for search
              if (this.searchTerm.length > 0 && this.searchTerm.length < 3) {
                return [];
              }
              let students = this.students;
              // Apply jurusan filter
              if (this.selectedJurusanId) {
                students = students.filter(s => s.majorId == this.selectedJurusanId);
              }
              // Apply kelas filter
              if (this.selectedKelas) {
                students = students.filter(s => s.kelas == this.selectedKelas);
              }
              // Apply search term (case insensitive)
              if (this.searchTerm.length >= 3) {
                const term = this.searchTerm.toLowerCase();
                students = students.filter(s =>
                  s.name.toLowerCase().includes(term) ||
                  (s.nis && s.nis.toLowerCase().includes(term))
                );
              }
              return students;
            },

            // Toggle single student selection
            toggleStudentSelection(studentId, checked) {
              if (checked) {
                if (!this.selectedStudents.includes(studentId)) {
                  this.selectedStudents.push(studentId);
                }
              } else {
                this.selectedStudents = this.selectedStudents.filter(id => id !== studentId);
              }
            },

            // Toggle all table students
            toggleAllTableStudents(checked) {
              const ids = this.getFilteredStudentsTable().map(s => s.id);
              if (checked) {
                this.selectedStudents = [...new Set([...this.selectedStudents, ...ids])];
              } else {
                this.selectedStudents = this.selectedStudents.filter(id => !ids.includes(id));
              }
            },

            // Select all filtered students
            selectAllStudents() {
              const ids = this.getFilteredStudentsTable().map(s => s.id);
              this.selectedStudents = [...new Set([...this.selectedStudents, ...ids])];
            },

            // Deselect all students
            deselectAllStudents() {
              this.selectedStudents = [];
            },

            // Bulk update attendance for selected students
            async bulkUpdateAttendance(status) {
              if (this.selectedStudents.length === 0) return;
              for (const studentId of this.selectedStudents) {
                const idx = this.attendanceRecords.findIndex(a =>
                  a.studentId === studentId &&
                  a.date === this.selectedDate
                );
                if (idx !== -1) {
                  this.attendanceRecords[idx].status = status;
                } else {
                  this.attendanceRecords.push({
                    id: Date.now() + Math.random(),
                    studentId: studentId,
                    date: this.selectedDate,
                    status: status
                  });
                }
              }
              localStorage.setItem('attendance_records', JSON.stringify(this.attendanceRecords));
              this.selectedStudents = [];
            },

            // Update single student attendance from table dropdown
            updateSingleAttendance(studentId, status) {
              if (!status) {
                // Remove attendance if empty status selected
                this.attendanceRecords = this.attendanceRecords.filter(a =>
                  !(a.studentId === studentId && a.date === this.selectedDate)
                );
              } else {
                const idx = this.attendanceRecords.findIndex(a =>
                  a.studentId === studentId &&
                  a.date === this.selectedDate
                );
                if (idx !== -1) {
                  this.attendanceRecords[idx].status = status;
                } else {
                  this.attendanceRecords.push({
                    id: Date.now() + Math.random(),
                    studentId: studentId,
                    date: this.selectedDate,
                    status: status
                  });
                }
              }
              localStorage.setItem('attendance_records', JSON.stringify(this.attendanceRecords));
            },

            async loadAttendanceData() {
              // Load students from localStorage
              const raw = localStorage.getItem('students_data');
              if (raw) {
                try { this.students = JSON.parse(raw); } catch (_) { this.students = []; }
              } else {
                this.students = [];
              }
              // Load attendance records from localStorage
              const attRaw = localStorage.getItem('attendance_records');
              if (attRaw) {
                try { this.attendanceRecords = JSON.parse(attRaw); } catch (_) { this.attendanceRecords = []; }
              }
            },

            // Get attendance status for a student on a specific date
            getStudentStatus(studentId, date) {
              const rec = this.attendanceRecords.find(a => a.studentId === studentId && a.date === date);
              return rec ? rec.status : null;
            },

            // Open modal to set attendance for a student on selectedDate
            openAttendanceModal(student) {
              this.attendanceForm.studentId = student.id;
              const existing = this.attendanceRecords.find(a =>
                a.studentId === student.id &&
                a.date === this.selectedDate
              );
              this.attendanceForm.status = existing ? existing.status : 'H';
              this.isAttendanceModalOpen = true;
            },

            // Save attendance record (create or update)
            async saveAttendance() {
              if (!this.attendanceForm.studentId) return;
              const idx = this.attendanceRecords.findIndex(a =>
                a.studentId === this.attendanceForm.studentId &&
                a.date === this.selectedDate
              );
              if (idx !== -1) {
                this.attendanceRecords[idx].status = this.attendanceForm.status;
              } else {
                this.attendanceRecords.push({
                  id: Date.now(),
                  studentId: this.attendanceForm.studentId,
                  date: this.selectedDate,
                  status: this.attendanceForm.status
                });
              }
              localStorage.setItem('attendance_records', JSON.stringify(this.attendanceRecords));
              this.isAttendanceModalOpen = false;
            },

            // Export attendance for selected date to Excel
            async exportAttendanceExcel() {
              if (!window.XLSX) {
                const s = document.createElement('script');
                s.src = 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js';
                document.head.appendChild(s);
                await new Promise(r => s.onload = r);
              }
              const filtered = this.attendanceRecords.filter(a => a.date === this.selectedDate);
              const exportData = filtered.map(rec => {
                const student = this.students.find(s => s.id === rec.studentId);
                return {
                  NIS: student?.nis || '',
                  Nama: student?.name || '',
                  Kelas: student?.kelas || '',
                  Jurusan: student?.majorId ? (this.jurusan?.find(j => j.id === student.majorId)?.name || '-') : '-',
                  Status: this.statusOptions.find(s => s.code === rec.status)?.label || rec.status,
                  Tanggal: rec.date
                };
              }).sort((a, b) => a.Nama.localeCompare(b.Nama));
              const ws = XLSX.utils.json_to_sheet(exportData);
              ws['!cols'] = [
                { wch: 15 }, // NIS
                { wch: 25 }, // Nama
                { wch: 15 }, // Kelas
                { wch: 20 }, // Jurusan
                { wch: 15 }, // Status
                { wch: 12 }  // Tanggal
              ];
              const wb = XLSX.utils.book_new();
              XLSX.utils.book_append_sheet(wb, ws, 'Presensi');
              XLSX.writeFile(wb, 'presensi_' + this.selectedDate + '.xlsx');
            },

            // Computed: filtered students based on selected jurusan & kelas
            getFilteredStudents() {
              return this.students.filter(s => {
                if (this.selectedJurusanId && s.majorId != this.selectedJurusanId) return false;
                if (this.selectedKelas && s.kelas != this.selectedKelas) return false;
                return true;
              });
            },

            // Computed: available kelas from filtered students
            getAvailableKelas() {
              const kelas = this.getFilteredStudents()
                .map(s => s.kelas)
                .filter(Boolean);
              return [...new Set(kelas)].sort();
            },
  

            // ── Jurusan Management ──────────────────
            
            jurusan: [],
            isJurusanLoading: false,
            isJurusanModalOpen: false,
            isJurusanDeleteModalOpen: false,
            jurusanForm: {
              id: null,
              name: '',
              code: '',
              description: ''
            },
            jurusanToDelete: null,
            jurusanDeleteInput: '',

            async loadJurusan() {
                          this.isJurusanLoading = true;
                          try {
                            const token = localStorage.getItem('token');
                            if (!token) { this.logout(); return; }
                            const response = await fetch('/api/majors', {
                              headers: { 'Authorization': 'Bearer ' + token }
                            });
                            if (response.status === 401) { alert('Sesi berakhir.'); this.logout(); return; }
                            if (response.ok) {
                              this.jurusan = await response.json();
                            }
                          } catch (error) {
                            console.error('Load jurusan error:', error);
                          } finally {
                            this.isJurusanLoading = false;
                          }
                        },

            openAddJurusanModal() {
              this.jurusanForm = { id: null, name: '', code: '', description: '' };
              this.isJurusanModalOpen = true;
            },

            openEditJurusan(item) {
              this.jurusanForm = { ...item };
              this.isJurusanModalOpen = true;
            },

            closeJurusanModal() {
              this.isJurusanModalOpen = false;
            },

            async saveJurusan() {
              const token = localStorage.getItem('token');
              const method = this.jurusanForm.id ? 'PUT' : 'POST';
              const url = this.jurusanForm.id ? '/api/majors/' + this.jurusanForm.id : '/api/majors';

              try {
                const response = await fetch(url, {
                  method: method,
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                  },
                  body: JSON.stringify({
                    name: this.jurusanForm.name,
                    code: this.jurusanForm.code,
                    description: this.jurusanForm.description
                  })
                });

                if (response.ok) {
                  await this.loadJurusan();
                  this.closeJurusanModal();
                  // Reload classes to get updated major names if needed
                  if (typeof this.loadClasses === 'function') this.loadClasses();
                } else {
                  alert('Gagal menyimpan data jurusan.');
                }
              } catch (error) {
                console.error('Save jurusan error:', error);
                alert('Terjadi kesalahan saat menyimpan.');
              }
            },

            openJurusanDeleteModal(item) {
              this.jurusanToDelete = item;
              this.jurusanDeleteInput = '';
              this.isJurusanDeleteModalOpen = true;
            },

            closeJurusanDeleteModal() {
              this.isJurusanDeleteModalOpen = false;
              this.jurusanToDelete = null;
              this.jurusanDeleteInput = '';
            },

            async confirmDeleteJurusan() {
              if (this.jurusanDeleteInput.toLowerCase() !== 'hapus') {
                alert('Silakan ketik "hapus" untuk mengonfirmasi.');
                return;
              }

              const token = localStorage.getItem('token');
              try {
                const response = await fetch('/api/majors/' + this.jurusanToDelete.id, {
                  method: 'DELETE',
                  headers: { 'Authorization': 'Bearer ' + token }
                });

                if (response.ok) {
                  await this.loadJurusan();
                  this.closeJurusanDeleteModal();
                  if (typeof this.loadClasses === 'function') this.loadClasses();
                } else {
                  alert('Gagal menghapus data jurusan.');
                }
              } catch (error) {
                console.error('Delete jurusan error:', error);
                alert('Terjadi kesalahan saat menghapus.');
              }
            },
  

            // ── Settings ────────────────────────────
            
            settings: {
              apiKey: '',
              baseUrl: '',
              provider: 'openai',
              selectedModel: '',
              promptAnalisisCP: '',
              promptATP: ''
            },
            showApiKey: false,
            connectionStatus: '',
            availableModels: [],
            isLoadingModels: false,

            saveSettings() {
              localStorage.setItem('apiKey', this.settings.apiKey || '');
              localStorage.setItem('baseUrl', this.settings.baseUrl || '');
              localStorage.setItem('provider', this.settings.provider || 'openai');
              localStorage.setItem('selectedModel', this.settings.selectedModel || '');
              localStorage.setItem('promptAnalisisCP', this.settings.promptAnalisisCP || '');
              localStorage.setItem('promptATP', this.settings.promptATP || '');
              this.connectionStatus = 'success';
              setTimeout(() => this.connectionStatus = '', 3000);
            },

            async fetchModels() {
              if (!this.settings.apiKey) {
                alert('Masukkan API Key terlebih dahulu.');
                return;
              }
              this.isLoadingModels = true;
              this.availableModels = [];
              try {
                let url = '';
                let headers = {};
                
                if (this.settings.provider === 'openai') {
                  url = (this.settings.baseUrl || 'https://api.openai.com/v1') + '/models';
                  headers = { 'Authorization': 'Bearer ' + this.settings.apiKey };
                } else if (this.settings.provider === 'google') {
                  url = 'https://generativelanguage.googleapis.com/v1beta/models?key=' + this.settings.apiKey;
                }

                const response = await fetch(url, { headers });
                const data = await response.json();
                
                if (this.settings.provider === 'openai') {
                  this.availableModels = data.data
                    .map(m => m.id)
                    .filter(id => id.includes('gpt'))
                    .sort();
                } else if (this.settings.provider === 'google') {
                  this.availableModels = data.models
                    .map(m => m.name.replace('models/', ''))
                    .filter(id => id.includes('gemini'))
                    .sort();
                }
                
                if (this.availableModels.length > 0 && !this.settings.selectedModel) {
                  this.settings.selectedModel = this.availableModels[0];
                }
              } catch (e) {
                console.error('Gagal mengambil daftar model:', e);
                alert('Gagal mengambil daftar model. Pastikan API Key benar.');
              } finally {
                this.isLoadingModels = false;
              }
            },

            async testConnection() {
              this.connectionStatus = 'testing';
              try {
                let url = '';
                let headers = {};
                
                if (this.settings.provider === 'openai') {
                  url = (this.settings.baseUrl || 'https://api.openai.com/v1') + '/models';
                  headers = { 'Authorization': 'Bearer ' + this.settings.apiKey };
                } else if (this.settings.provider === 'google') {
                  url = 'https://generativelanguage.googleapis.com/v1beta/models?key=' + this.settings.apiKey;
                }

                const response = await fetch(url, { headers });
                this.connectionStatus = response.ok ? 'success' : 'error';
              } catch (e) {
                this.connectionStatus = 'error';
              }
              setTimeout(() => this.connectionStatus = '', 3000);
            },
  

            // ── Student Data ────────────────────────
            
            students: [],
            isStudentModalOpen: false,
            studentForm: {
              id: null,
              nis: '',
              name: '',
              kelas: '',
              majorId: null,
              status: 'Aktif'
            },

            defaultStudents: [
              { id: 1, nis: '1234567890', name: 'Ahmad Fauzi', kelas: 'X-MIPA-1', majorId: null, status: 'Aktif' },
              { id: 2, nis: '1234567891', name: 'Budi Santoso', kelas: 'X-MIPA-1', majorId: null, status: 'Aktif' },
              { id: 3, nis: '1234567892', name: 'Citra Dewi', kelas: 'X-MIPA-1', majorId: null, status: 'Aktif' }
            ],

            loadStudents() {
              const saved = localStorage.getItem('students_data');
              if (saved) {
                try {
                  this.students = JSON.parse(saved);
                } catch(e) {
                  this.students = this.defaultStudents;
                }
              } else {
                this.students = this.defaultStudents;
                this.saveToLocal();
              }
            },

            saveToLocal() {
              localStorage.setItem('students_data', JSON.stringify(this.students));
            },

            openStudentModal(student = null) {
              if (student) {
                this.studentForm = { ...student };
              } else {
                this.studentForm = {
                  id: null,
                  nis: '',
                  name: '',
                  kelas: '',
                  majorId: null,
                  status: 'Aktif'
                };
              }
              this.isStudentModalOpen = true;
            },

            closeStudentModal() {
              this.isStudentModalOpen = false;
            },

            saveStudent() {
              if (!this.studentForm.nis || !this.studentForm.name || !this.studentForm.kelas) {
                alert('Silakan lengkapi data wajib.');
                return;
              }

              if (this.studentForm.id) {
                const index = this.students.findIndex(s => s.id === this.studentForm.id);
                if (index !== -1) {
                  this.students[index] = { ...this.studentForm };
                }
              } else {
                const newId = this.students.length > 0 ? Math.max(...this.students.map(s => s.id)) + 1 : 1;
                this.students.push({
                  ...this.studentForm,
                  id: newId
                });
              }

              this.saveToLocal();
              this.closeStudentModal();
            },

            async importExcel(event) {
              const file = event.target.files[0];
              if (!file) return;

              if (!window.XLSX) {
                alert('Memuat library Excel... Silakan coba lagi.');
                const script = document.createElement('script');
                script.src = 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js';
                document.head.appendChild(script);
                await new Promise(resolve => script.onload = resolve);
                if (!window.XLSX) return;
              }

              const reader = new FileReader();
              reader.onload = (e) => {
                try {
                  const data = new Uint8Array(e.target.result);
                  const workbook = XLSX.read(data, { type: 'array' });
                  const sheet = workbook.Sheets[workbook.SheetNames[0]];
                  const json = XLSX.utils.sheet_to_json(sheet, { defval: '' });

                  if (json.length === 0) {
                    alert('File Excel kosong.');
                    return;
                  }

                  const newStudents = json.map((row, idx) => ({
                    id: Date.now() + idx + Math.random(),
                    nis: row.NIS || row.nis || '',
                    name: row.Nama || row.name || '',
                    kelas: row.Kelas || row.kelas || '',
                    majorId: row.Jurusan ? (this.jurusan ? this.jurusan.find(j => j.name === row.Jurusan || j.code === row.Jurusan)?.id : null) : null,
                    status: row.Status || 'Aktif'
                  }));

                  this.students = [...this.students, ...newStudents];
                  this.saveToLocal();
                  alert('Berhasil mengimpor ' + newStudents.length + ' data siswa.');
                } catch (err) {
                  console.error('Excel import error:', err);
                  alert('Gagal membaca file Excel. Pastikan format sesuai.');
                }
              };
              reader.readAsArrayBuffer(file);
              event.target.value = '';
            },

            deleteStudent(id) {
              if (confirm('Yakin ingin menghapus data siswa ini?')) {
                this.students = this.students.filter(s => s.id !== id);
                this.saveToLocal();
              }
            },
  

            // ── Kelas Management ────────────────────
            
            classes: [],
            isKelasLoading: false,
            isKelasModalOpen: false,
            isKelasDeleteModalOpen: false,
            kelasForm: {
              id: null,
              name: '',
              majorId: null
            },
            kelasToDelete: null,
            kelasDeleteInput: '',

            async loadClasses() {
                          this.isKelasLoading = true;
                          try {
                            const token = localStorage.getItem('token');
                            if (!token) { this.logout(); return; }
                            const response = await fetch('/api/classes', {
                              headers: { 'Authorization': 'Bearer ' + token }
                            });
                            if (response.status === 401) { alert('Sesi berakhir.'); this.logout(); return; }
                            if (response.ok) {
                              this.classes = await response.json();
                            }
                          } catch (error) {
                            console.error('Load classes error:', error);
                          } finally {
                            this.isKelasLoading = false;
                          }
                        },

            openAddKelasModal() {
              this.kelasForm = { id: null, name: '', majorId: this.jurusan.length > 0 ? this.jurusan[0].id : null };
              this.isKelasModalOpen = true;
            },

            openEditKelas(item) {
              this.kelasForm = {
                id: item.id,
                name: item.name,
                majorId: item.majorId
              };
              this.isKelasModalOpen = true;
            },

            closeKelasModal() {
              this.isKelasModalOpen = false;
            },

            async saveKelas() {
              if (!this.kelasForm.majorId) {
                alert('Silakan pilih jurusan terlebih dahulu.');
                return;
              }

              const token = localStorage.getItem('token');
              const method = this.kelasForm.id ? 'PUT' : 'POST';
              const url = this.kelasForm.id ? '/api/classes/' + this.kelasForm.id : '/api/classes';

              try {
                const response = await fetch(url, {
                  method: method,
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                  },
                  body: JSON.stringify({
                    name: this.kelasForm.name,
                    majorId: parseInt(this.kelasForm.majorId)
                  })
                });

                if (response.ok) {
                  await this.loadClasses();
                  this.closeKelasModal();
                } else {
                  const err = await response.json();
                  alert('Gagal menyimpan kelas: ' + (err.error || 'Unknown error'));
                }
              } catch (error) {
                console.error('Save kelas error:', error);
                alert('Terjadi kesalahan saat menyimpan.');
              }
            },

            openKelasDeleteModal(item) {
              this.kelasToDelete = item;
              this.kelasDeleteInput = '';
              this.isKelasDeleteModalOpen = true;
            },

            closeKelasDeleteModal() {
              this.isKelasDeleteModalOpen = false;
              this.kelasToDelete = null;
              this.kelasDeleteInput = '';
            },

            async confirmDeleteKelas() {
              if (this.kelasDeleteInput.toLowerCase() !== 'hapus') {
                alert('Silakan ketik "hapus" untuk mengonfirmasi.');
                return;
              }

              const token = localStorage.getItem('token');
              try {
                const response = await fetch('/api/classes/' + this.kelasToDelete.id, {
                  method: 'DELETE',
                  headers: { 'Authorization': 'Bearer ' + token }
                });

                if (response.ok) {
                  await this.loadClasses();
                  this.closeKelasDeleteModal();
                } else {
                  alert('Gagal menghapus data kelas.');
                }
              } catch (error) {
                console.error('Delete kelas error:', error);
                alert('Terjadi kesalahan saat menghapus.');
              }
            },
  

            // ── Subjects Management ─────────────────────
                        
            subjects: [],
            isSubjectsLoading: false,
            isSubjectsModalOpen: false,
            isSubjectsDeleteModalOpen: false,
            subjectsForm: {
              id: null,
              name: '',
              code: '',
              majorId: null,
              classId: null
            },
            subjectToDelete: null,
            subjectsDeleteInput: '',

            async loadSubjects() {
                          this.isSubjectsLoading = true;
                          try {
                            const token = localStorage.getItem('token');
                            if (!token) { this.logout(); return; }
                            const response = await fetch('/api/subjects', {
                              headers: { 'Authorization': 'Bearer ' + token }
                            });
                            if (response.status === 401) { alert('Sesi berakhir.'); this.logout(); return; }
                            if (response.ok) {
                              this.subjects = await response.json();
                            }
                          } catch (error) {
                            console.error('Load subjects error:', error);
                          } finally {
                            this.isSubjectsLoading = false;
                          }
                        },

            openAddSubjectsModal() {
              this.subjectsForm = {
                id: null,
                name: '',
                code: '',
                majorId: this.jurusan.length > 0 ? this.jurusan[0].id : null,
                classId: null
              };
              this.isSubjectsModalOpen = true;
            },

            openEditSubjects(item) {
              this.subjectsForm = {
                id: item.id,
                name: item.name,
                code: item.code,
                majorId: item.majorId,
                classId: item.classId
              };
              this.isSubjectsModalOpen = true;
            },

            closeSubjectsModal() {
              this.isSubjectsModalOpen = false;
            },

            async saveSubjects() {
              if (!this.subjectsForm.majorId) {
                alert('Silakan pilih jurusan terlebih dahulu.');
                return;
              }
              if (!this.subjectsForm.name || !this.subjectsForm.code) {
                alert('Nama mata pelajaran dan kode harus diisi.');
                return;
              }

              const token = localStorage.getItem('token');
              const method = this.subjectsForm.id ? 'PUT' : 'POST';
              const url = this.subjectsForm.id ? '/api/subjects/' + this.subjectsForm.id : '/api/subjects';

              try {
                const response = await fetch(url, {
                  method: method,
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                  },
                  body: JSON.stringify({
                    name: this.subjectsForm.name,
                    code: this.subjectsForm.code,
                    majorId: parseInt(this.subjectsForm.majorId),
                    classId: this.subjectsForm.classId ? parseInt(this.subjectsForm.classId) : null
                  })
                });

                if (response.ok) {
                  await this.loadSubjects();
                  this.closeSubjectsModal();
                } else {
                  const err = await response.json();
                  alert('Gagal menyimpan mata pelajaran: ' + (err.error || 'Unknown error'));
                }
              } catch (error) {
                console.error('Save subjects error:', error);
                alert('Terjadi kesalahan saat menyimpan.');
              }
            },

            openSubjectsDeleteModal(item) {
              this.subjectToDelete = item;
              this.subjectsDeleteInput = '';
              this.isSubjectsDeleteModalOpen = true;
            },

            closeSubjectsDeleteModal() {
              this.isSubjectsDeleteModalOpen = false;
              this.subjectToDelete = null;
              this.subjectsDeleteInput = '';
            },

            async confirmDeleteSubjects() {
              if (this.subjectsDeleteInput.toLowerCase() !== 'hapus') {
                alert('Silakan ketik "hapus" untuk mengonfirmasi.');
                return;
              }

              const token = localStorage.getItem('token');
              try {
                const response = await fetch('/api/subjects/' + this.subjectToDelete.id, {
                  method: 'DELETE',
                  headers: { 'Authorization': 'Bearer ' + token }
                });

                if (response.ok) {
                  await this.loadSubjects();
                  this.closeSubjectsDeleteModal();
                } else {
                  alert('Gagal menghapus data mata pelajaran.');
                }
              } catch (error) {
                console.error('Delete subjects error:', error);
                alert('Terjadi kesalahan saat menghapus.');
              }
            },
  

                        // ── Users Management ────────────────────────
                        
    // -- State --
    users: [],
    isUsersLoading: false,
    isUsersModalOpen: false,
    isDeleteModalOpen: false,
    userForm: {
      id: null,
      name: '',
      email: '',
      password: '',
      role: 'guru'
    },
    userToDelete: null,
    userDeleteInput: '',
    showPassword: false,

    // Load all users
    async loadUsers() {
      this.isUsersLoading = true;
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          this.logout();
          return;
        }

        const response = await fetch('/api/users', {
          headers: {
            'Authorization': 'Bearer ' + token
          }
        });

        if (response.status === 401) {
          alert('Sesi berakhir.');
          this.logout();
          return;
        }

        if (response.ok) {
          this.users = await response.json();
        } else {
          alert('Gagal memuat data user.');
        }
      } catch (error) {
        console.error('Load users error:', error);
        alert('Terjadi kesalahan saat memuat data user.');
      } finally {
        this.isUsersLoading = false;
      }
    },

    // Open add modal
    openAddUserModal() {
      this.userForm = {
        id: null,
        name: '',
        email: '',
        password: '',
        role: 'guru'
      };
      this.isUsersModalOpen = true;
    },

    // Open edit modal
    openEditUserModal(user) {
      this.userForm = {
        ...user,
        password: '' // Don't include password in edit mode
      };
      this.isUsersModalOpen = true;
    },

    // Close modal
    closeUserModal() {
      this.isUsersModalOpen = false;
      this.isDeleteModalOpen = false;
      this.userToDelete = null;
      this.userDeleteInput = '';
    },

    // Save user (create/update)
    async saveUser() {
      if (!this.userForm.email || !this.userForm.name) {
        alert('Email, nama, dan role wajib diisi');
        return;
      }

      // For new user, password is required
      if (!this.userForm.id && !this.userForm.password) {
        alert('Password wajib untuk akun baru');
        return;
      }

      const token = localStorage.getItem('token');
      const method = this.userForm.id ? 'PUT' : 'POST';
      const url = this.userForm.id ? '/api/users/' + this.userForm.id : '/api/users';

      const payload = {
        name: this.userForm.name,
        email: this.userForm.email,
        role: this.userForm.role
      };

      if (this.userForm.password) {
        payload.password = this.userForm.password;
      }

      try {
        const response = await fetch(url, {
          method: method,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          await this.loadUsers();
          this.closeUserModal();
        } else {
          const err = await response.json();
          alert('Gagal menyimpan user: ' + (err.error || 'Unknown error'));
        }
      } catch (error) {
        console.error('Save user error:', error);
        alert('Terjadi kesalahan saat menyimpan data user.');
      }
    },

    // Open delete modal
    openDeleteUserModal(user) {
      this.userToDelete = user;
      this.isDeleteModalOpen = true;
    },

    // Confirm delete user
    async confirmDeleteUser() {
      if (this.userDeleteInput.toLowerCase() !== 'hapus') {
        alert('Silakan ketik "hapus" untuk mengonfirmasi.');
        return;
      }

      if (this.userToDelete.email === 'admin@gurupintar.com') {
        alert('Tidak dapat menghapus akun admin default.');
        return;
      }

      const token = localStorage.getItem('token');
      try {
        const response = await fetch('/api/users/' + this.userToDelete.id, {
          method: 'DELETE',
          headers: {
            'Authorization': 'Bearer ' + token
          }
        });

        if (response.ok) {
          await this.loadUsers();
          this.closeUserModal();
        } else {
          const err = await response.json();
          alert('Gagal menghapus user: ' + (err.error || 'Unknown error'));
        }
      } catch (error) {
        console.error('Delete user error', error);
        alert('Terjadi kesalahan saat menghapus user.');
      }
    },

    // Export users to Excel with unhashed passwords
    async exportUsers() {
      if (this.users.length === 0) {
        alert('Tidak ada data user untuk diekspor');
        return;
      }

      // Add password column - prompt admin for verification
      const confirmed = confirm('Akses data sensitif: Password akan termasuk dalam export. Lanjutkan?');
      if (!confirmed) return;

      // If admin needs to see passwords, we assume they enter a new password for export
      // Otherwise, we can skip password export for security
      const includePassword = confirm('Sertakan password dalam export? (Centang untuk level admin)');

      try {
        let exportData = [];

        if (includePassword) {
          // This is for admin export - will include actual password prompt
          const passwordPrompt = prompt('Masukkan password baru untuk export (digunakan untuk security dialog):');

          exportData = this.users.map(user => ({
            'ID': user.id,
            'Nama': user.name,
            'Email': user.email,
            'Role': user.role,
            'Password (Admin View)': passwordPrompt || '[PROTECTED]',
            'Created': user.createdAt.split('T')[0]
          }));
        } else {
          exportData = this.users.map(user => ({
            'ID': user.id,
            'Nama': user.name,
            'Email': user.email,
            'Role': user.role,
            'Created': user.createdAt.split('T')[0]
          }));
        }

        // Load XLSX library if not available
        if (!window.XLSX) {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js';
          document.head.appendChild(script);
          await new Promise(resolve => script.onload = resolve);
        }

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(exportData);
        const filename = 'data_user_' + new Date().toISOString().split('T')[0] + '.xlsx';

        XLSX.utils.book_append_sheet(wb, ws, 'User Accounts');
        XLSX.writeFile(wb, filename);

      } catch (error) {
        console.error('Export error', error);
        alert('Gagal mengekspor data user.');
      }
    },

  

                        // ── Soal Pilihan Ganda ─────────────────────
                        
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
            systemPromptSoalPG: `Anda adalah pakar pembuat soal ujian (Item Writer) untuk tingkat SMK Jurusan PPLG (Pengembangan Perangkat Lunak dan Gim).
Tugas Anda adalah membuat soal pilihan ganda yang berkualitas tinggi, valid secara pedagogi, dan relevan dengan industri IT.

Kriteria Kualitas Soal:
1. Validitas: Soal harus sesuai dengan Capaian Pembelajaran (CP).
2. Pengecoh (Distractors): Pilihan jawaban salah harus masuk akal (plausible), tidak konyol, dan mencerminkan kesalahan umum siswa (misalnya salah logika looping atau typo sintaks).
3. Level Kognitif: Fokus pada C3 (Aplikasi), C4 (Analisis), dan C5 (Evaluasi) sesuai taksonomi Bloom.
4. Kode Program: Jika soal pemrograman, gunakan potongan kode yang bersih dan gunakan standar industri (misal: camelCase, indentasi benar).
5. Bahasa: Gunakan Bahasa Indonesia yang baku dan teknis namun mudah dipahami siswa.`,

            // User prompt template
            userPromptSoalPG(topik, cp, levelBloom, konteksIndustri, jumlahSoal) {
              return `Buatkan soal pilihan ganda dengan detail sebagai berikut:

- Topik: ${topik}
- Capaian Pembelajaran (CP): ${cp}
- Level Kognitif: ${levelBloom}
- Konteks/Studi Kasus: ${konteksIndustri}
- Jumlah Soal: ${jumlahSoal}
- Jumlah Opsi: 5 (A, B, C, D, E)

Format Output:
Berikan output dalam format JSON yang bersih agar mudah diparsing oleh aplikasi saya dengan struktur:
[
  {
    "nomor": 1,
    "pertanyaan": "teks pertanyaan...",
    "kode_snippet": "jika ada kode, tulis di sini (opsional)",
    "opsi": {
      "A": "...",
      "B": "...",
      "C": "...",
      "D": "...",
      "E": "..."
    },
    "jawaban_benar": "A/B/C/D/E",
    "penjelasan": "Alasan mengapa jawaban tersebut benar dan mengapa pengecoh lainnya salah."
  }
]

PENTING: Jangan berikan teks pembuka atau penutup. Berikan HANYA array JSON.`;
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

                const response = await fetch('/api/soal-pilihan-ganda/generate', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    systemPrompt: this.systemPromptSoalPG,
                    userPrompt: prompt,
                    apiKey: this.settings.apiKey,
                    baseUrl: this.settings.baseUrl
                  }),
                });

                if (response.ok) {
                  const result = await response.json();
                  // Parse JSON from AI response
                  let questions = [];
                  try {
                    // Try to extract JSON from response (in case AI adds text before/after)
                    const jsonMatch = result.content.match(/\[\s*\{.*\}\s*\]/s);
                    if (jsonMatch) {
                      questions = JSON.parse(jsonMatch[0]);
                    } else {
                      questions = JSON.parse(result.content);
                    }
                  } catch (e) {
                    // Fallback: try parsing the whole content
                    try {
                      questions = JSON.parse(result.content);
                    } catch (e2) {
                      throw new Error('Gagal memparse jawaban AI. Pastikan format JSON benar.');
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

            // Load saved questions from localStorage
            loadSoalPilihanGanda() {
              const saved = localStorage.getItem('soal_pilihan_ganda');
              if (saved) {
                try {
                  const data = JSON.parse(saved);
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
  

                        // ── Soal Essay ─────────────────────
                        
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
  

                        // ── Auth Helper ────────────────────────────
                                    checkAuth() {
                                      const token = localStorage.getItem('token');
                                      if (!token) {
                                        this.logout();
                                        return false;
                                      }
                                      return true;
                                    },

                                    // Helper for authenticated fetch
                                    async authFetch(url, options = {}) {
                                      const token = localStorage.getItem('token');
                                      if (!token) {
                                        this.logout();
                                        throw new Error('Unauthorized');
                                      }
                                      const response = await fetch(url, {
                                        ...options,
                                        headers: {
                                          'Content-Type': 'application/json',
                                          'Authorization': 'Bearer ' + token,
                                          ...options.headers,
                                        },
                                      });
                                      if (response.status === 401) {
                                        alert('Sesi Anda telah berakhir. Silakan login kembali.');
                                        this.logout();
                                        throw new Error('Session expired');
                                      }
                                      return response;
                                    },

                                    // ── Initialization ──────────────────────
                                    async init() {
                                      // Check session first
                                      if (!this.checkAuth()) return;

                                      this.darkMode = localStorage.getItem('darkMode') === 'dark';
              if (this.darkMode) document.documentElement.classList.add('dark');

              this.settings.apiKey = localStorage.getItem('apiKey') || '';
              this.settings.baseUrl = localStorage.getItem('baseUrl') || '';
              this.settings.provider = localStorage.getItem('provider') || 'openai';
              this.settings.selectedModel = localStorage.getItem('selectedModel') || (this.settings.provider === 'openai' ? 'gpt-4o-mini' : 'gemini-1.5-flash');
              this.settings.promptAnalisisCP = localStorage.getItem('promptAnalisisCP') || "Anda adalah Pakar Kurikulum Merdeka yang menganalisis CP menjadi ATP yang logis, terukur, relevan dengan jurusan, dan hanya mengembalikan JSON.";

              this.settings.promptATP = localStorage.getItem('promptATP') || 'Buatkan Alur Tujuan Pembelajaran (ATP) untuk CP berikut berdasarkan alokasi waktu dan urutan logis...';

              // Load student data first
                            await this.loadStudents();
                            // Load attendance data (depends on students)
                            await this.loadAttendanceData();
                            // Load Jurusan
                            await this.loadJurusan();
                            await this.loadDocuments();
                            await this.loadClasses();

                            await this.loadSubjects();

                            // Load users
                                                        await this.loadUsers();

                                                        // Load soal pilihan ganda from localStorage
                                                        this.loadSoalPilihanGanda();

                                                        // Load soal essay from localStorage
                                                        this.loadSoalEssay();

                                                        this.initAnalisisCP();
                                        },

            logout() {
              localStorage.removeItem('token');
              window.location.href = '/login';
            }
          };
        };

        // Expose init to global scope for Alpine.js
        window.init = function() {
          return window.app().init.call(window.app());
        };
  