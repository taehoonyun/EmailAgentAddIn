const fs = require('fs');
const path = require('path');

/**
 * Find SSL certificate and key files for HTTPS server
 * @returns {Object} Object containing paths to cert and key files
 */
function findCertificates() {
  let certPath, keyPath;
  
  // Try to find mkcert certificates
  const possibleCertPaths = [
    path.join(__dirname, '../../../localhost+2.pem'),
    path.join(__dirname, '../../../localhost.pem'),
    path.join('C:\\Windows\\System32', 'localhost+2.pem'),
    path.join('C:\\Windows\\System32', 'localhost.pem')
  ];
  
  const possibleKeyPaths = [
    path.join(__dirname, '../../../localhost+2-key.pem'),
    path.join(__dirname, '../../../localhost-key.pem'),
    path.join('C:\\Windows\\System32', 'localhost+2-key.pem'),
    path.join('C:\\Windows\\System32', 'localhost-key.pem')
  ];
  
  // Check for mkcert certificates
  for (const cert of possibleCertPaths) {
    if (fs.existsSync(cert)) {
      certPath = cert;
      console.log(`Found certificate file: ${cert}`);
      break;
    }
  }
  
  for (const key of possibleKeyPaths) {
    if (fs.existsSync(key)) {
      keyPath = key;
      console.log(`Found key file: ${key}`);
      break;
    }
  }
  
  // If mkcert certificates not found, fall back to generated ones
  if (!certPath || !keyPath) {
    console.log('mkcert certificates not found, using fallback certificates');
    certPath = path.join(__dirname, '../../../cert', 'cert.pem');
    keyPath = path.join(__dirname, '../../../cert', 'key.pem');
    
    // Check fallback certificates
    if (!fs.existsSync(certPath) || !fs.existsSync(keyPath)) {
      console.error('Certificate files are missing. Please generate certificates using: npm run generate-cert');
      process.exit(1);
    }
  }
  
  return { certPath, keyPath };
}

/**
 * Get HTTPS server options with SSL certificates
 * @returns {Object} HTTPS server options
 */
function getHttpsOptions() {
  const { certPath, keyPath } = findCertificates();
  
  return {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath),
    minVersion: 'TLSv1.2',
    honorCipherOrder: true,
    ciphers: 'ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256',
    // Allow self-signed certificate
    rejectUnauthorized: false
  };
}

module.exports = {
  findCertificates,
  getHttpsOptions
}; 