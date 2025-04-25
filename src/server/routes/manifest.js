const express = require('express');
const manifestController = require('../controllers/manifest');

const router = express.Router();

router.get('/manifest-content', manifestController.getManifestContent);
router.get('/download-manifest', manifestController.downloadManifest);

module.exports = router; 