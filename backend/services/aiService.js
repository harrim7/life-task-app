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

/**
 * Generates specific suggestions for completing a subtask
 */
async function generateSubtaskSuggestions(contextData, subtask) {
  try {
    if (!openai) {
      console.warn('OpenAI client not initialized. Using mock data instead.');
      return `Here are some suggestions for completing the subtask "${subtask.title}":\n\n` +
        `1. Research best practices for this specific step\n` +
        `2. Set a timer to focus on just this subtask\n` +
        `3. Consider what tools or resources you'll need\n\n` +
        `Note: These are generic suggestions as the OpenAI API is not available.`;
    }

    // Extract location information if available
    const userLocation = contextData.userContext?.location || 'Unknown';
    
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { 
          role: "system", 
          content: `You are a helpful assistant that provides specific, practical suggestions for completing subtasks. 
                    You have extensive knowledge about how to accomplish tasks efficiently and can provide detailed, 
                    actionable advice including resources, tools, services, and step-by-step instructions.
                    
                    When mentioning local services or location-specific information, refer to the user's location: ${userLocation}.
                    
                    Your goal is to make this subtask as easy as possible to complete by providing comprehensive, 
                    specific guidance. When a task is about finding services (plumbers, contractors, specialists), 
                    provide exact search terms, websites, apps, and criteria for selection.`
        },
        { 
          role: "user", 
          content: `Provide detailed, practical assistance for completing this subtask: ${JSON.stringify(subtask)}\n\n` +
            `Here is the full context:\n${JSON.stringify(contextData, null, 2)}\n\n` +
            `Please include ALL of the following in your response:
            1. Step-by-step instructions for completing this specific subtask
            2. Relevant resources, tools, or services that would help (be specific - include websites, app names, service providers, etc.)
            3. If applicable, provide contact information or search terms for finding local services (plumbers, contractors, etc.)
            4. If applicable, provide product recommendations or alternatives
            5. Estimated time required and difficulty level
            6. Common pitfalls to avoid and how to verify successful completion
            
            Format your response in a clear, organized way with headings and bullet points when appropriate.`
        }
      ],
      temperature: 0.7, // Add some creativity but keep it practical
      max_tokens: 1500  // Allow for detailed responses
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error generating subtask suggestions:', error);
    throw new Error('Failed to generate subtask suggestions using AI');
  }
}

module.exports = {
  breakdownTask,
  prioritizeTasks,
  generateSuggestions,
  generateSubtaskSuggestions
};
