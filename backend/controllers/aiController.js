const aiService = require('../services/aiService');

/**
 * Break down a task into subtasks
 */
exports.breakdownTask = async (req, res) => {
  try {
    const { taskId, title, description } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Task title is required' });
    }
    
    // Get the breakdown result from AI service
    const result = await aiService.breakdownTask(title, description || '');
    
    // If we have a task ID and subtasks, add them to the task
    if (taskId && result.subtasks && Array.isArray(result.subtasks)) {
      const Task = require('../models/Task');
      const task = await Task.findById(taskId);
      
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }
      
      // Check task belongs to authenticated user
      if (task.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ error: 'Not authorized to modify this task' });
      }
      
      // Add each AI-generated subtask to the task
      for (const subtask of result.subtasks) {
        const newSubtask = {
          title: subtask.title,
          description: subtask.description,
          priority: subtask.priority ? subtask.priority.toLowerCase() : 'medium',
          dueDate: subtask.dueDate 
            ? new Date(Date.now() + subtask.dueDate * 24 * 60 * 60 * 1000) // Convert days to milliseconds
            : undefined
        };
        
        task.subtasks.push(newSubtask);
      }
      
      task.updatedAt = new Date();
      await task.save();
      
      return res.status(200).json(task);
    }
    
    // If no task ID, just return the subtasks
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
