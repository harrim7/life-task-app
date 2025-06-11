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
  const paddingTop = isLandingPage && !scrolled ? 6 : 2;
  const paddingBottom = isLandingPage && !scrolled ? 6 : 2;
  const boxShadow = scrolled ? "md" : "none";
  const transition = "all 0.3s ease";

  // Scale down the header text when scrolled (70% of original size)
  const headingSize = isLandingPage && !scrolled ? "xl" : "md";
  const buttonSize = scrolled ? "sm" : "md";
  const buttonPadding = scrolled ? "0.5rem 0.75rem" : undefined;

  return (
    <Box 
      as="header" 
      bg={bgColor} 
      color={textColor} 
      px={4} 
      pt={paddingTop}
      pb={paddingBottom}
      boxShadow={boxShadow}
      position="sticky"
      top={0}
      zIndex={1000}
      transition={transition}
      height={scrolled ? "auto" : undefined}
    >
      <Flex 
        maxW="container.xl" 
        mx="auto" 
        justify="space-between"
        align="flex-start" // Align items to the top of the header
      >
        <Heading 
          as={RouterLink} 
          to="/" 
          size={headingSize} 
          fontWeight="bold" 
          _hover={{ textDecoration: 'none' }}
          transition={transition}
          mt={1} // Keep the heading near the top
        >
          LifeTask AI
        </Heading>
        
        <HStack spacing={3} mt={1}> {/* Reduced spacing and kept near top */}
          {isLoggedIn ? (
            <>
              <Button 
                as={RouterLink} 
                to="/dashboard" 
                variant="ghost" 
                color={textColor} 
                _hover={{ bg: buttonHoverBg }}
                size={buttonSize}
                px={buttonPadding}
                py={scrolled ? 1 : undefined}
                transition={transition}
              >
                Dashboard
              </Button>
              <Button 
                variant="outline" 
                color={textColor} 
                borderColor="yellow.500" 
                _hover={{ bg: 'yellow.500', color: 'gray.800' }} 
                onClick={onLogout}
                size={buttonSize}
                px={buttonPadding}
                py={scrolled ? 1 : undefined}
                transition={transition}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button 
                as={RouterLink} 
                to="/login" 
                variant="ghost" 
                color={textColor} 
                _hover={{ bg: buttonHoverBg }}
                size={buttonSize}
                px={buttonPadding}
                py={scrolled ? 1 : undefined}
                transition={transition}
              >
                Login
              </Button>
              <Button 
                as={RouterLink} 
                to="/register" 
                variant="outline" 
                color={textColor} 
                borderColor="yellow.500" 
                _hover={{ bg: 'yellow.500', color: 'gray.800' }}
                size={buttonSize}
                px={buttonPadding}
                py={scrolled ? 1 : undefined}
                transition={transition}
              >
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