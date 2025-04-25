const { app, BrowserWindow, ipcMain, shell, Tray, Menu, dialog, nativeImage } = require('electron');
const path = require('path');
const url = require('url');
const fs = require('fs');
const Store = require('electron-store');
const { startServer } = require('./server');
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');

// Setup logging for auto-updater
log.transports.file.level = 'info';
autoUpdater.logger = log;

// Initialize configuration storage
const store = new Store();

// Global references to prevent garbage collection
let mainWindow = null;
let tray = null;
let isQuitting = false;
let server = null;

// Check if the application is in development mode
const isDev = process.env.NODE_ENV === 'development';

// Main function to create the application window
function createMainWindow() {
    // Load window dimensions from storage or use defaults
    const windowState = store.get('windowState', {
        width: 800,
        height: 600,
        x: undefined,
        y: undefined
    });

    // Create browser window with stored dimensions
    mainWindow = new BrowserWindow({
        width: windowState.width,
        height: windowState.height,
        x: windowState.x,
        y: windowState.y,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
            devTools: isDev // Enable DevTools only in development mode
        },
        icon: path.join(__dirname, 'assets', 'icon.png')
    });

    // Save window position and size when closed
    mainWindow.on('close', (e) => {
        if (!isQuitting) {
            e.preventDefault();
            mainWindow.hide();
            return false;
        }

        // Store window dimensions
        const { width, height } = mainWindow.getBounds();
        store.set('windowState', {
            width,
            height,
            x: mainWindow.getPosition()[0],
            y: mainWindow.getPosition()[1]
        });
    });

    // Load the HTML file
    mainWindow.loadFile('setup.html');

    // Setup IPC handlers
    setupIpc();
}

// Setup system tray
function setupTray() {
    const iconPath = path.join(__dirname, 'assets', 'icon.png');
    tray = new Tray(iconPath);
    tray.setToolTip('Email AI Assistant');
    
    const contextMenu = Menu.buildFromTemplate([
        { 
            label: 'Open', 
            click: () => {
                mainWindow.show();
            }
        },
        { 
            label: 'Auto-start at login',
            type: 'checkbox',
            checked: app.getLoginItemSettings().openAtLogin,
            click: (menuItem) => {
                app.setLoginItemSettings({
                    openAtLogin: menuItem.checked
                });
            }
        },
        { type: 'separator' },
        { 
            label: 'Quit', 
            click: () => {
                isQuitting = true;
                if (server) {
                    server.close();
                }
                app.quit();
            }
        }
    ]);
    
    tray.setContextMenu(contextMenu);
    
    tray.on('click', () => {
        mainWindow.show();
    });
}

// Setup IPC (Inter-Process Communication) handlers
function setupIpc() {
    // API key handling
    ipcMain.handle('get-store-value', async (event, key) => {
        return store.get(key);
    });
    
    ipcMain.handle('set-store-value', async (event, key, value) => {
        store.set(key, value);
        return true;
    });
    
    // Open external URL
    ipcMain.handle('open-external-url', async (event, url) => {
        return shell.openExternal(url);
    });

    // Navigate to specific tab
    ipcMain.handle('navigate-to', async (event, tab) => {
        mainWindow.webContents.send('navigate', tab);
    });
    
    // Minimize to tray
    ipcMain.handle('minimize-to-tray', async () => {
        if (mainWindow) {
            mainWindow.hide();
            // Show notification that app is still running
            if (process.platform === 'win32') {
                tray.displayBalloon({
                    title: 'Email AI Assistant',
                    content: 'The application is still running in the system tray.',
                    iconType: 'info'
                });
            }
            return true;
        }
        return false;
    });
}

// Configure auto-updater
function setupAutoUpdater() {
    // Check for updates on startup (after 10 seconds to let the app initialize)
    setTimeout(() => autoUpdater.checkForUpdates(), 10000);
    
    // Check for updates every hour
    setInterval(() => autoUpdater.checkForUpdates(), 60 * 60 * 1000);
    
    // Update downloaded event - show dialog
    autoUpdater.on('update-downloaded', (info) => {
        dialog.showMessageBox({
            type: 'info',
            title: 'Update Available',
            message: `Version ${info.version} has been downloaded and will be installed on restart`,
            buttons: ['Restart Now', 'Later']
        }).then((result) => {
            if (result.response === 0) {
                autoUpdater.quitAndInstall();
            }
        });
    });
}

// Handle certificate errors
app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
    // For development, we can ignore certificate errors for localhost
    if (isDev && (url.includes('localhost') || url.includes('127.0.0.1'))) {
        event.preventDefault();
        callback(true);
        return;
    }
    callback(false);
});

// When the app is ready to start
app.whenReady().then(() => {
    // Set app version in store
    store.set('version', app.getVersion());
    
    // Create window and setup tray
    createMainWindow();
    setupTray();
    
    // Start HTTPS server using server.js module
    server = startServer();
    
    // Setup auto-updater in production
    if (!isDev) {
        setupAutoUpdater();
    }
    
    // On macOS re-create window if dock icon clicked
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createMainWindow();
        } else {
            mainWindow.show();
        }
    });
});

// Handle window activation (focus)
app.on('browser-window-focus', () => {
    // Enable keyboard shortcuts in development
    if (isDev) {
        mainWindow.webContents.on('before-input-event', (event, input) => {
            // Allow refresh shortcut (F5, Ctrl+R)
            if ((input.key === 'F5') || (input.control && input.key === 'r')) {
                mainWindow.reload();
                event.preventDefault();
            }
        });
    }
});

// When all windows are closed
app.on('window-all-closed', () => {
    // On macOS stay active until explicit quit
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// Handle app quit
app.on('before-quit', () => {
    isQuitting = true;
    if (server) {
        server.close();
    }
});
