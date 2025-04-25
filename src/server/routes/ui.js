const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const logger = require('../../../utils/logger');

// Simple home page
router.get('/', (req, res) => {
  console.log(`Root path accessed: ${req.path}`);
  
  return res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Email AI Assistant API</title>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; margin: 40px; }
        h1 { color: #2c3e50; }
        .card { background-color: white; border-radius: 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.12); padding: 20px; margin-bottom: 20px; }
        .endpoint { background: #f8f9fa; border-left: 4px solid #3498db; padding: 10px; margin-bottom: 10px; }
        .button { display: inline-block; background-color: #3498db; color: white; padding: 8px 16px; 
                 border-radius: 4px; text-decoration: none; margin-right: 10px; }
      </style>
    </head>
    <body>
      <h1>Email AI Assistant API</h1>
      
      <div class="card">
        <h2>API Endpoints</h2>
        <div class="endpoint">/api/health - Health check endpoint</div>
        <div class="endpoint">/api/process-email - Process email content</div>
        <div class="endpoint">/api/set-api-key - Configure API keys</div>
      </div>
      
      <div class="card">
        <h2>Resources</h2>
        <a href="/taskpane.html" class="button">View Taskpane UI</a>
        <a href="/api/health" class="button">Check API Status</a>
      </div>
    </body>
    </html>
  `);
});

// Taskpane handler
router.get('/taskpane.html', (req, res) => {
  if (req.query.noredirect) {
    const filePath = path.join(process.cwd(), 'public', 'taskpane.html');
    
    if (fs.existsSync(filePath)) {
      logger.info(`Serving taskpane.html from: ${filePath}`);
      return res.sendFile(filePath);
    } else {
      const srcFilePath = path.join(process.cwd(), 'src', 'taskpane', 'taskpane.html');
      
      if (fs.existsSync(srcFilePath)) {
        logger.info(`Serving taskpane.html from source: ${srcFilePath}`);
        return res.sendFile(srcFilePath);
      } else {
        return res.status(404).send('Taskpane.html not found');
      }
    }
  } else {
    return res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Email AI Assistant - Taskpane</title>
        <meta charset="UTF-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; margin: 40px; }
          h1 { color: #2c3e50; }
          .card { background: #f8f9fa; border-left: 4px solid #3498db; padding: 15px; margin-bottom: 15px; }
          .button { display: inline-block; background-color: #3498db; color: white; 
                   padding: 8px 16px; border-radius: 4px; text-decoration: none; }
        </style>
      </head>
      <body>
        <h1>Email AI Assistant - Taskpane Debug</h1>
        
        <div class="card">
          <p>This endpoint is designed to be loaded by the Outlook Add-in.</p>
          <p>For development, you can view the raw content or return to the dashboard.</p>
        </div>
        
        <a href="/taskpane.html?noredirect=1" class="button">View Raw Content</a>
        <a href="/" class="button">Return to Dashboard</a>
      </body>
      </html>
    `);
  }
});

module.exports = router; 