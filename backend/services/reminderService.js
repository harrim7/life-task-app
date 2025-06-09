const Task = require('../models/Task');
const User = require('../models/User');
const nodemailer = require('nodemailer');
require('dotenv').config();

/**
 * Service to handle reminders for tasks
 */
class ReminderService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  /**
   * Check for tasks with due dates coming up and send reminders
   */
  async checkAndSendReminders() {
    try {
      // Get tasks with reminder dates that match today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const tasks = await Task.find({
        $or: [
          { reminderDates: { $gte: today, $lt: tomorrow } },
          { dueDate: { $gte: today, $lt: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000) } }
        ],
        status: { $ne: 'completed' }
      }).populate('user', 'name email preferences');
      
      // Group tasks by user
      const userTasks = {};
      
      tasks.forEach(task => {
        const userId = task.user._id.toString();
        if (!userTasks[userId]) {
          userTasks[userId] = {
            user: task.user,
            tasks: []
          };
        }
        userTasks[userId].tasks.push(task);
      });
      
      // Send reminders to each user
      for (const userId in userTasks) {
        await this.sendReminderEmail(userTasks[userId]);
      }
      
      return { success: true, tasksSent: tasks.length };
    } catch (error) {
      console.error('Error checking and sending reminders:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send reminder email to a user about their tasks
   */
  async sendReminderEmail({ user, tasks }) {
    // Skip if user has email notifications disabled
    if (!user.preferences?.notificationMethods?.email) {
      return;
    }
    
    // Build email content
    const taskList = tasks.map(task => {
      const dueText = task.dueDate ? `Due: ${task.dueDate.toLocaleDateString()}` : 'No due date';
      return `- ${task.title} (${dueText}) - Priority: ${task.priority}`;
    }).join('\n');
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Task Reminders: Actions Required Soon',
      text: `Hello ${user.name},

Here are your upcoming tasks that need attention:

${taskList}

Visit your task dashboard to see more details and mark tasks as complete.
      
Best regards,
Your Life Task Assistant`,
      html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2>Hello ${user.name},</h2>
  <p>Here are your upcoming tasks that need attention:</p>
  <ul>
    ${tasks.map(task => {
      const dueText = task.dueDate ? `Due: ${task.dueDate.toLocaleDateString()}` : 'No due date';
      return `<li><strong>${task.title}</strong> (${dueText}) - Priority: <span style="color: ${task.priority === 'high' ? 'red' : task.priority === 'medium' ? 'orange' : 'green'}">${task.priority}</span></li>`;
    }).join('')}
  </ul>
  <p>Visit your <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}">task dashboard</a> to see more details and mark tasks as complete.</p>
  <p>Best regards,<br>Your Life Task Assistant</p>
</div>`
    };
    
    try {
      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Error sending reminder email:', error);
      return false;
    }
  }

  /**
   * Schedule a reminder for a specific task
   */
  async scheduleTaskReminder(taskId, reminderDate) {
    try {
      const task = await Task.findById(taskId);
      
      if (!task) {
        throw new Error('Task not found');
      }
      
      // Add the reminder date
      if (!task.reminderDates) {
        task.reminderDates = [];
      }
      
      task.reminderDates.push(new Date(reminderDate));
      await task.save();
      
      return { success: true, task };
    } catch (error) {
      console.error('Error scheduling task reminder:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new ReminderService();