import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface SubTask {
  _id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: Date;
  priority: 'low' | 'medium' | 'high';
  notes?: string;
  resources?: string[];
  completedAt?: Date;
}

interface Task {
  _id: string;
  title: string;
  description?: string;
  category: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'deferred';
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  reminderDates?: Date[];
  subtasks?: SubTask[];
  notes?: string;
  attachments?: string[];
  aiGenerated?: boolean;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface TaskContextType {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  getTaskById: (id: string) => Promise<Task | null>;
  createTask: (taskData: Partial<Task>) => Promise<Task>;
  updateTask: (id: string, taskData: Partial<Task>) => Promise<Task>;
  deleteTask: (id: string) => Promise<void>;
  addSubtask: (taskId: string, subtaskData: Partial<SubTask>) => Promise<Task>;
  updateSubtask: (taskId: string, subtaskId: string, subtaskData: Partial<SubTask>) => Promise<Task>;
  deleteSubtask: (taskId: string, subtaskId: string) => Promise<void>;
  breakdownTask: (title: string, description?: string) => Promise<any>;
  prioritizeTasks: (tasks: Partial<Task>[]) => Promise<any>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTasks = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};

interface TaskProviderProps {
  children: ReactNode;
}

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/tasks');
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      const data = await response.json();
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  const getTaskById = useCallback(async (id: string): Promise<Task | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/tasks/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch task');
      }
      const data = await response.json();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createTask = useCallback(async (taskData: Partial<Task>): Promise<Task> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });
      if (!response.ok) {
        throw new Error('Failed to create task');
      }
      const newTask = await response.json();
      setTasks(prevTasks => [...prevTasks, newTask]);
      return newTask;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTask = useCallback(async (id: string, taskData: Partial<Task>): Promise<Task> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });
      if (!response.ok) {
        throw new Error('Failed to update task');
      }
      const updatedTask = await response.json();
      setTasks(prevTasks =>
        prevTasks.map(task => (task._id === id ? updatedTask : task))
      );
      return updatedTask;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteTask = useCallback(async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete task');
      }
      setTasks(prevTasks => prevTasks.filter(task => task._id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const addSubtask = useCallback(async (taskId: string, subtaskData: Partial<SubTask>): Promise<Task> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/tasks/${taskId}/subtasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subtaskData),
      });
      if (!response.ok) {
        throw new Error('Failed to add subtask');
      }
      const updatedTask = await response.json();
      setTasks(prevTasks =>
        prevTasks.map(task => (task._id === taskId ? updatedTask : task))
      );
      return updatedTask;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSubtask = useCallback(async (taskId: string, subtaskId: string, subtaskData: Partial<SubTask>): Promise<Task> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/tasks/${taskId}/subtasks/${subtaskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subtaskData),
      });
      if (!response.ok) {
        throw new Error('Failed to update subtask');
      }
      const updatedTask = await response.json();
      setTasks(prevTasks =>
        prevTasks.map(task => (task._id === taskId ? updatedTask : task))
      );
      return updatedTask;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteSubtask = useCallback(async (taskId: string, subtaskId: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/tasks/${taskId}/subtasks/${subtaskId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete subtask');
      }
      const updatedTask = await response.json();
      setTasks(prevTasks =>
        prevTasks.map(task => (task._id === taskId ? updatedTask : task))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // AI-related functionality
  const breakdownTask = useCallback(async (title: string, description?: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/ai/breakdown', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description }),
      });
      if (!response.ok) {
        throw new Error('Failed to break down task');
      }
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const prioritizeTasks = useCallback(async (tasksToProcess: Partial<Task>[]) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/ai/prioritize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tasks: tasksToProcess }),
      });
      if (!response.ok) {
        throw new Error('Failed to prioritize tasks');
      }
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    tasks,
    loading,
    error,
    fetchTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    addSubtask,
    updateSubtask,
    deleteSubtask,
    breakdownTask,
    prioritizeTasks
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};
