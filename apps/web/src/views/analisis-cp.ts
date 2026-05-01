/**
 * View: Analisis CP & ATP — Refined with Tailwind Forms.
 */
export function analisisCPView(): string {
  return `
    <div x-show="currentView === 'analisis-cp'" x-cloak class="p-margin flex flex-col gap-10 w-full pb-20">
      <!-- SCRIPTS FOR EXPORT -->
      <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>

      <!-- 1. HEADER -->
      <section class="w-full">
        <h2 class="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">Analisis CP &amp; ATP</h2>
        <p class="text-slate-500 dark:text-slate-400 mt-4 text-lg md:text-xl leading-relaxed max-w-3xl">Dekonstruksi Capaian Pembelajaran menjadi Alur Tujuan Pembelajaran yang sistematis menggunakan standar kurikulum terbaru.</p>
      </section>

      <!-- 2. FORM INPUT (VERTICAL STACK) -->
      <div class="w-full bg-white dark:bg-slate-900 p-8 md:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-10">
        <!-- Section: Konfigurasi Dasar -->
        <div class="space-y-8">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <span class="material-symbols-outlined text-2xl">tune</span>
            </div>
            <div>
              <h4 class="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Konfigurasi Perencanaan</h4>
              <p class="text-sm text-slate-500 font-medium leading-none">Lengkapi parameter utama kurikulum Anda</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Nama Sekolah -->
            <div class="flex flex-col gap-2">
              <label class="text-sm font-semibold text-slate-700 dark:text-slate-300">Nama Sekolah</label>
              <input type="text" x-model="cpForm.nama_sekolah" placeholder="Contoh: SMK Negeri 1 Jakarta" 
                class="form-input block w-full rounded-xl border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white shadow-sm focus:border-primary focus:ring focus:ring-primary/20 focus:ring-opacity-50">
            </div>

            <!-- Nama Guru -->
            <div class="flex flex-col gap-2">
              <label class="text-sm font-semibold text-slate-700 dark:text-slate-300">Nama Guru Pengampu</label>
              <input type="text" x-model="cpForm.nama_guru" placeholder="Contoh: Ahmad Subardjo, S.Kom" 
                class="form-input block w-full rounded-xl border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white shadow-sm focus:border-primary focus:ring focus:ring-primary/20 focus:ring-opacity-50">
            </div>

            <!-- Nama Kepala Sekolah -->
            <div class="flex flex-col gap-2">
              <label class="text-sm font-semibold text-slate-700 dark:text-slate-300">Nama Kepala Sekolah</label>
              <input type="text" x-model="cpForm.nama_kepsek" placeholder="Nama Kepala Sekolah & Gelar" 
                class="form-input block w-full rounded-xl border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white shadow-sm focus:border-primary focus:ring focus:ring-primary/20 focus:ring-opacity-50">
            </div>

            <!-- Tahun Ajaran -->
            <div class="flex flex-col gap-2">
              <label class="text-sm font-semibold text-slate-700 dark:text-slate-300">Tahun Ajaran</label>
              <input type="text" x-model="cpForm.tahun_ajaran" placeholder="2024/2025" 
                class="form-input block w-full rounded-xl border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white shadow-sm focus:border-primary focus:ring focus:ring-primary/20 focus:ring-opacity-50">
            </div>

            <!-- Mata Pelajaran -->
            <div class="flex flex-col gap-2">
              <label class="text-sm font-semibold text-slate-700 dark:text-slate-300">Mata Pelajaran</label>
              <input type="text" x-model="cpForm.mapel" placeholder="Contoh: Matematika" required 
                class="form-input block w-full rounded-xl border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white shadow-sm focus:border-primary focus:ring focus:ring-primary/20 focus:ring-opacity-50">
            </div>

            <!-- Kurikulum -->
            <div class="flex flex-col gap-2">
              <label class="text-sm font-semibold text-slate-700 dark:text-slate-300">Kurikulum</label>
              <select x-model="cpForm.kurikulum" 
                class="form-select block w-full rounded-xl border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white shadow-sm focus:border-primary focus:ring focus:ring-primary/20 focus:ring-opacity-50 font-medium">
                <option value="Merdeka">Kurikulum Merdeka</option>
                <option value="K13">Kurikulum 2013 (K13)</option>
              </select>
            </div>

            <!-- Fase / Kelas -->
            <div class="flex flex-col gap-2">
              <label class="text-sm font-semibold text-slate-700 dark:text-slate-300">Fase / Kelas</label>
              <select x-model="cpForm.fase" required 
                class="form-select block w-full rounded-xl border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white shadow-sm focus:border-primary focus:ring focus:ring-primary/20 focus:ring-opacity-50 font-medium">
                <option value="">Pilih Fase</option>
                <optgroup label="Sekolah Dasar (SD)">
                  <option value="Fase A (Kelas 1-2)">Fase A (Kelas 1-2)</option>
                  <option value="Fase B (Kelas 3-4)">Fase B (Kelas 3-4)</option>
                  <option value="Fase C (Kelas 5-6)">Fase C (Kelas 5-6)</option>
                </optgroup>
                <optgroup label="SMP">
                  <option value="Fase D (Kelas 7-9)">Fase D (Kelas 7-9)</option>
                </optgroup>
                <optgroup label="SMA/SMK">
                  <option value="Fase E (Kelas 10)">Fase E (Kelas 10)</option>
                  <option value="Fase F (Kelas 11-12)">Fase F (Kelas 11-12)</option>
                </optgroup>
              </select>
            </div>

            <!-- Mode Analisis -->
            <div class="flex flex-col gap-2">
              <label class="text-sm font-semibold text-slate-700 dark:text-slate-300">Mode Analisis</label>
              <select x-model="cpForm.mode" 
                class="form-select block w-full rounded-xl border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white shadow-sm focus:border-primary focus:ring focus:ring-primary/20 focus:ring-opacity-50 font-medium">
                <option value="Tahunan">Tahunan (Penuh)</option>
                <option value="Semester">Semester (Parsial)</option>
              </select>
            </div>

            <!-- Alokasi JP -->
            <div class="flex flex-col gap-2">
              <label class="text-sm font-semibold text-slate-700 dark:text-slate-300">Alokasi Waktu (JP)</label>
              <input type="number" x-model="cpForm.jp" placeholder="72" 
                class="form-input block w-full rounded-xl border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white shadow-sm focus:border-primary focus:ring focus:ring-primary/20 focus:ring-opacity-50">
            </div>

            <!-- Menit / JP -->
            <div class="flex flex-col gap-2">
              <label class="text-sm font-semibold text-slate-700 dark:text-slate-300">Durasi (Menit/JP)</label>
              <input type="number" x-model="cpForm.jp_duration" placeholder="45" 
                class="form-input block w-full rounded-xl border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white shadow-sm focus:border-primary focus:ring focus:ring-primary/20 focus:ring-opacity-50">
            </div>

            <!-- Semester (Conditional) -->
            <div class="flex flex-col gap-2" x-show="cpForm.mode === 'Semester'">
              <label class="text-sm font-semibold text-slate-700 dark:text-slate-300">Pilih Semester</label>
              <select x-model="cpForm.semester" 
                class="form-select block w-full rounded-xl border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white shadow-sm focus:border-primary focus:ring focus:ring-primary/20 focus:ring-opacity-50 font-medium">
                <option value="1">Semester 1 (Ganjil)</option>
                <option value="2">Semester 2 (Genap)</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Section: Daftar Elemen -->
        <div class="space-y-8 pt-10 border-t border-slate-100 dark:border-slate-800">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-600">
                <span class="material-symbols-outlined text-2xl">format_list_bulleted</span>
              </div>
              <div>
                <h4 class="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Daftar Elemen &amp; CP Spesifik</h4>
                <p class="text-sm text-slate-500 font-medium tracking-tight leading-none">Klik tombol tambah untuk setiap elemen kompetensi</p>
              </div>
            </div>
            <button type="button" @click="addElement()" 
              class="inline-flex items-center px-6 py-3 border border-transparent text-sm font-bold rounded-xl shadow-sm text-white bg-primary hover:bg-primary-container focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all">
              <span class="material-symbols-outlined mr-2 text-lg">add_circle</span>
              Tambah Elemen
            </button>
          </div>

          <!-- List Elemen (Single Column) -->
          <div class="flex flex-col gap-6">
            <template x-for="(item, index) in elements" :key="index">
              <div class="p-6 bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4 relative group">
                <div class="flex justify-between items-center">
                  <div class="flex items-center gap-3">
                    <span class="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-white text-xs font-black" x-text="index + 1"></span>
                    <span class="text-sm font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest">Detail Elemen</span>
                  </div>
                  <button type="button" @click="removeElement(index)" 
                    class="p-2 text-slate-400 hover:text-red-500 transition-colors">
                    <span class="material-symbols-outlined text-xl">close</span>
                  </button>
                </div>

                <div class="flex flex-col gap-4">
                  <div class="flex flex-col gap-2">
                    <label class="text-xs font-bold text-slate-500 uppercase tracking-tight ml-1">Nama Elemen</label>
                    <input type="text" x-model="elements[index].name" placeholder="Misal: Berpikir Komputasional" 
                      class="form-input block w-full rounded-xl border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-white shadow-sm focus:border-primary focus:ring focus:ring-primary/20">
                  </div>
                  <div class="flex flex-col gap-2">
                    <label class="text-xs font-bold text-slate-500 uppercase tracking-tight ml-1">Teks Capaian Pembelajaran (CP)</label>
                    <textarea x-model="item.cp" placeholder="Tempel teks CP di sini..." rows="4" 
                      class="form-textarea block w-full rounded-xl border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-white shadow-sm focus:border-primary focus:ring focus:ring-primary/20"></textarea>
                  </div>

                  <!-- Kolom Input Materi/Topik -->
                  <div class="mt-4 p-4 bg-indigo-50/50 dark:bg-indigo-900/20 rounded-2xl border-2 border-dashed border-indigo-100 dark:border-indigo-800/50">
                    <div class="flex items-center gap-2 mb-2">
                      <span class="material-symbols-outlined text-indigo-500 text-sm">inventory_2</span>
                      <label class="text-[11px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Materi / Topik Utama (Opsional)</label>
                    </div>
                    <input type="text" x-model="item.materi" 
                      placeholder="Contoh: Tipe Data, Logika Proposisi, atau Algoritma..." 
                      class="form-input block w-full rounded-xl border-white dark:border-slate-700 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm py-2.5 dark:bg-slate-800">
                    <p class="text-[10px] text-slate-400 mt-2 italic">Kosongkan jika ingin AI menganalisis materi secara otomatis dari teks CP di atas.</p>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>

        <!-- Submit & Reset Buttons -->
        <div class="flex flex-col md:flex-row items-center justify-center gap-4 pt-6">
          <button @click="generateATP()" :disabled="isAnalyzing" 
            class="inline-flex items-center px-10 py-4 border border-transparent text-lg font-bold rounded-2xl shadow-xl text-white bg-primary hover:bg-primary-container focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 transition-all group w-full md:w-auto">
            <span class="material-symbols-outlined mr-3 text-2xl group-hover:rotate-12 transition-transform" x-text="isAnalyzing ? 'sync' : 'auto_awesome'"></span>
            <span x-text="isAnalyzing ? 'Menganalisis...' : 'Mulai Analisis AI'"></span>
          </button>
          
          <button @click="resetForm()" :disabled="isAnalyzing"
            class="inline-flex items-center px-8 py-4 border-2 border-slate-200 dark:border-slate-700 text-lg font-bold rounded-2xl text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 focus:outline-none transition-all w-full md:w-auto">
            <span class="material-symbols-outlined mr-2">restart_alt</span>
            Reset Formulir
          </button>
        </div>
      </div>

      <!-- 3. HASIL ANALISIS (BAWAH) -->
      <div id="results-section" class="w-full flex flex-col gap-10">
        <!-- Empty State -->
        <div x-show="!analisisResult && !isAnalyzing" 
          class="p-20 flex flex-col items-center justify-center text-center bg-slate-50 dark:bg-slate-800/20 rounded-[2.5rem] border-4 border-dashed border-slate-200 dark:border-slate-800">
          <div class="w-24 h-24 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center shadow-lg mb-6">
            <span class="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-700">inventory</span>
          </div>
          <h4 class="text-2xl font-black text-on-surface dark:text-white">Siap Menganalisis Kurikulum?</h4>
          <p class="text-slate-500 max-w-sm mt-2">Lengkapi formulir di atas dan biarkan AI menyusun ATP yang logis untuk Anda.</p>
        </div>

        <!-- Loading State -->
        <div x-show="isAnalyzing" 
          class="p-20 flex flex-col items-center justify-center text-center bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
          <div class="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-6"></div>
          <h4 class="text-2xl font-black text-on-surface dark:text-white">AI Sedang Merumuskan...</h4>
          <p class="text-slate-500 mt-2">Menganalisis KKO dan menyusun urutan materi.</p>
        </div>

        <!-- ATP Display -->
        <div x-show="analisisResult" class="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <!-- ACTION BUTTONS -->
          <div class="flex flex-wrap items-center justify-end gap-3 px-2">
            <button @click="saveToDatabase()" :disabled="isSaving"
              class="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-all shadow-sm disabled:opacity-50">
              <span class="material-symbols-outlined mr-2 text-lg" x-text="isSaving ? 'sync' : 'database'"></span>
              <span x-text="isSaving ? 'Menyimpan...' : 'Simpan ke Database'"></span>
            </button>
            <button @click="exportToPDF()"
              class="inline-flex items-center px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold rounded-xl transition-all shadow-sm">
              <span class="material-symbols-outlined mr-2 text-lg">picture_as_pdf</span>
              Ekspor PDF
            </button>
            <button @click="exportToWord()"
              class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-all shadow-sm">
              <span class="material-symbols-outlined mr-2 text-lg">description</span>
              Ekspor Word
            </button>
          </div>

          <div id="export-container" class="flex flex-col gap-8">
            <div class="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">

            <div class="flex items-center gap-4">
              <div class="w-14 h-14 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-600 shrink-0">
                <span class="material-symbols-outlined text-3xl">verified_user</span>
              </div>
              <div class="overflow-hidden">
                <h2 class="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Analisis Selesai</h2>
                <div class="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                  <div class="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                    <span class="material-symbols-outlined text-sm">school</span>
                    <span x-text="cpForm.nama_sekolah || '-'"></span>
                  </div>
                  <div class="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                    <span class="material-symbols-outlined text-sm">person</span>
                    <span x-text="'Guru: ' + (cpForm.nama_guru || '-')"></span>
                  </div>
                  <div class="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                    <span class="material-symbols-outlined text-sm">badge</span>
                    <span x-text="'Kepsek: ' + (cpForm.nama_kepsek || '-')"></span>
                  </div>
                  <div class="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                    <span class="material-symbols-outlined text-sm">calendar_today</span>
                    <span x-text="cpForm.tahun_ajaran || '-'"></span>
                  </div>
                </div>
              </div>
            </div>
            <div class="text-right">
              <span class="text-[10px] font-black uppercase text-slate-400 tracking-widest">Skor Logika</span>
              <p class="text-4xl font-black text-primary leading-none" x-text="analisisResult?.skor_keselarasan + '%'"></p>
            </div>
          </div>          <div class="flex flex-col gap-12">
            <!-- Semester 1 -->
            <div class="flex flex-col gap-4">
              <div class="flex items-center gap-3 px-2">
                <div class="w-2 h-8 bg-indigo-500 rounded-full"></div>
                <h5 class="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Semester 1 (Ganjil)</h5>
              </div>
              
              <div class="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <table class="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                  <thead class="bg-slate-50 dark:bg-slate-900/50">
                    <tr>
                      <th class="px-4 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Elemen</th>
                      <th class="px-4 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Taksonomi</th>
                      <th class="px-4 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest w-1/3">Tujuan Pembelajaran (TP)</th>
                      <th class="px-4 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Materi</th>
                      <th class="px-4 py-4 text-center text-[10px] font-black text-slate-500 uppercase tracking-widest">JP</th>
                      <th class="px-4 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">P5 / Catatan AI</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white dark:bg-slate-900 divide-y divide-slate-100 dark:divide-slate-800">
                    <template x-for="(item, index) in (analisisResult?.atp_table?.filter(i => String(i.semester).includes('1') || String(i.semester).toLowerCase().includes('ganjil') || String(i.semester).toLowerCase().includes('1')) || [])" :key="index">
                      <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                        <td class="px-4 py-5 align-top text-nowrap">
                          <span class="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded-md" x-text="item.elemen"></span>
                        </td>
                        <td class="px-4 py-5 align-top">
                          <span class="text-[10px] font-black text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 whitespace-nowrap" x-text="item.taksonomi || '-'"></span>
                        </td>
                        <td class="px-4 py-5 align-top">
                          <p class="text-sm font-semibold text-slate-900 dark:text-white leading-relaxed" x-text="item.tp"></p>
                        </td>
                        <td class="px-4 py-5 align-top">
                          <span class="text-xs text-slate-600 dark:text-slate-400 font-medium" x-text="item.materi || '-'"></span>
                        </td>
                        <td class="px-4 py-5 align-top text-center">
                          <span class="text-sm font-black text-primary" x-text="(item.jp || '-')"></span>
                        </td>
                        <td class="px-4 py-5 align-top">
                          <div class="flex flex-col gap-2">
                            <span x-show="item.p5" class="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full self-start" x-text="item.p5"></span>
                            <p class="text-[10px] text-slate-400 italic leading-snug" x-text="item.catatan_ai"></p>
                          </div>
                        </td>
                      </tr>
                    </template>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Semester 2 -->
            <div class="flex flex-col gap-4">
              <div class="flex items-center gap-3 px-2">
                <div class="w-2 h-8 bg-emerald-500 rounded-full"></div>
                <h5 class="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Semester 2 (Genap)</h5>
              </div>

              <div class="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <table class="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                  <thead class="bg-slate-50 dark:bg-slate-900/50">
                    <tr>
                      <th class="px-4 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Elemen</th>
                      <th class="px-4 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Taksonomi</th>
                      <th class="px-4 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest w-1/3">Tujuan Pembelajaran (TP)</th>
                      <th class="px-4 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Materi</th>
                      <th class="px-4 py-4 text-center text-[10px] font-black text-slate-500 uppercase tracking-widest">JP</th>
                      <th class="px-4 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">P5 / Catatan AI</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white dark:bg-slate-900 divide-y divide-slate-100 dark:divide-slate-800">
                    <template x-for="(item, index) in (analisisResult?.atp_table?.filter(i => String(i.semester).includes('2') || String(i.semester).toLowerCase().includes('genap') || String(i.semester).toLowerCase().includes('2')) || [])" :key="index">
                      <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                        <td class="px-4 py-5 align-top text-nowrap">
                          <span class="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-md" x-text="item.elemen"></span>
                        </td>
                        <td class="px-4 py-5 align-top">
                          <span class="text-[10px] font-black text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 whitespace-nowrap" x-text="item.taksonomi || '-'"></span>
                        </td>
                        <td class="px-4 py-5 align-top">
                          <p class="text-sm font-semibold text-slate-900 dark:text-white leading-relaxed" x-text="item.tp"></p>
                        </td>
                        <td class="px-4 py-5 align-top">
                          <span class="text-xs text-slate-600 dark:text-slate-400 font-medium" x-text="item.materi || '-'"></span>
                        </td>
                        <td class="px-4 py-5 align-top text-center">
                          <span class="text-sm font-black text-primary" x-text="(item.jp || '-')"></span>
                        </td>
                        <td class="px-4 py-5 align-top">
                          <div class="flex flex-col gap-2">
                            <span x-show="item.p5" class="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full self-start" x-text="item.p5"></span>
                            <p class="text-[10px] text-slate-400 italic leading-snug" x-text="item.catatan_ai"></p>
                          </div>
                        </td>
                      </tr>
                    </template>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

        <!-- Debug Section (Optional/Hidden by default but helpful) -->
        <div x-show="analisisResult && (!analisisResult.atp_table || analisisResult.atp_table.length === 0)" class="p-8 bg-amber-50 border-2 border-amber-200 rounded-3xl mt-10">
          <div class="flex items-center gap-3 text-amber-700 mb-4">
            <span class="material-symbols-outlined">warning</span>
            <h6 class="font-bold uppercase tracking-tight">Debug: Data Terdeteksi tapi Tabel Kosong</h6>
          </div>
          <p class="text-sm text-amber-800 mb-4">AI mengembalikan data, namun sistem gagal memetakan tabelnya ke dalam semester. Berikut adalah data mentahnya:</p>
          <pre class="bg-white p-4 rounded-xl text-[10px] overflow-auto max-h-60 border border-amber-200" x-text="JSON.stringify(analisisResult, null, 2)"></pre>
        </div>
      </div>
    </div>
  `;
}
