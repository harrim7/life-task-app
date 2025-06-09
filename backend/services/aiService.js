const { OpenAI } = require('openai');
require('dotenv').config();

let openai;
try {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
} catch (error) {
  console.warn('OpenAI API key not configured. AI features will not work.');
  openai = null;
}

/**
 * Breaks down a main task into subtasks using AI
 */
async function breakdownTask(taskTitle, taskDescription) {
  try {
    if (!openai) {
      console.warn('OpenAI client not initialized. Using mock data instead.');
      return {
        subtasks: [
          {
            title: "Plan Task",
            description: "Initial planning for " + taskTitle,
            priority: "high",
            dueDate: 1
          },
          {
            title: "Execute Task",
            description: "Implement the core components of " + taskTitle,
            priority: "medium",
            dueDate: 3
          },
          {
            title: "Review Task",
            description: "Review and finalize " + taskTitle,
            priority: "low",
            dueDate: 5
          }
        ]
      };
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a helpful assistant that breaks down complex tasks into actionable subtasks." },
        { role: "user", content: `Break down this task into smaller, actionable subtasks: Task: ${taskTitle}\nDescription: ${taskDescription}\n\nProvide output as a JSON array of objects with 'title', 'description', 'priority' (low, medium, high), and estimated 'dueDate' offset in days from now.` }
      ],
      response_format: { type: "json_object" }
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error('Error breaking down task:', error);
    throw new Error('Failed to break down task using AI');
  }
}

/**
 * Prioritizes a list of tasks using AI
 */
async function prioritizeTasks(tasks) {
  try {
    if (!openai) {
      console.warn('OpenAI client not initialized. Using mock data instead.');
      return {
        prioritizedTasks: tasks.map(task => ({
          ...task,
          priority: task.priority || "medium",
          reasoning: "Prioritized based on default logic (OpenAI API not available)"
        }))
      };
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a helpful assistant that prioritizes tasks based on urgency, importance, and dependencies." },
        { role: "user", content: `Prioritize these tasks and explain why: ${JSON.stringify(tasks)}\n\nProvide output as a JSON array of objects with the original task plus a 'priority' field (low, medium, high) and a 'reasoning' field.` }
      ],
      response_format: { type: "json_object" }
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error('Error prioritizing tasks:', error);
    throw new Error('Failed to prioritize tasks using AI');
  }
}

/**
 * Generates suggestions based on task category and description
 */
async function generateSuggestions(task) {
  try {
    if (!openai) {
      console.warn('OpenAI client not initialized. Using mock data instead.');
      return `Here are some suggestions for completing "${task.title}":\n\n` +
        `1. Break this task into smaller steps\n` +
        `2. Allocate sufficient time for completion\n` +
        `3. Consider seeking help if needed\n\n` +
        `Note: These are generic suggestions as the OpenAI API is not available.`;
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a helpful assistant that provides practical suggestions for completing tasks." },
        { role: "user", content: `Provide suggestions, resources, and tips for completing this task: ${JSON.stringify(task)}\n\nConsider: who to contact, tools needed, common pitfalls, estimated time required, and any special considerations.` }
      ]
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error generating suggestions:', error);
    throw new Error('Failed to generate suggestions using AI');
  }
}

module.exports = {
  breakdownTask,
  prioritizeTasks,
  generateSuggestions
};
