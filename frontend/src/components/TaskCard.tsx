import React from 'react';
import { 
  Box, 
  Text, 
  Heading, 
  Flex, 
  Badge, 
  Progress,
  Icon,
  HStack,
  Tooltip
} from '@chakra-ui/react';
import { FiCheck, FiCalendar, FiFolder, FiClock, FiLayers } from 'react-icons/fi';
import { Link as RouterLink } from 'react-router-dom';
import { Task } from '../context/TaskContext';

interface TaskCardProps {
  task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  // Format date for display
  const formatDate = (date: Date | undefined) => {
    if (!date) return 'No due date';
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    });
  };
  
  // Get priority color based on new color scheme
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'yellow';
      case 'low':
        return 'teal';
      default:
        return 'gray';
    }
  };
  
  // Get status color based on new color scheme
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in_progress':
        return 'brand';
      case 'not_started':
        return 'gray';
      case 'deferred':
        return 'accent';
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

  // Calculate days until due date
  const getDaysUntilDue = () => {
    if (!task.dueDate) return null;
    const today = new Date();
    const dueDate = new Date(task.dueDate);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilDue = getDaysUntilDue();
  const isOverdue = daysUntilDue !== null && daysUntilDue < 0;
  const isDueSoon = daysUntilDue !== null && daysUntilDue >= 0 && daysUntilDue <= 2;
  
  const progressColorScheme = 
    calculateProgress(task) === 100 ? 'success' : 
    calculateProgress(task) > 75 ? 'teal' : 
    calculateProgress(task) > 25 ? 'brand' : 
    'yellow';

  return (
    <Box 
      as={RouterLink}
      to={`/tasks/${task._id}`}
      bg="white"
      p={5}
      borderRadius="lg"
      boxShadow="sm"
      transition="all 0.2s ease-in-out"
      position="relative"
      _hover={{
        transform: 'translateY(-4px)',
        boxShadow: 'md',
        textDecoration: 'none',
        '&::before': {
          opacity: 1,
          transform: 'scaleX(1)'
        }
      }}
      _after={{
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        bg: `${getPriorityColor(task.priority)}.400`,
        borderTopLeftRadius: 'lg',
        borderTopRightRadius: 'lg',
      }}
      _before={{
        content: '""',
        position: 'absolute',
        top: '-2px',
        left: '8px',
        right: '8px',
        height: '8px',
        bg: `${getPriorityColor(task.priority)}.400`,
        filter: 'blur(8px)',
        opacity: 0.4,
        transition: 'opacity 0.2s ease, transform 0.2s ease',
        transform: 'scaleX(0.6)',
        transformOrigin: 'center',
      }}
    >
      <Flex justify="space-between" mb={3} align="center">
        <HStack spacing={2}>
          <Badge 
            colorScheme={getStatusColor(task.status)}
            px={2}
            py={1}
            borderRadius="full"
            textTransform="none"
            fontSize="xs"
            fontWeight="medium"
          >
            {task.status === 'not_started' 
              ? 'Not Started' 
              : task.status === 'in_progress' 
              ? 'In Progress' 
              : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
          </Badge>
          {isOverdue && (
            <Badge 
              colorScheme="error" 
              variant="subtle"
              px={2}
              py={1}
              borderRadius="full"
              textTransform="none"
              fontSize="xs"
              fontWeight="medium"
            >
              Overdue
            </Badge>
          )}
          {isDueSoon && !isOverdue && (
            <Badge 
              colorScheme="yellow" 
              variant="subtle"
              px={2}
              py={1}
              borderRadius="full"
              textTransform="none"
              fontSize="xs"
              fontWeight="medium"
            >
              Due Soon
            </Badge>
          )}
        </HStack>
        <Tooltip label={`${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority`}>
          <Badge 
            colorScheme={getPriorityColor(task.priority)} 
            variant="subtle"
            px={2}
            py={1}
            borderRadius="full"
            textTransform="none"
            fontSize="xs"
            fontWeight="medium"
          >
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </Badge>
        </Tooltip>
      </Flex>
      
      <Heading 
        as="h3" 
        size="md" 
        mb={2} 
        noOfLines={1}
        color="gray.800"
        fontWeight="semibold"
      >
        {task.title}
      </Heading>
      
      {task.description && (
        <Text 
          fontSize="sm" 
          color="gray.600" 
          noOfLines={2} 
          mb={3}
          lineHeight="1.6"
        >
          {task.description}
        </Text>
      )}
      
      {task.subtasks.length > 0 && (
        <Box 
          bg="gray.50" 
          p={3} 
          borderRadius="md" 
          mt={3} 
          mb={3}
        >
          <Flex justify="space-between" mb={2} align="center">
            <Flex align="center">
              <Icon as={FiLayers} color="brand.500" mr={2} />
              <Text fontWeight="medium" fontSize="sm" color="gray.700">
                Progress
              </Text>
            </Flex>
            <Text fontWeight="medium" fontSize="sm" color={
              calculateProgress(task) === 100 ? 'success.500' : 
              calculateProgress(task) > 0 ? 'brand.500' : 
              'gray.500'
            }>
              {calculateProgress(task)}%
            </Text>
          </Flex>
          
          <Progress 
            value={calculateProgress(task)} 
            size="sm" 
            colorScheme={progressColorScheme}
            borderRadius="full"
            bg="gray.200"
            mb={2}
          />
          
          <Text fontSize="xs" color="gray.500" textAlign="right">
            {task.subtasks.filter(st => st.completed).length}/{task.subtasks.length} subtasks
          </Text>
        </Box>
      )}
      
      <Flex 
        mt={4} 
        fontSize="sm" 
        color="gray.500" 
        justify="space-between" 
        wrap="wrap"
        pt={3}
        borderTopWidth="1px"
        borderTopColor="gray.100"
      >
        <Tooltip label={isOverdue ? "Overdue" : "Due Date"}>
          <Flex 
            align="center" 
            mr={3}
            color={isOverdue ? "error.500" : isDueSoon ? "yellow.500" : "gray.500"}
          >
            <Icon as={FiCalendar} mr={1} />
            <Text fontWeight={isOverdue || isDueSoon ? "medium" : "normal"}>
              {formatDate(task.dueDate)}
            </Text>
          </Flex>
        </Tooltip>
        
        <Flex align="center">
          <Icon as={FiFolder} mr={1} />
          <Text 
            textTransform="capitalize"
            fontWeight="medium"
            color="gray.600"
          >
            {task.category}
          </Text>
        </Flex>
        
        {task.status === 'completed' && (
          <Badge 
            colorScheme="success" 
            display="flex" 
            alignItems="center" 
            mt={{ base: 2, md: 0 }}
            borderRadius="full"
            px={2}
            py={1}
          >
            <Icon as={FiCheck} mr={1} /> Completed
          </Badge>
        )}
      </Flex>
    </Box>
  );
};

export default TaskCard;