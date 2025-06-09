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
  InputGroup,
  InputRightElement,
  IconButton,
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';

const Register: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const { register } = useAuth();
  
  // Form validation schema
  const validationSchema = Yup.object({
    name: Yup.string()
      .required('Full name is required')
      .min(2, 'Name must be at least 2 characters'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required('Please confirm your password')
  });
  
  // Formik setup
  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        await register(values.name, values.email, values.password);
        
        toast({
          title: 'Account created',
          description: 'You have successfully registered!',
          status: 'success',
          duration: 3000,
          isClosable: true
        });
        
        navigate('/dashboard');
      } catch (error) {
        toast({
          title: 'Registration failed',
          description: error instanceof Error ? error.message : 'Please try again',
          status: 'error',
          duration: 5000,
          isClosable: true
        });
      } finally {
        setIsLoading(false);
      }
    }
  });
  
  const togglePassword = () => setShowPassword(!showPassword);
  const toggleConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);
  
  return (
    <Box>
      <Header />
      <Container maxW="md" py={{ base: 10, md: 20 }}>
        <Box bg="white" p={8} rounded="lg" shadow="base">
          <VStack spacing={6} align="stretch">
            <Box textAlign="center">
              <Heading color="brand.500" size="lg" mb={2}>Create an Account</Heading>
              <Text color="gray.600" fontSize="sm">
                Join LifeTask AI and boost your productivity
              </Text>
            </Box>
            
            <form onSubmit={formik.handleSubmit}>
              <VStack spacing={4} align="stretch">
                <FormControl isInvalid={!!formik.errors.name && formik.touched.name}>
                  <FormLabel htmlFor="name">Full Name</FormLabel>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    variant="filled"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.name}
                  />
                  <FormErrorMessage>{formik.errors.name}</FormErrorMessage>
                </FormControl>
                
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
                  <InputGroup>
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      variant="filled"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.password}
                    />
                    <InputRightElement>
                      <IconButton
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        icon={showPassword ? <FiEyeOff /> : <FiEye />}
                        variant="ghost"
                        onClick={togglePassword}
                        size="sm"
                      />
                    </InputRightElement>
                  </InputGroup>
                  <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
                  <Text fontSize="xs" color="gray.500" mt={1}>
                    At least 6 characters long
                  </Text>
                </FormControl>
                
                <FormControl isInvalid={!!formik.errors.confirmPassword && formik.touched.confirmPassword}>
                  <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
                  <InputGroup>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      variant="filled"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.confirmPassword}
                    />
                    <InputRightElement>
                      <IconButton
                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                        icon={showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                        variant="ghost"
                        onClick={toggleConfirmPassword}
                        size="sm"
                      />
                    </InputRightElement>
                  </InputGroup>
                  <FormErrorMessage>{formik.errors.confirmPassword}</FormErrorMessage>
                </FormControl>
                
                <Button 
                  type="submit" 
                  colorScheme="blue" 
                  size="lg" 
                  width="full" 
                  mt={4}
                  isLoading={isLoading}
                >
                  Create Account
                </Button>
              </VStack>
            </form>
            
            <Box textAlign="center" pt={4}>
              <Text fontSize="sm">
                Already have an account?{' '}
                <Link as={RouterLink} to="/login" color="brand.500">
                  Login
                </Link>
              </Text>
            </Box>
          </VStack>
        </Box>
      </Container>
    </Box>
  );
};

export default Register;