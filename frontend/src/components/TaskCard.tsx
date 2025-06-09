import React from 'react';
import { Box, Text, Badge, Flex, IconButton, Progress, Tooltip } from '@chakra-ui/react';
import { FiEdit, FiTrash2, FiCheckCircle } from 'react-icons/fi';
import { Link } from 'react-router-dom';

interface SubTask {
  _id: string;
  title: string;
  completed: boolean;
}

interface TaskCardProps {
  task: {
    _id: string;
    title: string;
    description?: string;
    status: 'not_started' | 'in_progress' | 'completed' | 'deferred';
    priority: 'low' | 'medium' | 'high';
    dueDate?: Date;
    category: string;
    subtasks?: SubTask[];
  };
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onComplete: (id: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete, onComplete }) => {
  // Calculate completion percentage based on subtasks
  const getCompletionPercentage = () => {
    if (!task.subtasks || task.subtasks.length === 0) return 0;
    const completedCount = task.subtasks.filter(subtask => subtask.completed).length;
    return Math.round((completedCount / task.subtasks.length) * 100);
  };

  // Format date to more readable format
  const formatDate = (date?: Date) => {
    if (!date) return 'No due date';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Get appropriate color for priority badge
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'red';
      case 'medium': return 'orange';
      case 'low': return 'green';
      default: return 'gray';
    }
  };

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="sm"
      bg="white"
      transition="all 0.3s"
      _hover={{ boxShadow: 'md', transform: 'translateY(-2px)' }}
    >
      <Box p={4}>
        <Flex justifyContent="space-between" alignItems="flex-start">
          <Link to={`/tasks/${task._id}`}>
            <Text fontWeight="bold" fontSize="lg" mb={2} noOfLines={1}>
              {task.title}
            </Text>
          </Link>

          <Flex>
            <Tooltip label="Edit task">
              <IconButton
                aria-label="Edit task"
                icon={<FiEdit />}
                size="sm"
                variant="ghost"
                colorScheme="blue"
                mr={1}
                onClick={() => onEdit(task._id)}
              />
            </Tooltip>
            <Tooltip label="Delete task">
              <IconButton
                aria-label="Delete task"
                icon={<FiTrash2 />}
                size="sm"
                variant="ghost"
                colorScheme="red"
                mr={1}
                onClick={() => onDelete(task._id)}
              />
            </Tooltip>
            {task.status !== 'completed' && (
              <Tooltip label="Mark as complete">
                <IconButton
                  aria-label="Mark as complete"
                  icon={<FiCheckCircle />}
                  size="sm"
                  variant="ghost"
                  colorScheme="green"
                  onClick={() => onComplete(task._id)}
                />
              </Tooltip>
            )}
          </Flex>
        </Flex>

        {task.description && (
          <Text fontSize="sm" color="gray.600" noOfLines={2} mb={3}>
            {task.description}
          </Text>
        )}

        <Flex mt={2} mb={3} justifyContent="space-between" alignItems="center">
          <Badge colorScheme={getPriorityColor(task.priority)} mr={2}>
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </Badge>

          <Text fontSize="xs" color="gray.500">
            Due: {formatDate(task.dueDate)}
          </Text>
        </Flex>

        {task.subtasks && task.subtasks.length > 0 && (
          <Box mt={3}>
            <Flex justifyContent="space-between" alignItems="center" mb={1}>
              <Text fontSize="xs" fontWeight="medium" color="gray.600">
                Progress
              </Text>
              <Text fontSize="xs" color="gray.600">
                {getCompletionPercentage()}%
              </Text>
            </Flex>
            <Progress
              value={getCompletionPercentage()}
              size="sm"
              colorScheme="green"
              borderRadius="full"
            />
          </Box>
        )}

        <Flex mt={3} justifyContent="space-between" alignItems="center">
          <Badge colorScheme="purple" variant="outline">
            {task.category}
          </Badge>
          <Badge
            colorScheme={task.status === 'completed' ? 'green' : task.status === 'in_progress' ? 'blue' : task.status === 'deferred' ? 'gray' : 'yellow'}
          >
            {task.status.replace('_', ' ')}
          </Badge>
        </Flex>
      </Box>
    </Box>
  );
};

export default TaskCard;
