const { OpenAI } = require('openai');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Breaks down a main task into subtasks using AI
 */
async function breakdownTask(taskTitle, taskDescription) {
  try {
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
