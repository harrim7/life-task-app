import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

// Task types
export interface Subtask {
  _id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  completed: boolean;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  category: 'home' | 'work' | 'finance' | 'health' | 'family' | 'other';
  status: 'not_started' | 'in_progress' | 'completed' | 'deferred';
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  reminderDates?: Date[];
  subtasks: Subtask[];
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  aiGenerated?: boolean;
}

interface NewTask {
  title: string;
  description?: string;
  category: 'home' | 'work' | 'finance' | 'health' | 'family' | 'other';
  priority?: 'low' | 'medium' | 'high';
  dueDate?: Date;
  reminderDates?: Date[];
}

interface TaskUpdate {
  title?: string;
  description?: string;
  category?: 'home' | 'work' | 'finance' | 'health' | 'family' | 'other';
  status?: 'not_started' | 'in_progress' | 'completed' | 'deferred';
  priority?: 'low' | 'medium' | 'high';
  dueDate?: Date;
  reminderDates?: Date[];
}

interface NewSubtask {
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: Date;
}

interface SubtaskUpdate {
  title?: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: Date;
  completed?: boolean;
  completedAt?: Date;
}

// Mock data for development (will be removed when API is connected)
const mockTasks: Task[] = [
  {
    _id: '1',
    title: 'Complete Project Proposal',
    description: 'Draft and finalize the project proposal document for the client meeting.',
    category: 'work',
    status: 'in_progress',
    priority: 'high',
    dueDate: new Date(Date.now() + 86400000), // tomorrow
    userId: '1',
    subtasks: [
      {
        _id: '1.1',
        title: 'Research market trends',
        description: 'Gather market data for the proposal',
        priority: 'medium',
        completed: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: '1.2',
        title: 'Draft executive summary',
        description: 'Create a compelling summary of the project',
        priority: 'high',
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: '1.3',
        title: 'Prepare budget section',
        description: 'Calculate and document the budget requirements',
        priority: 'high',
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: '2',
    title: 'Weekly Team Meeting',
    description: 'Prepare agenda and lead the weekly team sync meeting.',
    category: 'work',
    status: 'not_started',
    priority: 'medium',
    dueDate: new Date(Date.now() + 172800000), // day after tomorrow
    userId: '1',
    subtasks: [
      {
        _id: '2.1',
        title: 'Prepare meeting agenda',
        description: 'Create agenda based on team updates',
        priority: 'high',
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: '2.2',
        title: 'Send calendar invites',
        description: 'Make sure everyone has the meeting on their calendar',
        priority: 'medium',
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: '3',
    title: 'Update Documentation',
    description: 'Review and update the product documentation with recent changes.',
    category: 'work',
    status: 'not_started',
    priority: 'low',
    dueDate: new Date(Date.now() + 432000000), // 5 days from now
    userId: '1',
    subtasks: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

// Context type definition
interface TaskContextType {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  getTask: (id: string) => Promise<Task>;
  createTask: (task: NewTask) => Promise<Task>;
  updateTask: (id: string, updates: TaskUpdate) => Promise<Task>;
  deleteTask: (id: string) => Promise<void>;
  addSubtask: (taskId: string, subtask: NewSubtask) => Promise<Task>;
  updateSubtask: (taskId: string, subtaskId: string, updates: SubtaskUpdate) => Promise<Task>;
  deleteSubtask: (taskId: string, subtaskId: string) => Promise<Task>;
  breakdownTask: (taskId: string) => Promise<Task>;
  prioritizeTasks: () => Promise<Task[]>;
  generateSuggestions: (taskId: string) => Promise<string>;
}

// Create the context
const TaskContext = createContext<TaskContextType | undefined>(undefined);

// Provider props
interface TaskProviderProps {
  children: ReactNode;
}

// Task provider component
export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();
  
  // Fetch all tasks (initial load and refresh)
  useEffect(() => {
    if (isAuthenticated) {
      // Add delay before fetching tasks
      const timer = setTimeout(() => {
        fetchTasks();
      }, 500); // 500ms delay
      
      // Clean up timer if component unmounts
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated]);
  
  // Fetch all tasks with retry mechanism
  const fetchTasks = async (retryCount = 0) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get('/api/tasks');
      setTasks(response.data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      
      // Retry logic - attempt up to 3 retries with increasing delay
      if (retryCount < 3) {
        console.log(`Retrying fetch tasks (attempt ${retryCount + 1})...`);
        setTimeout(() => {
          fetchTasks(retryCount + 1);
        }, 1000 * (retryCount + 1)); // Exponential backoff: 1s, 2s, 3s
        return; // Exit early, don't set loading to false yet
      }
      
      setError('Failed to load tasks. Please try again later.');
      
      // Fallback to mock data in development
      if (process.env.NODE_ENV === 'development') {
        console.log('Using mock data for development');
        setTasks(mockTasks);
      }
    } finally {
      if (retryCount === 0 || retryCount >= 3) {
        setLoading(false);
      }
    }
  };
  
  // Get a single task
  const getTask = async (id: string): Promise<Task> => {
    try {
      const response = await axios.get(`/api/tasks/${id}`);
      return response.data;
    } catch (err) {
      console.error(`Error fetching task ${id}:`, err);
      
      // Fallback to mock data in development
      if (process.env.NODE_ENV === 'development') {
        console.log('Using mock data for development');
        const task = mockTasks.find(task => task._id === id);
        
        if (task) {
          return task;
        }
      }
      
      throw new Error('Failed to load task. Please try again later.');
    }
  };
  
  // Create a new task
  const createTask = async (newTask: NewTask): Promise<Task> => {
    try {
      const response = await axios.post('/api/tasks', newTask);
      const createdTask = response.data;
      
      // Update local state
      setTasks(prevTasks => [...prevTasks, createdTask]);
      
      return createdTask;
    } catch (err) {
      console.error('Error creating task:', err);
      
      // Fallback to mock data in development
      if (process.env.NODE_ENV === 'development') {
        console.log('Using mock data for development');
        
        // Create a mock task
        const createdTask: Task = {
          _id: (mockTasks.length + 1).toString(),
          ...newTask,
          status: 'not_started',
          priority: newTask.priority || 'medium',
          subtasks: [],
          userId: '1',
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        // Add to local state
        setTasks(prevTasks => [...prevTasks, createdTask]);
        
        return createdTask;
      }
      
      throw new Error('Failed to create task. Please try again later.');
    }
  };
  
  // Update a task
  const updateTask = async (id: string, updates: TaskUpdate): Promise<Task> => {
    try {
      const response = await axios.put(`/api/tasks/${id}`, updates);
      const updatedTask = response.data;
      
      // Update local state
      setTasks(prevTasks => 
        prevTasks.map(task => task._id === id ? updatedTask : task)
      );
      
      return updatedTask;
    } catch (err) {
      console.error(`Error updating task ${id}:`, err);
      
      // Fallback to mock data in development
      if (process.env.NODE_ENV === 'development') {
        console.log('Using mock data for development');
        
        // Find and update the task in our mock data
        const taskIndex = mockTasks.findIndex(task => task._id === id);
        
        if (taskIndex === -1) {
          throw new Error('Task not found');
        }
        
        const updatedTask = {
          ...mockTasks[taskIndex],
          ...updates,
          updatedAt: new Date()
        };
        
        // Update local state
        const updatedTasks = [...mockTasks];
        updatedTasks[taskIndex] = updatedTask;
        setTasks(updatedTasks);
        
        return updatedTask;
      }
      
      throw new Error('Failed to update task. Please try again later.');
    }
  };
  
  // Delete a task
  const deleteTask = async (id: string): Promise<void> => {
    try {
      await axios.delete(`/api/tasks/${id}`);
      
      // Remove from local state
      setTasks(prevTasks => prevTasks.filter(task => task._id !== id));
    } catch (err) {
      console.error(`Error deleting task ${id}:`, err);
      
      // Fallback to mock data in development
      if (process.env.NODE_ENV === 'development') {
        console.log('Using mock data for development');
        
        // Simulate successful delete in dev mode
        setTasks(prevTasks => prevTasks.filter(task => task._id !== id));
        return;
      }
      
      throw new Error('Failed to delete task. Please try again later.');
    }
  };
  
  // Add a subtask to a task
  const addSubtask = async (taskId: string, subtask: NewSubtask): Promise<Task> => {
    try {
      const response = await axios.post(`/api/tasks/${taskId}/subtasks`, subtask);
      const updatedTask = response.data;
      
      // Update local state
      setTasks(prevTasks => 
        prevTasks.map(task => task._id === taskId ? updatedTask : task)
      );
      
      return updatedTask;
    } catch (err) {
      console.error(`Error adding subtask to task ${taskId}:`, err);
      
      // Fallback to mock data in development
      if (process.env.NODE_ENV === 'development') {
        console.log('Using mock data for development');
        
        // Find the task
        const taskIndex = mockTasks.findIndex(task => task._id === taskId);
        
        if (taskIndex === -1) {
          throw new Error('Task not found');
        }
        
        // Create the new subtask
        const newSubtask: Subtask = {
          _id: `${taskId}.${mockTasks[taskIndex].subtasks.length + 1}`,
          ...subtask,
          priority: subtask.priority || 'medium',
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        // Add subtask to the task
        const updatedTask = { ...mockTasks[taskIndex] };
        updatedTask.subtasks = [...updatedTask.subtasks, newSubtask];
        updatedTask.updatedAt = new Date();
        
        // Update local state
        const updatedTasks = [...mockTasks];
        updatedTasks[taskIndex] = updatedTask;
        setTasks(updatedTasks);
        
        return updatedTask;
      }
      
      throw new Error('Failed to add subtask. Please try again later.');
    }
  };
  
  // Update a subtask
  const updateSubtask = async (
    taskId: string, 
    subtaskId: string, 
    updates: SubtaskUpdate
  ): Promise<Task> => {
    try {
      const response = await axios.put(`/api/tasks/${taskId}/subtasks/${subtaskId}`, updates);
      const updatedTask = response.data;
      
      // Update local state
      setTasks(prevTasks => 
        prevTasks.map(task => task._id === taskId ? updatedTask : task)
      );
      
      return updatedTask;
    } catch (err) {
      console.error(`Error updating subtask ${subtaskId} in task ${taskId}:`, err);
      
      // Fallback to mock data in development
      if (process.env.NODE_ENV === 'development') {
        console.log('Using mock data for development');
        
        // Find the task
        const taskIndex = mockTasks.findIndex(task => task._id === taskId);
        
        if (taskIndex === -1) {
          throw new Error('Task not found');
        }
        
        // Find the subtask
        const subtaskIndex = mockTasks[taskIndex].subtasks.findIndex(
          subtask => subtask._id === subtaskId
        );
        
        if (subtaskIndex === -1) {
          throw new Error('Subtask not found');
        }
        
        // Update the subtask
        const updatedTask = { ...mockTasks[taskIndex] };
        updatedTask.subtasks = [...updatedTask.subtasks];
        updatedTask.subtasks[subtaskIndex] = {
          ...updatedTask.subtasks[subtaskIndex],
          ...updates,
          updatedAt: new Date()
        };
        updatedTask.updatedAt = new Date();
        
        // Update local state
        const updatedTasks = [...mockTasks];
        updatedTasks[taskIndex] = updatedTask;
        setTasks(updatedTasks);
        
        return updatedTask;
      }
      
      throw new Error('Failed to update subtask. Please try again later.');
    }
  };
  
  // Delete a subtask
  const deleteSubtask = async (taskId: string, subtaskId: string): Promise<Task> => {
    try {
      const response = await axios.delete(`/api/tasks/${taskId}/subtasks/${subtaskId}`);
      const updatedTask = response.data;
      
      // Update local state
      setTasks(prevTasks => 
        prevTasks.map(task => task._id === taskId ? updatedTask : task)
      );
      
      return updatedTask;
    } catch (err) {
      console.error(`Error deleting subtask ${subtaskId} from task ${taskId}:`, err);
      
      // Fallback to mock data in development
      if (process.env.NODE_ENV === 'development') {
        console.log('Using mock data for development');
        
        // Find the task
        const taskIndex = mockTasks.findIndex(task => task._id === taskId);
        
        if (taskIndex === -1) {
          throw new Error('Task not found');
        }
        
        // Filter out the subtask
        const updatedTask = { ...mockTasks[taskIndex] };
        updatedTask.subtasks = updatedTask.subtasks.filter(
          subtask => subtask._id !== subtaskId
        );
        updatedTask.updatedAt = new Date();
        
        // Update local state
        const updatedTasks = [...mockTasks];
        updatedTasks[taskIndex] = updatedTask;
        setTasks(updatedTasks);
        
        return updatedTask;
      }
      
      throw new Error('Failed to delete subtask. Please try again later.');
    }
  };
  
  // Use AI to break down a task into subtasks
  const breakdownTask = async (taskId: string): Promise<Task> => {
    try {
      // Find the task
      const task = await getTask(taskId);
      
      if (!task) {
        throw new Error('Task not found');
      }
      
      const response = await axios.post('/api/ai/breakdown', {
        taskId: taskId,
        title: task.title,
        description: task.description
      });
      
      const updatedTask = response.data;
      
      // Update local state
      setTasks(prevTasks => 
        prevTasks.map(task => task._id === taskId ? updatedTask : task)
      );
      
      return updatedTask;
    } catch (err) {
      console.error(`Error breaking down task ${taskId}:`, err);
      
      // Fallback to mock data in development
      if (process.env.NODE_ENV === 'development') {
        console.log('Using mock data for development');
        
        const task = mockTasks.find(t => t._id === taskId);
        
        if (!task) {
          throw new Error('Task not found');
        }
        
        // Create mock AI-generated subtasks
        const aiSubtasks = [
          {
            title: "Research Phase",
            description: `Initial research for ${task.title}`,
            priority: "high" as const,
            dueDate: new Date(Date.now() + 86400000) // +1 day
          },
          {
            title: "Planning",
            description: `Create a plan for ${task.title}`,
            priority: "high" as const,
            dueDate: new Date(Date.now() + 172800000) // +2 days
          },
          {
            title: "Implementation",
            description: `Execute the core components of ${task.title}`,
            priority: "medium" as const,
            dueDate: new Date(Date.now() + 345600000) // +4 days
          },
          {
            title: "Testing & Review",
            description: `Verify quality and completeness of ${task.title}`,
            priority: "medium" as const,
            dueDate: new Date(Date.now() + 432000000) // +5 days
          },
          {
            title: "Finalization",
            description: `Complete any remaining details for ${task.title}`,
            priority: "low" as const,
            dueDate: new Date(Date.now() + 518400000) // +6 days
          }
        ];
        
        // Add each AI-generated subtask
        let updatedTask = { ...task };
        
        for (const subtaskData of aiSubtasks) {
          // Create the subtask
          const newSubtask: Subtask = {
            _id: `${taskId}.${updatedTask.subtasks.length + 1}`,
            title: subtaskData.title,
            description: subtaskData.description,
            priority: subtaskData.priority,
            dueDate: subtaskData.dueDate,
            completed: false,
            createdAt: new Date(),
            updatedAt: new Date()
          };
          
          // Add to the task
          updatedTask.subtasks = [...updatedTask.subtasks, newSubtask];
        }
        
        updatedTask.updatedAt = new Date();
        
        // Update in our state
        setTasks(prevTasks => 
          prevTasks.map(task => task._id === taskId ? updatedTask : task)
        );
        
        return updatedTask;
      }
      
      throw new Error('Failed to break down task using AI. Please try again later.');
    }
  };
  
  // Use AI to prioritize tasks
  const prioritizeTasks = async (): Promise<Task[]> => {
    try {
      const response = await axios.post('/api/ai/prioritize', { tasks });
      const prioritizedTasks = response.data;
      
      // Update tasks in state
      setTasks(prioritizedTasks);
      
      return prioritizedTasks;
    } catch (err) {
      console.error('Error prioritizing tasks:', err);
      
      // Fallback to mock data in development
      if (process.env.NODE_ENV === 'development') {
        console.log('Using mock data for development');
        
        // Create mock prioritized tasks
        const prioritizedTasks = tasks.map(task => ({
          ...task,
          priority: task.title.includes('Project') ? 'high' : 
                    task.title.includes('Meeting') ? 'medium' : 'low',
        }));
        
        // Update tasks in state
        setTasks(prioritizedTasks);
        
        return prioritizedTasks;
      }
      
      throw new Error('Failed to prioritize tasks using AI. Please try again later.');
    }
  };
  
  // Generate suggestions for a task
  const generateSuggestions = async (taskId: string): Promise<string> => {
    try {
      // Find the task
      const task = await getTask(taskId);
      
      if (!task) {
        throw new Error('Task not found');
      }
      
      const response = await axios.post('/api/ai/suggestions', { taskId, task });
      return response.data.suggestions;
    } catch (err) {
      console.error(`Error generating suggestions for task ${taskId}:`, err);
      
      // Fallback to mock data in development
      if (process.env.NODE_ENV === 'development') {
        console.log('Using mock data for development');
        
        const task = mockTasks.find(t => t._id === taskId);
        
        if (!task) {
          throw new Error('Task not found');
        }
        
        // Return mock suggestions
        return `Here are some suggestions for completing "${task.title}":\n\n` +
          `1. Break this task into smaller steps\n` +
          `2. Set aside dedicated time to focus on this task\n` +
          `3. Start with the research phase to gather necessary information\n` +
          `4. Collaborate with team members for faster completion\n` +
          `5. Review completed work against the original requirements\n\n` +
          `Estimated time required: ${task.priority === 'high' ? '4-6' : task.priority === 'medium' ? '2-4' : '1-2'} hours`;
      }
      
      throw new Error('Failed to generate suggestions. Please try again later.');
    }
  };
  
  // Context value
  const value: TaskContextType = {
    tasks,
    loading,
    error,
    fetchTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask,
    addSubtask,
    updateSubtask,
    deleteSubtask,
    breakdownTask,
    prioritizeTasks,
    generateSuggestions
  };
  
  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};

// Custom hook to use task context
export const useTask = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};

export default TaskContext;