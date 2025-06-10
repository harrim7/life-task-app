import React from 'react';
import { 
  Box, 
  Text, 
  Heading, 
  Flex, 
  Badge, 
  Progress,
  Icon,
} from '@chakra-ui/react';
import { FiCheck, FiCalendar, FiFolder } from 'react-icons/fi';
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
  
  // Get badge color based on priority
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'accent';
      case 'medium':
        return 'orange';
      case 'low':
        return 'brand';
      default:
        return 'gray';
    }
  };
  
  // Get badge color based on status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'brand';
      case 'in_progress':
        return 'blue';
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

  return (
    <Box 
      as={RouterLink}
      to={`/tasks/${task._id}`}
      bg="white"
      p={5}
      borderRadius="lg"
      shadow="sm"
      transition="all 0.2s"
      _hover={{
        transform: 'translateY(-4px)',
        shadow: 'md',
        textDecoration: 'none'
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
            colorScheme="brand" 
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
      
      <Flex mt={4} fontSize="sm" color="gray.500" justify="space-between" wrap="wrap">
        <Flex align="center" mr={2}>
          <Icon as={FiCalendar} mr={1} />
          <Text>{formatDate(task.dueDate)}</Text>
        </Flex>
        
        <Flex align="center">
          <Icon as={FiFolder} mr={1} />
          <Text textTransform="capitalize">{task.category}</Text>
        </Flex>
        
        {task.status === 'completed' && (
          <Badge colorScheme="green" display="flex" alignItems="center" mt={{ base: 2, md: 0 }}>
            <Icon as={FiCheck} mr={1} /> Completed
          </Badge>
        )}
      </Flex>
    </Box>
  );
};

export default TaskCard;