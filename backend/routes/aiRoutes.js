const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

// AI routes
router.post('/breakdown', aiController.breakdownTask);
router.post('/prioritize', aiController.prioritizeTasks);
router.post('/suggestions', aiController.generateSuggestions);

module.exports = router;
