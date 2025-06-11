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
  HStack,
  Icon,
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
import { FiArrowLeft, FiPlus, FiTrash2, FiEdit, FiCheckCircle, FiAward, FiCalendar, FiInfo, FiCpu } from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import * as Yup from 'yup';
import { useFormik } from 'formik';

// Components
import Layout from '../components/Layout';

// Hooks
import { useTask, Task, Subtask } from '../context/TaskContext';

const TaskDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { 
    getTask, 
    updateTask, 
    deleteTask, 
    addSubtask, 
    updateSubtask, 
    deleteSubtask,
    breakdownTask,
    generateSuggestions,
    generateSubtaskSuggestions
  } = useTask();
  const navigate = useNavigate();
  const toast = useToast();
  
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState<Partial<Task>>({});
  const [isBreakingDown, setIsBreakingDown] = useState(false);
  
  // Subtask modals
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { 
    isOpen: isEditSubtaskOpen, 
    onOpen: onEditSubtaskOpen, 
    onClose: onEditSubtaskClose 
  } = useDisclosure();
  
  // Subtask states
  const [editingSubtask, setEditingSubtask] = useState<{
    subtask: Subtask;
    index: number;
  } | null>(null);
  
  // AI Suggestions
  const { isOpen: isSuggestionsOpen, onOpen: onSuggestionsOpen, onClose: onSuggestionsClose } = useDisclosure();
  const [suggestions, setSuggestions] = useState<string | null>(null);
  const [isFetchingSuggestions, setIsFetchingSuggestions] = useState(false);
  
  // Subtask AI Suggestions
  const { isOpen: isSubtaskSuggestionsOpen, onOpen: onSubtaskSuggestionsOpen, onClose: onSubtaskSuggestionsClose } = useDisclosure();
  const [subtaskSuggestions, setSubtaskSuggestions] = useState<string | null>(null);
  const [currentSubtaskId, setCurrentSubtaskId] = useState<string | null>(null);
  const [isFetchingSubtaskSuggestions, setIsFetchingSubtaskSuggestions] = useState(false);
  const [userQuestion, setUserQuestion] = useState<string>('');
  const [showCustomQuestion, setShowCustomQuestion] = useState<boolean>(false);
  
  useEffect(() => {
    const loadTask = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      
      try {
        const taskData = await getTask(id);
        setTask(taskData);
        setEditedTask({
          title: taskData.title,
          description: taskData.description,
          category: taskData.category,
          priority: taskData.priority,
          status: taskData.status,
          dueDate: taskData.dueDate,
        });
      } catch (err) {
        console.error('Failed to load task:', err);
        setError(err instanceof Error ? err.message : 'Failed to load task details');
        toast({
          title: 'Error loading task',
          description: err instanceof Error ? err.message : 'Unknown error',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadTask();
  }, [id, getTask, toast]);
  
  const handleEditToggle = () => {
    if (isEditing && task) {
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
    setIsEditing(!isEditing);
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
      setIsEditing(false);
      
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
  // Function to handle editing a subtask
  const openEditSubtask = (subtask: Subtask, index: number) => {
    setEditingSubtask({ subtask, index });
    onEditSubtaskOpen();
  };
  
  // Function to handle updating a subtask
  const handleUpdateSubtask = async () => {
    if (!id || !task || !editingSubtask || !editingSubtask.subtask._id) return;
    
    try {
      await updateSubtask(id, editingSubtask.subtask._id, editingSubtask.subtask);
      
      // Update local state
      const updatedSubtasks = [...task.subtasks];
      updatedSubtasks[editingSubtask.index] = editingSubtask.subtask;
      
      setTask({
        ...task,
        subtasks: updatedSubtasks
      });
      
      toast({
        title: 'Subtask updated',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      onEditSubtaskClose();
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
  
  // Formik's onSubmit handles form submission
  
  
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
  
  const handleSubtaskCompletion = async (subtask: Subtask) => {
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
    
    setIsFetchingSuggestions(true);
    onSuggestionsOpen();
    
    try {
      const result = await generateSuggestions(task._id);
      setSuggestions(result);
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
      setIsFetchingSuggestions(false);
    }
  };

  // AI Suggestions for Subtasks
  const handleGetSubtaskSuggestions = async (subtaskId: string) => {
    if (!task || !id) return;
    
    setCurrentSubtaskId(subtaskId);
    setUserQuestion('');
    setShowCustomQuestion(false);
    onSubtaskSuggestionsOpen();
  };
  
  // Submit custom question about subtask
  const handleSubmitQuestion = async () => {
    if (!task || !id || !currentSubtaskId || !userQuestion.trim()) return;
    
    setIsFetchingSubtaskSuggestions(true);
    
    try {
      const result = await generateSubtaskSuggestions(id, currentSubtaskId, userQuestion);
      setSubtaskSuggestions(result.suggestions);
      
      // Update the local task state to reflect the aiAssisted flag
      if (task) {
        setTask({
          ...task,
          subtasks: task.subtasks.map(st => 
            st._id === currentSubtaskId ? {...st, aiAssisted: true} : st
          )
        });
      }
    } catch (error) {
      toast({
        title: 'Failed to get answer',
        description: error instanceof Error ? error.message : 'Unknown error',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      setSubtaskSuggestions('Unable to answer your question at this time.');
    } finally {
      setIsFetchingSubtaskSuggestions(false);
    }
  };
  
  // Form validation schema for subtask
  const subtaskValidationSchema = Yup.object({
    title: Yup.string().required('Title is required').min(3, 'Title must be at least 3 characters'),
    description: Yup.string(),
    priority: Yup.string().required('Priority is required'),
    dueDate: Yup.date().nullable()
  });
  
  // Formik for subtask
  const subtaskFormik = useFormik({
    initialValues: {
      title: '',
      description: '',
      priority: 'medium',
      dueDate: null as Date | null,
    },
    validationSchema: subtaskValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      if (!task || !id) return;
      
      try {
        const newSubtaskData = {
          title: values.title,
          description: values.description,
          priority: values.priority as 'low' | 'medium' | 'high',
          dueDate: values.dueDate || undefined
        };
        
        const updatedTask = await addSubtask(id, newSubtaskData);
        setTask(updatedTask);
        
        toast({
          title: 'Subtask added',
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
        
        resetForm();
        onClose();
      } catch (err) {
        toast({
          title: 'Error',
          description: err instanceof Error ? err.message : 'Failed to add subtask',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    }
  });

  // Handle AI task breakdown
  const handleBreakdownTask = async () => {
    if (!task) return;
    
    setIsBreakingDown(true);
    
    try {
      const updatedTask = await breakdownTask(task._id);
      setTask(updatedTask);
      toast({
        title: 'Task broken down successfully',
        description: 'AI has created subtasks for your task',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Failed to break down task',
        description: error instanceof Error ? error.message : 'Unknown error',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsBreakingDown(false);
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
    <Layout>
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
          {isEditing ? (
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
            isLoading={isFetchingSuggestions}
          >
            Get Help
          </Button>
          {isEditing ? (
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
                colorScheme="blue" 
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
        
        {isEditing ? (
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
          <HStack>
            {task.subtasks.length === 0 && (
              <Button 
                leftIcon={<FiCpu />} 
                colorScheme="purple" 
                size="sm"
                onClick={handleBreakdownTask}
                isLoading={isBreakingDown}
              >
                AI Breakdown
              </Button>
            )}
            <Button 
              leftIcon={<FiPlus />} 
              colorScheme="blue" 
              size="sm" 
              onClick={onOpen}
            >
              Add Subtask
            </Button>
          </HStack>
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
                    <Flex align="center" wrap="wrap">
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
                      {subtask.aiAssisted && (
                        <Badge ml={2} colorScheme="blue" variant="outline" size="sm">
                          AI-Assisted
                        </Badge>
                      )}
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
                    <Tooltip label={subtask.aiAssisted ? "View AI assistance" : "Get AI help with this subtask"}>
                      <IconButton
                        aria-label="Get AI help"
                        icon={<FiCpu />}
                        size="sm"
                        variant={subtask.aiAssisted ? "solid" : "ghost"}
                        colorScheme="blue"
                        mr={1}
                        onClick={() => handleGetSubtaskSuggestions(subtask._id)}
                      />
                    </Tooltip>
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
            <Button leftIcon={<FiPlus />} colorScheme="blue" onClick={onOpen}>
              Add Your First Subtask
            </Button>
          </Box>
        )}
      </Box>
      
      {/* Add Subtask Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Subtask</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form id="add-subtask-form" onSubmit={subtaskFormik.handleSubmit}>
              <FormControl isRequired mb={4}>
                <FormLabel>Title</FormLabel>
                <Input 
                  id="title"
                  name="title"
                  value={subtaskFormik.values.title} 
                  onChange={subtaskFormik.handleChange}
                  onBlur={subtaskFormik.handleBlur}
                  isInvalid={subtaskFormik.touched.title && Boolean(subtaskFormik.errors.title)}
                  placeholder="Enter subtask title"
                />
                {subtaskFormik.touched.title && subtaskFormik.errors.title && (
                  <Text color="red.500" fontSize="sm">{subtaskFormik.errors.title as string}</Text>
                )}
              </FormControl>
              
              <FormControl mb={4}>
                <FormLabel>Description</FormLabel>
                <Textarea 
                  id="description"
                  name="description"
                  value={subtaskFormik.values.description || ''} 
                  onChange={subtaskFormik.handleChange}
                  placeholder="Enter subtask description (optional)"
                />
              </FormControl>
              
              <FormControl mb={4}>
                <FormLabel>Priority</FormLabel>
                <Select
                  id="priority"
                  name="priority"
                  value={subtaskFormik.values.priority}
                  onChange={subtaskFormik.handleChange}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </Select>
              </FormControl>
              
              <FormControl>
                <FormLabel>Due Date</FormLabel>
                <DatePicker
                  selected={subtaskFormik.values.dueDate}
                  onChange={(date) => subtaskFormik.setFieldValue('dueDate', date)}
                  dateFormat="yyyy-MM-dd"
                  customInput={<Input />}
                  placeholderText="Select a due date (optional)"
                />
              </FormControl>
            </form>
          </ModalBody>
          
          <ModalFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button 
              colorScheme="blue" 
              type="submit"
              form="add-subtask-form"
              isLoading={subtaskFormik.isSubmitting}
            >
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
            <Button colorScheme="blue" onClick={handleUpdateSubtask}>
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
            {isFetchingSuggestions ? (
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

      {/* Subtask AI Suggestions Modal */}
      <Modal isOpen={isSubtaskSuggestionsOpen} onClose={onSubtaskSuggestionsClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader bg="blue.50" borderTopRadius="md">
            <Flex align="center">
              <Icon as={FiCpu} color="blue.500" mr={2} />
              <Box>
                <Text>AI Assistant for Subtask</Text>
                {currentSubtaskId && task && (
                  <Text fontWeight="bold" fontSize="lg">
                    {task.subtasks.find(st => st._id === currentSubtaskId)?.title}
                  </Text>
                )}
              </Box>
            </Flex>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {!showCustomQuestion && !isFetchingSubtaskSuggestions && (
              <Box mb={4}>
                <Flex 
                  justify="space-between" 
                  align="center" 
                  bg="purple.50" 
                  p={4} 
                  borderRadius="md" 
                  borderLeftWidth="4px"
                  borderLeftColor="purple.400"
                >
                  <Box>
                    <Text fontWeight="bold" color="purple.700">
                      Ask a specific question
                    </Text>
                    <Text fontSize="sm" color="purple.700">
                      For more targeted help, you can ask a specific question about this subtask.
                    </Text>
                  </Box>
                  <Button 
                    size="sm" 
                    colorScheme="purple" 
                    onClick={() => setShowCustomQuestion(true)}
                  >
                    Ask Question
                  </Button>
                </Flex>
              </Box>
            )}
            
            {showCustomQuestion && !isFetchingSubtaskSuggestions && (
              <Box mb={6}>
                <FormControl>
                  <FormLabel fontWeight="bold">
                    What would you like to know about this subtask?
                  </FormLabel>
                  <Textarea 
                    value={userQuestion} 
                    onChange={(e) => setUserQuestion(e.target.value)}
                    placeholder="Example: How do I find a good plumber in my area? What tools do I need for this? What's the best way to approach this?"
                    rows={3}
                  />
                  <Flex justify="flex-end" mt={2}>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      mr={2}
                      onClick={() => setShowCustomQuestion(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      size="sm" 
                      colorScheme="blue" 
                      onClick={handleSubmitQuestion}
                      isDisabled={!userQuestion.trim()}
                    >
                      Submit Question
                    </Button>
                  </Flex>
                </FormControl>
              </Box>
            )}
            
            {isFetchingSubtaskSuggestions ? (
              <Flex direction="column" align="center" justify="center" py={10}>
                <Spinner size="xl" color="blue.500" thickness="4px" mb={4} />
                <Text>
                  {userQuestion 
                    ? "Finding an answer to your question..." 
                    : "Generating personalized assistance for this subtask..."}
                </Text>
                <Text fontSize="sm" color="gray.500" mt={2}>
                  I'm finding the best resources, steps, and recommendations to help you complete this subtask efficiently.
                </Text>
              </Flex>
            ) : subtaskSuggestions ? (
              <Box>
                {!userQuestion && (
                  <Box 
                    bg="yellow.50" 
                    p={4} 
                    borderRadius="md" 
                    mb={4} 
                    borderLeft="4px solid" 
                    borderLeftColor="yellow.400"
                  >
                    <Flex align="center" mb={2}>
                      <Icon as={FiInfo} color="yellow.600" mr={2} />
                      <Text fontWeight="bold" color="yellow.700">How This Helps</Text>
                    </Flex>
                    <Text fontSize="sm">
                      This AI-generated assistance provides personalized guidance, resource recommendations, 
                      and step-by-step instructions to help you complete this subtask efficiently. 
                      You can save time by following these suggestions rather than doing the research yourself.
                    </Text>
                  </Box>
                )}
                
                <Box 
                  bg="white" 
                  p={4} 
                  borderRadius="md" 
                  borderWidth="1px" 
                  borderColor="gray.200"
                  whiteSpace="pre-wrap"
                  maxH="500px"
                  overflowY="auto"
                  sx={{
                    '& h1, & h2, & h3': {
                      fontWeight: 'bold',
                      marginTop: '1rem',
                      marginBottom: '0.5rem'
                    },
                    '& ul, & ol': {
                      paddingLeft: '1.5rem',
                      marginBottom: '1rem'
                    },
                    '& li': {
                      marginBottom: '0.25rem'
                    }
                  }}
                >
                  {userQuestion && (
                    <Box mb={4} p={3} bg="blue.50" borderRadius="md">
                      <Text fontWeight="bold">Your question:</Text>
                      <Text>{userQuestion}</Text>
                    </Box>
                  )}
                  {subtaskSuggestions}
                </Box>
              </Box>
            ) : null}
          </ModalBody>
          <ModalFooter borderTop="1px solid" borderTopColor="gray.200" bg="gray.50" borderBottomRadius="md">
            <Flex width="100%" justify="space-between" align="center">
              <Text fontSize="sm" color="gray.500">
                {currentSubtaskId && task && (
                  <>Part of: {task.title}</>
                )}
              </Text>
              <HStack>
                {subtaskSuggestions && (
                  <Button 
                    variant="outline" 
                    colorScheme="purple"
                    onClick={() => {
                      setUserQuestion('');
                      setSubtaskSuggestions(null);
                      setShowCustomQuestion(true);
                    }}
                    mr={2}
                  >
                    Ask Another Question
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  onClick={onSubtaskSuggestionsClose} 
                  mr={2}
                >
                  Close
                </Button>
                {subtaskSuggestions && (
                  <Button 
                    colorScheme="blue" 
                    leftIcon={<FiCheckCircle />}
                    onClick={onSubtaskSuggestionsClose}
                  >
                    Got It
                  </Button>
                )}
              </HStack>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
    </Layout>
  );
};

export default TaskDetail;
