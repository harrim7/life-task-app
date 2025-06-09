import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Spinner,
  Stack,
  Text,
  Textarea,
  useDisclosure,
  useToast,
  Badge,
  Tooltip,
  Progress,
} from '@chakra-ui/react';
import { FiArrowLeft, FiPlus, FiTrash2, FiEdit, FiCheckCircle, FiAward, FiCalendar, FiInfo } from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router-dom';

// Hooks
import { useTasks } from '../context/TaskContext';

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
  subtasks: SubTask[];
  notes?: string;
  attachments?: string[];
  aiGenerated?: boolean;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TaskDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getTaskById, updateTask, deleteTask, addSubtask, updateSubtask, deleteSubtask } = useTasks();
  const navigate = useNavigate();
  const toast = useToast();
  
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editedTask, setEditedTask] = useState<Partial<Task>>({});
  
  // Subtask modals
  const { isOpen: isAddSubtaskOpen, onOpen: onAddSubtaskOpen, onClose: onAddSubtaskClose } = useDisclosure();
  const { isOpen: isEditSubtaskOpen, onOpen: onEditSubtaskOpen, onClose: onEditSubtaskClose } = useDisclosure();
  const [newSubtask, setNewSubtask] = useState<Partial<SubTask>>({ title: '', priority: 'medium', completed: false });
  const [editingSubtask, setEditingSubtask] = useState<{ subtask: Partial<SubTask>, index: number } | null>(null);
  
  // AI Suggestions
  const { isOpen: isSuggestionsOpen, onOpen: onSuggestionsOpen, onClose: onSuggestionsClose } = useDisclosure();
  const [suggestions, setSuggestions] = useState('');
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  
  useEffect(() => {
    const loadTask = async () => {
      if (!id) return;
      
      try {
        const taskData = await getTaskById(id);
        if (taskData) {
          setTask(taskData);
          setEditedTask({
            title: taskData.title,
            description: taskData.description,
            category: taskData.category,
            priority: taskData.priority,
            status: taskData.status,
            dueDate: taskData.dueDate,
          });
        }
      } catch (error) {
        toast({
          title: 'Error loading task',
          description: error instanceof Error ? error.message : 'Unknown error',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadTask();
  }, [id, getTaskById, toast]);
  
  const handleEditToggle = () => {
    if (editMode && task) {
      // Reset form
      setEditedTask({
        title: task.title,
        description: task.description,
        category: task.category,
        priority: task.priority,
        status: task.status,
        dueDate: task.dueDate,
      });
    }
    setEditMode(!editMode);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedTask({ ...editedTask, [name]: value });
  };
  
  const handleDateChange = (date: Date | null, fieldName: string) => {
    setEditedTask({ ...editedTask, [fieldName]: date });
  };
  
  const handleSaveTask = async () => {
    if (!id || !task) return;
    
    try {
      const updatedTask = await updateTask(id, editedTask);
      setTask(updatedTask);
      setEditMode(false);
      
      toast({
        title: 'Task updated',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Failed to update task',
        description: error instanceof Error ? error.message : 'Unknown error',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };
  
  const handleDeleteTask = async () => {
    if (!id) return;
    
    try {
      await deleteTask(id);
      
      toast({
        title: 'Task deleted',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      navigate('/');
    } catch (error) {
      toast({
        title: 'Failed to delete task',
        description: error instanceof Error ? error.message : 'Unknown error',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };
  
  // Subtask handlers
  const handleAddSubtask = async () => {
    if (!id || !newSubtask.title) return;
    
    try {
      const updatedTask = await addSubtask(id, newSubtask);
      setTask(updatedTask);
      setNewSubtask({ title: '', priority: 'medium', completed: false });
      onAddSubtaskClose();
      
      toast({
        title: 'Subtask added',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Failed to add subtask',
        description: error instanceof Error ? error.message : 'Unknown error',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };
  
  const openEditSubtask = (subtask: SubTask, index: number) => {
    setEditingSubtask({ subtask: { ...subtask }, index });
    onEditSubtaskOpen();
  };
  
  const handleUpdateSubtask = async () => {
    if (!id || !task || !editingSubtask || !editingSubtask.subtask._id) return;
    
    try {
      const updatedTask = await updateSubtask(id, editingSubtask.subtask._id, editingSubtask.subtask);
      setTask(updatedTask);
      onEditSubtaskClose();
      
      toast({
        title: 'Subtask updated',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Failed to update subtask',
        description: error instanceof Error ? error.message : 'Unknown error',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };
  
  const handleDeleteSubtask = async (subtaskId: string) => {
    if (!id) return;
    
    try {
      await deleteSubtask(id, subtaskId);
      
      // Update local state
      if (task) {
        setTask({
          ...task,
          subtasks: task.subtasks.filter(subtask => subtask._id !== subtaskId)
        });
      }
      
      toast({
        title: 'Subtask deleted',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Failed to delete subtask',
        description: error instanceof Error ? error.message : 'Unknown error',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };
  
  const handleSubtaskCompletion = async (subtask: SubTask) => {
    if (!id || !subtask._id) return;
    
    const newCompletedState = !subtask.completed;
    
    try {
      await updateSubtask(id, subtask._id, { 
        completed: newCompletedState,
        completedAt: newCompletedState ? new Date() : undefined
      });
      
      // Update local state
      if (task) {
        setTask({
          ...task,
          subtasks: task.subtasks.map(st => 
            st._id === subtask._id ? { 
              ...st, 
              completed: newCompletedState,
              completedAt: newCompletedState ? new Date() : undefined
            } : st
          )
        });
      }
    } catch (error) {
      toast({
        title: 'Failed to update subtask',
        description: error instanceof Error ? error.message : 'Unknown error',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };
  
  // AI Suggestions
  const handleGetSuggestions = async () => {
    if (!task) return;
    
    setLoadingSuggestions(true);
    onSuggestionsOpen();
    
    try {
      const response = await fetch('/api/ai/suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ task }),
      });
      
      if (!response.ok) throw new Error('Failed to get suggestions');
      
      const data = await response.json();
      setSuggestions(data.suggestions);
    } catch (error) {
      toast({
        title: 'Failed to get suggestions',
        description: error instanceof Error ? error.message : 'Unknown error',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      setSuggestions('Unable to generate suggestions at this time.');
    } finally {
      setLoadingSuggestions(false);
    }
  };
  
  // Calculate progress
  const calculateProgress = () => {
    if (!task || !task.subtasks || task.subtasks.length === 0) return 0;
    const completedCount = task.subtasks.filter(subtask => subtask.completed).length;
    return Math.round((completedCount / task.subtasks.length) * 100);
  };
  
  if (loading) {
    return (
      <Flex justify="center" align="center" height="200px">
        <Spinner size="xl" />
      </Flex>
    );
  }
  
  if (!task) {
    return (
      <Box textAlign="center" p={5}>
        <Heading size="md">Task not found</Heading>
        <Button mt={4} onClick={() => navigate('/')} leftIcon={<FiArrowLeft />}>
          Back to Dashboard
        </Button>
      </Box>
    );
  }
  
  // Format date
  const formatDate = (date?: Date) => {
    if (!date) return 'Not set';
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'red';
      case 'medium': return 'orange';
      case 'low': return 'green';
      default: return 'gray';
    }
  };
  
  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'green';
      case 'in_progress': return 'blue';
      case 'not_started': return 'yellow';
      case 'deferred': return 'gray';
      default: return 'gray';
    }
  };
  
  return (
    <Box>
      <Flex align="center" mb={6}>
        <IconButton
          aria-label="Back to dashboard"
          icon={<FiArrowLeft />}
          variant="ghost"
          mr={2}
          onClick={() => navigate('/')}
        />
        <Heading size="lg" flex="1">
          {editMode ? (
            <Input 
              name="title"
              value={editedTask.title || ''}
              onChange={handleInputChange}
              size="lg"
              fontWeight="bold"
            />
          ) : (
            task.title
          )}
        </Heading>
        <Flex>
          <Button
            colorScheme="blue"
            leftIcon={<FiInfo />}
            mr={2}
            onClick={handleGetSuggestions}
          >
            Get Help
          </Button>
          {editMode ? (
            <>
              <Button colorScheme="green" mr={2} onClick={handleSaveTask}>
                Save
              </Button>
              <Button variant="outline" onClick={handleEditToggle}>
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button 
                leftIcon={<FiEdit />} 
                colorScheme="brand" 
                mr={2}
                onClick={handleEditToggle}
              >
                Edit
              </Button>
              <Button 
                leftIcon={<FiTrash2 />} 
                colorScheme="red"
                onClick={handleDeleteTask}
              >
                Delete
              </Button>
            </>
          )}
        </Flex>
      </Flex>
      
      <Box bg="white" p={6} borderRadius="md" boxShadow="sm" mb={4}>
        <Flex mb={4} wrap="wrap" gap={3}>
          <Badge colorScheme={getPriorityColor(task.priority)} p={2} borderRadius="md">
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
          </Badge>
          <Badge colorScheme={getStatusColor(task.status)} p={2} borderRadius="md">
            {task.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </Badge>
          <Badge colorScheme="purple" variant="outline" p={2} borderRadius="md">
            {task.category.charAt(0).toUpperCase() + task.category.slice(1)}
          </Badge>
          {task.aiGenerated && (
            <Badge colorScheme="blue" variant="outline" p={2} borderRadius="md">
              AI-Assisted
            </Badge>
          )}
        </Flex>
        
        {editMode ? (
          <Stack spacing={4}>
            <FormControl>
              <FormLabel>Description</FormLabel>
              <Textarea 
                name="description"
                value={editedTask.description || ''}
                onChange={handleInputChange}
                rows={4}
              />
            </FormControl>
            
            <Flex gap={4} wrap={{ base: 'wrap', md: 'nowrap' }}>
              <FormControl>
                <FormLabel>Category</FormLabel>
                <Select 
                  name="category"
                  value={editedTask.category || 'other'}
                  onChange={handleInputChange}
                >
                  <option value="home">Home</option>
                  <option value="work">Work</option>
                  <option value="finance">Finance</option>
                  <option value="health">Health</option>
                  <option value="family">Family</option>
                  <option value="other">Other</option>
                </Select>
              </FormControl>
              
              <FormControl>
                <FormLabel>Status</FormLabel>
                <Select 
                  name="status"
                  value={editedTask.status || 'not_started'}
                  onChange={handleInputChange}
                >
                  <option value="not_started">Not Started</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="deferred">Deferred</option>
                </Select>
              </FormControl>
              
              <FormControl>
                <FormLabel>Priority</FormLabel>
                <Select 
                  name="priority"
                  value={editedTask.priority || 'medium'}
                  onChange={handleInputChange}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </Select>
              </FormControl>
              
              <FormControl>
                <FormLabel>Due Date</FormLabel>
                <Input 
                  type="date"
                  name="dueDate"
                  value={editedTask.dueDate ? new Date(editedTask.dueDate).toISOString().split('T')[0] : ''}
                  onChange={handleInputChange}
                />
              </FormControl>
            </Flex>
          </Stack>
        ) : (
          <>
            <Text fontSize="md" mb={4}>
              {task.description || 'No description provided'}
            </Text>
            
            <Flex wrap="wrap" gap={6} mb={4}>
              <Box>
                <Text fontSize="sm" fontWeight="bold" color="gray.500" mb={1}>
                  Due Date
                </Text>
                <Flex align="center">
                  <FiCalendar />
                  <Text ml={2}>{formatDate(task.dueDate)}</Text>
                </Flex>
              </Box>
              
              {task.completedAt && (
                <Box>
                  <Text fontSize="sm" fontWeight="bold" color="gray.500" mb={1}>
                    Completed
                  </Text>
                  <Flex align="center" color="green.500">
                    <FiCheckCircle />
                    <Text ml={2}>{formatDate(task.completedAt)}</Text>
                  </Flex>
                </Box>
              )}
              
              <Box>
                <Text fontSize="sm" fontWeight="bold" color="gray.500" mb={1}>
                  Created
                </Text>
                <Text>{formatDate(task.createdAt)}</Text>
              </Box>
              
              {task.reminderDates && task.reminderDates.length > 0 && (
                <Box>
                  <Text fontSize="sm" fontWeight="bold" color="gray.500" mb={1}>
                    Reminders
                  </Text>
                  {task.reminderDates.map((date, index) => (
                    <Text key={index} fontSize="sm">{formatDate(date)}</Text>
                  ))}
                </Box>
              )}
            </Flex>
          </>
        )}
      </Box>
      
      {/* Subtasks Section */}
      <Box bg="white" p={6} borderRadius="md" boxShadow="sm">
        <Flex justify="space-between" align="center" mb={4}>
          <Heading size="md">Subtasks</Heading>
          <Button leftIcon={<FiPlus />} colorScheme="brand" size="sm" onClick={onAddSubtaskOpen}>
            Add Subtask
          </Button>
        </Flex>
        
        {task.subtasks && task.subtasks.length > 0 ? (
          <Box>
            <Flex justify="space-between" align="center" mb={2}>
              <Text fontSize="sm" fontWeight="medium">
                Progress
              </Text>
              <Text fontSize="sm">
                {calculateProgress()}% Complete ({task.subtasks.filter(st => st.completed).length}/{task.subtasks.length})
              </Text>
            </Flex>
            <Progress value={calculateProgress()} size="sm" colorScheme="green" mb={4} borderRadius="full" />
            
            <Stack spacing={3} mt={4}>
              {task.subtasks.map((subtask, index) => (
                <Flex 
                  key={subtask._id} 
                  p={3} 
                  borderWidth="1px" 
                  borderRadius="md"
                  borderColor={subtask.completed ? 'green.200' : 'gray.200'}
                  bg={subtask.completed ? 'green.50' : 'white'}
                  align="center"
                >
                  <Checkbox 
                    isChecked={subtask.completed}
                    onChange={() => handleSubtaskCompletion(subtask)}
                    mr={3}
                    colorScheme="green"
                  />
                  <Box flex="1">
                    <Flex align="center">
                      <Text
                        fontWeight="medium"
                        textDecoration={subtask.completed ? 'line-through' : 'none'}
                        color={subtask.completed ? 'gray.500' : 'inherit'}
                      >
                        {subtask.title}
                      </Text>
                      <Badge ml={2} colorScheme={getPriorityColor(subtask.priority)} size="sm">
                        {subtask.priority}
                      </Badge>
                    </Flex>
                    {subtask.description && (
                      <Text fontSize="sm" color="gray.600" mt={1}>
                        {subtask.description}
                      </Text>
                    )}
                    {subtask.dueDate && (
                      <Text fontSize="xs" color="gray.500" mt={1}>
                        Due: {formatDate(subtask.dueDate)}
                      </Text>
                    )}
                  </Box>
                  <Flex>
                    <IconButton
                      aria-label="Edit subtask"
                      icon={<FiEdit />}
                      size="sm"
                      variant="ghost"
                      mr={1}
                      onClick={() => openEditSubtask(subtask, index)}
                    />
                    <IconButton
                      aria-label="Delete subtask"
                      icon={<FiTrash2 />}
                      size="sm"
                      variant="ghost"
                      colorScheme="red"
                      onClick={() => handleDeleteSubtask(subtask._id)}
                    />
                  </Flex>
                </Flex>
              ))}
            </Stack>
          </Box>
        ) : (
          <Box textAlign="center" py={8}>
            <Text color="gray.500" mb={4}>
              No subtasks yet. Break down your task into smaller steps for better progress tracking.
            </Text>
            <Button leftIcon={<FiPlus />} colorScheme="brand" onClick={onAddSubtaskOpen}>
              Add Your First Subtask
            </Button>
          </Box>
        )}
      </Box>
      
      {/* Add Subtask Modal */}
      <Modal isOpen={isAddSubtaskOpen} onClose={onAddSubtaskClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Subtask</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isRequired mb={4}>
              <FormLabel>Title</FormLabel>
              <Input 
                value={newSubtask.title} 
                onChange={(e) => setNewSubtask({...newSubtask, title: e.target.value})}
                placeholder="Enter subtask title"
              />
            </FormControl>
            
            <FormControl mb={4}>
              <FormLabel>Description</FormLabel>
              <Textarea 
                value={newSubtask.description || ''} 
                onChange={(e) => setNewSubtask({...newSubtask, description: e.target.value})}
                placeholder="Enter subtask description (optional)"
              />
            </FormControl>
            
            <FormControl mb={4}>
              <FormLabel>Priority</FormLabel>
              <Select
                value={newSubtask.priority}
                onChange={(e) => setNewSubtask({...newSubtask, priority: e.target.value as 'low' | 'medium' | 'high'})}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </Select>
            </FormControl>
            
            <FormControl>
              <FormLabel>Due Date</FormLabel>
              <Input 
                type="date"
                value={newSubtask.dueDate ? new Date(newSubtask.dueDate).toISOString().split('T')[0] : ''}
                onChange={(e) => setNewSubtask({
                  ...newSubtask, 
                  dueDate: e.target.value ? new Date(e.target.value) : undefined
                })}
              />
            </FormControl>
          </ModalBody>
          
          <ModalFooter>
            <Button variant="outline" mr={3} onClick={onAddSubtaskClose}>
              Cancel
            </Button>
            <Button colorScheme="brand" onClick={handleAddSubtask}>
              Add Subtask
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      
      {/* Edit Subtask Modal */}
      <Modal isOpen={isEditSubtaskOpen} onClose={onEditSubtaskClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Subtask</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {editingSubtask && (
              <>
                <FormControl isRequired mb={4}>
                  <FormLabel>Title</FormLabel>
                  <Input 
                    value={editingSubtask.subtask.title || ''} 
                    onChange={(e) => setEditingSubtask({
                      ...editingSubtask,
                      subtask: {...editingSubtask.subtask, title: e.target.value}
                    })}
                  />
                </FormControl>
                
                <FormControl mb={4}>
                  <FormLabel>Description</FormLabel>
                  <Textarea 
                    value={editingSubtask.subtask.description || ''} 
                    onChange={(e) => setEditingSubtask({
                      ...editingSubtask,
                      subtask: {...editingSubtask.subtask, description: e.target.value}
                    })}
                  />
                </FormControl>
                
                <FormControl mb={4}>
                  <FormLabel>Priority</FormLabel>
                  <Select
                    value={editingSubtask.subtask.priority || 'medium'}
                    onChange={(e) => setEditingSubtask({
                      ...editingSubtask,
                      subtask: {...editingSubtask.subtask, priority: e.target.value as 'low' | 'medium' | 'high'}
                    })}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </Select>
                </FormControl>
                
                <FormControl mb={4}>
                  <FormLabel>Due Date</FormLabel>
                  <Input 
                    type="date"
                    value={editingSubtask.subtask.dueDate ? new Date(editingSubtask.subtask.dueDate).toISOString().split('T')[0] : ''}
                    onChange={(e) => setEditingSubtask({
                      ...editingSubtask,
                      subtask: {
                        ...editingSubtask.subtask, 
                        dueDate: e.target.value ? new Date(e.target.value) : undefined
                      }
                    })}
                  />
                </FormControl>
                
                <FormControl>
                  <FormLabel>Completed</FormLabel>
                  <Checkbox 
                    isChecked={editingSubtask.subtask.completed}
                    onChange={(e) => setEditingSubtask({
                      ...editingSubtask,
                      subtask: {
                        ...editingSubtask.subtask, 
                        completed: e.target.checked,
                        completedAt: e.target.checked ? new Date() : undefined
                      }
                    })}
                  >
                    Mark as completed
                  </Checkbox>
                </FormControl>
              </>
            )}
          </ModalBody>
          
          <ModalFooter>
            <Button variant="outline" mr={3} onClick={onEditSubtaskClose}>
              Cancel
            </Button>
            <Button colorScheme="brand" onClick={handleUpdateSubtask}>
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      
      {/* AI Suggestions Modal */}
      <Modal isOpen={isSuggestionsOpen} onClose={onSuggestionsClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>AI Suggestions & Help</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {loadingSuggestions ? (
              <Flex justify="center" py={4}>
                <Spinner />
                <Text ml={3}>Generating suggestions...</Text>
              </Flex>
            ) : (
              <Box whiteSpace="pre-wrap">{suggestions}</Box>
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={onSuggestionsClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default TaskDetail;
