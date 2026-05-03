export function kelasView(): string {
  return `
  <div x-show="currentView === 'kelas'" x-cloak class="p-6 space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-3xl font-black text-slate-800 dark:text-white tracking-tight uppercase">Manajemen Kelas</h2>
        <p class="text-slate-500 dark:text-slate-400 mt-1">Kelola data kelas dan hubungkan dengan jurusan</p>
      </div>
      <button
        @click="openAddKelasModal()"
        class="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl transition-all duration-300 shadow-lg shadow-indigo-200 dark:shadow-none hover:scale-[1.02] active:scale-[0.98] font-bold"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"></path>
        </svg>
        Tambah Kelas
      </button>
    </div>

    <!-- Table Section -->
    <div class="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
          <thead class="bg-slate-50 dark:bg-slate-900/50">
            <tr>
              <th class="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Nama Kelas</th>
              <th class="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Jurusan</th>
              <th class="px-6 py-4 text-right text-[10px] font-black text-slate-500 uppercase tracking-widest">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200 dark:divide-slate-800">
            <template x-for="item in classes" :key="item.id">
              <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold">
                      <span x-text="item.name.charAt(0)"></span>
                    </div>
                    <span class="font-bold text-slate-700 dark:text-slate-200" x-text="item.name"></span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-2">
                    <span class="text-sm text-slate-600 dark:text-slate-400 font-medium" x-text="item.major ? item.major.name : '-'"></span>
                    <span x-show="item.major" class="text-[10px] font-black px-1.5 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded border border-indigo-100 dark:border-indigo-800" x-text="item.major?.code"></span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right">
                  <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button @click="openEditKelas(item)" class="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                      </svg>
                    </button>
                    <button @click="openKelasDeleteModal(item)" class="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </template>
            <template x-if="classes.length === 0 && !isKelasLoading">
              <tr>
                <td colspan="3" class="px-6 py-12 text-center">
                  <div class="flex flex-col items-center">
                    <div class="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-4">
                      <svg class="w-8 h-8 text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                      </svg>
                    </div>
                    <h3 class="text-slate-800 dark:text-white font-bold">Belum ada data kelas</h3>
                    <p class="text-slate-500 text-sm mt-1">Klik tombol 'Tambah Kelas' untuk mulai mengelola data.</p>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Form -->
    <div x-show="isKelasModalOpen" x-cloak
         class="fixed inset-0 z-50 overflow-y-auto"
         x-transition:enter="transition ease-out duration-300"
         x-transition:enter-start="opacity-0"
         x-transition:enter-end="opacity-100"
         x-transition:leave="transition ease-in duration-200"
         x-transition:leave-start="opacity-100"
         x-transition:leave-end="opacity-0">
      <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity bg-slate-900/60 backdrop-blur-sm" @click="closeKelasModal()"></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen"></span>
        <div class="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white dark:bg-slate-900 rounded-3xl shadow-2xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-slate-200 dark:border-slate-800">
          <div class="px-8 py-6">
            <h3 class="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight" x-text="kelasForm.id ? 'Edit Kelas' : 'Tambah Kelas Baru'"></h3>
            <p class="text-slate-500 dark:text-slate-400 mt-1 text-sm">Isi informasi kelas dengan lengkap dan benar.</p>

            <div class="mt-8 space-y-5">
              <div>
                <label class="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Nama Kelas</label>
                <input type="text" x-model="kelasForm.name" placeholder="Contoh: XII RPL 1" class="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-slate-700 dark:text-white">
              </div>

              <div>
                <label class="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Jurusan</label>
                <select x-model="kelasForm.majorId" class="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-slate-700 dark:text-white">
                  <option value="">Pilih Jurusan</option>
                  <template x-for="j in jurusan" :key="j.id">
                    <option :value="j.id" x-text="j.code + ' - ' + j.name"></option>
                  </template>
                </select>
                <p x-show="jurusan.length === 0" class="text-[10px] text-amber-600 mt-1 font-bold">⚠️ Belum ada data jurusan</p>
              </div>
            </div>
          </div>
          <div class="px-8 py-6 bg-slate-50 dark:bg-slate-800/50 flex flex-col sm:flex-row-reverse gap-3">
            <button @click="saveKelas()" class="w-full sm:w-auto px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold transition-all transform hover:scale-[1.02] active:scale-[0.98]">Simpan Data</button>
            <button @click="closeKelasModal()" class="w-full sm:w-auto px-8 py-3 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 rounded-2xl font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">Batal</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div x-show="isKelasDeleteModalOpen" x-cloak
         class="fixed inset-0 z-[60] overflow-y-auto"
         x-transition:enter="transition ease-out duration-300"
         x-transition:enter-start="opacity-0"
         x-transition:enter-end="opacity-100"
         x-transition:leave="transition ease-in duration-200"
         x-transition:leave-start="opacity-100"
         x-transition:leave-end="opacity-0">
      <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity bg-slate-900/80 backdrop-blur-md" @click="closeKelasDeleteModal()"></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen"></span>
        <div class="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl sm:my-8 sm:align-middle sm:max-w-md sm:w-full border-4 border-rose-500/20">
          <div class="px-8 pt-10 pb-8 text-center">
            <div class="w-24 h-24 bg-rose-50 dark:bg-rose-900/30 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border-4 border-rose-100 dark:border-rose-800 animate-bounce">
              <svg class="w-12 h-12 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </div>
            <h3 class="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight mb-2">Hapus Kelas?</h3>
            <p class="text-slate-500 dark:text-slate-400 mb-8 font-medium">Data kelas <span class="text-rose-500 font-black underline" x-text="kelasToDelete?.name"></span> akan dihapus permanen. Tindakan ini tidak bisa dibatalkan.</p>

            <div class="bg-rose-50 dark:bg-rose-900/20 p-6 rounded-3xl border-2 border-rose-100 dark:border-rose-800 mb-8">
              <label class="block text-[10px] font-black text-rose-600 dark:text-rose-400 uppercase tracking-widest mb-3">Ketik "hapus" untuk konfirmasi</label>
              <input
                type="text"
                x-model="kelasDeleteInput"
                class="w-full px-5 py-3 bg-white dark:bg-slate-900 border-2 border-rose-200 dark:border-rose-800 focus:border-rose-500 focus:ring-0 rounded-2xl text-center font-black text-slate-700 dark:text-white uppercase tracking-widest placeholder:text-slate-300 dark:placeholder:text-slate-700"
                placeholder="---"
              >
            </div>

            <div class="flex flex-col gap-3">
              <button
                @click="confirmDeleteKelas()"
                class="w-full px-8 py-4 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl font-black transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-rose-200 dark:shadow-none"
                :disabled="kelasDeleteInput.toLowerCase() !== 'hapus'"
                :class="{'opacity-50 grayscale cursor-not-allowed': kelasDeleteInput.toLowerCase() !== 'hapus'}"
              >
                YA, HAPUS PERMANEN
              </button>
              <button @click="closeKelasDeleteModal()" class="w-full px-8 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl font-black hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
                BATALKAN
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
`;
}
