/**
 * View: Attendance — check-in/check-out cards.
 */
export function attendanceView(): string {
  return `
        <!-- Attendance View -->
        <div x-show="currentView === 'attendance'" x-cloak class="p-margin space-y-xl">
          <section>
            <h2 class="text-3xl font-bold text-on-surface dark:text-white">Presensi Digital</h2>
            <p class="text-secondary dark:text-slate-400 mt-2">Catat kehadiran Anda dan kelola riwayat presensi harian.</p>
          </section>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-xl">
            <div class="bg-white dark:bg-slate-900 p-xl rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
              <span class="material-symbols-outlined text-6xl text-primary mb-4">login</span>
              <h4 class="text-xl font-bold dark:text-white">Check-in</h4>
              <p class="text-sm text-slate-500 mb-6" x-text="lastCheckIn ? 'Sudah check-in pukul ' + lastCheckIn : 'Klik tombol di bawah untuk mulai bekerja'"></p>
              <button @click="checkIn()" :disabled="lastCheckIn" class="w-full bg-primary text-white font-bold py-3 rounded-xl disabled:bg-slate-100 disabled:text-slate-400">Presensi Masuk</button>
            </div>
            <div class="bg-white dark:bg-slate-900 p-xl rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
              <span class="material-symbols-outlined text-6xl text-orange-500 mb-4">logout</span>
              <h4 class="text-xl font-bold dark:text-white">Check-out</h4>
              <p class="text-sm text-slate-500 mb-6" x-text="lastCheckOut ? 'Sudah check-out pukul ' + lastCheckOut : 'Klik tombol di bawah setelah selesai mengajar'"></p>
              <button @click="checkOut()" :disabled="!lastCheckIn || lastCheckOut" class="w-full bg-orange-500 text-white font-bold py-3 rounded-xl disabled:bg-slate-100 disabled:text-slate-400">Presensi Keluar</button>
            </div>
          </div>
        </div>
  `;
}
