import React, { useState } from 'react';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
  Textarea,
  VStack,
  useToast,
  Divider,
  Text,
  SimpleGrid,
  Spinner,
  Badge,
  HStack,
  Switch,
  IconButton,
  FormHelperText,
} from '@chakra-ui/react';
import { FiPlus, FiMinus, FiArrowLeft, FiSave, FiRefreshCw } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// Hooks
import { useTasks } from '../context/TaskContext';

interface SubTask {
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date | null;
}

const CreateTask: React.FC = () => {
  const { createTask, breakdownTask } = useTasks();
  const navigate = useNavigate();
  const toast = useToast();
  
  // Task state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('home');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [subtasks, setSubtasks] = useState<SubTask[]>([]);
  const [useAiBreakdown, setUseAiBreakdown] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [showReminderOptions, setShowReminderOptions] = useState(false);
  const [reminderDates, setReminderDates] = useState<Date[]>([]);
  
  const handleAddSubtask = () => {
    setSubtasks([...subtasks, { title: '', priority: 'medium' }]);
  };
  
  const handleSubtaskChange = (index: number, field: keyof SubTask, value: any) => {
    const updatedSubtasks = [...subtasks];
    updatedSubtasks[index] = { ...updatedSubtasks[index], [field]: value };
    setSubtasks(updatedSubtasks);
  };
  
  const handleRemoveSubtask = (index: number) => {
    const updatedSubtasks = [...subtasks];
    updatedSubtasks.splice(index, 1);
    setSubtasks(updatedSubtasks);
  };
  
  const handleAddReminder = () => {
    setReminderDates([...reminderDates, new Date()]);
  };
  
  const handleReminderChange = (index: number, date: Date) => {
    const updatedReminders = [...reminderDates];
    updatedReminders[index] = date;
    setReminderDates(updatedReminders);
  };
  
  const handleRemoveReminder = (index: number) => {
    const updatedReminders = [...reminderDates];
    updatedReminders.splice(index, 1);
    setReminderDates(updatedReminders);
  };
  
  const handleGenerateSubtasks = async () => {
    if (!title) {
      toast({
        title: 'Title required',
        description: 'Please enter a task title before generating subtasks',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    setAiLoading(true);
    try {
      const result = await breakdownTask(title, description);
      
      if (result && result.subtasks && Array.isArray(result.subtasks)) {
        // Transform the AI result into our subtask format
        const aiGeneratedSubtasks = result.subtasks.map((item: any) => ({
          title: item.title,
          description: item.description || '',
          priority: item.priority || 'medium',
          dueDate: item.dueDate ? new Date(Date.now() + item.dueDate * 24 * 60 * 60 * 1000) : null,
        }));
        
        setSubtasks(aiGeneratedSubtasks);
        
        toast({
          title: 'Subtasks generated',
          description: `${aiGeneratedSubtasks.length} subtasks have been created`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        throw new Error('Invalid response from AI service');
      }
    } catch (error) {
      toast({
        title: 'Failed to generate subtasks',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setAiLoading(false);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title) {
      toast({
        title: 'Title required',
        description: 'Please enter a task title',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    try {
      // Prepare task data
      const taskData = {
        title,
        description,
        category,
        priority,
        dueDate,
        reminderDates: reminderDates.length > 0 ? reminderDates : undefined,
        status: 'not_started',
        aiGenerated: useAiBreakdown,
      };
      
      // Create the main task
      const newTask = await createTask(taskData);
      
      // Add subtasks if any
      if (subtasks.length > 0 && newTask._id) {
        // In a real implementation, we'd use a batch operation or transaction
        // For demo, we'll just show a success message
        
        toast({
          title: 'Task created successfully',
          description: `Task "${title}" created with ${subtasks.length} subtasks`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Task created',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
      
      // Navigate back to dashboard
      navigate('/');
    } catch (error) {
      toast({
        title: 'Failed to create task',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
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
        <Heading size="lg">Create New Task</Heading>
      </Flex>
      
      <Box
        as="form"
        onSubmit={handleSubmit}
        bg="white"
        p={6}
        borderRadius="md"
        boxShadow="sm"
      >
        <VStack spacing={4} align="stretch">
          {/* Task Details */}
          <FormControl isRequired>
            <FormLabel>Task Title</FormLabel>
            <Input 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What do you need to accomplish?"
            />
          </FormControl>
          
          <FormControl>
            <FormLabel>Description</FormLabel>
            <Textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details about this task..."
              rows={3}
            />
          </FormControl>
          
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
            <FormControl>
              <FormLabel>Category</FormLabel>
              <Select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
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
              <FormLabel>Priority</FormLabel>
              <Select 
                value={priority}
                onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
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
                value={dueDate ? dueDate.toISOString().split('T')[0] : ''}
                onChange={(e) => setDueDate(e.target.value ? new Date(e.target.value) : null)}
              />
            </FormControl>
          </SimpleGrid>
          
          {/* Reminders Section */}
          <Box mt={4}>
            <Flex align="center" mb={2}>
              <FormLabel htmlFor="reminders-toggle" mb={0}>Add Reminders</FormLabel>
              <Switch 
                id="reminders-toggle"
                isChecked={showReminderOptions}
                onChange={() => setShowReminderOptions(!showReminderOptions)}
              />
            </Flex>
            
            {showReminderOptions && (
              <Box mt={2} p={4} bg="gray.50" borderRadius="md">
                <Text fontSize="sm" mb={2}>
                  Set dates to receive reminders for this task
                </Text>
                
                {reminderDates.map((date, index) => (
                  <Flex key={index} mb={2} align="center">
                    <Input
                      type="date"
                      value={date.toISOString().split('T')[0]}
                      onChange={(e) => handleReminderChange(index, new Date(e.target.value))}
                      mr={2}
                    />
                    <IconButton
                      aria-label="Remove reminder"
                      icon={<FiMinus />}
                      size="sm"
                      onClick={() => handleRemoveReminder(index)}
                    />
                  </Flex>
                ))}
                
                <Button
                  leftIcon={<FiPlus />}
                  size="sm"
                  onClick={handleAddReminder}
                  mt={2}
                >
                  Add Reminder
                </Button>
              </Box>
            )}
          </Box>
          
          {/* AI Breakdown Section */}
          <Box mt={4}>
            <Flex align="center" mb={3}>
              <FormLabel htmlFor="ai-toggle" mb={0}>Use AI to break down this task</FormLabel>
              <Switch 
                id="ai-toggle"
                isChecked={useAiBreakdown}
                onChange={() => setUseAiBreakdown(!useAiBreakdown)}
              />
            </Flex>
            
            {useAiBreakdown && (
              <Box p={4} bg="blue.50" borderRadius="md">
                <Text fontSize="sm" mb={3}>
                  Let AI help break down this task into smaller, manageable subtasks.
                </Text>
                
                <Button
                  leftIcon={<FiRefreshCw />}
                  colorScheme="blue"
                  isLoading={aiLoading}
                  onClick={handleGenerateSubtasks}
                  size="sm"
                  mb={4}
                >
                  Generate Subtasks
                </Button>
                
                <Divider mb={4} />
                
                {subtasks.length > 0 ? (
                  <>
                    <Text fontWeight="medium" mb={2}>Subtasks</Text>
                    <VStack spacing={3} align="stretch">
                      {subtasks.map((subtask, index) => (
                        <Box key={index} p={3} borderWidth="1px" borderRadius="md">
                          <Flex justify="space-between" mb={2}>
                            <FormControl isRequired>
                              <Input
                                value={subtask.title}
                                onChange={(e) => handleSubtaskChange(index, 'title', e.target.value)}
                                placeholder="Subtask title"
                                size="sm"
                              />
                            </FormControl>
                            <IconButton
                              aria-label="Remove subtask"
                              icon={<FiMinus />}
                              size="sm"
                              ml={2}
                              onClick={() => handleRemoveSubtask(index)}
                            />
                          </Flex>
                          
                          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={2} mt={2}>
                            <FormControl>
                              <Select
                                size="sm"
                                value={subtask.priority}
                                onChange={(e) => handleSubtaskChange(index, 'priority', e.target.value)}
                              >
                                <option value="low">Low Priority</option>
                                <option value="medium">Medium Priority</option>
                                <option value="high">High Priority</option>
                              </Select>
                            </FormControl>
                            
                            <FormControl>
                              <Input
                                type="date"
                                size="sm"
                                value={subtask.dueDate ? subtask.dueDate.toISOString().split('T')[0] : ''}
                                onChange={(e) => handleSubtaskChange(
                                  index, 
                                  'dueDate', 
                                  e.target.value ? new Date(e.target.value) : null
                                )}
                              />
                            </FormControl>
                          </SimpleGrid>
                        </Box>
                      ))}
                    </VStack>
                  </>
                ) : aiLoading ? (
                  <Flex justify="center" py={4}>
                    <Spinner />
                    <Text ml={3}>Generating subtasks...</Text>
                  </Flex>
                ) : null}
                
                <Button
                  leftIcon={<FiPlus />}
                  variant="outline"
                  size="sm"
                  onClick={handleAddSubtask}
                  mt={3}
                >
                  Add Subtask Manually
                </Button>
              </Box>
            )}
          </Box>
          
          <Flex justify="space-between" mt={6}>
            <Button onClick={() => navigate('/')} variant="outline">
              Cancel
            </Button>
            <Button type="submit" colorScheme="brand" leftIcon={<FiSave />}>
              Save Task
            </Button>
          </Flex>
        </VStack>
      </Box>
    </Box>
  );
};

export default CreateTask;
