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
              jurusan: '',
              status: 'Aktif'
            },
            
            // Initial dummy data to load if localStorage is empty
            defaultStudents: [
              { id: 1, nis: '1234567890', name: 'Ahmad Fauzi', kelas: 'X-MIPA-1', jurusan: 'IPA', status: 'Aktif' },
              { id: 2, nis: '1234567891', name: 'Budi Santoso', kelas: 'X-MIPA-1', jurusan: 'IPA', status: 'Aktif' },
              { id: 3, nis: '1234567892', name: 'Citra Dewi', kelas: 'X-MIPA-1', jurusan: 'IPA', status: 'Aktif' }
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
                  jurusan: '',
                  status: 'Aktif'
                };
              }
              this.isStudentModalOpen = true;
            },

            closeStudentModal() {
              this.isStudentModalOpen = false;
            },

            saveStudent() {
              if (!this.studentForm.nis || !this.studentForm.name || !this.studentForm.kelas || !this.studentForm.jurusan) {
                alert('Silakan lengkapi data wajib.');
                return;
              }

              if (this.studentForm.id) {
                // Edit
                const index = this.students.findIndex(s => s.id === this.studentForm.id);
                if (index !== -1) {
                  this.students[index] = { ...this.studentForm };
                }
              } else {
                // Add
                const newId = this.students.length > 0 ? Math.max(...this.students.map(s => s.id)) + 1 : 1;
                this.students.push({
                  ...this.studentForm,
                  id: newId
                });
              }

              this.saveToLocal();
              this.closeStudentModal();
            },

            deleteStudent(id) {
              if (confirm('Yakin ingin menghapus data siswa ini?')) {
                this.students = this.students.filter(s => s.id !== id);
                this.saveToLocal();
              }
            },
  `;
}
