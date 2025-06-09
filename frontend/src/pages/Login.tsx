import React, { useState } from 'react';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  Link as ChakraLink,
  Alert,
  AlertIcon,
  useToast,
  Image,
} from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      await login(email, password);
      
      toast({
        title: 'Login successful',
        description: 'Welcome back!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // For demo purposes, handle quick login
  const handleDemoLogin = async () => {
    setIsLoading(true);
    
    try {
      // We'll use the mock login from AuthContext
      await login('demo@example.com', 'password');
      
      toast({
        title: 'Demo Login',
        description: 'Logged in as demo user',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      navigate('/');
    } catch (err) {
      setError('Demo login failed');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Flex minH="100vh" align="center" justify="center" bg="gray.50">
      <Stack spacing={8} mx="auto" maxW="lg" py={12} px={6} width="full">
        <Stack align="center">
          <Heading fontSize="4xl" color="brand.500" textAlign="center">LifeTask AI</Heading>
          <Text fontSize="lg" color="gray.600" textAlign="center">
            Your AI-powered task assistant
          </Text>
        </Stack>
        
        <Box
          rounded="lg"
          bg="white"
          boxShadow="lg"
          p={8}
          width="full"
          maxW="md"
          mx="auto"
        >
          <Stack spacing={4}>
            {error && (
              <Alert status="error" borderRadius="md">
                <AlertIcon />
                {error}
              </Alert>
            )}
            
            <form onSubmit={handleSubmit}>
              <Stack spacing={4}>
                <FormControl id="email">
                  <FormLabel>Email address</FormLabel>
                  <Input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </FormControl>
                
                <FormControl id="password">
                  <FormLabel>Password</FormLabel>
                  <Input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </FormControl>
                
                <Stack spacing={5}>
                  <Stack
                    direction={{ base: 'column', sm: 'row' }}
                    align="start"
                    justify="space-between"
                  >
                    <ChakraLink color="brand.500">Forgot password?</ChakraLink>
                  </Stack>
                  
                  <Button
                    type="submit"
                    bg="brand.500"
                    color="white"
                    _hover={{ bg: 'brand.600' }}
                    isLoading={isLoading}
                  >
                    Sign in
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={handleDemoLogin}
                    isLoading={isLoading}
                  >
                    Try Demo
                  </Button>
                </Stack>
              </Stack>
            </form>
            
            <Stack pt={4}>
              <Text align="center">
                Don't have an account?{' '}
                <Link to="/register">
                  <ChakraLink color="brand.500">Register</ChakraLink>
                </Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
};

export default Login;
