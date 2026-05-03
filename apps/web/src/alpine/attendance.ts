/**
 * Alpine.js data module: Student Attendance with proper schema.
 * Records: { id, studentId, date (YYYY-MM-DD), status (H/I/S/D/P/A) }
 */
export function attendanceData(): string {
  return `
            // Student data (shared with students module)
            students: [],
            // Attendance records stored in localStorage
            attendanceRecords: [],
            // UI state
            selectedDate: new Date().toISOString().split('T')[0],
            selectedJurusanId: null,
            selectedKelas: '',
            isAttendanceModalOpen: false,
            attendanceForm: {
              studentId: null,
              status: 'H' // H=Hadir, I=Izinkan, S=Sakit, D=Dispensasi, P=Preman, A=Alpa
            },

            // Status options with labels and colors
            statusOptions: [
              { code: 'H', label: 'Hadir', class: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
              { code: 'I', label: 'Izinkan', class: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
              { code: 'S', label: 'Sakit', class: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
              { code: 'D', label: 'Dispensasi', class: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
              { code: 'P', label: 'Preman', class: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
              { code: 'A', label: 'Alpa', class: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' }
            ],

            async loadAttendanceData() {
              // Load students from localStorage
              const raw = localStorage.getItem('students_data');
              if (raw) {
                try { this.students = JSON.parse(raw); } catch (_) { this.students = []; }
              } else {
                this.students = [];
              }
              // Load attendance records from localStorage
              const attRaw = localStorage.getItem('attendance_records');
              if (attRaw) {
                try { this.attendanceRecords = JSON.parse(attRaw); } catch (_) { this.attendanceRecords = []; }
              }
            },

            // Get attendance status for a student on a specific date
            getStudentStatus(studentId, date) {
              const rec = this.attendanceRecords.find(a => a.studentId === studentId && a.date === date);
              return rec ? rec.status : null;
            },

            // Open modal to set attendance for a student on selectedDate
            openAttendanceModal(student) {
              this.attendanceForm.studentId = student.id;
              const existing = this.attendanceRecords.find(a =>
                a.studentId === student.id &&
                a.date === this.selectedDate
              );
              this.attendanceForm.status = existing ? existing.status : 'H';
              this.isAttendanceModalOpen = true;
            },

            // Save attendance record (create or update)
            async saveAttendance() {
              if (!this.attendanceForm.studentId) return;
              const idx = this.attendanceRecords.findIndex(a =>
                a.studentId === this.attendanceForm.studentId &&
                a.date === this.selectedDate
              );
              if (idx !== -1) {
                this.attendanceRecords[idx].status = this.attendanceForm.status;
              } else {
                this.attendanceRecords.push({
                  id: Date.now(),
                  studentId: this.attendanceForm.studentId,
                  date: this.selectedDate,
                  status: this.attendanceForm.status
                });
              }
              localStorage.setItem('attendance_records', JSON.stringify(this.attendanceRecords));
              this.isAttendanceModalOpen = false;
            },

            // Export attendance for selected date to Excel
            async exportAttendanceExcel() {
              if (!window.XLSX) {
                const s = document.createElement('script');
                s.src = 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js';
                document.head.appendChild(s);
                await new Promise(r => s.onload = r);
              }
              const filtered = this.attendanceRecords.filter(a => a.date === this.selectedDate);
              const exportData = filtered.map(rec => {
                const student = this.students.find(s => s.id === rec.studentId);
                return {
                  NIS: student?.nis || '',
                  Nama: student?.name || '',
                  Kelas: student?.kelas || '',
                  Jurusan: student?.majorId ? (this.jurusan?.find(j => j.id === student.majorId)?.name || '-') : '-',
                  Status: this.statusOptions.find(s => s.code === rec.status)?.label || rec.status,
                  Tanggal: rec.date
                };
              }).sort((a, b) => a.Nama.localeCompare(b.Nama));
              const ws = XLSX.utils.json_to_sheet(exportData);
              ws['!cols'] = [
                { wch: 15 }, // NIS
                { wch: 25 }, // Nama
                { wch: 15 }, // Kelas
                { wch: 20 }, // Jurusan
                { wch: 15 }, // Status
                { wch: 12 }  // Tanggal
              ];
              const wb = XLSX.utils.book_new();
              XLSX.utils.book_append_sheet(wb, ws, 'Presensi');
              XLSX.writeFile(wb, 'presensi_' + this.selectedDate + '.xlsx');
            },

            // Computed: filtered students based on selected jurusan & kelas
            getFilteredStudents() {
              return this.students.filter(s => {
                if (this.selectedJurusanId && s.majorId != this.selectedJurusanId) return false;
                if (this.selectedKelas && s.kelas != this.selectedKelas) return false;
                return true;
              });
            },

            // Computed: available kelas from filtered students
            getAvailableKelas() {
              const kelas = this.getFilteredStudents()
                .map(s => s.kelas)
                .filter(Boolean);
              return [...new Set(kelas)].sort();
            },
  `;
}
