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
            // Latest check-in timestamp shown on dashboard
            lastCheckIn: '',
            // UI state
            selectedDate: new Date().toISOString().split('T')[0],
            selectedJurusanId: null,
            selectedKelas: '',
            isAttendanceModalOpen: false,
            attendanceForm: {
              studentId: null,
              status: 'H' // H=Hadir, I=Izinkan, S=Sakit, D=Dispensasi, P=Preman, A=Alpa
            },

            // View mode: 'grid' or 'table'
            viewMode: 'grid',
            // Search term for table view (minimum 3 characters)
            searchTerm: '',
            // Loading state for filtered results
            filteredStudentsTableLoading: false,
            // Selected students for bulk operations
            selectedStudents: [],

            // Status options with labels and colors
            statusOptions: [
              { code: 'H', label: 'Hadir', class: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
              { code: 'I', label: 'Izinkan', class: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
              { code: 'S', label: 'Sakit', class: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
              { code: 'D', label: 'Dispensasi', class: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
              { code: 'P', label: 'PKL', class: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
              { code: 'A', label: 'Alpa', class: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' }
            ],

            // Methods
            switchToView(mode) {
              this.viewMode = mode;
              // Clear selections when switching views
              if (mode === 'grid') {
                this.selectedStudents = [];
              }
            },

            // Search with 3 character minimum
            handleSearchInput() {
              // Debounce search for better performance
              if (this.searchTimeout) clearTimeout(this.searchTimeout);
              this.searchTimeout = setTimeout(() => {
                this.filteredStudentsTableLoading = this.searchTerm.length >= 3;
              }, 300);
            },

            searchTimeout: null,

            // Get jurusan name by id
            getJurusanName(jurusanId) {
              if (!jurusanId) return '-';
              const j = this.jurusan?.find(j => j.id === jurusanId);
              return j ? j.name : '-';
            },

            // Computed: filtered students for table view with search
            getFilteredStudentsTable() {
              // Require minimum 3 characters for search
              if (this.searchTerm.length > 0 && this.searchTerm.length < 3) {
                return [];
              }
              let students = this.students;
              // Apply jurusan filter
              if (this.selectedJurusanId) {
                students = students.filter(s => s.majorId == this.selectedJurusanId);
              }
              // Apply kelas filter
              if (this.selectedKelas) {
                students = students.filter(s => s.kelas == this.selectedKelas);
              }
              // Apply search term (case insensitive)
              if (this.searchTerm.length >= 3) {
                const term = this.searchTerm.toLowerCase();
                students = students.filter(s =>
                  s.name.toLowerCase().includes(term) ||
                  (s.nis && s.nis.toLowerCase().includes(term))
                );
              }
              return students;
            },

            // Toggle single student selection
            toggleStudentSelection(studentId, checked) {
              if (checked) {
                if (!this.selectedStudents.includes(studentId)) {
                  this.selectedStudents.push(studentId);
                }
              } else {
                this.selectedStudents = this.selectedStudents.filter(id => id !== studentId);
              }
            },

            // Toggle all table students
            toggleAllTableStudents(checked) {
              const ids = this.getFilteredStudentsTable().map(s => s.id);
              if (checked) {
                this.selectedStudents = [...new Set([...this.selectedStudents, ...ids])];
              } else {
                this.selectedStudents = this.selectedStudents.filter(id => !ids.includes(id));
              }
            },

            // Select all filtered students
            selectAllStudents() {
              const ids = this.getFilteredStudentsTable().map(s => s.id);
              this.selectedStudents = [...new Set([...this.selectedStudents, ...ids])];
            },

            // Deselect all students
            deselectAllStudents() {
              this.selectedStudents = [];
            },

            // Bulk update attendance for selected students
            async bulkUpdateAttendance(status) {
              if (this.selectedStudents.length === 0) return;
              for (const studentId of this.selectedStudents) {
                const idx = this.attendanceRecords.findIndex(a =>
                  a.studentId === studentId &&
                  a.date === this.selectedDate
                );
                if (idx !== -1) {
                  this.attendanceRecords[idx].status = status;
                } else {
                  this.attendanceRecords.push({
                    id: Date.now() + Math.random(),
                    studentId: studentId,
                    date: this.selectedDate,
                    status: status
                  });
                }
              }
              localStorage.setItem('attendance_records', JSON.stringify(this.attendanceRecords));
              this.selectedStudents = [];
            },

            // Update single student attendance from table dropdown
            updateSingleAttendance(studentId, status) {
              if (!status) {
                // Remove attendance if empty status selected
                this.attendanceRecords = this.attendanceRecords.filter(a =>
                  !(a.studentId === studentId && a.date === this.selectedDate)
                );
              } else {
                const idx = this.attendanceRecords.findIndex(a =>
                  a.studentId === studentId &&
                  a.date === this.selectedDate
                );
                if (idx !== -1) {
                  this.attendanceRecords[idx].status = status;
                } else {
                  this.attendanceRecords.push({
                    id: Date.now() + Math.random(),
                    studentId: studentId,
                    date: this.selectedDate,
                    status: status
                  });
                }
              }
              localStorage.setItem('attendance_records', JSON.stringify(this.attendanceRecords));
            },

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

              this.updateLastCheckIn();
            },

            // Derive the latest check-in timestamp for dashboard display
            updateLastCheckIn() {
              const latest = [...this.attendanceRecords]
                .filter(a => a.checkInTime || a.status === 'H')
                .sort((a, b) => new Date(b.checkInTime || b.date).getTime() - new Date(a.checkInTime || a.date).getTime())[0];
              this.lastCheckIn = latest
                ? new Date(latest.checkInTime || latest.date).toLocaleString()
                : '';
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
                  status: this.attendanceForm.status,
                  checkInTime: this.attendanceForm.status === 'H' ? new Date().toISOString() : null
                });
              }
              localStorage.setItem('attendance_records', JSON.stringify(this.attendanceRecords));
              this.updateLastCheckIn();
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
