const fs = require('fs');
const path = require('path');

/**
 * Get manifest content as text
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
function getManifestContent(req, res) {
  const manifestPath = path.join(__dirname, '../../../manifest.xml');
  
  if (fs.existsSync(manifestPath)) {
    console.log('Manifest content requested');
    
    try {
      const content = fs.readFileSync(manifestPath, 'utf8');
      res.setHeader('Content-Type', 'text/plain');
      res.send(content);
      console.log('Manifest content sent successfully');
    } catch (error) {
      console.error('Error reading manifest file:', error);
      res.status(500).send('Error reading manifest file');
    }
  } else {
    console.error('Manifest file not found');
    res.status(404).send('Manifest file not found');
  }
}

/**
 * Download manifest file
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
function downloadManifest(req, res) {
  const manifestPath = path.join(__dirname, '../../../manifest.xml');
  
  if (fs.existsSync(manifestPath)) {
    console.log('Manifest file download requested');
    
    // Set headers to force download
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', 'attachment; filename="manifest.xml"');
    res.setHeader('Content-Description', 'File Transfer');
    res.setHeader('Cache-Control', 'no-cache');
    
    const fileStream = fs.createReadStream(manifestPath);
    let downloaded = false;
    
    fileStream.on('end', () => {
      downloaded = true;
      console.log('Manifest file downloaded successfully');
    });
    
    fileStream.on('error', (err) => {
      console.error('Error downloading manifest file:', err);
      if (!res.headersSent) {
        res.status(500).send('Error downloading manifest file');
      }
    });
    
    fileStream.pipe(res);
    
    // If client aborts or download completes
    res.on('close', () => {
      if (!downloaded) {
        console.log('Manifest file download was interrupted');
      }
    });
  } else {
    console.error('Manifest file not found');
    res.status(404).send('Manifest file not found');
  }
}

module.exports = {
  getManifestContent,
  downloadManifest
}; 