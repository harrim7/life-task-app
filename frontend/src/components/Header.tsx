import React from 'react';
import { Box, Flex, Heading, Button, HStack, useColorModeValue } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

interface HeaderProps {
  isLoggedIn?: boolean;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ isLoggedIn = false, onLogout = () => {} }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'gray.100');
  const buttonHoverBg = useColorModeValue('gray.100', 'gray.700');
  const accentColor = useColorModeValue('yellow.500', 'yellow.400');

  return (
    <Box as="header" bg={bgColor} color={textColor} px={4} py={3} boxShadow="md">
      <Flex maxW="container.xl" mx="auto" align="center" justify="space-between">
        <Heading as={RouterLink} to="/" size="lg" fontWeight="bold" _hover={{ textDecoration: 'none' }}>
          LifeTask AI
        </Heading>
        
        <HStack spacing={4}>
          {isLoggedIn ? (
            <>
              <Button as={RouterLink} to="/dashboard" variant="ghost" color={textColor} _hover={{ bg: buttonHoverBg }}>
                Dashboard
              </Button>
              <Button variant="outline" color={textColor} borderColor="yellow.500" _hover={{ bg: 'yellow.500', color: 'gray.800' }} onClick={onLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button as={RouterLink} to="/login" variant="ghost" color={textColor} _hover={{ bg: buttonHoverBg }}>
                Login
              </Button>
              <Button as={RouterLink} to="/register" variant="outline" color={textColor} borderColor="yellow.500" _hover={{ bg: 'yellow.500', color: 'gray.800' }}>
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