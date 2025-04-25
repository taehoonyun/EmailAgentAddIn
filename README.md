# Email AI Assistant

An Outlook add-in that uses AI to analyze emails and generate automatic replies, helping you manage your inbox more efficiently.

## Features

- 📧 **Email Analysis**: Automatically summarizes email content
- ✍️ **Reply Generation**: Creates appropriate replies in various tones (professional, friendly, formal, casual)
- 🔄 **One-Click Apply**: Apply generated replies to your response with a single click
- 🔒 **Secure**: Your data and API keys remain on your local machine
- 📊 **Analytics**: Track email performance and user engagement
- 📁 **Document Management**: Create, edit, and manage document templates
- 📝 **Cadence Management**: Set up and manage email sequences
- 👤 **Contact Management**: Manage your contacts and their information

## Installation

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Microsoft Outlook (desktop or web version)

### Setup Steps

1. Clone or download this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Set up SSL certificates (see SSL Certificate Setup section below)
4. Start the application:
   ```
   npm start
   ```
5. Install the add-in in Outlook using the manifest file

### SSL Certificate Setup

This application requires HTTPS to function with Outlook. Follow these steps to set up SSL certificates:

#### Using mkcert (Recommended)

[mkcert](https://github.com/FiloSottile/mkcert) is a simple tool for creating locally-trusted development certificates.

1. **Install mkcert**:
   
   - Windows (using Chocolatey):
     ```
     choco install mkcert
     ```
   
   - macOS (using Homebrew):
     ```
     brew install mkcert
     ```
   
   - Linux:
     ```
     apt install libnss3-tools
     wget -O mkcert https://github.com/FiloSottile/mkcert/releases/download/v1.4.3/mkcert-v1.4.3-linux-amd64
     chmod +x mkcert
     sudo mv mkcert /usr/local/bin/
     ```

2. **Install the local CA**:
   ```
   mkcert -install
   ```

3. **Generate certificates for localhost**:
   ```
   cd /path/to/EmailAIAgent/EmailAgentAddIn
   mkcert localhost 127.0.0.1 ::1
   ```
   
   This will create two files:
   - `localhost+2.pem` (the certificate)
   - `localhost+2-key.pem` (the private key)

4. **Move the certificates**:
   
   By default, the application looks for these files in:
   - `cert` directory in the application root
   - The application directory
   - `C:\Windows\System32` (on Windows)
   
   You can leave them in the application directory, or move them to a system location for global use.

#### Using self-signed certificates (Alternative)

If you prefer not to use mkcert, the application includes a script to generate self-signed certificates:

1. Run the certificate generation script:
   ```
   npm run generate-cert
   ```

2. This creates certificates in the `cert` folder of your application.

**Note**: With self-signed certificates, you'll need to manually trust them in your browser and may encounter more security warnings than with mkcert-generated certificates.

## API Integration and Security

### Supported API Services

The application integrates with multiple AI and cloud services:

- **OpenAI**: For natural language processing and text generation
- **Azure**: For additional AI capabilities and cloud services
- **Anthropic**: For alternative AI language models
- **AWS CloudFront**: For content delivery and caching

### API Key Storage & Security

All API keys are stored securely on your local machine:

- Your API keys are saved using `electron-store`, a secure local storage solution for Electron apps
- On Windows, they're stored in: `C:\Users\[YourUsername]\AppData\Roaming\email-ai-assistant-config\config.json`
- On macOS, they're stored in: `~/Library/Application Support/email-ai-assistant-config/config.json`
- On Linux, they're stored in: `~/.config/email-ai-assistant-config/config.json`

### Security Considerations

- **Local Storage Only**: Your API keys never leave your computer
- **No Remote Transmission**: Keys are only used for direct API calls to respective services
- **Encrypted Communication**: All communication uses HTTPS
- **No Analytics Collection**: We don't collect any usage data or analytics
- **Open Source**: All code is open source and can be inspected

### Managing Your API Keys

- You can update or remove your API keys at any time through the Settings tab
- To completely remove keys from storage, you can delete the config file mentioned above
- If you suspect an API key has been compromised, regenerate a new one from the respective service provider

## How it Works

### Architecture

The application consists of three main components:

1. **Electron Application**: The desktop application that runs in the system tray
2. **Express Server**: A modular Node.js server that handles API requests
3. **Outlook Add-in**: The UI components that integrate with Outlook

### Server Structure

The server (`server.js`) is built with a modular approach:

- **Controllers**: Separated by functionality (email, document, contact, etc.)
- **Utils**: Common utility functions for various operations
- **Middleware**: Request processing and error handling
- **Endpoints**: RESTful API endpoints for each feature

### Data Flow

1. User interacts with the Outlook add-in
2. Add-in communicates with the local Express server
3. Server processes requests, communicates with external APIs if needed
4. Results are returned to the add-in for display

## Features in Detail

### Email Processing

- Email analysis and summarization
- Reply generation with various tones
- Email sequence management (cadences)
- Inbox message management

### Document Management

- Template creation and management
- Document categorization
- Recent document tracking
- Document version control

### Contact Management

- Contact information storage
- Contact retrieval by email
- Contact list management

### Analytics

- Email engagement tracking
- Performance metrics
- Visual data representation

## Troubleshooting

### Common Issues

- **Add-in not appearing in Outlook**: Ensure the local server is running and try reinstalling the add-in
- **SSL Certificate Warnings**: These are expected for local development certificates and can be safely ignored
- **API Key Issues**: Verify your API keys are valid and have sufficient credits
- **HTTPS Issues**: Check that your SSL certificates are properly installed and valid
- **Module not found errors**: Run `npm install` to ensure all dependencies are installed

### Certificate Troubleshooting

- **Certificate not found error**: Make sure the certificate files are in the `cert` directory
- **Certificate not trusted**: For mkcert, run `mkcert -install` again. For self-signed certificates, manually add them to your trusted root certificates
- **Port already in use**: If port 3000 is already in use, you can change it in the server configuration

### Getting Help

If you encounter any issues:
1. Check the console output for error messages
2. Verify your API keys are correct
3. Ensure you're running the latest version of the application
4. Review the logs in the application directory

## Development

### Environment Setup

```
npm install
npm run generate-cert
npm start
```

### Building from Source

```
npm run build
```

### Creating an Installer

```
npm run make
```

### Development Structure

- `main.js`: Electron main process
- `server.js`: Express server with all API endpoints
- `controllers/`: Feature-specific logic modules
- `utils/`: Shared utility functions
- `db/`: Database and data access functions
- `public/`: Static assets and client-side code

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- OpenAI for providing the API that powers the AI features
- Microsoft for the Outlook Add-in Framework
- Electron team for the desktop application framework
- AWS for cloud infrastructure services 