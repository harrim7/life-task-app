const cron = require('node-cron');
const reminderService = require('../services/reminderService');

/**
 * Configure and start the cron jobs for the application
 */
function startScheduler() {
  // Run daily at 8am to check for reminders
  cron.schedule('0 8 * * *', async () => {
    console.log('Running daily reminder check...');
    const result = await reminderService.checkAndSendReminders();
    console.log(`Reminder check complete. Sent reminders for ${result.tasksSent || 0} tasks.`);
  });

  // Run weekly on Sunday at 7pm to suggest task planning for the week
  cron.schedule('0 19 * * 0', async () => {
    console.log('Running weekly planning suggestions...');
    // This would be implemented with additional logic to suggest planning for the week
  });

  console.log('Scheduler initialized successfully');
}

module.exports = { startScheduler };