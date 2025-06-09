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
  FormHelperText,
} from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { register } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validate inputs
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await register(name, email, password);
      
      toast({
        title: 'Account created',
        description: 'You have successfully registered!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Flex minH="100vh" align="center" justify="center" bg="gray.50">
      <Stack spacing={8} mx="auto" maxW="lg" py={12} px={6} width="full">
        <Stack align="center">
          <Heading fontSize="4xl" color="brand.500" textAlign="center">Create an Account</Heading>
          <Text fontSize="lg" color="gray.600" textAlign="center">
            Join LifeTask AI and boost your productivity
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
                <FormControl id="name" isRequired>
                  <FormLabel>Full Name</FormLabel>
                  <Input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </FormControl>
                
                <FormControl id="email" isRequired>
                  <FormLabel>Email address</FormLabel>
                  <Input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <FormHelperText>We'll never share your email.</FormHelperText>
                </FormControl>
                
                <FormControl id="password" isRequired>
                  <FormLabel>Password</FormLabel>
                  <Input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <FormHelperText>At least 6 characters long.</FormHelperText>
                </FormControl>
                
                <FormControl id="confirm-password" isRequired>
                  <FormLabel>Confirm Password</FormLabel>
                  <Input 
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </FormControl>
                
                <Stack spacing={10} pt={2}>
                  <Button
                    type="submit"
                    size="lg"
                    bg="brand.500"
                    color="white"
                    _hover={{ bg: 'brand.600' }}
                    isLoading={isLoading}
                  >
                    Sign up
                  </Button>
                </Stack>
              </Stack>
            </form>
            
            <Stack pt={6}>
              <Text align="center">
                Already a user?{' '}
                <Link to="/login">
                  <ChakraLink color="brand.500">Login</ChakraLink>
                </Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
};

export default Register;
