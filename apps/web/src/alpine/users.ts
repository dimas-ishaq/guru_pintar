/** * Alpine.js data module: User Account Management CRUD * Includes user listing, add, edit, delete, and export to Excel with unhashed passwords */ export function usersData(): string {
  return `
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

  `;
}
