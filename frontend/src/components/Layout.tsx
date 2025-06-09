import React, { ReactNode } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import Header from './Header';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, showSidebar = true }) => {
  // This is a placeholder for auth state, which would come from context
  const isLoggedIn = true; // For demonstration purposes
  
  return (
    <Flex direction="column" minH="100vh">
      <Header isLoggedIn={isLoggedIn} />
      
      <Flex flex="1">
        {showSidebar && isLoggedIn && (
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