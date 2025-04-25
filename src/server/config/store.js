const Store = require('electron-store');

/**
 * Initialize and export the application configuration store
 */
const store = new Store({
  name: 'email-ai-assistant-config',
  defaults: {
    apiKey: '',
    port: 3000
  }
});

module.exports = store; 