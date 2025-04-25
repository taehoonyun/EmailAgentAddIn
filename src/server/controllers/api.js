const store = require('../config/store');
const openaiService = require('../services/openai');

/**
 * Save API key to store
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
function saveApiKey(req, res) {
  const { apiKey } = req.body;
  
  if (!apiKey) {
    return res.status(400).json({ success: false, message: 'API key is required.' });
  }
  
  store.set('apiKey', apiKey);
  console.log('API key has been saved.');
  
  res.json({ success: true, message: 'API key has been saved.' });
}

/**
 * Get masked API key
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
function getApiKey(req, res) {
  const apiKey = store.get('apiKey');
  
  if (!apiKey) {
    return res.status(404).json({ success: false, message: 'API key is not set.' });
  }
  
  // Mask API key (show first 4 and last 4 characters)
  const maskedKey = apiKey.length > 8 
    ? `${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}`
    : '****';
  
  res.json({ success: true, apiKey: maskedKey, hasKey: !!apiKey });
}

/**
 * Get a value from store by key
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
function getStoreValue(req, res) {
  const { key } = req.query;
  
  if (!key) {
    return res.status(400).json({ success: false, message: 'Key parameter is required.' });
  }
  
  const value = store.get(key);
  res.json({ success: true, value });
}

/**
 * Set a value in store by key
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
function setStoreValue(req, res) {
  const { key, value } = req.body;
  
  if (!key) {
    return res.status(400).json({ success: false, message: 'Key parameter is required.' });
  }
  
  store.set(key, value);
  console.log(`Store value for key "${key}" has been saved.`);
  
  res.json({ success: true, message: `Value for "${key}" has been saved.` });
}

/**
 * Analyze text using OpenAI
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function analyzeText(req, res) {
  const { prompt } = req.body;
  
  try {
    const result = await openaiService.analyzeText(prompt);
    res.json({ success: true, result });
  } catch (error) {
    console.error('API Error:', error);
    res.status(error.code || 500).json({ 
      success: false, 
      message: error.message || 'Server error occurred.' 
    });
  }
}

module.exports = {
  saveApiKey,
  getApiKey,
  getStoreValue,
  setStoreValue,
  analyzeText
}; 