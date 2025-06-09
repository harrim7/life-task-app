const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const requireAuth = require('../middleware/requireAuth');

// Apply authentication middleware to all routes
router.use(requireAuth);

// Task routes
router.post('/', taskController.createTask);
router.get('/', taskController.getTasks);
router.get('/:id', taskController.getTaskById);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);
router.post('/:id/subtasks', taskController.addSubtask);
router.put('/:id/subtasks/:subtaskId', taskController.updateSubtask);
router.delete('/:id/subtasks/:subtaskId', taskController.deleteSubtask);

module.exports = router;
