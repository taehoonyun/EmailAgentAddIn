# Email AI Assistant for Outlook

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)](https://nodejs.org/)
[![Electron](https://img.shields.io/badge/electron-%5E25.2.0-blue.svg)](https://www.electronjs.org/)

A professional-grade Microsoft Outlook add-in that leverages AI to analyze emails and generate context-aware responses. This desktop application runs in your system tray and provides a seamless integration with Outlook to boost your email productivity.

![Email AI Assistant](assets/logo-filled.png)

## Key Features

- 📧 **Email Analysis**: AI-powered analysis of email content, sentiment, and intent
- ✍️ **Smart Response Generation**: Create contextually appropriate replies in multiple tones (professional, friendly, formal, casual)
- 🔄 **Seamless Integration**: Apply generated responses directly in Outlook with a single click
- 🔒 **Enhanced Security**: All data processing happens locally, with API keys securely stored on your machine
- 🚀 **Optimized Performance**: Quick response generation without disrupting your workflow
- 🌐 **Multiple AI Integration**: Support for OpenAI, Azure AI, and Anthropic API services

## System Requirements

- **Operating System**: Windows 10/11
- **Node.js**: v14.0.0 or higher
- **npm**: v6.0.0 or higher
- **Microsoft Outlook**: Desktop version (2016 or newer) or Outlook Web App
- **Memory**: 4GB RAM minimum, 8GB recommended
- **Disk Space**: 200MB for application installation

## Quick Installation

### 1. Download & Install

#### Option 1: Download the Installer
Download the latest installer from the [releases page](https://github.com/yourusername/email-ai-assistant/releases) and run it.

#### Option 2: Build from Source
```bash
# Clone repository
git clone https://github.com/yourusername/email-ai-assistant.git
cd email-ai-assistant

# Install dependencies
npm install

# Generate certificates (required for HTTPS)
npm run generate-cert

# Start application
npm start
```

### 2. Set Up Outlook Add-in

1. Launch the Email AI Assistant application from your Start menu or desktop shortcut
2. Follow the in-app setup wizard to install the Outlook add-in
3. Configure your AI provider API key(s) in the settings panel
4. Restart Outlook if necessary

## SSL Certificate Setup

The application requires HTTPS to communicate with Outlook. There are two ways to set up the necessary certificates:

### Option 1: Use Built-in Certificate Generator (Recommended)

The simplest approach is to use our built-in certificate generator:

```bash
npm run generate-cert
```

This creates SSL certificates in the `cert` folder and configures the application to use them.

### Option 2: Use External Certificates

If you already have SSL certificates or want to generate them using tools like [mkcert](https://github.com/FiloSottile/mkcert), place them in one of these locations:

- `cert` directory in the application root
- The application directory
- `C:\Windows\System32` (on Windows)

Required files:
- Certificate file (*.pem)
- Private key file (*-key.pem)

The application will automatically detect and use these certificates.

## API Configuration

### Supported AI Services

The application integrates with multiple AI services:

- **OpenAI**: For GPT-based text generation
- **Azure OpenAI**: For enterprise deployments with Azure compliance
- **Anthropic**: For Claude models (alternative to GPT)

### Setting Up API Keys

1. **Get API Keys**: Obtain API keys from the service provider of your choice
2. **Configure Keys**: Enter your API keys in the application settings panel
3. **Test Connection**: Use the test function to verify connectivity

Your API keys are stored securely using `electron-store` in your local user profile and never transmitted to any third party.

## Architecture

The application consists of three main components:

1. **Electron Application**: Provides the desktop UI and system tray functionality
2. **Express Server**: Runs locally to handle API requests and communication with AI services
3. **Outlook Add-in**: The Office add-in component that integrates with the Outlook UI

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│                 │      │                 │      │                 │
│ Outlook Add-in  │◄────►│  Local Server   │◄────►│   AI Services   │
│                 │      │                 │      │                 │
└─────────────────┘      └─────────────────┘      └─────────────────┘
        ^                        ^
        │                        │
        └───────────┬────────────┘
                    │
           ┌──────────────────┐
           │                  │
           │ Electron App UI  │
           │                  │
           └──────────────────┘
```

## Building from Source

For detailed build instructions, see [BUILD.md](BUILD.md).

Quick build command:
```bash
npm run build
```

This will generate:
- Windows installer (.exe)
- Portable application version

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| Add-in not appearing in Outlook | Ensure application is running and SSL certificates are valid. Try reinstalling the add-in from the application UI. |
| Certificate errors | Run `npm run generate-cert` to create fresh certificates. |
| API connection failures | Verify your API keys are valid and have sufficient credits. Check your internet connection. |
| Port conflicts | If port 3000 is already in use, modify the port in settings and reinstall the add-in. |

### Logs

Application logs are stored in:

- Windows: `%USERPROFILE%\AppData\Roaming\email-ai-assistant\logs`

Check these logs for detailed error information when troubleshooting.

## Development

### Project Structure

```
email-ai-assistant/
├── assets/             # Application icons and images
├── cert/               # SSL certificates 
├── logs/               # Application logs
├── public/             # Static assets for web server
├── scripts/            # Build and utility scripts
├── src/                # Source code
│   ├── commands/       # Outlook add-in commands
│   ├── server/         # Express server code
│   │   ├── controllers/  # API controllers
│   │   ├── routes/       # Route definitions
│   │   └── services/     # Business logic
│   ├── settings/       # Settings UI components
│   └── taskpane/       # Outlook add-in UI
├── utils/              # Utility functions
├── main.js             # Electron entry point
├── preload.js          # Electron preload script
├── server.js           # Express server entry point
└── manifest.xml        # Outlook add-in manifest
```

### Development Environment Setup

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev
```

## Security

- All API requests are made directly from your computer to the AI service provider
- API keys are stored securely in your user profile using encryption
- No email content or credentials leave your computer except when sent to the configured AI service
- All communication uses HTTPS with locally-generated or provided certificates
- The application runs with minimal required permissions

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Acknowledgments

- [Electron](https://www.electronjs.org/) - Desktop application framework
- [Express](https://expressjs.com/) - Web server framework
- [Office Add-ins API](https://docs.microsoft.com/office/dev/add-ins) - Microsoft Office Add-ins platform 