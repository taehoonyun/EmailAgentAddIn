/**
 * API Key Manager Module
 * Handles OpenAI API key management
 */
class ApiKeyManager {
    constructor() {
        this.apiKey = '';
        this.domElements = {};
        
        // Initialize after DOM is ready
        document.addEventListener('DOMContentLoaded', () => this.initialize());
    }
    
    /**
     * Initialize the API key manager
     */
    initialize() {
        // Get DOM elements
        this.domElements = {
            apiKeyInput: document.getElementById('apiKey'),
            saveApiKeyBtn: document.getElementById('saveApiKey'),
            apiKeyMessage: document.getElementById('apiKeyMessage'),
            openApiKeyLink: document.getElementById('openApiKeyLink')
        };
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Load API key
        this.loadApiKey();
    }
    
    /**
     * Set up event listeners for API key management
     */
    setupEventListeners() {
        // Save API key button
        this.domElements.saveApiKeyBtn.addEventListener('click', () => this.saveApiKey());
        
        // Open OpenAI website button
        if (this.domElements.openApiKeyLink) {
            this.domElements.openApiKeyLink.addEventListener('click', (e) => {
                e.preventDefault();
                window.electronAPI.openExternalUrl('https://platform.openai.com/api-keys');
            });
        }
    }
    
    /**
     * Load API key from storage
     */
    loadApiKey() {
        window.electronAPI.getStoreValue('apiKey')
            .then(apiKey => {
                if (apiKey) {
                    this.apiKey = apiKey;
                    this.domElements.apiKeyInput.value = apiKey;
                }
            })
            .catch(error => {
                console.error('API key load error:', error);
            });
    }
    
    /**
     * Save API key to storage
     */
    saveApiKey() {
        const apiKey = this.domElements.apiKeyInput.value.trim();
        
        if (!apiKey) {
            this.showMessage('Please enter a valid API key.', 'error');
            return;
        }
        
        window.electronAPI.setStoreValue('apiKey', apiKey)
            .then(() => {
                this.apiKey = apiKey;
                this.showMessage('API key saved successfully.', 'success');
            })
            .catch(error => {
                console.error('API key save error:', error);
                this.showMessage('An error occurred: ' + error.message, 'error');
            });
    }
    
    /**
     * Show a message to the user
     * @param {string} message - The message to show
     * @param {string} type - The type of message ('success', 'error')
     */
    showMessage(message, type) {
        const element = this.domElements.apiKeyMessage;
        element.textContent = message;
        element.className = type;
        
        setTimeout(() => {
            element.textContent = '';
            element.className = '';
        }, 3000);
    }
}

// Create and export the API key manager instance
const apiKeyManager = new ApiKeyManager();
export default apiKeyManager; 