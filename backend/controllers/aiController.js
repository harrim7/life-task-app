const aiService = require('../services/aiService');

/**
 * Break down a task into subtasks
 */
exports.breakdownTask = async (req, res) => {
  try {
    const { title, description } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Task title is required' });
    }
    
    const result = await aiService.breakdownTask(title, description || '');
    res.status(200).json(result);
  } catch (error) {
    console.error('Error in breakdownTask controller:', error);
    res.status(500).json({ error: 'Failed to break down task' });
  }
};

/**
 * Prioritize a list of tasks
 */
exports.prioritizeTasks = async (req, res) => {
  try {
    const { tasks } = req.body;
    
    if (!tasks || !Array.isArray(tasks) || tasks.length === 0) {
      return res.status(400).json({ error: 'Valid tasks array is required' });
    }
    
    const result = await aiService.prioritizeTasks(tasks);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error in prioritizeTasks controller:', error);
    res.status(500).json({ error: 'Failed to prioritize tasks' });
  }
};

/**
 * Generate suggestions for completing a task
 */
exports.generateSuggestions = async (req, res) => {
  try {
    const { task } = req.body;
    
    if (!task || !task.title) {
      return res.status(400).json({ error: 'Valid task object with title is required' });
    }
    
    const suggestions = await aiService.generateSuggestions(task);
    res.status(200).json({ suggestions });
  } catch (error) {
    console.error('Error in generateSuggestions controller:', error);
    res.status(500).json({ error: 'Failed to generate suggestions' });
  }
};
