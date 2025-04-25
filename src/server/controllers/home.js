const store = require('../config/store');

/**
 * Render home page
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
function renderHomePage(req, res) {
  const port = store.get('port') || 3000;
  
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Email AI Assistant</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          margin: 0;
          padding: 20px;
          background-color: #f5f5f5;
          color: #333;
          line-height: 1.6;
        }
        .container {
          max-width: 800px;
          margin: 0 auto;
          background-color: white;
          padding: 20px;
          border-radius: 5px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        h1 {
          color: #0078d7;
          margin-top: 0;
        }
        .links {
          margin-top: 20px;
        }
        .links a {
          display: block;
          margin-bottom: 10px;
          color: #0078d7;
          text-decoration: none;
        }
        .links a:hover {
          text-decoration: underline;
        }
        .status {
          margin-top: 20px;
          padding: 10px;
          background-color: #f0f7ff;
          border-left: 4px solid #0078d7;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Email AI Assistant Server</h1>
        <p>The local server for the Email AI Assistant is running correctly.</p>
        
        <div class="status">
          <p><strong>Server Status:</strong> Online</p>
          <p><strong>Port:</strong> ${port}</p>
        </div>
        
        <div class="links">
          <h3>Available Resources:</h3>
          <a href="/manifest.xml">Manifest XML File</a>
          <a href="/download-manifest">Download Manifest File</a>
          <a href="/taskpane.html">Task Pane Interface</a>
        </div>
        
        <p>This server handles the backend functionality for the Outlook add-in.</p>
      </div>
    </body>
    </html>
  `);
  console.log('Root page accessed');
}

module.exports = {
  renderHomePage
}; 