/**
 * Alpine.js data module: Subjects (Mata Pelajaran) management CRUD.
 * Requires jurusan (majors) and kelas (classes) data to be loaded first.
 */
export function subjectsData(): string {
  return `
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
  `;
}
