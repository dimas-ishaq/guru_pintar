/**
 * Alpine.js main app composer.
 * Imports all feature modules and combines them into a single Alpine data function.
 */
import { dashboardData } from './dashboard';
import { analisisCPData } from './analisis-cp';
import { aiGeneratorData } from './ai-generator';
import { attendanceData } from './attendance';
import { jurusanData } from './jurusan';
import { settingsData } from './settings';
import { studentsData } from './students';
import { kelasData } from './kelas';
import { subjectsData } from './subjects';
import { usersData } from './users';
import { soalPilihanGandaData } from './soal-pilihan-ganda';
import { soalEssayData } from './soal-essay';

/**
 * Returns the full inline <script> content for the Alpine.js app function.
 * Escapes </script> to prevent premature script tag closing.
 */
export function appScript(): string {
  const defaultPromptAnalisisCP = 'Anda adalah Pakar Kurikulum Merdeka yang menganalisis CP menjadi ATP yang logis, terukur, relevan dengan jurusan, dan hanya mengembalikan JSON.';
  const raw = `
        window.app = function app() {
          return {
            currentView: 'dashboard',
            darkMode: false,
            sidebarCollapsed: false,
            groupState: {
              ai: true,
              management: true
            },

            toggleGroup(id) {
              this.groupState[id] = !this.groupState[id];
            },

            toggleDarkMode() {
              this.darkMode = !this.darkMode;
              document.documentElement.classList.toggle('dark', this.darkMode);
              localStorage.setItem('darkMode', this.darkMode ? 'dark' : 'light');
            },

            navItems: [
              { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
              {
                id: 'soal',
                label: 'Bank Soal',
                icon: 'quiz',
                isGroup: true,
                children: [
                  { id: 'soal-essay', label: 'Soal Essay', icon: 'edit_note' },
                  { id: 'soal-pilihan-ganda', label: 'Pilihan Ganda', icon: 'list_alt' },
                ]
              },
              {
                id: 'ai',
                label: 'Generator AI',
                icon: 'auto_awesome',
                isGroup: true,
                children: [
                  { id: 'analisis-cp', label: 'Analisis CP & ATP', icon: 'psychology' },
                  { id: 'ai-prota', label: 'PROTA', icon: 'description' },
                  { id: 'ai-prosem', label: 'PROSEM', icon: 'calendar_today' },
                  { id: 'ai-kktp', label: 'KKTP', icon: 'check_circle' },
                  { id: 'ai-modul', label: 'Modul Ajar', icon: 'school' },
                                    { id: 'ai-lkpd', label: 'LKPD', icon: 'assignment' },
                                  ]
              },
              { id: 'attendance', label: 'Kehadiran', icon: 'fact_check' },
              { id: 'profile', label: 'Profil', icon: 'person' },
              {
                id: 'management',
                label: 'Manajemen Data',
                icon: 'folder_managed',
                isGroup: true,
                children: [
                  { id: 'jurusan', label: 'Jurusan', icon: 'school' },
                  { id: 'kelas', label: 'Kelas', icon: 'class' },
                  { id: 'mata-pelajaran', label: 'Mata Pelajaran', icon: 'school' },
                  { id: 'data-siswa', label: 'Data Siswa', icon: 'people' },
                ]
              },
              { id: 'account', label: 'Manajemen Akun', icon: 'people' },
              { id: 'settings', label: 'Pengaturan', icon: 'settings' },
            ],

            // ── Dashboard ──────────────────────────
            ${dashboardData()}

            // ── Analisis CP & ATP ───────────────────
            ${analisisCPData()}

            // ── AI Generator ────────────────────────
            ${aiGeneratorData()}

            // ── Attendance ──────────────────────────
            ${attendanceData()}

            // ── Jurusan Management ──────────────────
            ${jurusanData()}

            // ── Settings ────────────────────────────
            ${settingsData()}

            // ── Student Data ────────────────────────
            ${studentsData()}

            // ── Kelas Management ────────────────────
            ${kelasData()}

            // ── Subjects Management ─────────────────────
                        ${subjectsData()}

                        // ── Users Management ────────────────────────
                        ${usersData()}

                        // ── Soal Pilihan Ganda ─────────────────────
                        ${soalPilihanGandaData()}

                        // ── Soal Essay ─────────────────────
                        ${soalEssayData()}

                        // ── Auth Helper ────────────────────────────
                                    checkAuth() {
                                      const token = localStorage.getItem('token');
                                      if (!token) {
                                        this.logout();
                                        return false;
                                      }
                                      return true;
                                    },

                                    // Helper for authenticated fetch
                                    async authFetch(url, options = {}) {
                                      const token = localStorage.getItem('token');
                                      if (!token) {
                                        this.logout();
                                        throw new Error('Unauthorized');
                                      }
                                      const response = await fetch(url, {
                                        ...options,
                                        headers: {
                                          'Content-Type': 'application/json',
                                          'Authorization': 'Bearer ' + token,
                                          ...options.headers,
                                        },
                                      });
                                      if (response.status === 401) {
                                        alert('Sesi Anda telah berakhir. Silakan login kembali.');
                                        this.logout();
                                        throw new Error('Session expired');
                                      }
                                      return response;
                                    },

                                    // ── Initialization ──────────────────────
                                    async init() {
                                      // Check session first
                                      if (!this.checkAuth()) return;

                                      this.darkMode = localStorage.getItem('darkMode') === 'dark';
              if (this.darkMode) document.documentElement.classList.add('dark');

              this.settings.apiKey = localStorage.getItem('apiKey') || '';
              this.settings.baseUrl = localStorage.getItem('baseUrl') || '';
              this.settings.provider = localStorage.getItem('provider') || 'openai';
               this.settings.selectedModel = localStorage.getItem('selectedModel') || (this.settings.provider === 'openai' ? 'gpt-4o-mini' : this.settings.provider === 'google' ? 'gemini-1.5-flash' : 'meta/llama-3.1-8b-instruct');
              this.settings.promptAnalisisCP = localStorage.getItem('promptAnalisisCP') || ${JSON.stringify(defaultPromptAnalisisCP)};

              this.settings.promptATP = localStorage.getItem('promptATP') || 'Buatkan Alur Tujuan Pembelajaran (ATP) untuk CP berikut berdasarkan alokasi waktu dan urutan logis...';

              // Load student data first
                            await this.loadStudents();
                            // Load attendance data (depends on students)
                            await this.loadAttendanceData();
                            // Load Jurusan
                            await this.loadJurusan();
                            await this.loadDocuments();
                            await this.loadClasses();

                            await this.loadSubjects();

                            // Load users
                                                        await this.loadUsers();

                                                        // Load soal pilihan ganda from localStorage
                                                        this.loadSoalPilihanGanda();

                                                        // Load soal essay from localStorage
                                                        this.loadSoalEssay();

                                                        this.initAnalisisCP();
                                        },

            logout() {
              localStorage.removeItem('token');
              window.location.href = '/login';
            }
          };
        };

        // Expose init to global scope for Alpine.js
        document.addEventListener('alpine:init', () => {
          Alpine.data('app', () => window.app());
        });

        window.init = function() {
          return window.app().init.call(window.app());
        };
  `;
  // Escape </script> to prevent browser from closing the script tag prematurely
  return raw.replace(/<\/script>/gi, '<\\/script>');
}
