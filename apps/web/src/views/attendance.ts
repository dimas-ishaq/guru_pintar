/**
 * View: Student Attendance (Presensi Siswa).
 * Shows date-based attendance with options for Grid View and Table View
 */
export function attendanceView(): string {
  return `
        <div x-show="currentView === 'attendance'" x-cloak class="p-6 space-y-6">
          <!-- Header -->
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 class="text-3xl font-black text-slate-800 dark:text-white tracking-tight uppercase">Presensi Siswa</h2>
              <p class="text-slate-500 dark:text-slate-400 mt-1">Absensi siswa - Tabel & Grid view tersedia</p>
            </div>
            <!-- View toggle and export buttons -->
            <div class="flex items-center gap-2">
              <button @click="switchToView('table')" :class="viewMode === 'table' ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'" class="flex items-center gap-2 px-3 py-1.5 rounded-xl font-bold transition-all">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                Tabel
              </button>
              <button @click="switchToView('grid')" :class="viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'" class="flex items-center gap-2 px-3 py-1.5 rounded-xl font-bold transition-all">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
                Grid
              </button>
              <button @click="exportAttendanceExcel()" class="flex items-center gap-2 px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-xl font-bold transition-all shadow-md">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                </svg>
                Export Excel
              </button>
            </div>
          </div>

          <!-- Filters -->
          <div class="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div class="flex items-center gap-3 flex-wrap">
              <label class="text-xs font-black text-slate-500 uppercase tracking-widest">Tanggal:</label>
              <input type="date" x-model="selectedDate" class="bg-slate-50 dark:bg-slate-800 border-none rounded-lg px-3 py-1.5 text-sm font-bold text-slate-700 dark:text-white focus:ring-2 focus:ring-indigo-500">

              <label class="text-xs font-black text-slate-500 uppercase tracking-widest">Jurusan:</label>
              <select x-model="selectedJurusanId" class="bg-slate-50 dark:bg-slate-800 border-none rounded-lg px-3 py-1.5 text-sm font-bold text-slate-700 dark:text-white focus:ring-2 focus:ring-indigo-500">
                <option value="">Semua Jurusan</option>
                <template x-for="j in jurusan" :key="j.id">
                  <option :value="j.id" x-text="j.code + ' - ' + j.name"></option>
                </template>
              </select>

              <label class="text-xs font-black text-slate-500 uppercase tracking-widest">Kelas:</label>
              <select x-model="selectedKelas" class="bg-slate-50 dark:bg-slate-800 border-none rounded-lg px-3 py-1.5 text-sm font-bold text-slate-700 dark:text-white focus:ring-2 focus:ring-indigo-500">
                <option value="">Semua Kelas</option>
                <template x-for="k in getAvailableKelas()" :key="k">
                  <option :value="k" x-text="k"></option>
                </template>
              </select>
            </div>

            <!-- Search input (for table view) -->
            <div class="flex-1 max-w-sm" x-show="viewMode === 'table'">
              <label class="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Cari Siswa:</label>
              <div class="relative">
                <input type="text" x-model="searchTerm" x-on:input="handleSearchInput()" placeholder="Cari minimal 3 huruf..." class="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-lg pl-10 pr-4 py-1.5 text-sm font-bold text-slate-700 dark:text-white focus:ring-2 focus:ring-indigo-500">
                <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
            </div>
          </div>

          <!-- Summary Stats -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <template x-for="opt in statusOptions" :key="opt.code">
              <div class="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                <div class="text-xs font-bold text-slate-500 uppercase" x-text="opt.label"></div>
                <div class="text-2xl font-black" :class="opt.class.split(' ')[0] + ' ' + opt.class.split(' ')[1]" x-text="attendanceRecords.filter(a => a.date === selectedDate && a.status === opt.code).length"></div>
              </div>
            </template>
          </div>

          <!-- Bulk Actions (Table View) -->
          <div x-show="viewMode === 'table' && getFilteredStudentsTable().length > 0" class="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div class="flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div class="flex items-center gap-3">
                <button @click="selectAllStudents()" class="px-3 py-1.5 text-sm font-bold bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition">Pilih Semua</button>
                <button @click="deselectAllStudents()" class="px-3 py-1.5 text-sm font-bold bg-slate-500 text-white rounded-lg hover:bg-slate-600 transition">Batal Pilih</button>
                <span class="text-sm text-slate-600 dark:text-slate-400" x-text="'Dipilih: ' + selectedStudents.length"></span>
              </div>
              <div class="flex items-center gap-2 flex-wrap">
                <span class="text-sm text-slate-600 dark:text-slate-400">Ubah status:</span>
                <template x-for="opt in statusOptions" :key="opt.code">
                  <button @click="bulkUpdateAttendance(opt.code)" :disabled="selectedStudents.length === 0" :class="['text-xs px-2 py-1 rounded-md font-bold disabled:opacity-50 disabled:cursor-not-allowed transition', ...opt.class.split(' ').slice(0, 2)]" x-text="opt.label"></button>
                </template>
              </div>
            </div>
          </div>

          <!-- Grid View -->
          <div x-show="viewMode === 'grid'" class="flex flex-col gap-6">
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <template x-for="student in getFilteredStudents()" :key="student.id">
                <div @click="openAttendanceModal(student)" class="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm cursor-pointer transition-all hover:border-indigo-400 hover:shadow-md text-center group relative">
                  <!-- Status badge overlay -->
                  <div x-show="getStudentStatus(student.id, selectedDate)" :class="statusOptions.find(s => s.code === getStudentStatus(student.id, selectedDate))?.class + ' absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase'" x-text="getStudentStatus(student.id, selectedDate)"></div>
                  <div class="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-full mx-auto mb-2 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-black text-2xl group-hover:scale-110 transition-transform" x-text="student.name.charAt(0)"></div>
                  <h4 class="font-bold text-slate-800 dark:text-white text-sm truncate" x-text="student.name"></h4>
                  <p class="text-xs text-slate-500 dark:text-slate-400" x-text="student.kelas"></p>
                  <p x-show="!getStudentStatus(student.id, selectedDate)" class="text-xs text-slate-400 mt-1">Klik untuk absen</p>
                </div>
              </template>
            </div>
          </div>

          <!-- Table View (Bulk Attendance) -->
          <div x-show="viewMode === 'table'" class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead class="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th class="px-6 py-4 text-left">
                      <input type="checkbox" @change="toggleAllTableStudents($event.target.checked)" :checked="getFilteredStudentsTable().length > 0 && selectedStudents.length === getFilteredStudentsTable().length">
                    </th>
                    <th class="px-6 py-4 text-left text-sm font-black text-slate-600 dark:text-slate-400 uppercase tracking-wide">Nama</th>
                                        <th class="px-6 py-4 text-left text-sm font-black text-slate-600 dark:text-slate-400 uppercase tracking-wide">NIS</th>
                                        <th class="px-6 py-4 text-left text-sm font-black text-slate-600 dark:text-slate-400 uppercase tracking-wide">Kelas</th>
                                        <th class="px-6 py-4 text-left text-sm font-black text-slate-600 dark:text-slate-400 uppercase tracking-wide">Jurusan</th>
                                        <th class="px-6 py-4 text-left text-sm font-black text-slate-600 dark:text-slate-400 uppercase tracking-wide">Status</th>
                                      </tr>
                                    </thead>
                                    <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                                      <template x-if="getFilteredStudentsTable().length === 0">
                                        <tr>
                                          <td colspan="6" class="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                                            <template x-if="filteredStudentsTableLoading">
                                              <span>Sedang mencari...</span>
                                            </template>
                                            <template x-if="!filteredStudentsTableLoading">
                                              <span x-text="searchTerm.length < 3 ? 'Masukkan minimal 3 huruf untuk mencari' : 'Tidak ada siswa yang ditemukan'"></span>
                                            </template>
                                          </td>
                                        </tr>
                                      </template>
                                      <template x-for="student in getFilteredStudentsTable()" :key="student.id">
                                        <tr class="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                          <td class="px-6 py-4">
                                            <input type="checkbox" @change="toggleStudentSelection(student.id, $event.target.checked)" :checked="selectedStudents.includes(student.id)">
                                          </td>
                                          <td class="px-6 py-4">
                                            <div class="font-bold text-slate-800 dark:text-white" x-text="student.name"></div>
                                          </td>
                                          <td class="px-6 py-4 text-slate-600 dark:text-slate-300" x-text="student.nis || '-'"></td>
                                          <td class="px-6 py-4 text-slate-600 dark:text-slate-300" x-text="student.kelas"></td>
                                          <td class="px-6 py-4">
                                            <span x-text="getJurusanName(student.majorId)" class="text-slate-600 dark:text-slate-300"></span>
                                          </td>
                                          <td class="px-6 py-4">
                                            <div class="flex items-center gap-1 flex-wrap">
                                              <template x-for="opt in statusOptions" :key="opt.code">
                                                <button @click="updateSingleAttendance(student.id, opt.code)" :class="['text-xs px-2 py-1 rounded-md font-bold transition-all border-2', getStudentStatus(student.id, selectedDate) === opt.code ? opt.class : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-transparent']" x-text="opt.label"></button>
                                              </template>
                                            </div>
                                          </td>
                                        </tr>
                                      </template>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Attendance Modal (Single Student - used by both views) -->
          <div x-show="isAttendanceModalOpen" x-cloak class="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" @click="isAttendanceModalOpen = false"></div>
            <div class="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-xs w-full p-6 border border-slate-200 dark:border-slate-800">
              <h3 class="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight mb-2">Set Presensi</h3>
              <p class="text-sm text-slate-600 dark:text-slate-400 mb-3" x-text="students.find(s => s.id === attendanceForm.studentId)?.name || ''"></p>
              <div class="space-y-3">
                <template x-for="opt in statusOptions" :key="opt.code">
                  <button @click="attendanceForm.status = opt.code; saveAttendance()" :class="['w-full p-3 rounded-2xl font-bold transition-all border', opt.class]" x-text="opt.label"></button>
                </template>
              </div>
              <button @click="isAttendanceModalOpen = false" class="w-full mt-4 py-2 text-sm font-bold text-slate-400 hover:text-slate-600">Batal</button>
            </div>
          </div>
        </div>
  `;
}
