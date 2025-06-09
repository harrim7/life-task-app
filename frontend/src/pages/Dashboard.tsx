import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Input,
  Select,
  SimpleGrid,
  Text,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useToast
} from '@chakra-ui/react';
import { FiPlus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

// Components
import TaskCard from '../components/TaskCard';

// Hooks
import { useTasks } from '../context/TaskContext';

const Dashboard: React.FC = () => {
  const { tasks, fetchTasks, deleteTask, updateTask } = useTasks();
  const [filteredTasks, setFilteredTasks] = useState(tasks);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const navigate = useNavigate();
  const toast = useToast();
  
  // Modal for AI suggestions
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [taskIdForSuggestions, setTaskIdForSuggestions] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string>('');
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    // Filter tasks based on search and filters
    let result = [...tasks];
    
    if (searchTerm) {
      result = result.filter(task => 
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (categoryFilter) {
      result = result.filter(task => task.category === categoryFilter);
    }
    
    if (statusFilter) {
      result = result.filter(task => task.status === statusFilter);
    }
    
    if (priorityFilter) {
      result = result.filter(task => task.priority === priorityFilter);
    }
    
    setFilteredTasks(result);
  }, [tasks, searchTerm, categoryFilter, statusFilter, priorityFilter]);

  const handleCreateTask = () => {
    navigate('/tasks/create');
  };

  const handleEditTask = (id: string) => {
    navigate(`/tasks/${id}`);
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await deleteTask(id);
      toast({
        title: 'Task deleted',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
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

  const handleCompleteTask = async (id: string) => {
    try {
      await updateTask(id, { status: 'completed' });
      toast({
        title: 'Task completed',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Failed to complete task',
        description: error instanceof Error ? error.message : 'Unknown error',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleGetSuggestions = async (taskId: string) => {
    setTaskIdForSuggestions(taskId);
    setLoadingSuggestions(true);
    onOpen();
    
    try {
      const task = tasks.find(t => t._id === taskId);
      if (!task) throw new Error('Task not found');
      
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

  // Get unique categories for filter
  const categories = ['All', ...new Set(tasks.map(task => task.category))];

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg">My Tasks</Heading>
        <Button
          leftIcon={<FiPlus />}
          colorScheme="brand"
          onClick={handleCreateTask}
        >
          New Task
        </Button>
      </Flex>

      {/* Filters */}
      <Grid
        templateColumns={{ base: "1fr", md: "1fr 1fr 1fr 1fr" }}
        gap={4}
        mb={6}
        p={4}
        bg="white"
        borderRadius="md"
        boxShadow="sm"
      >
        <Input
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <Select
          placeholder="All Categories"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          {categories.map((category, index) => (
            category !== 'All' && <option key={index} value={category}>{category}</option>
          ))}
        </Select>
        
        <Select
          placeholder="All Statuses"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="not_started">Not Started</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="deferred">Deferred</option>
        </Select>
        
        <Select
          placeholder="All Priorities"
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
        >
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </Select>
      </Grid>

      {/* Task Grid */}
      {filteredTasks.length > 0 ? (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
          {filteredTasks.map(task => (
            <TaskCard
              key={task._id}
              task={task}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              onComplete={handleCompleteTask}
            />
          ))}
        </SimpleGrid>
      ) : (
        <Box
          textAlign="center"
          p={10}
          bg="white"
          borderRadius="md"
          boxShadow="sm"
        >
          <Text fontSize="lg" color="gray.500">
            No tasks found. Create a new task to get started!
          </Text>
          <Button
            mt={4}
            colorScheme="brand"
            onClick={handleCreateTask}
          >
            Create Task
          </Button>
        </Box>
      )}

      {/* AI Suggestions Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>AI Suggestions</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {loadingSuggestions ? (
              <Text>Generating suggestions...</Text>
            ) : (
              <Box whiteSpace="pre-wrap">{suggestions}</Box>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Dashboard;
