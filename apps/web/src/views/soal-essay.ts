/**
 * View: Bank Soal - Essay Generator
 * Generates essay questions with HOTS focus
 */
export function soalEssayView(): string {
  return `
        <!-- Soal Essay View -->
        <div x-show="currentView === 'soal-essay'" x-cloak class="p-6 space-y-6">
          <section>
            <h2 class="text-3xl font-bold text-on-surface dark:text-white">Generator Soal Essay</h2>
            <p class="text-secondary dark:text-slate-400 mt-2">Buat soal essay berbasis HOTS dengan stimulus untuk SMK PPLG.</p>
          </section>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-xl">
            <!-- Input Form -->
            <div class="lg:col-span-1 bg-white dark:bg-slate-900 p-xl rounded-2xl border border-slate-200 dark:border-slate-800">
              <h4 class="font-bold text-on-surface dark:text-white mb-xl">Input Data Soal Essay</h4>
              <form @submit.prevent="submitSoalEssay()" class="space-y-lg">
                <div class="space-y-2">
                  <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mata Pelajaran</label>
                  <input type="text" x-model="essayForm.subject" placeholder="Contoh: Sistem Operasi" required
                         class="form-input w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg p-3 text-sm focus:border-primary focus:ring focus:ring-primary/20 outline-none dark:text-white">
                </div>

                <div class="space-y-2">
                  <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Topik</label>
                  <input type="text" x-model="essayForm.topic" placeholder="Contoh: Linux Command Line" required
                         class="form-input w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg p-3 text-sm focus:border-primary focus:ring focus:ring-primary/20 outline-none dark:text-white">
                </div>

                <div class="space-y-2">
                  <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tujuan Pembelajaran (CP)</label>
                  <textarea x-model="essayForm.learningGoal" placeholder="Capaian pembelajaran yang ingin dicapai..."
                            class="form-textarea w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg p-3 text-sm focus:border-primary focus:ring focus:ring-primary/20 outline-none dark:text-white h-24"></textarea>
                </div>

                <div class="space-y-2">
                  <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Jenis Stimulus</label>
                  <select x-model="essayForm.stimulusType" required
                          class="form-select w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg p-3 text-sm focus:border-primary focus:ring focus:ring-primary/20 outline-none dark:text-white">
                    <option value="teks">Teks</option>
                    <option value="skenario">Skenario</option>
                    <option value="data">Data</option>
                    <option value="kasus">Kasus</option>
                  </select>
                </div>

                <div class="space-y-2">
                  <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Level Kognitif</label>
                  <select x-model="essayForm.questionLevel" required
                          class="form-select w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg p-3 text-sm focus:border-primary focus:ring focus:ring-primary/20 outline-none dark:text-white">
                    <option value="L2">L2 - Aplikasi</option>
                    <option value="L3">L3 - HOTS (Analisis/Evaluasi/Kreasi)</option>
                  </select>
                </div>

                <div class="space-y-2">
                  <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Jumlah Soal</label>
                  <input type="number" x-model="essayForm.totalQuestions" min="1" max="5" placeholder="3" required
                         class="form-input w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg p-3 text-sm focus:border-primary focus:ring focus:ring-primary/20 outline-none dark:text-white">
                </div>

                <button type="submit" :disabled="isGeneratingEssay"
                        class="w-full bg-primary text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-primary-container transition-all disabled:opacity-50">
                  <span class="material-symbols-outlined" x-text="isGeneratingEssay ? 'progress_activity' : 'auto_awesome'"></span>
                  <span x-text="isGeneratingEssay ? 'Membuat Soal...' : 'Generate Soal Essay'"></span>
                </button>
              </form>
            </div>

            <!-- Generated Questions Display -->
            <div class="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-xl flex flex-col min-h-[500px]">
              <div x-show="!generatedEssay.length && !isGeneratingEssay" class="flex-1 flex flex-col items-center justify-center text-center space-y-4">
                <div class="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center">
                  <span class="material-symbols-outlined text-4xl text-slate-300">edit_note</span>
                </div>
                <p class="text-slate-400 text-sm max-w-xs">Isi form di samping dan klik Generate untuk membuat soal essay dengan bantuan AI.</p>
              </div>

              <div x-show="isGeneratingEssay" class="flex-1 flex flex-col items-center justify-center text-center space-y-6">
                <div class="relative w-16 h-16">
                  <div class="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
                  <div class="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
                <div>
                  <h4 class="font-bold text-slate-900 dark:text-white">AI sedang membuat soal</h4>
                  <p class="text-slate-400 text-sm mt-1">Menyusun soal essay dengan stimulus...</p>
                </div>
              </div>

              <!-- Questions List -->
              <div x-show="generatedEssay.length > 0" class="flex-1 overflow-y-auto space-y-6">
                <div class="flex items-center justify-between mb-4">
                  <h3 class="text-xl font-bold text-slate-800 dark:text-white">Hasil Generate Soal Essay</h3>
                  <button @click="saveSoalEssay()" class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold text-sm transition">
                    Simpan Soal
                  </button>
                </div>

                <template x-for="(soal, index) in generatedEssay" :key="index">
                  <div class="bg-slate-50 dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                    <div class="flex items-start gap-4 mb-4">
                      <div class="bg-slate-900 text-white rounded-lg w-12 h-12 flex-shrink-0 flex items-center justify-center font-bold text-xl" x-text="soal.nomor + ''"></div>
                      <div class="flex-1">
                        <!-- Stimulus -->
                        <div class="mb-4">
                          <p class="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">Stimulus</p>
                          <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-blue-800 dark:text-blue-300 italic"
                               x-text="soal.stimulus"></div>
                        </div>

                        <!-- Pertanyaan -->
                        <div class="mb-4">
                          <p class="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">Pertanyaan</p>
                          <p class="font-bold text-slate-800 dark:text-white" x-text="soal.pertanyaan"></p>
                        </div>

                        <!-- Kunci Jawaban -->
                        <div class="mb-4">
                          <p class="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-wider mb-2">Kunci Jawaban</p>
                          <p class="text-slate-700 dark:text-slate-300" x-text="soal.kunci_jawaban"></p>
                        </div>

                        <!-- Rubrik Penilaian -->
                        <div class="mb-4">
                          <p class="text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-3">Rubrik Penilaian</p>
                          <div class="bg-slate-100 dark:bg-slate-700 rounded-lg p-4 space-y-2">
                            <template x-for="(skor, sk) in soal.rubrik">
                              <div class="flex items-start gap-3">
                                <div class="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0"
                                     :class="{'bg-green-500': sk=='4', 'bg-yellow-500': sk=='3', 'bg-orange-500': sk=='2', 'bg-red-500': sk=='1'}"
                                     x-text="sk"></div>
                                <p class="text-sm text-slate-700 dark:text-slate-300" x-text="skor"></p>
                              </div>
                            </template>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
  `;
}
