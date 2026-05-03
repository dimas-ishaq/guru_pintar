/**
 * Alpine.js data module: Student Data Management.
 * Returns a JS string fragment defining student state, modal control, and CRUD actions.
 */
export function studentsData(): string {
  return `
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
  `;
}
