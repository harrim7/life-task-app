import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  SimpleGrid,
  Text,
  Flex,
  Badge,
  Button,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
  Card,
  CardBody,
  Progress,
  Icon,
  VStack,
  useColorModeValue,
  HStack,
} from '@chakra-ui/react';
import { FiFolder, FiPlus, FiHome, FiBriefcase, FiDollarSign, FiHeart, FiUsers, FiGrid } from 'react-icons/fi';
import { Link as RouterLink } from 'react-router-dom';
import Layout from '../components/Layout';
import { useTask, Task } from '../context/TaskContext';

const Categories: React.FC = () => {
  const { tasks } = useTask();
  const [categorizedTasks, setCategorizedTasks] = useState<Record<string, Task[]>>({});
  
  // Categorize tasks
  useEffect(() => {
    const categories: Record<string, Task[]> = {
      home: [],
      work: [],
      finance: [],
      health: [],
      family: [],
      other: [],
    };
    
    tasks.forEach(task => {
      if (categories[task.category]) {
        categories[task.category].push(task);
      } else {
        categories.other.push(task);
      }
    });
    
    setCategorizedTasks(categories);
  }, [tasks]);
  
  // Calculate category statistics
  const getCategoryStats = (category: string) => {
    const categoryTasks = categorizedTasks[category] || [];
    const totalTasks = categoryTasks.length;
    const completedTasks = categoryTasks.filter(task => task.status === 'completed').length;
    const inProgressTasks = categoryTasks.filter(task => task.status === 'in_progress').length;
    const percentComplete = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    return {
      totalTasks,
      completedTasks,
      inProgressTasks,
      percentComplete
    };
  };
  
  // Get icon for category
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'home':
        return FiHome;
      case 'work':
        return FiBriefcase;
      case 'finance':
        return FiDollarSign;
      case 'health':
        return FiHeart;
      case 'family':
        return FiUsers;
      case 'other':
        return FiGrid;
      default:
        return FiFolder;
    }
  };
  
  // Get color for category
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'home':
        return 'brand';
      case 'work':
        return 'accent';
      case 'finance':
        return 'yellow';
      case 'health':
        return 'green';
      case 'family':
        return 'purple';
      case 'other':
        return 'gray';
      default:
        return 'gray';
    }
  };
  
  return (
    <Layout>
      <Box mb={6}>
        <Flex justify="space-between" align="center" mb={6}>
          <Heading as="h1" size="xl" color="gray.800">Categories</Heading>
          <Button
            as={RouterLink}
            to="/tasks/create"
            colorScheme="blue"
            leftIcon={<FiPlus />}
            size="sm"
          >
            New Task
          </Button>
        </Flex>
        
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {Object.keys(categorizedTasks).map(category => {
            const stats = getCategoryStats(category);
            const CategoryIcon = getCategoryIcon(category);
            const colorScheme = getCategoryColor(category);
            
            return (
              <Card key={category} overflow="hidden" variant="outline">
                <CardBody>
                  <Flex align="center" mb={4}>
                    <Box 
                      p={2}
                      borderRadius="md"
                      bg={`${colorScheme}.100`}
                      color={`${colorScheme}.700`}
                      mr={3}
                    >
                      <Icon as={CategoryIcon} boxSize={5} />
                    </Box>
                    <Heading size="md" textTransform="capitalize">
                      {category}
                    </Heading>
                  </Flex>
                  
                  <StatGroup mb={4}>
                    <Stat>
                      <StatLabel>Total</StatLabel>
                      <StatNumber>{stats.totalTasks}</StatNumber>
                    </Stat>
                    <Stat>
                      <StatLabel>Completed</StatLabel>
                      <StatNumber>{stats.completedTasks}</StatNumber>
                    </Stat>
                    <Stat>
                      <StatLabel>In Progress</StatLabel>
                      <StatNumber>{stats.inProgressTasks}</StatNumber>
                    </Stat>
                  </StatGroup>
                  
                  <VStack align="stretch" spacing={3}>
                    <Box>
                      <HStack justify="space-between" mb={1}>
                        <Text fontSize="sm">Completion</Text>
                        <Text fontSize="sm" fontWeight="medium">{stats.percentComplete}%</Text>
                      </HStack>
                      <Progress value={stats.percentComplete} size="sm" colorScheme={colorScheme} borderRadius="full" />
                    </Box>
                    
                    <Button 
                      as={RouterLink} 
                      to={`/tasks?category=${category}`}
                      variant="outline"
                      colorScheme={colorScheme}
                      size="sm"
                      w="full"
                    >
                      View Tasks
                    </Button>
                  </VStack>
                </CardBody>
              </Card>
            );
          })}
        </SimpleGrid>
      </Box>
    </Layout>
  );
};

export default Categories;