/**
 * Alpine.js data module: Dashboard state & logic.
 * Handles document listing.
 */
export function dashboardData(): string {
  return `
            documents: [],

            async loadDocuments() {
                          try {
                            const token = localStorage.getItem('token');
                            if (!token) { this.logout(); return; }
                            const response = await fetch('/api/documents/list/1', {
                              headers: { 'Authorization': 'Bearer ' + token }
                            });
                            if (response.status === 401) { alert('Sesi berakhir.'); this.logout(); return; }
                            const data = await response.json();
                            this.documents = data.documents || [];
                          } catch (e) { console.error(e); }
                        },
  `;
}
