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

/**
 * Returns the full inline <script> content for the Alpine.js app function.
 */
export function appScript(): string {
  return `
        function app() {
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
                  { id: 'data-siswa', label: 'Data Siswa', icon: 'people' },
                ]
              },
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

            // ── Initialization ──────────────────────
            async init() {
              this.darkMode = localStorage.getItem('darkMode') === 'dark';
              if (this.darkMode) document.documentElement.classList.add('dark');
              
              this.settings.apiKey = localStorage.getItem('apiKey') || '';
              this.settings.baseUrl = localStorage.getItem('baseUrl') || '';
              this.settings.provider = localStorage.getItem('provider') || 'openai';
              this.settings.selectedModel = localStorage.getItem('selectedModel') || (this.settings.provider === 'openai' ? 'gpt-4o-mini' : 'gemini-1.5-flash');
              this.settings.promptAnalisisCP = localStorage.getItem('promptAnalisisCP') || \`Anda adalah seorang Pakar Kurikulum Merdeka yang spesialis dalam pengembangan kurikulum SMK, khususnya rumpun Teknologi Informasi (seperti PPLG). Tugas Anda adalah menganalisis input dari guru untuk memastikan Capaian Pembelajaran (CP) diturunkan menjadi Alur Tujuan Pembelajaran (ATP) yang logis, terukur, dan sesuai standar BSKAP.

### KONTEKS KHUSUS:
- Di sekolah ini, "Elemen" sering kali diperlakukan sebagai "Mata Pelajaran" tersendiri.
- Fokus utama: Keselarasan (Alignment), Scaffolding (Urutan Logis), dan Integrasi P5.

### TUGAS ANDA:
1. Analisis Kompetensi: Identifikasi Kata Kerja Operasional (KKO) dalam CP dan pastikan Tujuan Pembelajaran (TP) yang dihasilkan setara atau mendukung KKO tersebut.
2. Analisis Konten: Bedah materi esensial dari teks CP yang diberikan.
3. Cek Urutan (Scaffolding): Pastikan materi disusun dari dasar ke kompleks (misal: Logika dasar sebelum Sintaks PWA).
4. Identifikasi Gap: Beritahu jika ada bagian dari CP yang belum ter-cover oleh elemen atau rencana guru.

### INSTRUKSI KHUSUS CAKUPAN WAKTU:
1. JIKA MODE = "TAHUNAN":
   - Analisis seluruh teks CP untuk durasi 1 Tahun Ajaran (Fase E = 1 tahun, Fase F = 2 tahun).
   - Bagi Tujuan Pembelajaran (TP) secara merata ke dalam dua blok: Semester 1 (Ganjil) dan Semester 2 (Genap).
   - Pastikan materi di Semester 2 memiliki prasyarat yang logis dari Semester 1 (Scaffolding Jangka Panjang).

2. JIKA MODE = "SEMESTER":
   - Fokus hanya pada Tujuan Pembelajaran operasional untuk periode 6 bulan.
   - Jika Semester 1: Mulai dari materi fundamental/dasar.
   - Jika Semester 2: Asumsikan siswa sudah memiliki kompetensi dasar dari semester sebelumnya dan berikan materi pengembangan atau proyek akhir.

### INPUT DATA:
- Mode: {{mode}} (Tahunan / Semester)
- Semester Pilihan: {{semester}} (Hanya relevan jika mode semester)
- Mapel/Elemen: {{mapel}}
- Elemen Detail: {{elemen}}
- Teks CP: {{cp_text}}
- Alokasi JP: {{jp}}
- Waktu per JP: {{jp_duration}} (misal: 45 menit)

### MANDATORY SCHEMA (JSON ONLY):
{
  "atp_table": [
    {
      "semester": "1",
      "elemen": "{{elemen}}",
      "taksonomi": "C3 - Menerapkan",
      "materi": "Nama Topik/Bab (Contoh: 'Tipe Data & Variabel', 'SQL Join', 'Metode Agile')",
      "tp": "Tujuan Pembelajaran lengkap",
      "jp": "12",
      "p5": "Gotong Royong",
      "catatan_ai": "Analisis singkat"
    }
  ]
}

### ATURAN KERAS MATERI:
1. "materi" HARUS berupa KATA BENDA / NAMA TOPIK (Contoh: "Array 2 Dimensi").
2. DILARANG menggunakan kata kerja di awal materi (JANGAN GUNAKAN: "Menjelaskan...", "Memahami...", "Mempraktikkan...").
3. BEDAH teks CP menjadi unit pengetahuan terkecil (Bab/Sub-bab).

### REASONING RULES:
1. "taksonomi" WAJIB berisi Level Bloom (C1-C6).
2. "elemen" HARUS sesuai dengan input.
3. JANGAN BERIKAN TEKS PENJELASAN. HANYA JSON.\`;
              
              this.settings.promptATP = localStorage.getItem('promptATP') || 'Buatkan Alur Tujuan Pembelajaran (ATP) untuk CP berikut berdasarkan alokasi waktu dan urutan logis...';
              
              // Sequence loading to ensure dependency (Classes need Jurusan)
              await this.loadJurusan();
              await this.loadDocuments();
              await this.loadClasses();
              
              this.initAnalisisCP();
            },

            logout() {
              localStorage.removeItem('token');
              window.location.href = '/login';
            }
          };
        }
  `;
}
