/**
 * View: Dashboard — stat cards and recent documents table.
 */
export function dashboardView(): string {
  return `
        <!-- Dashboard View -->
        <div x-show="currentView === 'dashboard'" x-cloak class="p-margin space-y-xl">
          <section class="grid grid-cols-1 md:grid-cols-3 gap-lg">
            <div class="bg-white dark:bg-slate-900 p-lg rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
              <div class="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-600">
                <span class="material-symbols-outlined">description</span>
              </div>
              <div>
                <p class="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Dokumen</p>
                <h3 class="text-2xl font-bold text-slate-900 dark:text-white" x-text="documents.length">0</h3>
              </div>
            </div>
            <div class="bg-white dark:bg-slate-900 p-lg rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
              <div class="w-12 h-12 bg-green-50 dark:bg-green-900/20 rounded-xl flex items-center justify-center text-green-600">
                <span class="material-symbols-outlined">how_to_reg</span>
              </div>
              <div>
                <p class="text-xs text-slate-500 dark:text-slate-400 font-medium">Status Kehadiran</p>
                <h3 class="text-sm font-bold text-slate-900 dark:text-white" x-text="lastCheckIn ? 'Masuk: ' + lastCheckIn : 'Belum Check-in'">Belum Check-in</h3>
              </div>
            </div>
            <div class="bg-white dark:bg-slate-900 p-lg rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
              <div class="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 rounded-xl flex items-center justify-center text-purple-600">
                <span class="material-symbols-outlined">auto_awesome</span>
              </div>
              <div>
                <p class="text-xs text-slate-500 dark:text-slate-400 font-medium">Sisa Kuota AI</p>
                <h3 class="text-2xl font-bold text-slate-900 dark:text-white">98%</h3>
              </div>
            </div>
          </section>

          <section class="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div class="p-lg border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <h3 class="font-bold text-slate-900 dark:text-white">Dokumen Terbaru</h3>
              <button class="text-primary text-sm font-semibold hover:underline">Lihat Semua</button>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
                    <th class="py-4 px-6 font-semibold">Nama Dokumen</th>
                    <th class="py-4 px-6 font-semibold">Tipe</th>
                    <th class="py-4 px-6 font-semibold">Tanggal</th>
                    <th class="py-4 px-6 font-semibold text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                  <template x-for="doc in documents" :key="doc.id">
                    <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td class="py-4 px-6">
                        <div class="flex items-center gap-3">
                          <span class="material-symbols-outlined text-slate-400">description</span>
                          <span class="font-medium text-slate-700 dark:text-slate-200" x-text="doc.title"></span>
                        </div>
                      </td>
                      <td class="py-4 px-6 text-sm text-slate-500 dark:text-slate-400 uppercase" x-text="doc.type"></td>
                      <td class="py-4 px-6 text-sm text-slate-500 dark:text-slate-400" x-text="new Date(doc.createdAt).toLocaleDateString()"></td>
                      <td class="py-4 px-6 text-right">
                        <button class="text-slate-400 hover:text-primary transition-colors">
                          <span class="material-symbols-outlined">more_vert</span>
                        </button>
                      </td>
                    </tr>
                  </template>
                </tbody>
              </table>
            </div>
          </section>
        </div>
  `;
}
