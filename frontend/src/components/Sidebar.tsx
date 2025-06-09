import React from 'react';
import {
  Box,
  Flex,
  Icon,
  Text,
  VStack,
  Divider,
  Tooltip,
  IconButton,
} from '@chakra-ui/react';
import { 
  FiHome, 
  FiCalendar, 
  FiCheckSquare, 
  FiClock,
  FiStar,
  FiSettings,
  FiHelpCircle,
  FiMenu,
} from 'react-icons/fi';
import { Link, useLocation } from 'react-router-dom';

interface NavItemProps {
  icon: any;
  children: string;
  to: string;
  isActive?: boolean;
  isCollapsed?: boolean;
}

const NavItem = ({ icon, children, to, isActive, isCollapsed }: NavItemProps) => {
  return (
    <Tooltip label={isCollapsed ? children : ''} placement="right" hasArrow isDisabled={!isCollapsed}>
      <Link to={to} style={{ textDecoration: 'none', width: '100%' }}>
        <Flex
          align="center"
          p={3}
          mx={isCollapsed ? 0 : 3}
          borderRadius="md"
          role="group"
          cursor="pointer"
          _hover={{
            bg: 'brand.50',
            color: 'brand.600',
          }}
          bg={isActive ? 'brand.50' : 'transparent'}
          color={isActive ? 'brand.600' : 'gray.600'}
          justifyContent={isCollapsed ? 'center' : 'flex-start'}
        >
          <Icon
            as={icon}
            fontSize="lg"
            color={isActive ? 'brand.500' : 'gray.500'}
            _groupHover={{ color: 'brand.500' }}
          />
          {!isCollapsed && (
            <Text ml={4} fontWeight={isActive ? 'medium' : 'normal'}>
              {children}
            </Text>
          )}
        </Flex>
      </Link>
    </Tooltip>
  );
};

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <Box
      as="nav"
      pos="sticky"
      top="0"
      h="100vh"
      pb="10"
      overflowX="hidden"
      overflowY="auto"
      bg="white"
      borderRight="1px"
      borderRightColor="gray.200"
      w={isCollapsed ? '60px' : '240px'}
      transition="width 0.2s ease"
    >
      <Flex px={4} py={4} align="center" justify={isCollapsed ? 'center' : 'space-between'}>
        {!isCollapsed && <Text fontSize="xl" fontWeight="bold" color="brand.500">LifeTask</Text>}
        <IconButton
          aria-label="Toggle Sidebar"
          icon={<FiMenu />}
          variant="ghost"
          onClick={toggleSidebar}
        />
      </Flex>
      <Divider />
      <VStack spacing={0} align="stretch" mt={4}>
        <NavItem 
          icon={FiHome} 
          to="/" 
          isActive={location.pathname === '/'}
          isCollapsed={isCollapsed}
        >
          Dashboard
        </NavItem>
        <NavItem 
          icon={FiStar} 
          to="/priorities" 
          isActive={location.pathname === '/priorities'}
          isCollapsed={isCollapsed}
        >
          Priorities
        </NavItem>
        <NavItem 
          icon={FiCalendar} 
          to="/calendar" 
          isActive={location.pathname === '/calendar'}
          isCollapsed={isCollapsed}
        >
          Calendar
        </NavItem>
        <NavItem 
          icon={FiCheckSquare} 
          to="/completed" 
          isActive={location.pathname === '/completed'}
          isCollapsed={isCollapsed}
        >
          Completed
        </NavItem>
        <NavItem 
          icon={FiClock} 
          to="/upcoming" 
          isActive={location.pathname === '/upcoming'}
          isCollapsed={isCollapsed}
        >
          Upcoming
        </NavItem>
      </VStack>
      <Divider mt={6} mb={6} />
      <VStack spacing={0} align="stretch">
        <NavItem 
          icon={FiSettings} 
          to="/settings" 
          isActive={location.pathname === '/settings'}
          isCollapsed={isCollapsed}
        >
          Settings
        </NavItem>
        <NavItem 
          icon={FiHelpCircle} 
          to="/help" 
          isActive={location.pathname === '/help'}
          isCollapsed={isCollapsed}
        >
          Help & Support
        </NavItem>
      </VStack>
    </Box>
  );
};

export default Sidebar;
