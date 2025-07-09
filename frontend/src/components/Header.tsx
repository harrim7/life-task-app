import React, { useState, useEffect } from 'react';
import { Box, Flex, Heading, Button, HStack, useColorModeValue, Icon } from '@chakra-ui/react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { FiLogOut, FiUser, FiGrid } from 'react-icons/fi';

interface HeaderProps {
  isLoggedIn?: boolean;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ isLoggedIn = false, onLogout = () => {} }) => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isLandingPage = location.pathname === '/';
  
  // Updated color scheme using new theme colors
  const bgColor = useColorModeValue(isLandingPage ? 'white' : 'white', 'gray.900');
  const textColor = useColorModeValue('gray.800', 'gray.100');
  
  // Dynamic styles for the scrolled header
  const headerBgGradient = useColorModeValue(
    scrolled 
      ? 'linear(to-b, white, white)' 
      : isLandingPage 
        ? 'linear(to-b, white, brand.50)' 
        : 'linear(to-b, white, white)',
    'linear(to-b, gray.900, gray.800)'
  );
  
  const headerBoxShadow = scrolled 
    ? 'rgba(0, 0, 0, 0.05) 0px 1px 2px, rgba(0, 0, 0, 0.05) 0px 1px 4px' 
    : 'none';

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

  // Dynamic padding based on page and scroll state
  const paddingTop = isLandingPage ? (scrolled ? 2 : 3) : 2;
  const paddingBottom = isLandingPage ? (scrolled ? 2 : 16) : 2;
  const transition = "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)";

  // Scale down the header text when scrolled
  const headingSize = isLandingPage && !scrolled ? "xl" : "md";
  const buttonSize = scrolled ? "sm" : "md";
  
  return (
    <Box 
      as="header" 
      bgGradient={headerBgGradient}
      color={textColor} 
      px={4} 
      pt={paddingTop}
      pb={paddingBottom}
      boxShadow={headerBoxShadow}
      position="sticky"
      top={0}
      zIndex={1000}
      transition={transition}
      borderBottomWidth={scrolled ? "1px" : "0px"}
      borderBottomColor="gray.100"
    >
      <Flex 
        maxW="container.xl" 
        mx="auto" 
        justify="space-between"
        align="flex-start"
      >
        <Heading 
          as={RouterLink} 
          to="/" 
          size={headingSize} 
          fontWeight="semibold" 
          color="brand.500"
          _hover={{ 
            color: 'brand.600',
            transform: 'translateY(-1px)',
          }}
          transition={transition}
          mt={1}
          letterSpacing="-0.5px"
        >
          LifeTask AI
        </Heading>
        
        <HStack spacing={3} mt={1}>
          {isLoggedIn ? (
            <>
              <Button 
                as={RouterLink} 
                to="/dashboard" 
                variant="ghost" 
                color="gray.700"
                leftIcon={<Icon as={FiGrid} />} 
                _hover={{ 
                  bg: 'brand.50',
                  color: 'brand.600',
                  transform: 'translateY(-1px)'
                }}
                size={buttonSize}
                fontWeight="medium"
                transition={transition}
              >
                Dashboard
              </Button>
              <Button 
                variant="outline" 
                color="gray.700"
                borderColor="brand.300"
                leftIcon={<Icon as={FiLogOut} />}
                _hover={{ 
                  bg: 'brand.50',
                  borderColor: 'brand.500',
                  color: 'brand.600',
                  transform: 'translateY(-1px)'
                }}
                onClick={onLogout}
                size={buttonSize}
                fontWeight="medium"
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
                color="gray.700"
                leftIcon={<Icon as={FiUser} />}
                _hover={{ 
                  bg: 'brand.50',
                  color: 'brand.600',
                  transform: 'translateY(-1px)'
                }}
                size={buttonSize}
                fontWeight="medium"
                transition={transition}
              >
                Login
              </Button>
              <Button 
                as={RouterLink} 
                to="/register" 
                variant="solid" 
                colorScheme="brand"
                _hover={{
                  transform: 'translateY(-1px)',
                  boxShadow: 'md',
                }}
                _active={{
                  transform: 'translateY(0)',
                }}
                size={buttonSize}
                fontWeight="medium"
                transition={transition}
              >
                Get Started
              </Button>
            </>
          )}
        </HStack>
      </Flex>
    </Box>
  );
};

export default Header;