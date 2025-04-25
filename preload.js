const { contextBridge, ipcRenderer } = require('electron');

// Expose Electron APIs to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  // Get value from store
  getStoreValue: (key) => ipcRenderer.invoke('get-store-value', key),
  
  // Set value in store
  setStoreValue: (key, value) => ipcRenderer.invoke('set-store-value', key, value),
  
  // Open external URL
  openExternalUrl: (url) => ipcRenderer.invoke('open-external-url', url),
  
  // Minimize window to system tray
  minimizeToTray: () => ipcRenderer.invoke('minimize-to-tray'),
  
  // Register event listeners
  onNavigate: (callback) => {
    ipcRenderer.on('navigate', (event, page) => callback(page));
    return () => {
      ipcRenderer.removeAllListeners('navigate');
    };
  }
});
