import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  Link,
  Container,
  FormErrorMessage,
  useToast,
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';

// This is a placeholder component for login
// In a real implementation, this would connect to your AuthContext

const Login: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  
  // Form validation schema
  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .required('Password is required')
  });
  
  // Formik setup
  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        // This is where you would call your authentication service
        console.log('Login attempt with:', values);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Simulate successful login
        toast({
          title: 'Login successful',
          description: 'Welcome to LifeTask AI!',
          status: 'success',
          duration: 3000,
          isClosable: true
        });
        
        navigate('/dashboard');
      } catch (error) {
        toast({
          title: 'Login failed',
          description: error instanceof Error ? error.message : 'Please check your credentials',
          status: 'error',
          duration: 5000,
          isClosable: true
        });
      } finally {
        setIsLoading(false);
      }
    }
  });
  
  const handleDemoLogin = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: 'Demo Login',
        description: 'Logged in as demo user',
        status: 'success',
        duration: 3000,
        isClosable: true
      });
      
      navigate('/dashboard');
      setIsLoading(false);
    }, 1000);
  };
  
  return (
    <Container maxW="md" py={{ base: 10, md: 20 }}>
      <Box bg="white" p={8} rounded="lg" shadow="base">
        <VStack spacing={6} align="stretch">
          <Box textAlign="center">
            <Heading color="brand.500" size="lg" mb={2}>Sign in to your account</Heading>
            <Text color="gray.600" fontSize="sm">
              Access your tasks and continue your productivity journey
            </Text>
          </Box>
          
          <form onSubmit={formik.handleSubmit}>
            <VStack spacing={4} align="stretch">
              <FormControl isInvalid={!!formik.errors.email && formik.touched.email}>
                <FormLabel htmlFor="email">Email address</FormLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  variant="filled"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                />
                <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
              </FormControl>
              
              <FormControl isInvalid={!!formik.errors.password && formik.touched.password}>
                <FormLabel htmlFor="password">Password</FormLabel>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  variant="filled"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                />
                <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
              </FormControl>
              
              <Box textAlign="right">
                <Link color="brand.500" fontSize="sm">Forgot password?</Link>
              </Box>
              
              <Button 
                type="submit" 
                colorScheme="blue" 
                size="lg" 
                width="full" 
                mt={4}
                isLoading={isLoading}
              >
                Sign In
              </Button>
              
              <Button
                variant="outline"
                colorScheme="blue"
                size="lg"
                width="full"
                onClick={handleDemoLogin}
                isLoading={isLoading}
              >
                Try Demo
              </Button>
            </VStack>
          </form>
          
          <Box textAlign="center" pt={4}>
            <Text fontSize="sm">
              Don't have an account?{' '}
              <Link as={RouterLink} to="/register" color="brand.500">
                Register
              </Link>
            </Text>
          </Box>
        </VStack>
      </Box>
    </Container>
  );
};

export default Login;