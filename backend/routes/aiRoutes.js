const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const requireAuth = require('../middleware/requireAuth');

// Apply authentication middleware to all routes
router.use(requireAuth);

// AI routes
router.post('/breakdown', aiController.breakdownTask);
router.post('/prioritize', aiController.prioritizeTasks);
router.post('/suggestions', aiController.generateSuggestions);
router.post('/subtask-suggestions', aiController.generateSubtaskSuggestions);

module.exports = router;
