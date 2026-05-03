/**
 * View: Bank Soal - Pilihan Ganda Generator
 * Generates multiple choice questions using AI with specific pedagogy criteria
 */
export function soalPilihanGandaView(): string {
  return `
        <!-- Soal Pilihan Ganda View -->
        <div x-show="currentView === 'soal-pilihan-ganda'" x-cloak class="p-6 space-y-6">
          <section>
            <h2 class="text-3xl font-bold text-on-surface dark:text-white">Generator Soal Pilihan Ganda</h2>
            <p class="text-secondary dark:text-slate-400 mt-2">Buat soal pilihan ganda berkualitas tinggi untuk SMK PPLG dengan bantuan AI.</p>
          </section>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-xl">
            <!-- Input Form -->
            <div class="lg:col-span-1 bg-white dark:bg-slate-900 p-xl rounded-2xl border border-slate-200 dark:border-slate-800">
              <h4 class="font-bold text-on-surface dark:text-white mb-xl">Input Data Soal</h4>
              <form @submit.prevent="submitSoalPilihanGanda()" class="space-y-lg">
                 <div class="space-y-2">
                   <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Topik Materi</label>
                   <input type="text" x-model="soalPGForm.topik" @input="saveFormData()" placeholder="Contoh: Array dan Looping" required
                          class="form-input w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg p-3 text-sm focus:border-primary focus:ring focus:ring-primary/20 outline-none dark:text-white">
                 </div>

                 <div class="space-y-2">
                   <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Capaian Pembelajaran (CP)</label>
                   <textarea x-model="soalPGForm.cp" @input="saveFormData()" placeholder="Masukkan CP yang ingin dicapai..."
                             class="form-textarea w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg p-3 text-sm focus:border-primary focus:ring focus:ring-primary/20 outline-none dark:text-white h-24"></textarea>
                 </div>

                 <div class="space-y-2">
                   <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Level Kognitif (Bloom)</label>
                   <select x-model="soalPGForm.levelBloom" @change="saveFormData()" required
                           class="form-select w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg p-3 text-sm focus:border-primary focus:ring focus:ring-primary/20 outline-none dark:text-white">
                     <option value="C3">C3 - Menerapkan (Application)</option>
                     <option value="C4">C4 - Menganalisis (Analysis)</option>
                     <option value="C5">C5 - Mengevaluasi (Evaluation)</option>
                     <option value="HOTS">HOTS - Higher Order Thinking Skills</option>
                   </select>
                 </div>

                 <div class="space-y-2">
                   <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Konteks Industri</label>
                   <textarea x-model="soalPGForm.konteksIndustri" @input="saveFormData()" placeholder="Contoh: Pengembangan aplikasi e-commerce, sistem inventory..."
                             class="form-textarea w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg p-3 text-sm focus:border-primary focus:ring focus:ring-primary/20 outline-none dark:text-white h-20"></textarea>
                 </div>

                 <div class="space-y-2">
                   <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Jumlah Soal</label>
                   <input type="number" x-model="soalPGForm.jumlahSoal" @input="saveFormData()" min="1" max="20" placeholder="5" required
                          class="form-input w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg p-3 text-sm focus:border-primary focus:ring focus:ring-primary/20 outline-none dark:text-white">
                 </div>

                <div class="flex gap-3">
                  <button type="button" @click="resetFormData()"
                          class="flex-1 bg-slate-500 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-600 transition-all">
                    <span class="material-symbols-outlined">refresh</span>
                    <span>Reset Form</span>
                  </button>
                  <button type="submit" :disabled="isGeneratingSoalPG"
                          class="flex-1 bg-primary text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-primary-container transition-all disabled:opacity-50">
                    <span class="material-symbols-outlined" x-text="isGeneratingSoalPG ? 'progress_activity' : 'auto_awesome'"></span>
                    <span x-text="isGeneratingSoalPG ? 'Membuat Soal...' : 'Generate Soal'"></span>
                  </button>
                </div>
              </form>
            </div>

            <!-- Generated Questions Display -->
            <div class="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-xl flex flex-col min-h-[500px]">
              <div x-show="!generatedSoalPG.length && !isGeneratingSoalPG" class="flex-1 flex flex-col items-center justify-center text-center space-y-4">
                <div class="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center">
                  <span class="material-symbols-outlined text-4xl text-slate-300">quiz</span>
                </div>
                <p class="text-slate-400 text-sm max-w-xs">Isi form di samping dan klik Generate untuk membuat soal pilihan ganda secara otomatis.</p>
              </div>

              <div x-show="isGeneratingSoalPG" class="flex-1 flex flex-col items-center justify-center text-center space-y-6">
                <div class="relative w-16 h-16">
                  <div class="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
                  <div class="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
                <div>
                  <h4 class="font-bold text-slate-900 dark:text-white">AI sedang membuat soal</h4>
                  <p class="text-slate-400 text-sm mt-1">Menyusun soal dengan standar industri...</p>
                </div>
              </div>

              <!-- Questions List -->
              <div x-show="generatedSoalPG.length > 0" class="flex-1 overflow-y-auto space-y-6">
                <div class="flex items-center justify-between mb-4">
                  <h3 class="text-xl font-bold text-slate-800 dark:text-white">Hasil Generate Soal</h3>
                  <button @click="saveSoalPilihanGanda()" class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold text-sm transition">
                    Simpan Soal
                  </button>
                </div>

                <template x-for="(soal, index) in generatedSoalPG" :key="index">
                  <div class="bg-slate-50 dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                    <div class="flex items-start gap-4 mb-4">
                      <span class="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm" x-text="soal.nomor"></span>
                      <div class="flex-1">
                        <p class="font-bold text-slate-800 dark:text-white mb-3" x-text="soal.pertanyaan"></p>

                        <!-- Code Snippet (if any) -->
                        <template x-if="soal.kode_snippet">
                          <pre class="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm mb-3 font-mono"><code x-text="soal.kode_snippet"></code></pre>
                        </template>

                        <!-- Options A-E -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                          <template x-for="(opsiText, key) in soal.opsi">
                            <div @click="soal.selectedAnswer = key"
                                 :class="[
                                   'p-3 rounded-lg border-2 cursor-pointer transition-all',
                                   soal.selectedAnswer === key ? 'border-primary bg-primary/10' : 'border-slate-200 dark:border-slate-700 hover:border-primary/50',
                                   soal.jawaban_benar === key ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : ''
                                 ]">
                              <span class="font-bold mr-2" x-text="key + '.'"></span>
                              <span x-text="opsiText"></span>
                            </div>
                          </template>
                        </div>

                        <!-- Explanation (shown after checking answer) -->
                        <div x-show="soal.showExplanation" class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mt-3">
                          <p class="text-sm font-bold text-blue-800 dark:text-blue-300 mb-1">Penjelasan:</p>
                          <p class="text-sm text-blue-700 dark:text-blue-400" x-text="soal.penjelasan"></p>
                        </div>

                        <button @click="soal.showExplanation = !soal.showExplanation"
                                class="text-sm text-primary hover:text-primary-container font-bold mt-2">
                          <span x-text="soal.showExplanation ? 'Sembunyikan' : 'Lihat'">Lihat</span> Penjelasan
                        </button>
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
