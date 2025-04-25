/**
 * Settings App Module
 * Main entry point for the settings application
 */
import apiKeyManager from './api-key-manager.js';
import signatureManager from './signature-manager.js';

class SettingsApp {
    constructor() {
        this.activeTab = 'api-key';
        this.domElements = {};
        
        // Initialize after DOM is ready
        document.addEventListener('DOMContentLoaded', () => this.initialize());
    }
    
    /**
     * Initialize the settings app
     */
    initialize() {
        // Get DOM elements
        this.domElements = {
            tabs: document.querySelectorAll('.tab'),
            tabContents: document.querySelectorAll('.tab-content'),
            minimizeButton: document.getElementById('minimizeToTray'),
            appVersionElement: document.getElementById('appVersion'),
            downloadButton: document.getElementById('downloadManifest'),
            directLink: document.getElementById('directLink')
        };
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Load app version
        this.loadAppVersion();
        
        // Set up navigation event handling
        this.setupNavigationHandling();
    }
    
    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Tab switching
        this.domElements.tabs.forEach(tab => {
            tab.addEventListener('click', () => this.handleTabClick(tab));
        });
        
        // Minimize to tray
        if (this.domElements.minimizeButton) {
            this.domElements.minimizeButton.addEventListener('click', () => {
                window.electronAPI.minimizeToTray();
            });
        }
        
        // Manifest file direct download
        if (this.domElements.directLink) {
            this.domElements.directLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.downloadManifestDirect();
                return false;
            });
        }
        
        // Manifest file download button
        if (this.domElements.downloadButton) {
            this.domElements.downloadButton.addEventListener('click', () => {
                this.downloadManifestDirect();
            });
        }
    }
    
    /**
     * Handle tab click event
     * @param {HTMLElement} tab - The tab element that was clicked
     */
    handleTabClick(tab) {
        const tabId = tab.getAttribute('data-tab');
        
        // Update active tab and content
        this.domElements.tabs.forEach(t => t.classList.remove('active'));
        this.domElements.tabContents.forEach(c => c.classList.remove('active'));
        
        tab.classList.add('active');
        document.getElementById(tabId).classList.add('active');
        
        this.activeTab = tabId;
    }
    
    /**
     * Load app version from storage
     */
    loadAppVersion() {
        if (this.domElements.appVersionElement) {
            window.electronAPI.getStoreValue('version')
                .then(version => {
                    if (version) {
                        this.domElements.appVersionElement.textContent = version;
                    }
                })
                .catch(error => {
                    console.error('Version load error:', error);
                });
        }
    }
    
    /**
     * Set up navigation event handling from external sources
     */
    setupNavigationHandling() {
        window.electronAPI.onNavigate((page) => {
            const tab = document.querySelector(`.tab[data-tab="${page}"]`);
            if (tab) this.handleTabClick(tab);
        });
    }
    
    /**
     * Download the manifest file directly
     */
    downloadManifestDirect() {
        console.log('Direct download link clicked');
        
        // Create or update the status element
        let downloadStatus = document.getElementById('download-status');
        if (!downloadStatus) {
            downloadStatus = document.createElement('div');
            downloadStatus.id = 'download-status';
            
            // Add the status element to the page
            const linkElement = this.domElements.directLink || this.domElements.downloadButton;
            if (linkElement && linkElement.parentNode) {
                linkElement.parentNode.appendChild(downloadStatus);
            }
        }
        
        // Update the status
        downloadStatus.className = 'info';
        downloadStatus.style.marginTop = '10px';
        downloadStatus.innerHTML = '<p><strong>Downloading...</strong> Please wait.</p>';
        
        // Get manifest file content
        fetch('https://localhost:3000/manifest-content')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Server response error: ' + response.status);
                }
                return response.text();
            })
            .then(content => {
                // Create download link
                const blob = new Blob([content], { type: 'application/xml' });
                const url = URL.createObjectURL(blob);
                
                // Create and click download link
                const a = document.createElement('a');
                a.href = url;
                a.download = 'manifest.xml';
                a.style.display = 'none';
                document.body.appendChild(a);
                a.click();
                
                // Cleanup
                setTimeout(() => {
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                }, 100);
                
                // Show success message
                downloadStatus.className = 'success';
                downloadStatus.innerHTML = '<p><strong>Download Complete!</strong> manifest.xml file has been downloaded.</p>';
                
                // Fade message after 5 seconds
                setTimeout(() => {
                    downloadStatus.style.opacity = '0.5';
                }, 5000);
            })
            .catch(error => {
                console.error('Manifest download error:', error);
                downloadStatus.className = 'error';
                downloadStatus.innerHTML = '<p><strong>Download Error:</strong> ' + error.message + '</p><p>Cannot connect to download server. Make sure the application is running.</p>';
            });
    }
}

// Create and initialize the settings app
const settingsApp = new SettingsApp();
export default settingsApp; 