
        function app() {
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
              { id: 'settings', label: 'Pengaturan', icon: 'settings' },
            ],

            // ── Dashboard ──────────────────────────
            
            documents: [],

            async loadDocuments() {
              try {
                const token = localStorage.getItem('token');
                const response = await fetch('/api/documents/list/1', {
                  headers: {
                    'Authorization': 'Bearer ' + token
                  }
                });
                const data = await response.json();
                this.documents = data.documents || [];
              } catch (e) { console.error(e); }
            },
  

            // ── Analisis CP & ATP ───────────────────
            
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
                      cpDetails.push('Elemen ' + (idx + 1) + ': ' + item.name.trim() + '\nCP: ' + (item.cp || '-') + '\nMateri Utama (Opsional): ' + (item.materi || 'Generate otomatis berdasarkan CP'));
                    }
                  });
                }

                const elemenText = elemenNames.join(', ') || '-';
                const cpTextCombined = cpDetails.join('\n\n') || '-';

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

            // Status options with labels and colors
            statusOptions: [
              { code: 'H', label: 'Hadir', class: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
              { code: 'I', label: 'Izinkan', class: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
              { code: 'S', label: 'Sakit', class: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
              { code: 'D', label: 'Dispensasi', class: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
              { code: 'P', label: 'Preman', class: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
              { code: 'A', label: 'Alpa', class: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' }
            ],

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
                const response = await fetch('/api/majors', {
                  headers: { 'Authorization': 'Bearer ' + token }
                });
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
                const response = await fetch('/api/classes', {
                  headers: { 'Authorization': 'Bearer ' + token }
                });
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
                const response = await fetch('/api/subjects', {
                  headers: { 'Authorization': 'Bearer ' + token }
                });
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
  

                        // ── Initialization ──────────────────────
            async init() {
              this.darkMode = localStorage.getItem('darkMode') === 'dark';
              if (this.darkMode) document.documentElement.classList.add('dark');

              this.settings.apiKey = localStorage.getItem('apiKey') || '';
              this.settings.baseUrl = localStorage.getItem('baseUrl') || '';
              this.settings.provider = localStorage.getItem('provider') || 'openai';
              this.settings.selectedModel = localStorage.getItem('selectedModel') || (this.settings.provider === 'openai' ? 'gpt-4o-mini' : 'gemini-1.5-flash');
              this.settings.promptAnalisisCP = localStorage.getItem('promptAnalisisCP') || `Anda adalah seorang Pakar Kurikulum Merdeka yang spesialis dalam pengembangan kurikulum SMK, khususnya rumpun Teknologi Informasi (seperti PPLG). Tugas Anda adalah menganalisis input dari guru untuk memastikan Capaian Pembelajaran (CP) diturunkan menjadi Alur Tujuan Pembelajaran (ATP) yang logis, terukur, dan sesuai standar BSKAP.

### KONTEKS KHUSUS:
- Di sekolah ini, "Elemen" sering kali diperlakukan sebagai "Mata Pelajaran" tersendiri.
- Fokus utama: Keselarasan (Alignment), Scaffolding (Urutan Logis), dan Integrasi P5.

### TUGAS ANDA:
1. Analisis Kompetensi: Identifikasi Kata Kerja Operasional (KKO) dalam CP dan pastikan Tujuan Pembelajaran (TP) yang dihasilkan setara atau mendukung KKO tersebut.
2. Analisis Konten: Bedah materi esensial dari teks CP yang diberikan.
3. Cek Urutan (Scaffolding): Pastikan materi disusun dari dasar ke kompleks (misal: Logika dasar sebelum Sintaks PWA).
4. Identifikasi Gap: Beritahu jika ada bagian dari CP yang belum ter-cover oleh elemen atau rencana guru.

### INSTRUKSI KHUSUS CAKUPAN WAKTU:
1. JIKA MODE = "TAHUNAN":
   - Analisis seluruh teks CP untuk durasi 1 Tahun Ajaran (Fase E = 1 tahun, Fase F = 2 tahun).
   - Bagi Tujuan Pembelajaran (TP) secara merata ke dalam dua blok: Semester 1 (Ganjil) dan Semester 2 (Genap).
   - Pastikan materi di Semester 2 memiliki prasyarat yang logis dari Semester 1 (Scaffolding Jangka Panjang).

2. JIKA MODE = "SEMESTER":
   - Fokus hanya pada Tujuan Pembelajaran operasional untuk periode 6 bulan.
   - Jika Semester 1: Mulai dari materi fundamental/dasar.
   - Jika Semester 2: Asumsikan siswa sudah memiliki kompetensi dasar dari semester sebelumnya dan berikan materi pengembangan atau proyek akhir.

### INPUT DATA:
- Mode: {{mode}} (Tahunan / Semester)
- Semester Pilihan: {{semester}} (Hanya relevan jika mode semester)
- Mapel/Elemen: {{mapel}}
- Elemen Detail: {{elemen}}
- Teks CP: {{cp_text}}
- Alokasi JP: {{jp}}
- Waktu per JP: {{jp_duration}} (misal: 45 menit)

### MANDATORY SCHEMA (JSON ONLY):
{
  "atp_table": [
    {
      "semester": "1",
      "elemen": "{{elemen}}",
      "taksonomi": "C3 - Menerapkan",
      "materi": "Nama Topik/Bab (Contoh: 'Tipe Data & Variabel', 'SQL Join', 'Metode Agile')",
      "tp": "Tujuan Pembelajaran lengkap",
      "jp": "12",
      "p5": "Gotong Royong",
      "catatan_ai": "Analisis singkat"
    }
  ]
}

### ATURAN KERAS MATERI:
1. "materi" HARUS berupa KATA BENDA / NAMA TOPIK (Contoh: "Array 2 Dimensi").
2. DILARANG menggunakan kata kerja di awal materi (JANGAN GUNAKAN: "Menjelaskan...", "Memahami...", "Mempraktikkan...").
3. BEDAH teks CP menjadi unit pengetahuan terkecil (Bab/Sub-bab).

### REASONING RULES:
1. "taksonomi" WAJIB berisi Level Bloom (C1-C6).
2. "elemen" HARUS sesuai dengan input.
3. JANGAN BERIKAN TEKS PENJELASAN. HANYA JSON.`;

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

              this.initAnalisisCP();
            },

            logout() {
              localStorage.removeItem('token');
              window.location.href = '/login';
            }
          };
        }
  