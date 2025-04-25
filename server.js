const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const axios = require('axios');
const { Configuration, OpenAIApi } = require('openai');
const https = require('https');
const Store = require('electron-store');
const logger = require('./utils/logger');
const PORT = 3000;

// Load environment variables
dotenv.config();
const app = express();

// Initialize the store to access saved configurations
const store = new Store({
  name: 'email-ai-assistant-config'
});

// Middlewares
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));
// Also serve files from the root directory (for backward compatibility)
app.use(express.static(__dirname));

// Import and use routes
const routes = require('./src/server/routes');
app.use('/', routes);

// Get API keys from store or environment variables as fallback
let openaiApiKey = store.get('openaiApiKey') || process.env.OPENAI_API_KEY || '';
let azureApiKey = store.get('azureApiKey') || process.env.AZURE_API_KEY || '';
let anthropicApiKey = store.get('anthropicApiKey') || process.env.ANTHROPIC_API_KEY || '';
let jupyterToken = store.get('jupyterToken') || process.env.JUPYTER_TOKEN || '';

// The legacy API key field in case it exists
if (!openaiApiKey) {
  openaiApiKey = store.get('apiKey') || '';
}

// OpenAI configuration
let openaiConfiguration = null;
let openai = null;

// Initialize configurations if API keys are available
if (openaiApiKey) {
  openaiConfiguration = new Configuration({ apiKey: openaiApiKey });
  openai = new OpenAIApi(openaiConfiguration);
}

// Make API keys and OpenAI client available to the API routes
app.locals.store = store;
app.locals.openai = openai;
app.locals.openaiConfiguration = openaiConfiguration;
app.locals.openaiApiKey = openaiApiKey;
app.locals.azureApiKey = azureApiKey;
app.locals.anthropicApiKey = anthropicApiKey;
app.locals.jupyterToken = jupyterToken;

// Function to start the server
function startServer() {
  try {
    // 인증서 파일 경로를 명확히 지정
    const certPath = "C:\\Windows\\System32\\localhost+2.pem";
    const keyPath = "C:\\Windows\\System32\\localhost+2-key.pem";
    
    let server;
    
    if (fs.existsSync(certPath) && fs.existsSync(keyPath)) {
      const options = {
        key: fs.readFileSync(keyPath),
        cert: fs.readFileSync(certPath)
      };
      server = https.createServer(options, app);
      server.listen(PORT, () => {
        logger.info(`HTTPS Server running on port ${PORT}`);
        logger.info(`Open in browser: https://localhost:${PORT}/`);
      });
    } else {
      logger.warn('SSL certificates not found, falling back to HTTP');
      logger.warn(`Tried to find certificates at:`);
      logger.warn(` - Certificate: ${certPath}`);
      logger.warn(` - Key: ${keyPath}`);
      server = app.listen(PORT, () => {
        logger.info(`HTTP Server running on port ${PORT}`);
        logger.info(`Open in browser: http://localhost:${PORT}/`);
      });
    }
    
    return server;
  } catch (error) {
    logger.error(`Failed to start server: ${error.message}`);
    throw error;
  }
}

// Start the server if this file is run directly
if (require.main === module) {
  startServer();
}

// Export for use in other modules
module.exports = { startServer, app }; 