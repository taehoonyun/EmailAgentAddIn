const express = require('express');
const path = require('path');

/**
 * Configure Express application
 * @returns {Object} Configured Express app
 */
function configureExpress() {
  const app = express();
  
  // Parse JSON request bodies
  app.use(express.json());
  
  // Serve static files with proper headers
  app.use(express.static(path.join(__dirname, '../../..'), {
    setHeaders: (res, filePath) => {
      // Allow cross-origin requests for all static files
      res.setHeader('Access-Control-Allow-Origin', '*');
      
      // Set proper content type for XML files
      if (filePath.endsWith('.xml')) {
        res.setHeader('Content-Type', 'application/xml');
      }
      
      // Set cache control for better performance but allow reloading
      res.setHeader('Cache-Control', 'public, max-age=0');
    }
  }));
  
  // Set CORS headers
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });
  
  return app;
}

module.exports = configureExpress; 