import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  SimpleGrid,
  Text,
  Flex,
  Button,
  Card,
  CardBody,
  CardHeader,
  Progress,
  HStack,
  VStack,
  Select,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  StatGroup,
  Divider,
} from '@chakra-ui/react';
import { FiDownload, FiBarChart2, FiClock, FiCheck, FiCalendar } from 'react-icons/fi';
import Layout from '../components/Layout';
import { useTask, Task } from '../context/TaskContext';

// Helper function to format date
const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

const Reports: React.FC = () => {
  const { tasks } = useTask();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  const [reportData, setReportData] = useState<any>({});
  
  // Calculate report data
  useEffect(() => {
    if (!tasks.length) return;
    
    // Filter tasks based on time range
    const now = new Date();
    const startDate = new Date();
    
    if (timeRange === 'week') {
      startDate.setDate(now.getDate() - 7);
    } else if (timeRange === 'month') {
      startDate.setMonth(now.getMonth() - 1);
    } else {
      startDate.setFullYear(now.getFullYear() - 1);
    }
    
    // Recent tasks (created within the time range)
    const recentTasks = tasks.filter(task => 
      new Date(task.createdAt) >= startDate
    );
    
    // Completed tasks within time range
    const completedTasks = tasks.filter(task => 
      task.status === 'completed' && 
      task.completedAt && 
      new Date(task.completedAt) >= startDate
    );
    
    // Tasks by category
    const categoryCounts: Record<string, number> = {};
    const categoryCompletionRates: Record<string, number> = {};
    
    tasks.forEach(task => {
      if (!categoryCounts[task.category]) {
        categoryCounts[task.category] = 0;
        categoryCompletionRates[task.category] = 0;
      }
      
      categoryCounts[task.category]++;
      
      if (task.status === 'completed') {
        categoryCompletionRates[task.category]++;
      }
    });
    
    // Calculate completion rates
    Object.keys(categoryCompletionRates).forEach(category => {
      if (categoryCounts[category] > 0) {
        categoryCompletionRates[category] = Math.round(
          (categoryCompletionRates[category] / categoryCounts[category]) * 100
        );
      }
    });
    
    // Tasks by priority
    const priorityCounts = {
      high: tasks.filter(t => t.priority === 'high').length,
      medium: tasks.filter(t => t.priority === 'medium').length,
      low: tasks.filter(t => t.priority === 'low').length,
    };
    
    // Tasks by status
    const statusCounts = {
      not_started: tasks.filter(t => t.status === 'not_started').length,
      in_progress: tasks.filter(t => t.status === 'in_progress').length,
      completed: tasks.filter(t => t.status === 'completed').length,
      deferred: tasks.filter(t => t.status === 'deferred').length,
    };
    
    // Recently completed tasks
    const recentlyCompleted = tasks
      .filter(task => task.status === 'completed' && task.completedAt)
      .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime())
      .slice(0, 5);
      
    // Upcoming tasks
    const upcomingTasks = tasks
      .filter(task => 
        task.status !== 'completed' && 
        task.dueDate && 
        new Date(task.dueDate) > new Date()
      )
      .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
      .slice(0, 5);
    
    // Completion rate over time (simplified)
    const completionRate = tasks.length > 0 
      ? Math.round((tasks.filter(t => t.status === 'completed').length / tasks.length) * 100) 
      : 0;
    
    // Previous period comparison (simplified mock data)
    const previousCompletionRate = completionRate - Math.floor(Math.random() * 15) + 5;
    
    setReportData({
      totalTasks: tasks.length,
      completedTasks: completedTasks.length,
      recentTasks: recentTasks.length,
      categoryCounts,
      categoryCompletionRates,
      priorityCounts,
      statusCounts,
      recentlyCompleted,
      upcomingTasks,
      completionRate,
      previousCompletionRate,
    });
    
  }, [tasks, timeRange]);
  
  // Loading state
  if (!reportData.totalTasks) {
    return (
      <Layout>
        <Box p={6}>
          <Heading mb={6}>Reports</Heading>
          <Text>Loading reports...</Text>
        </Box>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <Box mb={6}>
        <Flex 
          justify="space-between" 
          align={{ base: 'flex-start', md: 'center' }} 
          mb={6}
          direction={{ base: 'column', md: 'row' }}
          gap={4}
        >
          <Heading as="h1" size="xl" color="gray.800">Reports</Heading>
          
          <HStack>
            <Select 
              value={timeRange} 
              onChange={e => setTimeRange(e.target.value as any)} 
              maxW="200px"
              size="sm"
            >
              <option value="week">Past Week</option>
              <option value="month">Past Month</option>
              <option value="year">Past Year</option>
            </Select>
            
            <Button leftIcon={<FiDownload />} colorScheme="blue" size="sm">
              Export
            </Button>
          </HStack>
        </Flex>
        
        {/* Overview Stats */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={6}>
          <Card>
            <CardBody>
              <Stat>
                <StatLabel fontSize="md" mb={1}>Completion Rate</StatLabel>
                <Flex align="center">
                  <StatNumber fontSize="3xl">{reportData.completionRate}%</StatNumber>
                  <StatHelpText ml={2} mb={0}>
                    <StatArrow 
                      type={reportData.completionRate > reportData.previousCompletionRate ? 'increase' : 'decrease'} 
                    />
                    {Math.abs(reportData.completionRate - reportData.previousCompletionRate)}%
                  </StatHelpText>
                </Flex>
                <Progress 
                  value={reportData.completionRate} 
                  colorScheme="yellow" 
                  size="sm" 
                  mt={2} 
                />
              </Stat>
            </CardBody>
          </Card>
          
          <Card>
            <CardBody>
              <StatGroup>
                <Stat>
                  <StatLabel>Total Tasks</StatLabel>
                  <StatNumber>{reportData.totalTasks}</StatNumber>
                  <StatHelpText>
                    <StatArrow type="increase" />
                    {reportData.recentTasks} new
                  </StatHelpText>
                </Stat>
                
                <Stat>
                  <StatLabel>Completed</StatLabel>
                  <StatNumber>{reportData.completedTasks}</StatNumber>
                  <StatHelpText>
                    In {timeRange === 'week' ? 'past week' : timeRange === 'month' ? 'past month' : 'past year'}
                  </StatHelpText>
                </Stat>
              </StatGroup>
            </CardBody>
          </Card>
          
          <Card>
            <CardBody>
              <Heading size="md" mb={4}>Tasks by Priority</Heading>
              <VStack align="stretch" spacing={3}>
                <HStack justify="space-between">
                  <Text>High</Text>
                  <Text fontWeight="bold">{reportData.priorityCounts.high}</Text>
                </HStack>
                <Progress 
                  value={reportData.totalTasks ? (reportData.priorityCounts.high / reportData.totalTasks) * 100 : 0} 
                  size="sm" 
                  colorScheme="red" 
                />
                
                <HStack justify="space-between">
                  <Text>Medium</Text>
                  <Text fontWeight="bold">{reportData.priorityCounts.medium}</Text>
                </HStack>
                <Progress 
                  value={reportData.totalTasks ? (reportData.priorityCounts.medium / reportData.totalTasks) * 100 : 0} 
                  size="sm" 
                  colorScheme="yellow" 
                />
                
                <HStack justify="space-between">
                  <Text>Low</Text>
                  <Text fontWeight="bold">{reportData.priorityCounts.low}</Text>
                </HStack>
                <Progress 
                  value={reportData.totalTasks ? (reportData.priorityCounts.low / reportData.totalTasks) * 100 : 0} 
                  size="sm" 
                  colorScheme="blue" 
                />
              </VStack>
            </CardBody>
          </Card>
        </SimpleGrid>
        
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={6}>
          {/* Category Completion Rates */}
          <Card>
            <CardHeader pb={0}>
              <Heading size="md">Category Completion Rates</Heading>
            </CardHeader>
            <CardBody>
              <VStack align="stretch" spacing={4}>
                {Object.keys(reportData.categoryCompletionRates).map(category => (
                  <Box key={category}>
                    <HStack justify="space-between" mb={1}>
                      <Text textTransform="capitalize">{category}</Text>
                      <Text fontWeight="bold">{reportData.categoryCompletionRates[category]}%</Text>
                    </HStack>
                    <Progress 
                      value={reportData.categoryCompletionRates[category]} 
                      size="sm" 
                      colorScheme={category === 'work' ? 'yellow' : 
                                  category === 'home' ? 'green' : 
                                  category === 'finance' ? 'blue' : 
                                  category === 'health' ? 'purple' : 
                                  category === 'family' ? 'pink' : 'gray'} 
                    />
                  </Box>
                ))}
              </VStack>
            </CardBody>
          </Card>
          
          {/* Status Distribution */}
          <Card>
            <CardHeader pb={0}>
              <Heading size="md">Task Status Distribution</Heading>
            </CardHeader>
            <CardBody>
              <VStack align="stretch" spacing={4}>
                <HStack justify="space-between">
                  <Text>Not Started</Text>
                  <Text fontWeight="bold">{reportData.statusCounts.not_started}</Text>
                </HStack>
                <Progress 
                  value={reportData.totalTasks ? (reportData.statusCounts.not_started / reportData.totalTasks) * 100 : 0} 
                  size="sm" 
                  colorScheme="gray" 
                />
                
                <HStack justify="space-between">
                  <Text>In Progress</Text>
                  <Text fontWeight="bold">{reportData.statusCounts.in_progress}</Text>
                </HStack>
                <Progress 
                  value={reportData.totalTasks ? (reportData.statusCounts.in_progress / reportData.totalTasks) * 100 : 0} 
                  size="sm" 
                  colorScheme="blue" 
                />
                
                <HStack justify="space-between">
                  <Text>Completed</Text>
                  <Text fontWeight="bold">{reportData.statusCounts.completed}</Text>
                </HStack>
                <Progress 
                  value={reportData.totalTasks ? (reportData.statusCounts.completed / reportData.totalTasks) * 100 : 0} 
                  size="sm" 
                  colorScheme="green" 
                />
                
                <HStack justify="space-between">
                  <Text>Deferred</Text>
                  <Text fontWeight="bold">{reportData.statusCounts.deferred}</Text>
                </HStack>
                <Progress 
                  value={reportData.totalTasks ? (reportData.statusCounts.deferred / reportData.totalTasks) * 100 : 0} 
                  size="sm" 
                  colorScheme="yellow" 
                />
              </VStack>
            </CardBody>
          </Card>
        </SimpleGrid>
        
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          {/* Recently Completed Tasks */}
          <Card>
            <CardHeader pb={0}>
              <Flex align="center">
                <FiCheck size={18} style={{ marginRight: '8px' }} />
                <Heading size="md">Recently Completed</Heading>
              </Flex>
            </CardHeader>
            <CardBody>
              <VStack align="stretch" spacing={3} divider={<Divider />}>
                {reportData.recentlyCompleted.length > 0 ? (
                  reportData.recentlyCompleted.map((task: Task) => (
                    <Flex key={task._id} justify="space-between" align="center">
                      <Box>
                        <Text fontWeight="medium">{task.title}</Text>
                        <Text fontSize="sm" color="gray.500">
                          Completed: {task.completedAt ? formatDate(task.completedAt) : 'Unknown'}
                        </Text>
                      </Box>
                      <Text
                        textTransform="capitalize"
                        fontSize="sm"
                        color="accent.500"
                      >
                        {task.category}
                      </Text>
                    </Flex>
                  ))
                ) : (
                  <Text color="gray.500">No recently completed tasks.</Text>
                )}
              </VStack>
            </CardBody>
          </Card>
          
          {/* Upcoming Tasks */}
          <Card>
            <CardHeader pb={0}>
              <Flex align="center">
                <FiCalendar size={18} style={{ marginRight: '8px' }} />
                <Heading size="md">Upcoming Tasks</Heading>
              </Flex>
            </CardHeader>
            <CardBody>
              <VStack align="stretch" spacing={3} divider={<Divider />}>
                {reportData.upcomingTasks.length > 0 ? (
                  reportData.upcomingTasks.map((task: Task) => (
                    <Flex key={task._id} justify="space-between" align="center">
                      <Box>
                        <Text fontWeight="medium">{task.title}</Text>
                        <Text fontSize="sm" color="gray.500">
                          Due: {task.dueDate ? formatDate(task.dueDate) : 'No due date'}
                        </Text>
                      </Box>
                      <Text
                        fontSize="sm"
                        px={2}
                        py={1}
                        borderRadius="md"
                        bg={task.priority === 'high' ? 'red.100' : 
                           task.priority === 'medium' ? 'yellow.100' : 'green.100'}
                        color={task.priority === 'high' ? 'red.700' : 
                              task.priority === 'medium' ? 'yellow.700' : 'green.700'}
                      >
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                      </Text>
                    </Flex>
                  ))
                ) : (
                  <Text color="gray.500">No upcoming tasks.</Text>
                )}
              </VStack>
            </CardBody>
          </Card>
        </SimpleGrid>
      </Box>
    </Layout>
  );
};

export default Reports;