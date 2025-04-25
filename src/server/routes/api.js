const express = require('express');
const apiController = require('../controllers/api');

const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).send('Server is running');
});

// API key routes
router.post('/save-key', apiController.saveApiKey);
router.get('/get-key', apiController.getApiKey);
router.post('/set-api-key', apiController.saveApiKey);

// Generic store value routes
router.get('/get-store-value', apiController.getStoreValue);
router.post('/set-store-value', apiController.setStoreValue);

// Email analysis route
router.post('/analyze', apiController.analyzeText);
router.post('/process-email', apiController.analyzeText);

module.exports = router; 