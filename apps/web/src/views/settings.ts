/**
 * View: Settings — API key configuration and connection test.
 */
export function settingsView(): string {
  return `
        <!-- Settings View -->
        <div x-show="currentView === 'settings'" x-cloak class="p-margin space-y-xl">
          <section>
            <h2 class="text-3xl font-bold text-on-surface dark:text-white">Pengaturan</h2>
            <p class="text-secondary dark:text-slate-400 mt-2">Konfigurasi API AI dan preferensi aplikasi Anda.</p>
          </section>

          <div class="max-w-2xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div class="p-xl space-y-xl">
              <div class="space-y-4">
                <div class="flex items-center gap-2">
                  <span class="material-symbols-outlined text-primary">hub</span>
                  <h4 class="font-bold dark:text-white">AI Provider</h4>
                </div>
                <div class="space-y-4">
                 <div class="grid grid-cols-3 gap-2 p-1 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                     <button @click="settings.provider = 'openai'" :class="settings.provider === 'openai' ? 'bg-white dark:bg-slate-700 shadow-sm text-primary' : 'text-slate-500'" class="py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1">
                       <img src="https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg" class="w-3 h-3 dark:invert" x-show="settings.provider === 'openai'">
                       OpenAI
                     </button>
                     <button @click="settings.provider = 'google'" :class="settings.provider === 'google' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600' : 'text-slate-500'" class="py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1">
                       <img src="https://www.gstatic.com/lamda/images/favicon_v2_16x16.png" class="w-3 h-3" x-show="settings.provider === 'google'">
                       Gemini
                     </button>
                     <button @click="settings.provider = 'nvidia'" :class="settings.provider === 'nvidia' ? 'bg-white dark:bg-slate-700 shadow-sm text-green-600' : 'text-slate-500'" class="py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1">
                       <img src="https://developer.nvidia.com/sites/default/files/akamai/nvidia-logo.png" class="w-3 h-3 object-contain" x-show="settings.provider === 'nvidia'">
                       Nvidia
                     </button>
                   </div>
                </div>

                <div class="space-y-lg">
                  <div class="space-y-2">
                     <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider" x-text="settings.provider === 'openai' ? 'OpenAI API Key' : settings.provider === 'google' ? 'Google AI API Key' : 'Nvidia API Key'"></label>
                    <div class="relative">
                      <input :type="showApiKey ? 'text' : 'password'" x-model="settings.apiKey" :placeholder="settings.provider === 'openai' ? 'sk-...' : settings.provider === 'google' ? 'AIza...' : 'nvapi-...'" class="form-input w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg p-3 pr-12 text-sm focus:border-primary focus:ring focus:ring-primary/20 outline-none dark:text-white">
                      <button @click="showApiKey = !showApiKey" type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors">
                        <span class="material-symbols-outlined text-xl" x-text="showApiKey ? 'visibility_off' : 'visibility'"></span>
                      </button>
                    </div>
                  </div>
                   <div class="space-y-2" x-show="settings.provider === 'openai'">
                     <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Custom Base URL (Opsional)</label>
                     <input type="text" x-model="settings.baseUrl" placeholder="https://api.openai.com/v1" class="form-input w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg p-3 text-sm focus:border-primary focus:ring focus:ring-primary/20 outline-none dark:text-white">
                   </div>
                   <div class="space-y-2" x-show="settings.provider === 'nvidia'">
                     <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Base URL (Otomatis)</label>
                     <input type="text" value="https://integrate.api.nvidia.com/v1" disabled class="form-input w-full border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-700 rounded-lg p-3 text-sm text-slate-500 dark:text-slate-400 cursor-not-allowed">
                   </div>
                  <div class="space-y-2">
                    <div class="flex items-center justify-between">
                      <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Model AI</label>
                      <button @click="fetchModels()" type="button" class="text-[10px] font-bold text-primary hover:underline flex items-center gap-1" :disabled="isLoadingModels">
                        <span class="material-symbols-outlined text-xs" :class="isLoadingModels ? 'animate-spin' : ''">sync</span>
                        Ambil Daftar Model
                      </button>
                    </div>
                    <div class="relative">
                      <select x-model="settings.selectedModel" class="form-select w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg p-3 text-sm focus:border-primary focus:ring focus:ring-primary/20 outline-none dark:text-white">
                        <option value="">-- Pilih Model --</option>
                        <template x-for="model in availableModels" :key="model">
                          <option :value="model" x-text="model" :selected="settings.selectedModel === model"></option>
                        </template>
                      </select>
                    </div>
                    <p class="text-[10px] text-slate-400" x-show="!availableModels.length">Klik 'Ambil Daftar Model' untuk melihat model yang tersedia pada akun Anda.</p>
                  </div>
                </div>
              </div>

              <!-- Konfigurasi Prompt -->
              <div class="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                <div class="flex items-center gap-2">
                  <span class="material-symbols-outlined text-primary">edit_note</span>
                  <h4 class="font-bold dark:text-white">Konfigurasi Prompt AI</h4>
                </div>
                <div class="space-y-lg">
                  <div class="space-y-2">
                    <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Prompt Analisis CP</label>
                    <textarea x-model="settings.promptAnalisisCP" rows="3" class="form-textarea w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg p-3 text-sm focus:border-primary focus:ring focus:ring-primary/20 outline-none dark:text-white"></textarea>
                  </div>
                  <div class="space-y-2">
                    <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Prompt ATP</label>
                    <textarea x-model="settings.promptATP" rows="3" class="form-textarea w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg p-3 text-sm focus:border-primary focus:ring focus:ring-primary/20 outline-none dark:text-white"></textarea>
                  </div>
                </div>
              </div>

              <div class="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-4">
                <button @click="saveSettings()" class="bg-primary text-white font-bold px-8 py-3 rounded-xl hover:bg-primary-container transition-all">Simpan Konfigurasi</button>
                <button @click="testConnection()" class="px-8 py-3 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800">Tes Koneksi</button>

                <div x-show="connectionStatus === 'success'" class="flex items-center gap-2 text-green-600 text-sm font-bold animate-in fade-in">
                  <span class="material-symbols-outlined text-lg">check_circle</span>
                  Berhasil Terhubung
                </div>
                <div x-show="connectionStatus === 'error'" class="flex items-center gap-2 text-red-600 text-sm font-bold animate-in fade-in">
                  <span class="material-symbols-outlined text-lg">error</span>
                  Koneksi Gagal
                </div>
                <div x-show="connectionStatus === 'testing'" class="flex items-center gap-2 text-primary text-sm font-bold animate-pulse">
                  <span class="material-symbols-outlined text-lg">sync</span>
                  Menghubungkan...
                </div>
              </div>
            </div>
          </div>
        </div>
  `;
}
