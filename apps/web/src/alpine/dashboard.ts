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
                const response = await fetch('/api/documents/list/1', {
                  headers: {
                    'Authorization': 'Bearer ' + token
                  }
                });
                const data = await response.json();
                this.documents = data.documents || [];
              } catch (e) { console.error(e); }
            },
  `;
}
