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

/**
 * Generate suggestions for completing a specific subtask
 */
exports.generateSubtaskSuggestions = async (req, res) => {
  try {
    const { taskId, subtaskId, question } = req.body;
    
    if (!taskId || !subtaskId) {
      return res.status(400).json({ error: 'Task ID and subtask ID are required' });
    }
    
    // Find the task and subtask
    const Task = require('../models/Task');
    const task = await Task.findById(taskId).lean();
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    // Check task belongs to authenticated user
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to access this task' });
    }
    
    // Find the subtask
    const subtask = task.subtasks.find(st => st._id.toString() === subtaskId);
    if (!subtask) {
      return res.status(404).json({ error: 'Subtask not found' });
    }
    
    // Get related subtasks for context
    const relatedSubtasks = task.subtasks.filter(st => st._id.toString() !== subtaskId);
    
    // Add user location if available
    const User = require('../models/User');
    let userContext = {};
    
    try {
      const user = await User.findById(req.user._id).select('location preferences').lean();
      if (user) {
        userContext = {
          location: user.location || 'Unknown',
          preferences: user.preferences || {}
        };
      }
    } catch (err) {
      console.log('Could not retrieve user data:', err);
      // Continue without user context
    }
    
    // Prepare a rich context object for the AI
    const contextData = {
      task: {
        title: task.title,
        description: task.description,
        category: task.category,
        priority: task.priority,
        status: task.status,
        dueDate: task.dueDate
      },
      subtask: subtask,
      relatedSubtasks: relatedSubtasks.map(st => ({
        title: st.title,
        description: st.description,
        priority: st.priority,
        completed: st.completed
      })),
      userContext
    };
    
    // Get suggestions with enhanced context
    const suggestions = await aiService.generateSubtaskSuggestions(contextData, subtask, question);
    
    // Mark the subtask as AI-assisted in the database
    const taskDoc = await Task.findById(taskId);
    const subtaskDoc = taskDoc.subtasks.id(subtaskId);
    subtaskDoc.aiAssisted = true;
    await taskDoc.save();
    
    // Return the updated subtask and suggestions
    res.status(200).json({ 
      suggestions, 
      subtask: {
        ...subtask,
        aiAssisted: true
      } 
    });
  } catch (error) {
    console.error('Error in generateSubtaskSuggestions controller:', error);
    res.status(500).json({ error: 'Failed to generate subtask suggestions' });
  }
};
