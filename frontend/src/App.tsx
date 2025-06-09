import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box, Text, Container, Heading, Button, VStack, extendTheme, ChakraProvider } from '@chakra-ui/react';

// Components
import Layout from './components/Layout';
import Header from './components/Header';

// Pages
import Login from './pages/Login';

// Context
import { AuthProvider, useAuth } from './context/AuthContext';

// Theme
const theme = extendTheme({
  colors: {
    brand: {
      50: '#e6f7ff',
      100: '#b3e0ff',
      200: '#80caff',
      300: '#4db3ff',
      400: '#1a9dff',
      500: '#0080ff', // Primary color
      600: '#0066cc',
      700: '#004d99',
      800: '#003366',
      900: '#001a33',
    },
  },
  fonts: {
    heading: '"Inter", sans-serif',
    body: '"Inter", sans-serif',
  },
});

// Home page component
const Home = () => (
  <Box>
    <Header />
    <Container maxW="container.xl" py={10}>
      <VStack spacing={6} align="center" textAlign="center">
        <Heading as="h1" size="2xl" color="brand.500">LifeTask AI</Heading>
        <Text fontSize="xl">Your AI-powered task management assistant</Text>
        <Box>
          <Button colorScheme="blue" as="a" href="/login" size="lg" mr={4}>Login</Button>
          <Button variant="outline" colorScheme="blue" as="a" href="/register" size="lg">Register</Button>
        </Box>
        <Text mt={8}>
          LifeTask AI helps you break down complex tasks, prioritize effectively, 
          and receive intelligent suggestions for improved productivity.
        </Text>
      </VStack>
    </Container>
  </Box>
);

// Dashboard page placeholder
const Dashboard = () => {
  return (
    <Layout>
      <Heading as="h1" size="xl" mb={6}>Dashboard</Heading>
      <Text mb={4}>Welcome to your LifeTask AI dashboard. This page is under active development.</Text>
      <Text mb={4}>In the meantime, you can explore the navigation options in the sidebar.</Text>
    </Layout>
  );
};

// Register page placeholder
const Register = () => (
  <Box>
    <Header />
    <Container maxW="md" py={10}>
      <VStack spacing={6} align="center">
        <Heading as="h1" size="xl" color="brand.500">Register</Heading>
        <Text>Registration page is under development. Please use the static HTML version for now.</Text>
        <Button as="a" href="/" colorScheme="blue">Back to Home</Button>
      </VStack>
    </Container>
  </Box>
);

// Private route component
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <Text>Loading...</Text>;
  }
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

// Main App component
function App() {
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/dashboard" 
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default App;