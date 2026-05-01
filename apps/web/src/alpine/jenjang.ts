/**
 * Alpine.js data module: Jenjang (Education Level) management CRUD.
 */
export function jenjangData(): string {
  return `
            levels: [],
            isJenjangLoading: false,
            isJenjangModalOpen: false,
            isJenjangDeleteModalOpen: false,
            jenjangForm: {
              id: null,
              name: '',
              code: ''
            },
            jenjangToDelete: null,
            jenjangDeleteInput: '',

            async loadLevels() {
              this.isJenjangLoading = true;
              try {
                const token = localStorage.getItem('token');
                const response = await fetch('/api/levels', {
                  headers: { 'Authorization': 'Bearer ' + token }
                });
                if (response.ok) {
                  this.levels = await response.json();
                }
              } catch (error) {
                console.error('Load levels error:', error);
              } finally {
                this.isJenjangLoading = false;
              }
            },

            openAddJenjangModal() {
              this.jenjangForm = { id: null, name: '', code: '' };
              this.isJenjangModalOpen = true;
            },

            openEditJenjangModal(item) {
              this.jenjangForm = { ...item };
              this.isJenjangModalOpen = true;
            },

            closeJenjangModal() {
              this.isJenjangModalOpen = false;
            },

            async saveJenjang() {
              const token = localStorage.getItem('token');
              const method = this.jenjangForm.id ? 'PUT' : 'POST';
              const url = this.jenjangForm.id ? '/api/levels/' + this.jenjangForm.id : '/api/levels';

              try {
                const response = await fetch(url, {
                  method: method,
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                  },
                  body: JSON.stringify({
                    name: this.jenjangForm.name,
                    code: this.jenjangForm.code
                  })
                });

                if (response.ok) {
                  await this.loadLevels();
                  this.closeJenjangModal();
                } else {
                  alert('Gagal menyimpan data jenjang.');
                }
              } catch (error) {
                console.error('Save level error:', error);
                alert('Terjadi kesalahan saat menyimpan.');
              }
            },

            openJenjangDeleteModal(item) {
              this.jenjangToDelete = item;
              this.jenjangDeleteInput = '';
              this.isJenjangDeleteModalOpen = true;
            },

            closeJenjangDeleteModal() {
              this.isJenjangDeleteModalOpen = false;
              this.jenjangToDelete = null;
              this.jenjangDeleteInput = '';
            },

            async confirmDeleteJenjang() {
              if (this.jenjangDeleteInput.toLowerCase() !== 'hapus') {
                alert('Silakan ketik "hapus" untuk mengonfirmasi.');
                return;
              }

              const token = localStorage.getItem('token');
              try {
                const response = await fetch('/api/levels/' + this.jenjangToDelete.id, {
                  method: 'DELETE',
                  headers: { 'Authorization': 'Bearer ' + token }
                });

                if (response.ok) {
                  await this.loadLevels();
                  this.closeJenjangDeleteModal();
                } else {
                  alert('Gagal menghapus data jenjang.');
                }
              } catch (error) {
                console.error('Delete level error:', error);
                alert('Terjadi kesalahan saat menghapus.');
              }
            },
  `;
}
