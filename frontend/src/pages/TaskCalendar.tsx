import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Heading,
  Button,
  Flex,
  useToast,
  Text,
  Badge,
  Grid,
  GridItem,
  HStack,
  Divider,
  VStack,
  Center,
  Spinner,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Tooltip,
  useColorModeValue,
  List,
  ListItem,
} from '@chakra-ui/react';
import { 
  FiCalendar, 
  FiChevronLeft, 
  FiChevronRight, 
  FiFilter, 
  FiClock,
  FiCheck,
  FiArrowRight
} from 'react-icons/fi';
import { Link as RouterLink } from 'react-router-dom';
import Layout from '../components/Layout';
import { useTask, Task, Subtask } from '../context/TaskContext';

// Constants for calendar view modes
type CalendarViewMode = 'day' | 'week' | 'month';

// Interface for calendar event item
interface CalendarItem {
  id: string;
  title: string;
  dueDate: Date;
  priority: 'low' | 'medium' | 'high';
  isCompleted: boolean;
  isSubtask: boolean;
  parentId?: string;
  parentTitle?: string;
}

const TaskCalendar: React.FC = () => {
  const { tasks, loading, error, fetchTasks } = useTask();
  const [viewMode, setViewMode] = useState<CalendarViewMode>('week');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [calendarItems, setCalendarItems] = useState<CalendarItem[]>([]);
  const [showSubtasks, setShowSubtasks] = useState<boolean>(true);
  const [showCompleted, setShowCompleted] = useState<boolean>(false);
  const toast = useToast();
  
  // Calculate dates based on the current date and view mode
  const dates = useMemo(() => {
    const result: Date[] = [];
    const startDate = new Date(currentDate);
    
    // Adjust to start of current view
    if (viewMode === 'day') {
      // Single day view - just use current date
      result.push(new Date(startDate));
    } else if (viewMode === 'week') {
      // Week view - start from Sunday
      const day = startDate.getDay();
      startDate.setDate(startDate.getDate() - day);
      
      // Add 7 days starting from Sunday
      for (let i = 0; i < 7; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        result.push(date);
      }
    } else if (viewMode === 'month') {
      // Month view - start from first day of month
      startDate.setDate(1);
      
      // Find the first day of the month
      const firstDay = new Date(startDate).getDay();
      
      // Add days from previous month to start from Sunday
      for (let i = 0; i < firstDay; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() - (firstDay - i));
        result.push(date);
      }
      
      // Add days of current month
      const daysInMonth = new Date(
        startDate.getFullYear(),
        startDate.getMonth() + 1,
        0
      ).getDate();
      
      for (let i = 0; i < daysInMonth; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        result.push(date);
      }
      
      // Add days from next month to complete grid (max 6 rows of 7 days)
      const totalDays = Math.ceil((firstDay + daysInMonth) / 7) * 7;
      const remainingDays = totalDays - (firstDay + daysInMonth);
      
      for (let i = 1; i <= remainingDays; i++) {
        const date = new Date(startDate);
        date.setMonth(date.getMonth() + 1, i);
        result.push(date);
      }
    }
    
    return result;
  }, [currentDate, viewMode]);
  
  // Generate calendar items from tasks and subtasks
  useEffect(() => {
    if (!tasks) return;
    
    const items: CalendarItem[] = [];
    
    // Add tasks with due dates
    tasks.forEach(task => {
      if (task.dueDate) {
        items.push({
          id: task._id,
          title: task.title,
          dueDate: new Date(task.dueDate),
          priority: task.priority,
          isCompleted: task.status === 'completed',
          isSubtask: false
        });
      }
      
      // Add subtasks with due dates
      if (showSubtasks && task.subtasks) {
        task.subtasks.forEach(subtask => {
          if (subtask.dueDate) {
            items.push({
              id: subtask._id,
              title: subtask.title,
              dueDate: new Date(subtask.dueDate),
              priority: subtask.priority,
              isCompleted: subtask.completed,
              isSubtask: true,
              parentId: task._id,
              parentTitle: task.title
            });
          }
        });
      }
    });
    
    // Filter out completed items if not showing completed
    const filteredItems = showCompleted 
      ? items 
      : items.filter(item => !item.isCompleted);
    
    setCalendarItems(filteredItems);
  }, [tasks, showSubtasks, showCompleted]);
  
  // Navigate to previous period
  const goToPrevious = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'day') {
      newDate.setDate(newDate.getDate() - 1);
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() - 1);
    }
    setCurrentDate(newDate);
  };
  
  // Navigate to next period
  const goToNext = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'day') {
      newDate.setDate(newDate.getDate() + 1);
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };
  
  // Navigate to today
  const goToToday = () => {
    setCurrentDate(new Date());
  };
  
  // Refresh tasks
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchTasks();
      toast({
        title: 'Calendar refreshed',
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
  
  // Format date for display
  const formatDate = (date: Date, format: 'short' | 'long' = 'short') => {
    if (format === 'long') {
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    }
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };
  
  // Format month and year for display
  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  };
  
  // Check if date is today
  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };
  
  // Check if date is in current month
  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };
  
  // Get items for a specific date
  const getItemsForDate = (date: Date) => {
    return calendarItems.filter(item => {
      const itemDate = new Date(item.dueDate);
      return itemDate.getDate() === date.getDate() &&
        itemDate.getMonth() === date.getMonth() &&
        itemDate.getFullYear() === date.getFullYear();
    });
  };
  
  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'yellow';
      case 'medium':
        return 'accent';
      case 'low':
        return 'brand';
      default:
        return 'gray';
    }
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
  
  // Render calendar
  return (
    <Layout>
      <Box mb={6}>
        <Flex justify="space-between" align="center" mb={4}>
          <Heading as="h1" size="xl" color="gray.800">Task Calendar</Heading>
          <HStack spacing={3}>
            <Button
              leftIcon={<FiCalendar />}
              variant="ghost"
              onClick={goToToday}
              size="sm"
            >
              Today
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              isLoading={isRefreshing}
              leftIcon={<FiClock />}
            >
              Refresh
            </Button>
          </HStack>
        </Flex>
        
        {/* Calendar Navigation */}
        <Flex 
          justify="space-between" 
          align="center" 
          bg="white" 
          p={4} 
          borderRadius="lg" 
          shadow="sm" 
          mb={4}
        >
          <HStack>
            <IconButton
              aria-label="Previous"
              icon={<FiChevronLeft />}
              onClick={goToPrevious}
              variant="ghost"
            />
            <IconButton
              aria-label="Next"
              icon={<FiChevronRight />}
              onClick={goToNext}
              variant="ghost"
            />
            <Heading size="md" ml={2}>
              {viewMode === 'day' 
                ? formatDate(currentDate, 'long')
                : viewMode === 'week'
                  ? `Week of ${formatDate(dates[0])}`
                  : formatMonthYear(currentDate)
              }
            </Heading>
          </HStack>
          
          <HStack>
            <Menu>
              <MenuButton as={Button} rightIcon={<FiFilter />} variant="outline" size="sm">
                Options
              </MenuButton>
              <MenuList>
                <MenuItem 
                  onClick={() => setShowSubtasks(!showSubtasks)}
                  icon={showSubtasks ? <FiCheck /> : undefined}
                >
                  Show Subtasks
                </MenuItem>
                <MenuItem
                  onClick={() => setShowCompleted(!showCompleted)}
                  icon={showCompleted ? <FiCheck /> : undefined}
                >
                  Show Completed
                </MenuItem>
              </MenuList>
            </Menu>
            
            <HStack spacing={1} bg="gray.100" p={1} borderRadius="md">
              <Button 
                size="sm" 
                variant={viewMode === 'day' ? 'solid' : 'ghost'} 
                onClick={() => setViewMode('day')}
                bg={viewMode === 'day' ? 'brand.500' : undefined}
                color={viewMode === 'day' ? 'white' : undefined}
                _hover={{
                  bg: viewMode === 'day' ? 'brand.600' : 'gray.200'
                }}
              >
                Day
              </Button>
              <Button 
                size="sm" 
                variant={viewMode === 'week' ? 'solid' : 'ghost'} 
                onClick={() => setViewMode('week')}
                bg={viewMode === 'week' ? 'brand.500' : undefined}
                color={viewMode === 'week' ? 'white' : undefined}
                _hover={{
                  bg: viewMode === 'week' ? 'brand.600' : 'gray.200'
                }}
              >
                Week
              </Button>
              <Button 
                size="sm" 
                variant={viewMode === 'month' ? 'solid' : 'ghost'} 
                onClick={() => setViewMode('month')}
                bg={viewMode === 'month' ? 'brand.500' : undefined}
                color={viewMode === 'month' ? 'white' : undefined}
                _hover={{
                  bg: viewMode === 'month' ? 'brand.600' : 'gray.200'
                }}
              >
                Month
              </Button>
            </HStack>
          </HStack>
        </Flex>
        
        {/* Calendar Grid */}
        {viewMode === 'month' ? (
          <>
            {/* Weekday Headers */}
            <Grid templateColumns="repeat(7, 1fr)" gap={2} mb={2}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <GridItem key={day} textAlign="center" fontWeight="bold" p={2}>
                  {day}
                </GridItem>
              ))}
            </Grid>
            
            {/* Calendar Days */}
            <Grid 
              templateColumns="repeat(7, 1fr)" 
              gap={2} 
              templateRows={`repeat(${dates.length / 7}, 1fr)`}
            >
              {dates.map((date, index) => {
                const dateItems = getItemsForDate(date);
                return (
                  <GridItem 
                    key={index}
                    bg={isToday(date) ? 'yellow.50' : 'white'}
                    borderWidth="1px"
                    borderRadius="md"
                    p={2}
                    minH="120px"
                    opacity={isCurrentMonth(date) ? 1 : 0.5}
                    borderColor={isToday(date) ? 'yellow.300' : 'gray.200'}
                  >
                    <Text 
                      fontWeight={isToday(date) ? 'bold' : 'normal'}
                      fontSize="sm" 
                      textAlign="right"
                      color={isToday(date) ? 'yellow.500' : 'gray.500'}
                      mb={2}
                    >
                      {date.getDate()}
                    </Text>
                    
                    <VStack align="stretch" spacing={1}>
                      {dateItems.length > 0 ? (
                        dateItems.slice(0, 3).map((item) => (
                          <Box 
                            key={item.id}
                            p={1}
                            bg={`${getPriorityColor(item.priority)}.50`}
                            borderRadius="sm"
                            borderLeftWidth="3px"
                            borderLeftColor={`${getPriorityColor(item.priority)}.500`}
                            fontSize="xs"
                            isTruncated
                            opacity={item.isCompleted ? 0.6 : 1}
                            textDecoration={item.isCompleted ? 'line-through' : 'none'}
                            as={RouterLink}
                            to={item.isSubtask ? `/tasks/${item.parentId}` : `/tasks/${item.id}`}
                          >
                            {item.title}
                          </Box>
                        ))
                      ) : null}
                      
                      {dateItems.length > 3 && (
                        <Text fontSize="xs" color="gray.500" textAlign="center">
                          +{dateItems.length - 3} more
                        </Text>
                      )}
                    </VStack>
                  </GridItem>
                );
              })}
            </Grid>
          </>
        ) : viewMode === 'week' ? (
          <Grid templateColumns="repeat(7, 1fr)" gap={2}>
            {dates.map((date, index) => {
              const dateItems = getItemsForDate(date);
              return (
                <GridItem 
                  key={index}
                  bg={isToday(date) ? 'yellow.50' : 'white'}
                  borderWidth="1px"
                  borderRadius="md"
                  overflow="hidden"
                  shadow="sm"
                >
                  <Box 
                    bg={isToday(date) ? 'yellow.100' : 'gray.50'} 
                    p={2}
                    borderBottomWidth="1px"
                    borderBottomColor={isToday(date) ? 'yellow.200' : 'gray.200'}
                  >
                    <Text 
                      fontWeight="bold" 
                      textAlign="center"
                      fontSize="sm"
                    >
                      {date.toLocaleDateString('en-US', { weekday: 'short' })}
                    </Text>
                    <Text 
                      textAlign="center" 
                      fontSize="lg"
                      fontWeight={isToday(date) ? 'bold' : 'medium'}
                    >
                      {date.getDate()}
                    </Text>
                  </Box>
                  
                  <VStack align="stretch" p={2} spacing={2} minH="200px" maxH="350px" overflowY="auto">
                    {dateItems.length > 0 ? (
                      dateItems.map((item) => (
                        <Box 
                          key={item.id}
                          p={2}
                          bg={`${getPriorityColor(item.priority)}.50`}
                          borderRadius="md"
                          borderLeftWidth="3px"
                          borderLeftColor={`${getPriorityColor(item.priority)}.500`}
                          fontSize="sm"
                          opacity={item.isCompleted ? 0.6 : 1}
                          textDecoration={item.isCompleted ? 'line-through' : 'none'}
                          as={RouterLink}
                          to={item.isSubtask ? `/tasks/${item.parentId}` : `/tasks/${item.id}`}
                        >
                          <Text fontWeight="medium" isTruncated>
                            {item.title}
                          </Text>
                          {item.isSubtask && (
                            <Text fontSize="xs" color="gray.500" isTruncated>
                              From: {item.parentTitle}
                            </Text>
                          )}
                        </Box>
                      ))
                    ) : (
                      <Center h="100%">
                        <Text fontSize="sm" color="gray.400">No tasks</Text>
                      </Center>
                    )}
                  </VStack>
                </GridItem>
              );
            })}
          </Grid>
        ) : (
          // Day view
          <Box bg="white" p={4} borderRadius="lg" shadow="sm">
            <VStack align="stretch" spacing={4}>
              <Text fontWeight="bold" fontSize="lg">
                {formatDate(currentDate, 'long')}
              </Text>
              
              <Divider />
              
              {getItemsForDate(currentDate).length > 0 ? (
                <List spacing={3}>
                  {getItemsForDate(currentDate).map((item) => (
                    <ListItem 
                      key={item.id}
                      p={4}
                      bg={`${getPriorityColor(item.priority)}.50`}
                      borderRadius="md"
                      borderLeftWidth="4px"
                      borderLeftColor={`${getPriorityColor(item.priority)}.500`}
                      opacity={item.isCompleted ? 0.7 : 1}
                    >
                      <Flex justify="space-between" align="center">
                        <Box>
                          <HStack mb={1}>
                            <Badge colorScheme={getPriorityColor(item.priority)}>
                              {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
                            </Badge>
                            {item.isSubtask && (
                              <Badge variant="outline">Subtask</Badge>
                            )}
                            {item.isCompleted && (
                              <Badge colorScheme="green">Completed</Badge>
                            )}
                          </HStack>
                          
                          <Text 
                            fontWeight="bold" 
                            fontSize="md"
                            textDecoration={item.isCompleted ? 'line-through' : 'none'}
                          >
                            {item.title}
                          </Text>
                          
                          {item.isSubtask && item.parentTitle && (
                            <Text fontSize="sm" color="gray.600" mt={1}>
                              From: {item.parentTitle}
                            </Text>
                          )}
                        </Box>
                        
                        <Button 
                          as={RouterLink}
                          to={item.isSubtask ? `/tasks/${item.parentId}` : `/tasks/${item.id}`}
                          size="sm"
                          rightIcon={<FiArrowRight />}
                          variant="ghost"
                        >
                          View
                        </Button>
                      </Flex>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Center p={12}>
                  <VStack>
                    <Text fontSize="lg" color="gray.500">No tasks scheduled for today</Text>
                    <Button 
                      as={RouterLink}
                      to="/tasks/create"
                      mt={4}
                      colorScheme="blue"
                    >
                      Create a Task
                    </Button>
                  </VStack>
                </Center>
              )}
            </VStack>
          </Box>
        )}
      </Box>
    </Layout>
  );
};

export default TaskCalendar;