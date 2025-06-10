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
      ]
    });

    // Parse the response - handling both string and JSON formats
    try {
      const content = response.choices[0].message.content;
      // Try to find JSON in the response
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const subtasks = JSON.parse(jsonMatch[0]);
        // Normalize priority values to lowercase
        subtasks.forEach(subtask => {
          if (subtask.priority) {
            subtask.priority = subtask.priority.toLowerCase();
          }
        });
        return { subtasks };
      } else {
        // Fallback to a simple parsing approach
        return { 
          subtasks: [
            {
              title: "Research & Planning",
              description: `Initial research and planning for ${taskTitle}`,
              priority: "high",
              dueDate: 1
            },
            {
              title: "Implementation",
              description: `Execute the main components of ${taskTitle}`,
              priority: "medium",
              dueDate: 3
            },
            {
              title: "Review & Finalization",
              description: `Complete and review ${taskTitle}`,
              priority: "medium",
              dueDate: 5
            }
          ]
        };
      }
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      // Return fallback subtasks
      return { 
        subtasks: [
          {
            title: "Research & Planning",
            description: `Initial research and planning for ${taskTitle}`,
            priority: "high",
            dueDate: 1
          },
          {
            title: "Implementation",
            description: `Execute the main components of ${taskTitle}`,
            priority: "medium",
            dueDate: 3
          },
          {
            title: "Review & Finalization",
            description: `Complete and review ${taskTitle}`,
            priority: "medium",
            dueDate: 5
          }
        ]
      };
    }
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
      ]
    });

    // Handle the response safely
    try {
      const content = response.choices[0].message.content;
      // Try to extract JSON
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const prioritizedTasks = JSON.parse(jsonMatch[0]);
        // Normalize priority values to lowercase
        prioritizedTasks.forEach(task => {
          if (task.priority) {
            task.priority = task.priority.toLowerCase();
          }
        });
        return { prioritizedTasks };
      } else {
        // Return the original tasks with default priorities
        return { 
          prioritizedTasks: tasks.map(task => ({
            ...task,
            priority: task.priority || "medium",
            reasoning: "Prioritized based on default logic"
          }))
        };
      }
    } catch (parseError) {
      console.error('Error parsing AI prioritization response:', parseError);
      // Return a fallback prioritization
      return { 
        prioritizedTasks: tasks.map(task => ({
          ...task,
          priority: task.priority || "medium",
          reasoning: "Prioritized based on default logic"
        }))
      };
    }
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
