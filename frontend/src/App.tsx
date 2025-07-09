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
import TaskCalendar from './pages/TaskCalendar';
import Categories from './pages/Categories';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import LandingPage from './pages/LandingPage';

// Context
import { AuthProvider, useAuth } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';

// Theme
const theme = extendTheme({
  colors: {
    brand: {
      50: '#f0f6ff',
      100: '#dde8ff',
      200: '#c1d3ff',
      300: '#9ab7ff',
      400: '#7093ff', 
      500: '#4e6af1', // Primary blue
      600: '#3a4ede',
      700: '#2f3cbb',
      800: '#283293',
      900: '#1f2566',
    },
    accent: {
      50: '#fef4fd',
      100: '#f9e2fc',
      200: '#f3c8f9',
      300: '#e99ff1',
      400: '#de6de8',
      500: '#c840d9', // Secondary purple
      600: '#a92dbb',
      700: '#862597',
      800: '#641e73',
      900: '#441a4f',
    },
    teal: {
      50: '#e6fefe',
      100: '#c7f9fa',
      200: '#9cf1f5',
      300: '#64e3ed',
      400: '#37c8d3',
      500: '#1aacbb', // Accent teal
      600: '#12889a',
      700: '#136b7a',
      800: '#145563',
      900: '#124754',
    },
    yellow: {
      50: '#fffde8',
      100: '#fff9c0',
      200: '#fff085',
      300: '#ffe14a',
      400: '#ffd026',
      500: '#ffaf0f', // Warm orange
      600: '#e17c00',
      700: '#b65204',
      800: '#94400b',
      900: '#7a340d',
    },
    gray: {
      50: '#f9fafb',
      100: '#f0f2f5',
      200: '#e2e7ed',
      300: '#cfd8e3',
      400: '#a9b9cc',
      500: '#8599b2',
      600: '#637994',
      700: '#4d5e77',
      800: '#354055',
      900: '#1f2636',
    },
    success: {
      50: '#e7f8f0',
      100: '#c5eedd',
      200: '#9ee2c7',
      300: '#6ed3aa',
      400: '#40c190',
      500: '#1aad7a', // Success green
      600: '#0e8d65',
      700: '#0d6f50',
      800: '#0e563f',
      900: '#0c4132',
    },
    error: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444', // Error red
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
    },
  },
  fonts: {
    heading: '"Inter", system-ui, sans-serif',
    body: '"Inter", system-ui, sans-serif',
  },
  fontWeights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  shadows: {
    xs: '0 1px 2px rgba(16, 24, 40, 0.05)',
    sm: '0 1px 3px rgba(16, 24, 40, 0.1), 0 1px 2px rgba(16, 24, 40, 0.06)',
    md: '0 4px 8px -2px rgba(16, 24, 40, 0.1), 0 2px 4px -2px rgba(16, 24, 40, 0.06)',
    lg: '0 12px 16px -4px rgba(16, 24, 40, 0.08), 0 4px 6px -2px rgba(16, 24, 40, 0.03)',
    xl: '0 20px 24px -4px rgba(16, 24, 40, 0.08), 0 8px 8px -4px rgba(16, 24, 40, 0.03)',
  },
  radii: {
    none: '0',
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
    full: '9999px',
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'medium',
        borderRadius: 'md',
        _focus: {
          boxShadow: '0 0 0 3px rgba(78, 106, 241, 0.25)',
        },
      },
      variants: {
        solid: {
          bg: 'brand.500',
          color: 'white',
          _hover: {
            bg: 'brand.600',
            transform: 'translateY(-1px)',
            boxShadow: 'md',
          },
          _active: {
            bg: 'brand.700',
            transform: 'translateY(0)',
            boxShadow: 'sm',
          },
        },
        outline: {
          borderColor: 'brand.500',
          color: 'brand.500',
          _hover: {
            bg: 'brand.50',
            transform: 'translateY(-1px)',
          },
        },
        ghost: {
          color: 'gray.700',
          _hover: {
            bg: 'gray.100',
            transform: 'translateY(-1px)',
          },
        },
        secondary: {
          bg: 'accent.500',
          color: 'white',
          _hover: {
            bg: 'accent.600',
            transform: 'translateY(-1px)',
            boxShadow: 'md',
          },
        },
      },
    },
    Card: {
      baseStyle: {
        container: {
          bg: 'white',
          borderRadius: 'lg',
          boxShadow: 'sm',
          overflow: 'hidden',
          transition: 'all 0.2s ease',
          _hover: {
            boxShadow: 'md',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    Heading: {
      baseStyle: {
        fontWeight: 'semibold',
        color: 'gray.900',
      },
    },
  },
  styles: {
    global: {
      body: {
        bg: 'gray.50',
        color: 'gray.800',
      },
      a: {
        color: 'brand.500',
        _hover: {
          textDecoration: 'none',
          color: 'brand.600',
        },
      },
      'input:focus, select:focus, textarea:focus': {
        borderColor: 'brand.500',
        boxShadow: '0 0 0 1px rgba(78, 106, 241, 0.4)',
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
              <Route 
                path="/calendar" 
                element={
                  <PrivateRoute>
                    <TaskCalendar />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/categories" 
                element={
                  <PrivateRoute>
                    <Categories />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/reports" 
                element={
                  <PrivateRoute>
                    <Reports />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/settings" 
                element={
                  <PrivateRoute>
                    <Settings />
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