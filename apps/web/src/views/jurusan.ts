/**
 * View: Jurusan management — CRUD table with modals.
 * Function names must match alpine/jurusan.ts
 */
export function jurusanView(): string {
  return `
    <div x-show="currentView === 'jurusan'" x-cloak class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-3xl font-black text-slate-800 dark:text-white tracking-tight uppercase">Manajemen Jurusan</h2>
          <p class="text-slate-500 dark:text-slate-400 mt-1">Kelola data kompetensi keahlian yang tersedia di sekolah</p>
        </div>
        <button
          @click="openAddJurusanModal()"
          class="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl transition-all duration-300 shadow-lg shadow-indigo-200 dark:shadow-none hover:scale-[1.02] active:scale-[0.98] font-bold"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"></path>
          </svg>
          Tambah Jurusan
        </button>
      </div>

      <!-- Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <template x-for="item in jurusan" :key="item.id">
          <div class="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col group transition-all hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md">
            <div class="flex justify-between items-start mb-4">
              <div class="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-black text-xl" x-text="item.code"></div>
              <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button @click="openEditJurusan(item)" class="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/30">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                </button>
                <button @click="openJurusanDeleteModal(item)" class="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors rounded-xl hover:bg-rose-50 dark:hover:bg-rose-900/30">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              </div>
            </div>
            <h4 class="font-black text-slate-900 dark:text-white text-lg mb-1 leading-tight" x-text="item.name"></h4>
            <p class="text-xs text-indigo-600 dark:text-indigo-400 font-black uppercase tracking-wider mb-3" x-text="item.code"></p>
            <p class="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 flex-1" x-text="item.description || 'Tidak ada deskripsi'"></p>
          </div>
        </template>

        <!-- Empty State -->
        <template x-if="jurusan.length === 0 && !isJurusanLoading">
          <div class="col-span-3 py-16 flex flex-col items-center">
            <div class="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center mb-5">
              <svg class="w-10 h-10 text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
            </div>
            <h3 class="text-slate-800 dark:text-white font-black text-xl">Belum ada data jurusan</h3>
            <p class="text-slate-500 text-sm mt-2">Klik tombol 'Tambah Jurusan' untuk mulai mengelola.</p>
          </div>
        </template>

        <!-- Loading State -->
        <template x-if="isJurusanLoading">
          <div class="col-span-3 py-16 flex items-center justify-center">
            <div class="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          </div>
        </template>
      </div>

      <!-- Add/Edit Modal -->
      <div x-show="isJurusanModalOpen" x-cloak
           class="fixed inset-0 z-50 overflow-y-auto"
           x-transition:enter="transition ease-out duration-300"
           x-transition:enter-start="opacity-0"
           x-transition:enter-end="opacity-100"
           x-transition:leave="transition ease-in duration-200"
           x-transition:leave-start="opacity-100"
           x-transition:leave-end="opacity-0">
        <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 transition-opacity bg-slate-900/60 backdrop-blur-sm" @click="closeJurusanModal()"></div>
          <span class="hidden sm:inline-block sm:align-middle sm:h-screen"></span>
          <div class="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white dark:bg-slate-900 rounded-3xl shadow-2xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-slate-200 dark:border-slate-800">
            <div class="px-8 py-6">
              <h3 class="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight" x-text="jurusanForm.id ? 'Edit Jurusan' : 'Tambah Jurusan Baru'"></h3>
              <p class="text-slate-500 dark:text-slate-400 mt-1 text-sm">Isi informasi jurusan dengan lengkap dan benar.</p>

              <div class="mt-6 space-y-4">
                <div class="grid grid-cols-3 gap-4">
                  <div class="col-span-2">
                    <label class="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Nama Jurusan</label>
                    <input type="text" x-model="jurusanForm.name" placeholder="Contoh: Rekayasa Perangkat Lunak"
                           class="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all font-semibold text-slate-700 dark:text-white">
                  </div>
                  <div class="col-span-1">
                    <label class="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Kode</label>
                    <input type="text" x-model="jurusanForm.code" placeholder="RPL"
                           class="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all font-black text-slate-700 dark:text-white uppercase">
                  </div>
                </div>
                <div>
                  <label class="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Deskripsi</label>
                  <textarea x-model="jurusanForm.description" rows="3" placeholder="Deskripsi singkat tentang jurusan ini..."
                            class="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all text-slate-700 dark:text-white resize-none"></textarea>
                </div>
              </div>
            </div>
            <div class="px-8 py-6 bg-slate-50 dark:bg-slate-800/50 flex flex-col sm:flex-row-reverse gap-3">
              <button @click="saveJurusan()" class="w-full sm:w-auto px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold transition-all transform hover:scale-[1.02] active:scale-[0.98]">Simpan Data</button>
              <button @click="closeJurusanModal()" class="w-full sm:w-auto px-8 py-3 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 rounded-2xl font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">Batal</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Delete Confirmation Modal -->
      <div x-show="isJurusanDeleteModalOpen" x-cloak
           class="fixed inset-0 z-[60] overflow-y-auto"
           x-transition:enter="transition ease-out duration-300"
           x-transition:enter-start="opacity-0"
           x-transition:enter-end="opacity-100"
           x-transition:leave="transition ease-in duration-200"
           x-transition:leave-start="opacity-100"
           x-transition:leave-end="opacity-0">
        <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 transition-opacity bg-slate-900/80 backdrop-blur-md" @click="closeJurusanDeleteModal()"></div>
          <span class="hidden sm:inline-block sm:align-middle sm:h-screen"></span>
          <div class="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl sm:my-8 sm:align-middle sm:max-w-md sm:w-full border-4 border-rose-500/20">
            <div class="px-8 pt-10 pb-8 text-center">
              <div class="w-24 h-24 bg-rose-50 dark:bg-rose-900/30 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border-4 border-rose-100 dark:border-rose-800 animate-bounce">
                <svg class="w-12 h-12 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </div>
              <h3 class="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight mb-2">Hapus Jurusan?</h3>
              <p class="text-slate-500 dark:text-slate-400 mb-8 font-medium">Jurusan <span class="text-rose-500 font-black underline" x-text="jurusanToDelete?.name"></span> akan dihapus permanen. Semua kelas yang terhubung juga akan terpengaruh.</p>

              <div class="bg-rose-50 dark:bg-rose-900/20 p-6 rounded-3xl border-2 border-rose-100 dark:border-rose-800 mb-8">
                <label class="block text-[10px] font-black text-rose-600 dark:text-rose-400 uppercase tracking-widest mb-3">Ketik "hapus" untuk konfirmasi</label>
                <input
                  type="text"
                  x-model="jurusanDeleteInput"
                  class="w-full px-5 py-3 bg-white dark:bg-slate-900 border-2 border-rose-200 dark:border-rose-800 focus:border-rose-500 focus:ring-0 rounded-2xl text-center font-black text-slate-700 dark:text-white uppercase tracking-widest placeholder:text-slate-300 dark:placeholder:text-slate-700"
                  placeholder="---"
                >
              </div>

              <div class="flex flex-col gap-3">
                <button
                  @click="confirmDeleteJurusan()"
                  class="w-full px-8 py-4 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl font-black transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-rose-200 dark:shadow-none"
                  :disabled="jurusanDeleteInput.toLowerCase() !== 'hapus'"
                  :class="{'opacity-50 grayscale cursor-not-allowed': jurusanDeleteInput.toLowerCase() !== 'hapus'}"
                >
                  YA, HAPUS PERMANEN
                </button>
                <button @click="closeJurusanDeleteModal()" class="w-full px-8 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl font-black hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
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
