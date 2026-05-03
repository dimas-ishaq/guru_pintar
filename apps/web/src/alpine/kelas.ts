/**
 * Alpine.js data module: Manajemen Kelas (Class Management) CRUD.
 */
export function kelasData(): string {
  return `
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
  `;
}
