/**
 * View: Jenjang (Education Level) Management.
 */
export function jenjangView(): string {
  return `
    <div x-show="currentView === 'jenjang'" x-cloak class="p-margin flex flex-col gap-8 w-full pb-20">
      <!-- HEADER -->
      <section class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 class="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Manajemen Jenjang</h2>
          <p class="text-slate-500 dark:text-slate-400 mt-1">Kelola tingkat satuan pendidikan (SD, SMP, SMA, SMK, dll).</p>
        </div>
        <button @click="openAddJenjangModal()" 
          class="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all">
          <span class="material-symbols-outlined mr-2">add_circle</span>
          Tambah Jenjang
        </button>
      </section>

      <!-- TABLE SECTION -->
      <div class="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
            <thead class="bg-slate-50 dark:bg-slate-900/50">
              <tr>
                <th class="px-6 py-5 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">ID</th>
                <th class="px-6 py-5 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Nama Jenjang</th>
                <th class="px-6 py-5 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Kode</th>
                <th class="px-6 py-5 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Dibuat Pada</th>
                <th class="px-6 py-5 text-right text-[10px] font-black text-slate-500 uppercase tracking-widest">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
              <tr x-show="isJenjangLoading">
                <td colspan="5" class="px-6 py-20 text-center">
                  <div class="flex flex-col items-center gap-3">
                    <div class="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    <p class="text-sm font-bold text-slate-400">Memuat data...</p>
                  </div>
                </td>
              </tr>

              <tr x-show="!isJenjangLoading && levels.length === 0">
                <td colspan="5" class="px-6 py-20 text-center text-slate-400 font-bold">Belum ada data jenjang.</td>
              </tr>

              <template x-for="item in levels" :key="item.id">
                <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td class="px-6 py-4 text-xs font-mono text-slate-400" x-text="'#' + item.id"></td>
                  <td class="px-6 py-4">
                    <span class="text-sm font-black text-slate-900 dark:text-white" x-text="item.name"></span>
                  </td>
                  <td class="px-6 py-4">
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800" x-text="item.code"></span>
                  </td>
                  <td class="px-6 py-4 text-xs text-slate-500" x-text="new Date(item.createdAt).toLocaleDateString('id-ID')"></td>
                  <td class="px-6 py-4 text-right">
                    <div class="flex items-center justify-end gap-2">
                      <button @click="openEditJenjangModal(item)" class="p-2 text-slate-400 hover:text-indigo-600 rounded-xl transition-all">
                        <span class="material-symbols-outlined text-xl">edit</span>
                      </button>
                      <button @click="openJenjangDeleteModal(item)" class="p-2 text-slate-400 hover:text-red-500 rounded-xl transition-all">
                        <span class="material-symbols-outlined text-xl">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>

      <!-- MODAL: ADD / EDIT -->
      <div x-show="isJenjangModalOpen" class="fixed inset-0 z-[100] overflow-y-auto" x-cloak>
        <div class="flex items-center justify-center min-h-screen p-4 text-center">
          <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" @click="closeJenjangModal()"></div>
          <div class="relative bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-lg p-10 shadow-2xl border border-slate-200 dark:border-slate-800">
            <h3 class="text-2xl font-black mb-8 text-left" x-text="jenjangForm.id ? 'Edit Jenjang' : 'Tambah Jenjang'"></h3>
            <div class="space-y-6 text-left">
              <div class="space-y-2">
                <label class="text-xs font-black uppercase text-slate-500 tracking-widest">Nama Jenjang</label>
                <input type="text" x-model="jenjangForm.name" placeholder="Misal: Sekolah Menengah Kejuruan" 
                  class="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 dark:bg-slate-800 focus:border-indigo-600 outline-none font-bold">
              </div>
              <div class="space-y-2">
                <label class="text-xs font-black uppercase text-slate-500 tracking-widest">Kode</label>
                <input type="text" x-model="jenjangForm.code" placeholder="Misal: SMK" 
                  class="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 dark:bg-slate-800 focus:border-indigo-600 outline-none font-bold">
              </div>
            </div>
            <div class="mt-10 flex gap-4">
              <button @click="saveJenjang()" class="flex-1 bg-indigo-600 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-indigo-700 transition-all">Simpan</button>
              <button @click="closeJenjangModal()" class="px-8 py-4 text-slate-500 font-bold hover:bg-slate-50 rounded-2xl transition-all">Batal</button>
            </div>
          </div>
        </div>
      </div>

      <!-- MODAL: DELETE -->
      <div x-show="isJenjangDeleteModalOpen" class="fixed inset-0 z-[110] overflow-y-auto" x-cloak>
        <div class="flex items-center justify-center min-h-screen p-4 text-center">
          <div class="fixed inset-0 bg-slate-900/80 backdrop-blur-md"></div>
          <div class="relative bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-md p-10 shadow-2xl">
            <div class="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <span class="material-symbols-outlined text-4xl">warning</span>
            </div>
            <h3 class="text-2xl font-black mb-2">Hapus Jenjang?</h3>
            <p class="text-slate-500 text-sm mb-8">Data jenjang <strong x-text="jenjangToDelete?.name"></strong> akan dihapus permanen.</p>
            <div class="space-y-4 mb-8">
              <p class="text-[10px] font-black uppercase tracking-widest text-red-500">Ketik "hapus" untuk konfirmasi</p>
              <input type="text" x-model="jenjangDeleteInput" placeholder="Ketik di sini..." 
                class="w-full px-5 py-4 rounded-2xl border-2 border-red-100 text-center focus:border-red-500 outline-none font-bold">
            </div>
            <button @click="confirmDeleteJenjang()" :disabled="jenjangDeleteInput.toLowerCase() !== 'hapus'"
              class="w-full bg-red-600 text-white font-bold py-4 rounded-2xl hover:bg-red-700 disabled:opacity-30 transition-all">Ya, Hapus Data</button>
            <button @click="closeJenjangDeleteModal()" class="w-full py-4 text-slate-500 font-bold mt-2">Batal</button>
          </div>
        </div>
      </div>
    </div>
  `;
}
