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
                } else if (this.settings.provider === 'nvidia') {
                  // Nvidia doesn't have a models endpoint, so we'll use a predefined list
                  this.availableModels = [
                    'meta/llama-3.1-8b-instruct',
                    'meta/llama-3.1-70b-instruct',
                    'meta/llama-3.1-405b-instruct',
                    'meta/llama-3.2-3b-instruct',
                    'nvidia/llama-3.1-nemotron-70b-instruct',
                    'microsoft/wizardlm-2-8x22b',
                    'google/gemma-7b',
                    'google/gemma-2-9b-it',
                    'google/gemma-2-27b-it',
                    'stepfun-ai/step-1-8k',
                    'stepfun-ai/step-1.5v',
                    'stepfun-ai/step-2-16k',
                    'stepfun-ai/step-3-32k',
                    'stepfun-ai/step-3.5-flash',
                    'deepseek-ai/deepseek-coder-6.7b-instruct',
                    'aisingapore/sea-lion-7b-instruct'
                  ].sort();
                  this.isLoadingModels = false;
                  if (this.availableModels.length > 0 && !this.settings.selectedModel) {
                    this.settings.selectedModel = this.availableModels[0];
                  }
                  return;
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
                let method = 'GET';

                if (this.settings.provider === 'openai') {
                  url = (this.settings.baseUrl || 'https://api.openai.com/v1') + '/models';
                  headers = { 'Authorization': 'Bearer ' + this.settings.apiKey };
                } else if (this.settings.provider === 'google') {
                  url = 'https://generativelanguage.googleapis.com/v1beta/models?key=' + this.settings.apiKey;
                } else if (this.settings.provider === 'nvidia') {
                  url = 'https://integrate.api.nvidia.com/v1/chat/completions';
                  headers = {
                    'Authorization': 'Bearer ' + this.settings.apiKey,
                    'Content-Type': 'application/json'
                  };
                  method = 'POST';
                  // Test with a simple completion request
                  const testBody = JSON.stringify({
                    model: this.settings.selectedModel || 'meta/llama-3.1-8b-instruct',
                    messages: [{ role: 'user', content: 'Hello' }],
                    max_tokens: 10
                  });
                }

                const response = await fetch(url, {
                  method,
                  headers,
                  body: method === 'POST' ? testBody : undefined
                });
                this.connectionStatus = response.ok ? 'success' : 'error';
              } catch (e) {
                this.connectionStatus = 'error';
              }
              setTimeout(() => this.connectionStatus = '', 3000);
            },
  `;
}
