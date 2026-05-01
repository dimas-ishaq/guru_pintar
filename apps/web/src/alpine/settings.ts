/**
 * Alpine.js data module: Settings (API key, connection test).
 */
export function settingsData(): string {
  return `
            settings: {
              apiKey: '',
              baseUrl: '',
              provider: 'openai',
              selectedModel: '',
              promptAnalisisCP: '',
              promptATP: ''
            },
            showApiKey: false,
            connectionStatus: '',
            availableModels: [],
            isLoadingModels: false,

            saveSettings() {
              localStorage.setItem('apiKey', this.settings.apiKey || '');
              localStorage.setItem('baseUrl', this.settings.baseUrl || '');
              localStorage.setItem('provider', this.settings.provider || 'openai');
              localStorage.setItem('selectedModel', this.settings.selectedModel || '');
              localStorage.setItem('promptAnalisisCP', this.settings.promptAnalisisCP || '');
              localStorage.setItem('promptATP', this.settings.promptATP || '');
              this.connectionStatus = 'success';
              setTimeout(() => this.connectionStatus = '', 3000);
            },

            async fetchModels() {
              if (!this.settings.apiKey) {
                alert('Masukkan API Key terlebih dahulu.');
                return;
              }
              this.isLoadingModels = true;
              this.availableModels = [];
              try {
                let url = '';
                let headers = {};
                
                if (this.settings.provider === 'openai') {
                  url = (this.settings.baseUrl || 'https://api.openai.com/v1') + '/models';
                  headers = { 'Authorization': 'Bearer ' + this.settings.apiKey };
                } else if (this.settings.provider === 'google') {
                  url = 'https://generativelanguage.googleapis.com/v1beta/models?key=' + this.settings.apiKey;
                }

                const response = await fetch(url, { headers });
                const data = await response.json();
                
                if (this.settings.provider === 'openai') {
                  this.availableModels = data.data
                    .map(m => m.id)
                    .filter(id => id.includes('gpt'))
                    .sort();
                } else if (this.settings.provider === 'google') {
                  this.availableModels = data.models
                    .map(m => m.name.replace('models/', ''))
                    .filter(id => id.includes('gemini'))
                    .sort();
                }
                
                if (this.availableModels.length > 0 && !this.settings.selectedModel) {
                  this.settings.selectedModel = this.availableModels[0];
                }
              } catch (e) {
                console.error('Gagal mengambil daftar model:', e);
                alert('Gagal mengambil daftar model. Pastikan API Key benar.');
              } finally {
                this.isLoadingModels = false;
              }
            },

            async testConnection() {
              this.connectionStatus = 'testing';
              try {
                let url = '';
                let headers = {};
                
                if (this.settings.provider === 'openai') {
                  url = (this.settings.baseUrl || 'https://api.openai.com/v1') + '/models';
                  headers = { 'Authorization': 'Bearer ' + this.settings.apiKey };
                } else if (this.settings.provider === 'google') {
                  url = 'https://generativelanguage.googleapis.com/v1beta/models?key=' + this.settings.apiKey;
                }

                const response = await fetch(url, { headers });
                this.connectionStatus = response.ok ? 'success' : 'error';
              } catch (e) {
                this.connectionStatus = 'error';
              }
              setTimeout(() => this.connectionStatus = '', 3000);
            },
  `;
}
