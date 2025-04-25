const https = require('https');
const store = require('./config/store');
const configureExpress = require('./config/express');
const routes = require('./routes');
const { findCertificates, getHttpsOptions } = require('./utils/certificates');

/**
 * Start the HTTPS server
 * @returns {Object} HTTPS server instance
 */
function startServer() {
  // Port settings
  const port = store.get('port') || 3000;
  
  try {
    // Get express app
    const app = configureExpress();
    
    // Apply routes
    app.use(routes);
    
    // Get certificate paths for logging
    const { certPath, keyPath } = findCertificates();
    
    // HTTPS server options
    const httpsOptions = getHttpsOptions();
    
    // Create and start HTTPS server
    const server = https.createServer(httpsOptions, app);
    server.listen(port, () => {
      console.log(`Server is running at https://localhost:${port} with ${certPath.includes('mkcert') ? 'mkcert' : 'fallback'} certificates`);
      console.log(`Certificate path: ${certPath}`);
      console.log(`Key path: ${keyPath}`);
    });
    
    return server;
  } catch (error) {
    console.error('Error occurred while starting server:', error);
    process.exit(1);
  }
}

// When used as a module in Electron app
if (require.main === module) {
  startServer();
}

module.exports = { startServer }; 