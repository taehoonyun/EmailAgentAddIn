/**
 * Simple logger module for Email AI Assistant
 */

const fs = require('fs');
const path = require('path');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logsDir)) {
  try {
    fs.mkdirSync(logsDir, { recursive: true });
  } catch (err) {
    console.error('Failed to create logs directory:', err);
    // Continue even if we can't create logs directory
  }
}

// Log file paths
const logFilePath = path.join(logsDir, 'app.log');
const errorLogFilePath = path.join(logsDir, 'error.log');

/**
 * Get current timestamp
 * @returns {string} Formatted timestamp
 */
function getTimestamp() {
  const now = new Date();
  return now.toISOString();
}

/**
 * Write message to log file
 * @param {string} message - Message to log
 * @param {string} filePath - Path to log file
 */
function writeToFile(message, filePath) {
  try {
    fs.appendFileSync(filePath, message + '\n');
  } catch (err) {
    console.error('Failed to write to log file:', err);
  }
}

/**
 * Log levels and their methods
 */
const logger = {
  /**
   * Log info message
   * @param {string} message - Message to log
   */
  info: function(message) {
    const logMessage = `[INFO] ${getTimestamp()} - ${message}`;
    console.log('\x1b[36m%s\x1b[0m', logMessage); // Cyan color for info
    writeToFile(logMessage, logFilePath);
  },

  /**
   * Log warning message
   * @param {string} message - Message to log
   */
  warn: function(message) {
    const logMessage = `[WARN] ${getTimestamp()} - ${message}`;
    console.log('\x1b[33m%s\x1b[0m', logMessage); // Yellow color for warnings
    writeToFile(logMessage, logFilePath);
  },

  /**
   * Log error message
   * @param {string} message - Message to log
   * @param {Error} [error] - Optional error object
   */
  error: function(message, error) {
    let logMessage = `[ERROR] ${getTimestamp()} - ${message}`;
    
    if (error && error.stack) {
      logMessage += `\n${error.stack}`;
    }
    
    console.error('\x1b[31m%s\x1b[0m', logMessage); // Red color for errors
    writeToFile(logMessage, logFilePath);
    writeToFile(logMessage, errorLogFilePath);
  },

  /**
   * Log debug message (only in development)
   * @param {string} message - Message to log
   */
  debug: function(message) {
    // Only log debug messages if not in production
    if (process.env.NODE_ENV !== 'production') {
      const logMessage = `[DEBUG] ${getTimestamp()} - ${message}`;
      console.log('\x1b[90m%s\x1b[0m', logMessage); // Gray color for debug
      writeToFile(logMessage, logFilePath);
    }
  }
};

module.exports = logger; 