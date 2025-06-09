import React from 'react';
import { Box, Flex } from '@chakra-ui/react';
import Sidebar from './Sidebar';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Flex h="100vh" overflow="hidden">
      <Sidebar />
      <Flex flexDirection="column" flex="1" overflow="hidden">
        <Header />
        <Box
          flex="1"
          p={4}
          overflowY="auto"
          bg="gray.50"
        >
          {children}
        </Box>
      </Flex>
    </Flex>
  );
};

export default Layout;
