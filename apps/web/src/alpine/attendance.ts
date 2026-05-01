/**
 * Alpine.js data module: Attendance (check-in/check-out).
 */
export function attendanceData(): string {
  return `
            lastCheckIn: null,
            lastCheckOut: null,

            async checkIn() {
              try {
                const token = localStorage.getItem('token');
                const res = await fetch('/api/attendance/check-in', {
                  method: 'POST',
                  headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                  },
                  body: JSON.stringify({ userId: 1 }),
                });
                if (res.ok) this.lastCheckIn = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
              } catch (e) { alert('Check-in gagal'); }
            },

            async checkOut() {
              try {
                const token = localStorage.getItem('token');
                const res = await fetch('/api/attendance/check-out', {
                  method: 'POST',
                  headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                  },
                  body: JSON.stringify({ userId: 1 }),
                });
                if (res.ok) this.lastCheckOut = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
              } catch (e) { alert('Check-out gagal'); }
            },
  `;
}
