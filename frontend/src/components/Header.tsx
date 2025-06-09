import React from 'react';
import { Box, Flex, Heading, Button, HStack, useColorModeValue } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

interface HeaderProps {
  isLoggedIn?: boolean;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ isLoggedIn = false, onLogout = () => {} }) => {
  const bgColor = useColorModeValue('brand.500', 'brand.700');
  const textColor = useColorModeValue('white', 'white');

  return (
    <Box as="header" bg={bgColor} color={textColor} px={4} py={3} boxShadow="md">
      <Flex maxW="container.xl" mx="auto" align="center" justify="space-between">
        <Heading as={RouterLink} to="/" size="lg" fontWeight="bold" _hover={{ textDecoration: 'none' }}>
          LifeTask AI
        </Heading>
        
        <HStack spacing={4}>
          {isLoggedIn ? (
            <>
              <Button as={RouterLink} to="/dashboard" variant="ghost" color="white" _hover={{ bg: 'brand.400' }}>
                Dashboard
              </Button>
              <Button variant="outline" color="white" borderColor="white" _hover={{ bg: 'brand.400' }} onClick={onLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button as={RouterLink} to="/login" variant="ghost" color="white" _hover={{ bg: 'brand.400' }}>
                Login
              </Button>
              <Button as={RouterLink} to="/register" variant="outline" color="white" borderColor="white" _hover={{ bg: 'brand.400' }}>
                Register
              </Button>
            </>
          )}
        </HStack>
      </Flex>
    </Box>
  );
};

export default Header;