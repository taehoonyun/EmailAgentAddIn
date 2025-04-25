const express = require('express');
const homeController = require('../controllers/home');
const apiRoutes = require('./api');
const manifestRoutes = require('./manifest');
const uiRoutes = require('./ui');

const router = express.Router();

// Home route - UI 라우터로 대체
// router.get('/', homeController.renderHomePage);
router.use('/', uiRoutes);

// API routes under /api
router.use('/api', apiRoutes);

// Manifest routes
router.use('/', manifestRoutes);

module.exports = router; 