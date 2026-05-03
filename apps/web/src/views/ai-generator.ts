/**
 * View: AI Generator — form input and result preview for PROTA, PROSEM, KKTP, Modul Ajar.
 */
export function aiGeneratorView(): string {
  return `
        <!-- AI Generator View -->
        <div x-show="currentView.startsWith('ai-')" x-cloak class="p-margin space-y-xl">
          <section>
            <h2 class="text-3xl font-bold text-on-surface dark:text-white" x-text="navItems.find(n => n.children?.find(c => c.id === currentView))?.children.find(c => c.id === currentView).label">Generator</h2>
            <p class="text-secondary dark:text-slate-400 mt-2">Gunakan kecerdasan buatan untuk menyusun administrasi guru secara instan.</p>
          </section>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-xl">
            <div class="lg:col-span-1 bg-white dark:bg-slate-900 p-xl rounded-2xl border border-slate-200 dark:border-slate-800">
              <h4 class="font-bold text-on-surface dark:text-white mb-xl">Input Data</h4>
              <form @submit.prevent="submitForm()" class="space-y-lg">
                <div class="space-y-2">
                  <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nama Sekolah</label>
                  <input type="text" x-model="formData.schoolName" placeholder="Contoh: SMA Negeri 1 Jakarta" required class="form-input w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg p-3 text-sm focus:border-primary focus:ring focus:ring-primary/20 outline-none dark:text-white">
                </div>
                <div class="space-y-2">
                  <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mata Pelajaran</label>
                  <input type="text" x-model="formData.subject" placeholder="Contoh: Fisika" required class="form-input w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg p-3 text-sm focus:border-primary focus:ring focus:ring-primary/20 outline-none dark:text-white">
                </div>
                <div class="space-y-2">
                  <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Kurikulum</label>
                  <select x-model="formData.kurikulum" required class="form-select w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg p-3 text-sm focus:border-primary focus:ring focus:ring-primary/20 outline-none dark:text-white">
                    <option value="Merdeka">Kurikulum Merdeka</option>
                    <option value="K13">Kurikulum 2013 (K13)</option>
                  </select>
                </div>
                <div class="space-y-2">
                  <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Kelas / Fase</label>
                  <select x-model="formData.grade" required class="form-select w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg p-3 text-sm focus:border-primary focus:ring focus:ring-primary/20 outline-none dark:text-white">
                    <option value="">Pilih Fase</option>
                    <option value="Fase A (Kelas 1-2)">Fase A (Kelas 1-2)</option>
                    <option value="Fase B (Kelas 3-4)">Fase B (Kelas 3-4)</option>
                    <option value="Fase C (Kelas 5-6)">Fase C (Kelas 5-6)</option>
                    <option value="Fase D (Kelas 7-9)">Fase D (Kelas 7-9)</option>
                    <option value="Fase E (Kelas 10)">Fase E (Kelas 10)</option>
                    <option value="Fase F (Kelas 11-12)">Fase F (Kelas 11-12)</option>
                  </select>
                </div>

                <!-- Fields for PROTA -->
                <template x-if="currentView === 'ai-prota'">
                  <div class="space-y-lg">
                    <div class="space-y-2">
                      <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tahun Ajaran</label>
                      <input type="text" x-model="formData.academicYear" placeholder="Contoh: 2024/2025" class="form-input w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg p-3 text-sm focus:border-primary focus:ring focus:ring-primary/20 outline-none dark:text-white">
                    </div>
                    <div class="space-y-2">
                      <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Capaian Pembelajaran (CP) / ATP</label>
                      <textarea x-model="formData.cp" placeholder="Masukkan CP atau ATP" class="form-textarea w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg p-3 text-sm focus:border-primary focus:ring focus:ring-primary/20 outline-none dark:text-white h-32"></textarea>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                      <div class="space-y-2">
                        <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Gaya Belajar</label>
                        <select x-model="formData.learningStyle" class="form-select w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg p-3 text-sm focus:border-primary focus:ring focus:ring-primary/20 outline-none dark:text-white">
                          <option value="visual">Visual</option>
                          <option value="project">Project</option>
                          <option value="praktik">Praktik</option>
                        </select>
                      </div>
                      <div class="space-y-2">
                        <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Fokus</label>
                        <select x-model="formData.focus" class="form-select w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg p-3 text-sm focus:border-primary focus:ring focus:ring-primary/20 outline-none dark:text-white">
                          <option value="konsep">Konsep</option>
                          <option value="praktik">Praktik</option>
                        </select>
                      </div>
                    </div>
                    <div class="space-y-2">
                      <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tingkat Kesulitan</label>
                      <select x-model="formData.difficulty" class="form-select w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg p-3 text-sm focus:border-primary focus:ring focus:ring-primary/20 outline-none dark:text-white">
                        <option value="dasar">Dasar</option>
                        <option value="menengah">Menengah</option>
                        <option value="lanjut">Lanjut</option>
                      </select>
                    </div>
                  </div>
                </template>

                <div class="space-y-2" x-show="currentView === 'ai-modul' || currentView === 'ai-materi-ajar'">
                  <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Topik Pembelajaran</label>
                  <input type="text" x-model="formData.topic" placeholder="Contoh: Hukum Newton" class="form-input w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg p-3 text-sm focus:border-primary focus:ring focus:ring-primary/20 outline-none dark:text-white">
                </div>
                <!-- LKPD fields -->
                <template x-if="currentView === 'ai-lkpd'">
                  <div class="space-y-lg">
                    <div class="space-y-2">
                      <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Topik / Judul LKPD</label>
                      <input type="text" x-model="formData.topic" placeholder="Contoh: LKPD Hukum Newton" class="form-input w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg p-3 text-sm focus:border-primary focus:ring focus:ring-primary/20 outline-none dark:text-white">
                    </div>
                    <div class="space-y-2">
                      <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Capaian Pembelajaran (CP) / ATP</label>
                      <textarea x-model="formData.cp" placeholder="Masukkan CP dan/atau ATP yang ingin dicapai" class="form-textarea w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg p-3 text-sm focus:border-primary focus:ring focus:ring-primary/20 outline-none dark:text-white h-28"></textarea>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                      <div class="space-y-2">
                        <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Kelompok / Individu</label>
                        <select x-model="formData.activityType" class="form-select w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg p-3 text-sm focus:border-primary focus:ring focus:ring-primary/20 outline-none dark:text-white">
                          <option value="individu">Individu</option>
                          <option value="kelompok">Kelompok</option>
                        </select>
                      </div>
                      <div class="space-y-2">
                        <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Jumlah Pertemuan</label>
                        <input type="number" x-model="formData.meetings" placeholder="1" min="1" max="10" class="form-input w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg p-3 text-sm focus:border-primary focus:ring focus:ring-primary/20 outline-none dark:text-white">
                      </div>
                    </div>
                  </div>
                </template>
                <button type="submit" :disabled="isGenerating" class="w-full bg-primary text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-primary-container transition-all disabled:opacity-50">
                  <span class="material-symbols-outlined" x-text="isGenerating ? 'progress_activity' : 'auto_awesome'"></span>
                  <span x-text="isGenerating ? 'Membangun Konten...' : 'Generate Sekarang'"></span>
                </button>
              </form>
            </div>

            <div class="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-xl flex flex-col min-h-[500px]">
              <div x-show="!lastGenerated && !isGenerating" class="flex-1 flex flex-col items-center justify-center text-center space-y-4">
                <div class="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center">
                  <span class="material-symbols-outlined text-4xl text-slate-300">article</span>
                </div>
                <p class="text-slate-400 text-sm max-w-xs">Isi form di samping dan klik generate untuk membuat konten administrasi secara otomatis.</p>
              </div>

              <div x-show="isGenerating" class="flex-1 flex flex-col items-center justify-center text-center space-y-6">
                <div class="relative w-16 h-16">
                  <div class="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
                  <div class="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
                <div>
                  <h4 class="font-bold text-slate-900 dark:text-white">EduZen AI sedang bekerja</h4>
                  <p class="text-slate-400 text-sm mt-1">Menganalisis kurikulum dan menyusun teks...</p>
                </div>
              </div>

              <div x-show="lastGenerated" x-html="lastGenerated" class="flex-1 overflow-y-auto"></div>
            </div>
          </div>
        </div>
  `;
}
