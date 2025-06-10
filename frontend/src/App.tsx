import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Text, extendTheme, ChakraProvider } from '@chakra-ui/react';

// Components
import Layout from './components/Layout';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';
import CreateTask from './pages/CreateTask';
import TaskDetail from './pages/TaskDetail';
import LandingPage from './pages/LandingPage';

// Context
import { AuthProvider, useAuth } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';

// Theme
const theme = extendTheme({
  colors: {
    brand: {
      50: '#e6f7f7',
      100: '#c1e9e8',
      200: '#9cdbd9',
      300: '#77cdca',
      400: '#52bfbb',
      500: '#09757a', // Primary teal color
      600: '#086e72',
      700: '#06565a',
      800: '#053f42',
      900: '#03282a',
    },
    accent: {
      50: '#f9e6f5',
      100: '#f0bfe7',
      200: '#e799d9',
      300: '#de72ca',
      400: '#d465c5', // Primary pink color
      500: '#c94eb9',
      600: '#b243a2',
      700: '#8f358a',
      800: '#6b2865',
      900: '#471b43',
    },
    gray: {
      50: '#f2f2f2',
      100: '#e6e6e6',
      200: '#cccccc',
      300: '#b3b3b3',
      400: '#999999',
      500: '#808080',
      600: '#666666',
      700: '#4d4d4d',
      800: '#2b2b2b', // Dark gray
      900: '#111111', // Near black
    },
  },
  fonts: {
    heading: '"Inter", sans-serif',
    body: '"Inter", sans-serif',
  },
  styles: {
    global: {
      body: {
        bg: 'gray.50',
        color: 'gray.900',
      },
    },
  },
});

// Home route component that redirects based on authentication status
const HomeRoute = () => {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }
  
  return <LandingPage />;
};

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
              <Route path="/" element={<HomeRoute />} />
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