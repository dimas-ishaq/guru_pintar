/**
 * View: Student Attendance (Presensi Siswa).
 * Shows date-based attendance with status codes: H/I/S/D/P/A
 */
export function attendanceView(): string {
  return `
        <div x-show="currentView === 'attendance'" x-cloak class="p-6 space-y-6">
          <!-- Header -->
          <div class="flex justify-between items-center">
            <div>
              <h2 class="text-3xl font-black text-slate-800 dark:text-white tracking-tight uppercase">Presensi Siswa</h2>
              <p class="text-slate-500 dark:text-slate-400 mt-1">Catat kehadiran siswa per tanggal</p>
            </div>
            <button @click="exportAttendanceExcel()" class="flex items-center gap-2 px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-xl font-bold transition-all shadow-md">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
              </svg>
              Export Excel
            </button>
          </div>

          <!-- Filters -->
          <div class="flex flex-wrap items-center gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
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

          <!-- Summary Stats -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <template x-for="opt in statusOptions" :key="opt.code">
              <div class="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                <div class="text-xs font-bold text-slate-500 uppercase" x-text="opt.label"></div>
                <div class="text-2xl font-black" :class="opt.class.split(' ')[0] + ' ' + opt.class.split(' ')[1]"
                     x-text="attendanceRecords.filter(a => a.date === selectedDate && a.status === opt.code).length"></div>
              </div>
            </template>
          </div>

          <!-- Student Grid -->
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <template x-for="student in getFilteredStudents()" :key="student.id">
              <div @click="openAttendanceModal(student)"
                   class="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm cursor-pointer transition-all hover:border-indigo-400 hover:shadow-md text-center group relative">
                <!-- Status badge overlay -->
                <div x-show="getStudentStatus(student.id, selectedDate)"
                     :class="statusOptions.find(s => s.code === getStudentStatus(student.id, selectedDate))?.class + ' absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase'"
                     x-text="getStudentStatus(student.id, selectedDate)"></div>

                <div class="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-full mx-auto mb-2 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-black text-2xl group-hover:scale-110 transition-transform" x-text="student.name.charAt(0)"></div>
                <h4 class="font-bold text-slate-800 dark:text-white text-sm truncate" x-text="student.name"></h4>
                <p class="text-xs text-slate-500 dark:text-slate-400" x-text="student.kelas"></p>
                <p x-show="!getStudentStatus(student.id, selectedDate)" class="text-xs text-slate-400 mt-1">Klik untuk absen</p>
              </div>
            </template>
          </div>

          <!-- Attendance Modal -->
          <div x-show="isAttendanceModalOpen" x-cloak class="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" @click="isAttendanceModalOpen = false"></div>
            <div class="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-xs w-full p-6 border border-slate-200 dark:border-slate-800">
              <h3 class="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight mb-2">Set Presensi</h3>
              <p class="text-sm text-slate-600 dark:text-slate-400 mb-3" x-text="students.find(s => s.id === attendanceForm.studentId)?.name || ''"></p>
              <div class="space-y-3">
                <template x-for="opt in statusOptions" :key="opt.code">
                  <button @click="attendanceForm.status = opt.code; saveAttendance()"
                          :class="['w-full p-3 rounded-2xl font-bold transition-all border', opt.class]"
                          x-text="opt.label"></button>
                </template>
              </div>
              <button @click="isAttendanceModalOpen = false" class="w-full mt-4 py-2 text-sm font-bold text-slate-400 hover:text-slate-600">Batal</button>
            </div>
          </div>
        </div>
  `;
}
