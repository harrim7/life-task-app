import React from 'react';
import { Box, VStack, Link, Text, Icon, Divider, Heading } from '@chakra-ui/react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { FiHome, FiList, FiPlus, FiFolder, FiSettings, FiBarChart2 } from 'react-icons/fi';

const Sidebar: React.FC = () => {
  const location = useLocation();
  
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: FiHome },
    { name: 'All Tasks', path: '/tasks', icon: FiList },
    { name: 'Create Task', path: '/tasks/create', icon: FiPlus },
    { name: 'Categories', path: '/categories', icon: FiFolder },
    { name: 'Reports', path: '/reports', icon: FiBarChart2 },
    { name: 'Settings', path: '/settings', icon: FiSettings },
  ];
  
  return (
    <Box as="nav" width="full">
      <Heading size="sm" mb={6} color="brand.500">Navigation</Heading>
      
      <VStack spacing={1} align="stretch">
        {navItems.map(item => (
          <Link 
            key={item.path}
            as={RouterLink}
            to={item.path}
            display="flex"
            alignItems="center"
            p={3}
            borderRadius="md"
            fontSize="sm"
            fontWeight="medium"
            color={location.pathname === item.path ? 'brand.500' : 'gray.700'}
            bg={location.pathname === item.path ? 'blue.50' : 'transparent'}
            _hover={{ bg: 'blue.50', textDecoration: 'none' }}
          >
            <Icon as={item.icon} mr={3} />
            <Text>{item.name}</Text>
          </Link>
        ))}
      </VStack>
      
      <Divider my={6} />
      
      <Box px={3} py={2}>
        <Text fontSize="xs" color="gray.500">
          LifeTask AI v0.1.0
        </Text>
      </Box>
    </Box>
  );
};

export default Sidebar;