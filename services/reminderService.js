const axios = require('axios');
const todoModel = require('../models/todoModel');
const cron = require('node-cron');

const EMAIL_SERVICE_URL = 'http://localhost:3001';

// Update the processReminders function in services/reminderService.js
const processReminders = async () => {
  try {
    console.log('Checking for reminders...', new Date().toISOString());
    
    const todosWithReminders = await todoModel.getTodosWithRemindersForToday();
    
    if (todosWithReminders.length === 0) {
      console.log('No reminders to send today');
      return { success: true, message: 'No reminders to send' };
    }

    console.log(`Found ${todosWithReminders.length} reminders to send`);
    
    const results = [];
    
    for (const todo of todosWithReminders) {
      try {
        const emailData = {
          to_address: todo.email,
          subject: `Reminder: ${todo.title}`,
          text: `Don't forget about your todo: ${todo.title}${todo.description ? '\nDescription: ' + todo.description : ''}`,
          html: `
            <h2>Todo Reminder</h2>
            <p><strong>Title:</strong> ${todo.title}</p>
            ${todo.description ? `<p><strong>Description:</strong> ${todo.description}</p>` : ''}
            <p><strong>Due:</strong> Today</p>
          `
        };

        console.log(`Sending reminder for todo: ${todo.title} to ${todo.email}`); // Add this log
        
        const response = await axios.post(`${EMAIL_SERVICE_URL}/send-email`, emailData);
        console.log(`Reminder sent successfully for todo: ${todo.title}`);
        results.push({ todoId: todo.id, success: true, message: 'Sent successfully' });
        
      } catch (emailError) {
        console.error(`Failed to send reminder for todo ${todo.id}:`, emailError.message);
        results.push({ todoId: todo.id, success: false, message: 'Failed to send' });
      }
    }
    
    return { success: true, results };
    
  } catch (error) {
    console.error('Error in processReminders:', error);
    return { success: false, message: 'Error processing reminders' };
  }
};

// Setup cron job - runs daily at 9 AM
const startReminderCron = () => {
  // '0 9 * * *' means every day at 9:00 AM
  // You can change this to '0 0 * * *' for midnight, or any other time
  cron.schedule('0 9 * * *', async () => {
    console.log('Daily reminder cron job triggered');
    await processReminders();
  });
  
  console.log('Reminder cron job scheduled for 9:00 AM daily');
};

module.exports = {
  processReminders,
  startReminderCron,
};