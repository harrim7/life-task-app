const Task = require('../models/Task');

/**
 * Create a new task
 */
exports.createTask = async (req, res) => {
  try {
    const { title, description, category, priority, dueDate, reminderDates } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Task title is required' });
    }
    
    // For demo purposes, hardcoding a user ID. In a real app, this would come from authentication
    const userId = '64f78d9e1d41c82b3d6c80a1';
    
    const task = new Task({
      user: userId,
      title,
      description,
      category,
      priority,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      reminderDates: reminderDates ? reminderDates.map(date => new Date(date)) : []
    });
    
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
};

/**
 * Get all tasks for a user
 */
exports.getTasks = async (req, res) => {
  try {
    // For demo purposes, hardcoding a user ID. In a real app, this would come from authentication
    const userId = '64f78d9e1d41c82b3d6c80a1';
    
    const { category, status, priority } = req.query;
    const query = { user: userId };
    
    if (category) query.category = category;
    if (status) query.status = status;
    if (priority) query.priority = priority;
    
    const tasks = await Task.find(query).sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

/**
 * Get a task by ID
 */
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    // For demo purposes, hardcoding a user ID. In a real app, this would come from authentication
    const userId = '64f78d9e1d41c82b3d6c80a1';
    
    if (task.user.toString() !== userId) {
      return res.status(403).json({ error: 'Not authorized to access this task' });
    }
    
    res.status(200).json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ error: 'Failed to fetch task' });
  }
};

/**
 * Update a task
 */
exports.updateTask = async (req, res) => {
  try {
    const { title, description, category, status, priority, dueDate, reminderDates } = req.body;
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    // For demo purposes, hardcoding a user ID. In a real app, this would come from authentication
    const userId = '64f78d9e1d41c82b3d6c80a1';
    
    if (task.user.toString() !== userId) {
      return res.status(403).json({ error: 'Not authorized to update this task' });
    }
    
    // Update fields if provided
    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (category) task.category = category;
    if (status) {
      task.status = status;
      if (status === 'completed' && !task.completedAt) {
        task.completedAt = new Date();
      } else if (status !== 'completed') {
        task.completedAt = undefined;
      }
    }
    if (priority) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate ? new Date(dueDate) : undefined;
    if (reminderDates) task.reminderDates = reminderDates.map(date => new Date(date));
    
    await task.save();
    res.status(200).json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
};

/**
 * Delete a task
 */
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    // For demo purposes, hardcoding a user ID. In a real app, this would come from authentication
    const userId = '64f78d9e1d41c82b3d6c80a1';
    
    if (task.user.toString() !== userId) {
      return res.status(403).json({ error: 'Not authorized to delete this task' });
    }
    
    await task.deleteOne();
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
};

/**
 * Add a subtask to a task
 */
exports.addSubtask = async (req, res) => {
  try {
    const { title, description, priority, dueDate } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Subtask title is required' });
    }
    
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    // For demo purposes, hardcoding a user ID. In a real app, this would come from authentication
    const userId = '64f78d9e1d41c82b3d6c80a1';
    
    if (task.user.toString() !== userId) {
      return res.status(403).json({ error: 'Not authorized to modify this task' });
    }
    
    const subtask = {
      title,
      description,
      priority,
      dueDate: dueDate ? new Date(dueDate) : undefined
    };
    
    task.subtasks.push(subtask);
    await task.save();
    
    res.status(201).json(task);
  } catch (error) {
    console.error('Error adding subtask:', error);
    res.status(500).json({ error: 'Failed to add subtask' });
  }
};

/**
 * Update a subtask
 */
exports.updateSubtask = async (req, res) => {
  try {
    const { title, description, priority, dueDate, completed } = req.body;
    
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    // For demo purposes, hardcoding a user ID. In a real app, this would come from authentication
    const userId = '64f78d9e1d41c82b3d6c80a1';
    
    if (task.user.toString() !== userId) {
      return res.status(403).json({ error: 'Not authorized to modify this task' });
    }
    
    const subtask = task.subtasks.id(req.params.subtaskId);
    
    if (!subtask) {
      return res.status(404).json({ error: 'Subtask not found' });
    }
    
    // Update fields if provided
    if (title) subtask.title = title;
    if (description !== undefined) subtask.description = description;
    if (priority) subtask.priority = priority;
    if (dueDate !== undefined) subtask.dueDate = dueDate ? new Date(dueDate) : undefined;
    if (completed !== undefined) {
      subtask.completed = completed;
      if (completed && !subtask.completedAt) {
        subtask.completedAt = new Date();
      } else if (!completed) {
        subtask.completedAt = undefined;
      }
    }
    
    await task.save();
    res.status(200).json(task);
  } catch (error) {
    console.error('Error updating subtask:', error);
    res.status(500).json({ error: 'Failed to update subtask' });
  }
};

/**
 * Delete a subtask
 */
exports.deleteSubtask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    // For demo purposes, hardcoding a user ID. In a real app, this would come from authentication
    const userId = '64f78d9e1d41c82b3d6c80a1';
    
    if (task.user.toString() !== userId) {
      return res.status(403).json({ error: 'Not authorized to modify this task' });
    }
    
    const subtask = task.subtasks.id(req.params.subtaskId);
    
    if (!subtask) {
      return res.status(404).json({ error: 'Subtask not found' });
    }
    
    subtask.deleteOne();
    await task.save();
    
    res.status(200).json({ message: 'Subtask deleted successfully' });
  } catch (error) {
    console.error('Error deleting subtask:', error);
    res.status(500).json({ error: 'Failed to delete subtask' });
  }
};
