/**
 * View: Login Page — Elegant and modern design.
 */
export function loginView(): string {
  return `
    <div x-data="login()" class="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950">
      <div class="w-full max-w-md">
        <!-- Logo/Header -->
        <div class="text-center mb-10">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl text-white shadow-xl shadow-primary/20 mb-6 animate-in zoom-in-50 duration-500">
            <span class="material-symbols-outlined text-3xl">auto_awesome</span>
          </div>
          <h1 class="text-4xl font-black text-slate-900 dark:text-white tracking-tighter mb-2">EduZen AI</h1>
          <p class="text-slate-500 dark:text-slate-400 font-medium">Asisten Digital Guru Pintar SMK</p>
        </div>

        <!-- Login Card -->
        <div class="bg-white dark:bg-slate-900 p-8 md:p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 animate-in slide-in-from-bottom-8 duration-700">
          <form @submit.prevent="handleLogin()" class="space-y-6">
            <div class="space-y-2">
              <label class="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Email Sekolah</label>
              <div class="relative">
                <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">mail</span>
                <input type="email" x-model="email" required placeholder="admin@sekolah.sch.id" 
                  class="form-input block w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 text-sm font-medium dark:text-white transition-all">
              </div>
            </div>

            <div class="space-y-2">
              <div class="flex justify-between items-center px-1">
                <label class="text-xs font-bold text-slate-500 uppercase tracking-widest">Kata Sandi</label>
                <a href="#" class="text-[11px] font-bold text-primary hover:underline">Lupa sandi?</a>
              </div>
              <div class="relative">
                <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">lock</span>
                <input :type="showPassword ? 'text' : 'password'" x-model="password" required placeholder="••••••••" 
                  class="form-input block w-full pl-12 pr-12 py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 text-sm font-medium dark:text-white transition-all">
                <button type="button" @click="showPassword = !showPassword" class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <span class="material-symbols-outlined text-lg" x-text="showPassword ? 'visibility_off' : 'visibility'"></span>
                </button>
              </div>
            </div>

            <div class="flex items-center gap-2 px-1">
              <input type="checkbox" id="remember" class="form-checkbox h-4 w-4 text-primary rounded border-slate-300 focus:ring-primary/20">
              <label for="remember" class="text-xs font-medium text-slate-500">Ingat saya di perangkat ini</label>
            </div>

            <button type="submit" :disabled="loading" 
              class="w-full py-4 bg-primary text-white rounded-2xl font-black tracking-wide shadow-lg shadow-primary/20 hover:bg-primary-container hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none flex items-center justify-center gap-2">
              <span x-show="!loading">Masuk ke Dashboard</span>
              <span x-show="loading" class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span x-show="!loading" class="material-symbols-outlined text-sm">login</span>
            </button>
          </form>

          <!-- Footer -->
          <div class="mt-8 pt-8 border-t border-slate-50 dark:border-slate-800 text-center">
            <p class="text-xs text-slate-500">Belum punya akun? <a href="#" class="font-bold text-primary hover:underline">Hubungi Admin</a></p>
          </div>
        </div>

        <!-- System Status -->
        <div class="mt-8 flex items-center justify-center gap-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          <span class="flex items-center gap-1.5"><span class="w-2 h-2 bg-green-500 rounded-full"></span> System Online</span>
          <span>Version 1.2.0</span>
        </div>
      </div>
    </div>

    <script>
      function login() {
        return {
          email: '',
          password: '',
          showPassword: false,
          loading: false,

          async handleLogin() {
            this.loading = true;
            try {
              const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: this.email, password: this.password })
              });

              if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || 'Login gagal');
              }

              const data = await response.json();
              localStorage.setItem('token', data.token);
              localStorage.setItem('user', JSON.stringify(data.user));
              
              window.location.href = '/';
            } catch (e) {
              alert(e.message);
            } finally {
              this.loading = false;
            }
          }
        }
      }
    </script>
  `;
}
