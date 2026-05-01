/**
 * Alpine.js data module: Jurusan (Department) management CRUD.
 * Now integrated with Backend API.
 */
export function jurusanData(): string {
  return `
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
  `;
}
