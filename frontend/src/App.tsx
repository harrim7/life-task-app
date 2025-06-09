import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box, Text, Container, Heading, Button, VStack, extendTheme, ChakraProvider } from '@chakra-ui/react';

// Components
import Layout from './components/Layout';
import Header from './components/Header';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';
import CreateTask from './pages/CreateTask';
import TaskDetail from './pages/TaskDetail';

// Context
import { AuthProvider, useAuth } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';

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

// Home page component

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
        <TaskProvider>
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
              <Route 
                path="/tasks" 
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route 
                path="/tasks/create" 
                element={
                  <PrivateRoute>
                    <CreateTask />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/tasks/:id" 
                element={
                  <PrivateRoute>
                    <TaskDetail />
                  </PrivateRoute>
                } 
              />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Router>
        </TaskProvider>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default App;