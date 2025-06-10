import React, { ReactNode } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import Header from './Header';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';

interface LayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, showSidebar = true }) => {
  const { isAuthenticated, logout } = useAuth();
  
  return (
    <Flex direction="column" minH="100vh">
      <Header isLoggedIn={isAuthenticated} onLogout={logout} />
      
      <Flex flex="1">
        {showSidebar && isAuthenticated && (
          <Box w="250px" bg="white" p={4} shadow="sm">
            <Sidebar />
          </Box>
        )}
        
        <Box flex="1" p={4}>
          {children}
        </Box>
      </Flex>
    </Flex>
  );
};

export default Layout;