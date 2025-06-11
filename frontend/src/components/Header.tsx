import React, { useState, useEffect } from 'react';
import { Box, Flex, Heading, Button, HStack, useColorModeValue } from '@chakra-ui/react';
import { Link as RouterLink, useLocation } from 'react-router-dom';

interface HeaderProps {
  isLoggedIn?: boolean;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ isLoggedIn = false, onLogout = () => {} }) => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isLandingPage = location.pathname === '/';
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'gray.100');
  const buttonHoverBg = useColorModeValue('gray.100', 'gray.700');
  const accentColor = useColorModeValue('yellow.500', 'yellow.400');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Determine padding based on whether we're on the landing page and if scrolled
  const paddingY = isLandingPage && !scrolled ? 14 : 3;
  const boxShadow = scrolled ? "md" : "none";
  const transition = "all 0.3s ease";

  return (
    <Box 
      as="header" 
      bg={bgColor} 
      color={textColor} 
      px={4} 
      py={paddingY} 
      boxShadow={boxShadow}
      position="sticky"
      top={0}
      zIndex={1000}
      transition={transition}
    >
      <Flex maxW="container.xl" mx="auto" align="center" justify="space-between">
        <Heading 
          as={RouterLink} 
          to="/" 
          size={isLandingPage && !scrolled ? "xl" : "lg"} 
          fontWeight="bold" 
          _hover={{ textDecoration: 'none' }}
          transition={transition}
        >
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