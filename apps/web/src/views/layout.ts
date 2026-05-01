/**
 * Layout: Full HTML page shell — head, sidebar, header, main wrapper.
 * Composes the Alpine script, Tailwind config, and view content.
 */
import { tailwindConfig } from '../config/tailwind';
import { appScript } from '../alpine/app';

export function renderPage(viewContent: string): string {
  return `<!DOCTYPE html>
<html class="light" lang="id">
<head>
  <meta charset="utf-8"/>
  <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
  <title>EduZen AI - Admin Guru Pintar</title>
  <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
  <script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet"/>
  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
  <script>${tailwindConfig()}</script>
  <style>
    .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
    [x-cloak] { display: none !important; }
  </style>
  <script>${appScript()}</script>
</head>
<body class="bg-background dark:bg-slate-950 text-on-background dark:text-slate-200 antialiased transition-colors duration-300" x-data="app()" x-init="init()">

  ${sidebarHtml()}
  ${headerHtml()}

  <!-- Main Content -->
  <main 
    :class="sidebarCollapsed ? 'ml-20' : 'ml-64'"
    class="pt-16 min-h-screen transition-all duration-300">
    ${viewContent}
  </main>
</body>
</html>`;
}

export function renderAuthPage(viewContent: string): string {
  return `<!DOCTYPE html>
<html class="light" lang="id">
<head>
  <meta charset="utf-8"/>
  <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
  <title>Login - EduZen AI</title>
  <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
  <script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet"/>
  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
  <script>${tailwindConfig()}</script>
  <style>
    .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
    [x-cloak] { display: none !important; }
  </style>
</head>
<body class="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 antialiased transition-colors duration-300">
  ${viewContent}
</body>
</html>`;
}

function sidebarHtml(): string {
  return `
  <!-- Sidebar -->
  <aside 
    :class="sidebarCollapsed ? 'w-20' : 'w-64'"
    class="h-screen border-r fixed left-0 top-0 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 flex flex-col py-8 px-4 gap-y-2 z-50 transition-all duration-300">
    
    <!-- Logo & Toggle -->
    <div class="mb-8 px-2 flex items-center justify-between">
      <div class="flex items-center gap-3 overflow-hidden">
        <div class="w-8 h-8 bg-primary rounded flex items-center justify-center text-white shrink-0">
          <span class="material-symbols-outlined text-sm">auto_awesome</span>
        </div>
        <h1 x-show="!sidebarCollapsed" x-transition:enter="transition ease-out duration-200" x-transition:enter-start="opacity-0 -translate-x-2" x-transition:enter-end="opacity-100 translate-x-0" class="text-xl font-bold text-slate-900 dark:text-white tracking-tighter whitespace-nowrap">EduZen AI</h1>
      </div>
      <button @click="sidebarCollapsed = !sidebarCollapsed" class="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 transition-colors">
        <span class="material-symbols-outlined text-lg" x-text="sidebarCollapsed ? 'menu_open' : 'menu'"></span>
      </button>
    </div>

    <nav class="flex-1 space-y-1 overflow-y-auto overflow-x-hidden">
      <template x-for="item in navItems" :key="item.id">
        <div class="space-y-1">
          <!-- Regular menu item -->
          <template x-if="!item.children">
            <button
              @click="currentView = item.id"
              :class="currentView === item.id ? 'bg-white text-primary font-semibold border border-slate-200 shadow-sm' : 'text-slate-600 hover:bg-slate-100'"
              class="w-full flex items-center gap-3 p-2.5 rounded-lg transition-all text-sm group relative"
            >
              <span class="material-symbols-outlined text-lg shrink-0" x-text="item.icon" :style="currentView === item.id ? 'font-variation-settings: \\'FILL\\' 1;' : ''"></span>
              <span x-show="!sidebarCollapsed" x-transition class="whitespace-nowrap overflow-hidden">
                <span x-text="item.label"></span>
              </span>
              <!-- Tooltip for collapsed mode -->
              <div x-show="sidebarCollapsed" class="absolute left-14 bg-slate-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                <span x-text="item.label"></span>
              </div>
            </button>
          </template>
          <!-- Group menu item with submenu -->
          <template x-if="item.children">
            <div class="space-y-1">
              <button
                @click="sidebarCollapsed ? (sidebarCollapsed = false, toggleGroup(item.id)) : toggleGroup(item.id)"
                class="w-full px-2 py-2 flex items-center justify-between text-xs font-medium text-slate-500 uppercase tracking-wider hover:bg-slate-100/50 rounded-lg transition-all group"
              >
                <div class="flex items-center gap-2 overflow-hidden">
                  <span class="material-symbols-outlined text-sm shrink-0" x-text="item.icon"></span>
                  <span x-show="!sidebarCollapsed" x-transition class="whitespace-nowrap" x-text="item.label"></span>
                </div>
                <span x-show="!sidebarCollapsed" class="material-symbols-outlined text-sm transition-transform duration-300" :class="groupState[item.id] ? 'rotate-180' : ''">expand_more</span>
              </button>
              <div x-show="groupState[item.id] && !sidebarCollapsed" x-transition class="space-y-1">
                <template x-for="child in item.children" :key="child.id">
                  <button
                    @click="currentView = child.id"
                    :class="currentView === child.id ? 'bg-white text-primary font-semibold border border-slate-200 shadow-sm' : 'text-slate-600 hover:bg-slate-100'"
                    class="w-full flex items-center gap-3 p-2.5 rounded-lg transition-all text-sm pl-10 group relative"
                  >
                    <span class="material-symbols-outlined text-lg shrink-0" x-text="child.icon" :style="currentView === child.id ? 'font-variation-settings: \\'FILL\\' 1;' : ''"></span>
                    <span x-show="!sidebarCollapsed" x-transition class="whitespace-nowrap" x-text="child.label"></span>
                  </button>
                </template>
              </div>
            </div>
          </template>
        </div>
      </template>
    </nav>

    <div class="mt-auto pt-6 border-t border-slate-200 flex items-center gap-3 px-2 overflow-hidden">
      <div class="w-10 h-10 rounded-full bg-primary-container dark:bg-primary dark:text-white flex items-center justify-center font-bold shrink-0 shadow-sm">SJ</div>
      <div x-show="!sidebarCollapsed" x-transition class="flex flex-col overflow-hidden">
        <span class="text-sm font-semibold text-slate-900 dark:text-white truncate">Sarah Jenkins</span>
        <span class="text-xs text-slate-500 dark:text-slate-400 truncate">Dep. Sains</span>
      </div>
    </div>
  </aside>`;
}

function headerHtml(): string {
  return `
  <!-- Header -->
  <header 
    :class="sidebarCollapsed ? 'ml-20 w-[calc(100%-5rem)]' : 'ml-64 w-[calc(100%-16rem)]'"
    class="fixed top-0 right-0 h-16 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center px-8 transition-all duration-300">
    <div class="flex items-center flex-1 max-w-md">
      <div class="relative w-full text-slate-400">
        <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-lg">search</span>
        <input class="form-input w-full bg-slate-50 border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 text-slate-900 dark:bg-slate-800 dark:text-white" placeholder="Cari sumber daya..." type="text"/>
      </div>
    </div>
    <div class="flex items-center gap-4 text-slate-500">
      <button @click="toggleDarkMode()" class="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center justify-center">
        <span class="material-symbols-outlined" x-text="darkMode ? 'light_mode' : 'dark_mode'"></span>
      </button>
      <span class="material-symbols-outlined cursor-pointer hover:text-primary">notifications</span>
      <span class="material-symbols-outlined cursor-pointer hover:text-primary">help_outline</span>
      <div class="h-8 w-px bg-slate-200 mx-2"></div>
      <button @click="logout()" class="flex items-center gap-2 hover:text-primary transition-all">
        <span class="material-symbols-outlined">logout</span>
        <span class="text-sm font-medium">Keluar</span>
      </button>
    </div>
  </header>`;
}
