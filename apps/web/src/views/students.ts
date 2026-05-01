export function studentsView(): string {
  return `
      <!-- Data Siswa View -->
      <div x-show="currentView === 'data-siswa'" style="display: none;">
        <div class="flex justify-between items-center mb-8">
          <div>
              <h2 class="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Manajemen Siswa</h2>
              <p class="text-slate-500 dark:text-slate-400 mt-2 text-lg leading-relaxed">Kelola data peserta didik, kelas, dan status akademik secara efisien.</p>
          </div>
          <button @click="openStudentModal()" class="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-2">
            <span class="material-icons-outlined text-sm">add</span>
            Tambah Siswa
          </button>
        </div>

        <div class="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="border-b border-slate-100 dark:border-slate-800">
                  <th class="pb-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">NIS</th>
                  <th class="pb-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Nama Lengkap</th>
                  <th class="pb-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Kelas</th>
                  <th class="pb-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Jurusan</th>
                  <th class="pb-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                  <th class="pb-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                <template x-for="student in students" :key="student.id">
                  <tr class="border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td class="py-4 px-4 text-sm font-semibold text-slate-900 dark:text-white" x-text="student.nis"></td>
                    <td class="py-4 px-4 text-sm text-slate-600 dark:text-slate-300" x-text="student.name"></td>
                    <td class="py-4 px-4 text-sm text-slate-600 dark:text-slate-300">
                      <span class="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300" x-text="student.kelas"></span>
                    </td>
                    <td class="py-4 px-4 text-sm text-slate-600 dark:text-slate-300" x-text="student.jurusan"></td>
                    <td class="py-4 px-4 text-sm">
                      <span class="px-2.5 py-1 rounded-full text-xs font-bold"
                            :class="student.status === 'Aktif' ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'"
                            x-text="student.status"></span>
                    </td>
                    <td class="py-4 px-4 text-right">
                      <div class="flex items-center justify-end gap-2">
                        <button @click="openStudentModal(student)" class="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-primary hover:bg-primary/10 transition-colors">
                          <span class="material-icons-outlined text-sm">edit</span>
                        </button>
                        <button @click="deleteStudent(student.id)" class="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                          <span class="material-icons-outlined text-sm">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                </template>
                <tr x-show="students.length === 0">
                  <td colspan="6" class="py-12 text-center text-slate-400 text-sm">Belum ada data siswa.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Student Modal -->
        <div x-show="isStudentModalOpen" 
             style="display: none;"
             class="fixed inset-0 z-50 flex items-center justify-center"
             x-transition:enter="transition ease-out duration-300"
             x-transition:enter-start="opacity-0"
             x-transition:enter-end="opacity-100"
             x-transition:leave="transition ease-in duration-200"
             x-transition:leave-start="opacity-100"
             x-transition:leave-end="opacity-0">
          
          <div class="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" @click="closeStudentModal()"></div>
          
          <div class="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden border border-slate-100 dark:border-slate-800"
               x-transition:enter="transition ease-out duration-300"
               x-transition:enter-start="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
               x-transition:enter-end="opacity-100 translate-y-0 sm:scale-100"
               x-transition:leave="transition ease-in duration-200"
               x-transition:leave-start="opacity-100 translate-y-0 sm:scale-100"
               x-transition:leave-end="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
            
            <div class="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
              <h3 class="text-xl font-bold text-slate-900 dark:text-white" x-text="studentForm.id ? 'Edit Data Siswa' : 'Tambah Siswa Baru'"></h3>
              <button @click="closeStudentModal()" class="text-slate-400 hover:text-slate-500 dark:hover:text-slate-300 transition-colors">
                <span class="material-icons-outlined">close</span>
              </button>
            </div>

            <div class="p-6">
              <div class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                  <div class="space-y-1">
                    <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">NIS</label>
                    <input type="text" x-model="studentForm.nis" placeholder="e.g. 123456" class="form-input w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg p-2.5 text-sm focus:border-primary focus:ring focus:ring-primary/20 outline-none dark:text-white">
                  </div>
                  <div class="space-y-1">
                    <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</label>
                    <select x-model="studentForm.status" class="form-select w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg p-2.5 text-sm focus:border-primary focus:ring focus:ring-primary/20 outline-none dark:text-white">
                      <option value="Aktif">Aktif</option>
                      <option value="Non-Aktif">Non-Aktif</option>
                    </select>
                  </div>
                </div>

                <div class="space-y-1">
                  <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nama Lengkap</label>
                  <input type="text" x-model="studentForm.name" placeholder="Nama Lengkap" class="form-input w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg p-2.5 text-sm focus:border-primary focus:ring focus:ring-primary/20 outline-none dark:text-white">
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div class="space-y-1">
                    <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Kelas</label>
                    <input type="text" x-model="studentForm.kelas" placeholder="e.g. X-MIPA-1" class="form-input w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg p-2.5 text-sm focus:border-primary focus:ring focus:ring-primary/20 outline-none dark:text-white">
                  </div>
                  <div class="space-y-1">
                    <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Jurusan</label>
                    <input type="text" x-model="studentForm.jurusan" placeholder="e.g. IPA" class="form-input w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg p-2.5 text-sm focus:border-primary focus:ring focus:ring-primary/20 outline-none dark:text-white">
                  </div>
                </div>

              </div>
            </div>

            <div class="p-6 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3 bg-slate-50 dark:bg-slate-900/50">
              <button @click="closeStudentModal()" class="px-5 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                Batal
              </button>
              <button @click="saveStudent()" class="px-5 py-2.5 text-sm font-bold bg-primary hover:bg-primary-dark text-white rounded-xl transition-colors shadow-md hover:shadow-lg">
                Simpan Data
              </button>
            </div>
          </div>
        </div>

      </div>
  `;
}
