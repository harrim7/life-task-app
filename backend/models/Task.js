const mongoose = require('mongoose');

const SubtaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: String,
  completed: {
    type: Boolean,
    default: false
  },
  dueDate: Date,
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  notes: String,
  resources: [String],
  completedAt: Date
}, { timestamps: true });

const TaskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: String,
  category: {
    type: String,
    enum: ['home', 'work', 'finance', 'health', 'family', 'other'],
    default: 'other'
  },
  status: {
    type: String,
    enum: ['not_started', 'in_progress', 'completed', 'deferred'],
    default: 'not_started'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  dueDate: Date,
  reminderDates: [Date],
  subtasks: [SubtaskSchema],
  notes: String,
  attachments: [String],
  aiGenerated: {
    type: Boolean,
    default: false
  },
  completedAt: Date
}, { timestamps: true });

module.exports = mongoose.model('Task', TaskSchema);
