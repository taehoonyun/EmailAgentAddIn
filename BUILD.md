# Building Email AI Assistant

This document provides instructions for building the Email AI Assistant application into an executable (.exe) file for Windows.

## Prerequisites

1. Make sure you have Node.js (version 14 or later) and npm installed
2. Clone or download this repository
3. Install dependencies with `npm install`

## Building the Application

### 1. Install Required Dependencies

```bash
npm install
```

This will install all required dependencies, including development dependencies needed for building.

### 2. Generate SSL Certificates (if needed)

```bash
npm run generate-cert
```

This creates SSL certificates required for HTTPS communication with Outlook.

### 3. Generate Icon Files

```bash
npm run generate-icon
```

This converts PNG icon to ICO format required for Windows executables.

### 4. Build the Application

For 64-bit Windows:

```bash
npm run build:win
```

For 32-bit Windows:

```bash
npm run build:win32
```

For both architectures:

```bash
npm run build
```

## Build Output

After the build completes, you can find the output files in the `dist` directory:

- **Installer**: `EmailAIAssistant-Setup-{version}.exe` - This is a Windows installer that will install the application
- **Portable Version**: `EmailAIAssistant-Portable-{version}.exe` - This is a standalone executable that doesn't require installation

## Customizing the Build

If you need to modify build settings, you can edit the `build` section in `package.json` to configure:

- Application metadata
- Build targets (installer, portable, etc.)
- Package files
- Code signing (if you have a certificate)
- And other options

## Troubleshooting

If you encounter any issues during the build process:

1. Make sure all dependencies are installed correctly
2. Check that the assets directory contains the necessary icon files
3. Verify that the `scripts` directory contains all required build scripts
4. Check the console output for any error messages

For more detailed configuration options, refer to the [electron-builder documentation](https://www.electron.build/). 