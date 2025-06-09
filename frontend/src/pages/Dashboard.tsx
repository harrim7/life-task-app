import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Heading, 
  Text, 
  SimpleGrid, 
  Flex, 
  Badge, 
  Button,
  Spinner,
  Select,
  HStack,
  useToast,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
  Progress,
} from '@chakra-ui/react';
import { FiPlusCircle, FiFilter, FiRefreshCw, FiCheck } from 'react-icons/fi';
import { Link as RouterLink } from 'react-router-dom';
import Layout from '../components/Layout';
import { useTask, Task } from '../context/TaskContext';

const Dashboard: React.FC = () => {
  const { tasks, loading, error, fetchTasks } = useTask();
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const toast = useToast();
  
  // Apply filters when tasks or filter settings change
  useEffect(() => {
    if (tasks) {
      let filtered = [...tasks];
      
      // Apply category filter
      if (categoryFilter !== 'all') {
        filtered = filtered.filter(task => task.category === categoryFilter);
      }
      
      // Apply status filter
      if (statusFilter !== 'all') {
        filtered = filtered.filter(task => task.status === statusFilter);
      }
      
      setFilteredTasks(filtered);
    }
  }, [tasks, categoryFilter, statusFilter]);
  
  // Refresh tasks
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchTasks();
      toast({
        title: 'Tasks refreshed',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to refresh tasks',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsRefreshing(false);
    }
  };
  
  // Calculate task statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const inProgressTasks = tasks.filter(task => task.status === 'in_progress').length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const highPriorityTasks = tasks.filter(task => task.priority === 'high').length;
  
  // Format date for display
  const formatDate = (date: Date | undefined) => {
    if (!date) return 'No due date';
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  // Get badge color based on priority
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'red';
      case 'medium':
        return 'orange';
      case 'low':
        return 'green';
      default:
        return 'gray';
    }
  };
  
  // Get badge color based on status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'green';
      case 'in_progress':
        return 'blue';
      case 'not_started':
        return 'gray';
      case 'deferred':
        return 'purple';
      default:
        return 'gray';
    }
  };
  
  // Calculate progress for a task
  const calculateProgress = (task: Task) => {
    if (task.subtasks.length === 0) return 0;
    const completedSubtasks = task.subtasks.filter(st => st.completed).length;
    return Math.round((completedSubtasks / task.subtasks.length) * 100);
  };
  
  // Loading state
  if (loading && !isRefreshing) {
    return (
      <Layout>
        <Flex justify="center" align="center" height="50vh">
          <Spinner size="xl" color="brand.500" thickness="4px" />
        </Flex>
      </Layout>
    );
  }
  
  // Error state
  if (error && !isRefreshing) {
    return (
      <Layout>
        <Alert status="error" borderRadius="md" mb={6}>
          <AlertIcon />
          <AlertTitle mr={2}>Error loading tasks!</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button leftIcon={<FiRefreshCw />} onClick={handleRefresh}>
          Retry
        </Button>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <Box mb={6}>
        <Flex justify="space-between" align="center" mb={4}>
          <Heading as="h1" size="xl" color="gray.800">Dashboard</Heading>
          <HStack spacing={3}>
            <Button 
              leftIcon={<FiRefreshCw />} 
              variant="outline" 
              size="sm"
              isLoading={isRefreshing}
              onClick={handleRefresh}
            >
              Refresh
            </Button>
            <Button 
              as={RouterLink}
              to="/tasks/create"
              colorScheme="blue"
              leftIcon={<FiPlusCircle />}
              size="sm"
            >
              New Task
            </Button>
          </HStack>
        </Flex>
        
        {/* Task Statistics */}
        <StatGroup bg="white" p={4} borderRadius="lg" shadow="sm" mb={6}>
          <Stat>
            <StatLabel>Total Tasks</StatLabel>
            <StatNumber>{totalTasks}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Completed</StatLabel>
            <StatNumber>{completedTasks}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>In Progress</StatLabel>
            <StatNumber>{inProgressTasks}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Completion</StatLabel>
            <StatNumber>{completionPercentage}%</StatNumber>
            <Progress value={completionPercentage} size="xs" colorScheme="green" mt={2} />
          </Stat>
          <Stat>
            <StatLabel>High Priority</StatLabel>
            <StatNumber>{highPriorityTasks}</StatNumber>
          </Stat>
        </StatGroup>
        
        {/* Filters */}
        <Flex 
          bg="white" 
          p={4} 
          borderRadius="lg" 
          shadow="sm" 
          mb={6}
          align="center"
          wrap={{ base: "wrap", md: "nowrap" }}
          gap={4}
        >
          <FiFilter />
          <Text fontWeight="medium" mr={2}>Filters:</Text>
          <Select 
            value={categoryFilter} 
            onChange={e => setCategoryFilter(e.target.value)}
            maxW="200px"
            size="sm"
          >
            <option value="all">All Categories</option>
            <option value="work">Work</option>
            <option value="home">Home</option>
            <option value="finance">Finance</option>
            <option value="health">Health</option>
            <option value="family">Family</option>
            <option value="other">Other</option>
          </Select>
          
          <Select 
            value={statusFilter} 
            onChange={e => setStatusFilter(e.target.value)}
            maxW="200px"
            size="sm"
          >
            <option value="all">All Statuses</option>
            <option value="not_started">Not Started</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="deferred">Deferred</option>
          </Select>
        </Flex>
      </Box>
      
      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <Box bg="white" p={8} borderRadius="lg" shadow="sm" textAlign="center">
          <Heading size="md" mb={4}>No tasks found</Heading>
          <Text mb={4}>
            {tasks.length === 0 
              ? "You don't have any tasks yet." 
              : "No tasks match your current filters."}
          </Text>
          <Button 
            as={RouterLink}
            to="/tasks/create"
            colorScheme="blue"
            leftIcon={<FiPlusCircle />}
          >
            Create Your First Task
          </Button>
        </Box>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {filteredTasks.map(task => (
            <Box 
              key={task._id}
              as={RouterLink}
              to={`/tasks/${task._id}`}
              bg="white"
              p={5}
              borderRadius="lg"
              shadow="sm"
              transition="all 0.2s"
              _hover={{
                transform: 'translateY(-4px)',
                shadow: 'md'
              }}
              borderLeft="4px solid"
              borderLeftColor={`${getPriorityColor(task.priority)}.400`}
            >
              <Flex justify="space-between" mb={2}>
                <Badge colorScheme={getStatusColor(task.status)}>
                  {task.status === 'not_started' 
                    ? 'Not Started' 
                    : task.status === 'in_progress' 
                    ? 'In Progress' 
                    : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                </Badge>
                <Badge colorScheme={getPriorityColor(task.priority)}>
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                </Badge>
              </Flex>
              
              <Heading as="h3" size="md" mb={2} noOfLines={1}>
                {task.title}
              </Heading>
              
              {task.description && (
                <Text fontSize="sm" color="gray.600" noOfLines={2} mb={3}>
                  {task.description}
                </Text>
              )}
              
              {task.subtasks.length > 0 && (
                <>
                  <Progress 
                    value={calculateProgress(task)} 
                    size="xs" 
                    colorScheme="blue" 
                    mb={2} 
                  />
                  <Flex justify="space-between" fontSize="xs" color="gray.500">
                    <Text>{calculateProgress(task)}% complete</Text>
                    <Text>
                      {task.subtasks.filter(st => st.completed).length}/{task.subtasks.length} subtasks
                    </Text>
                  </Flex>
                </>
              )}
              
              <Flex mt={4} fontSize="sm" color="gray.500" justify="space-between" align="center">
                <Text>
                  Due: {formatDate(task.dueDate)}
                </Text>
                {task.status === 'completed' && (
                  <Badge colorScheme="green" display="flex" alignItems="center">
                    <FiCheck size={12} style={{ marginRight: 4 }} /> Completed
                  </Badge>
                )}
              </Flex>
            </Box>
          ))}
        </SimpleGrid>
      )}
    </Layout>
  );
};

export default Dashboard;