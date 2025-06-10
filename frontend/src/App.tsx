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
import LandingPage from './pages/LandingPage';

// Context
import { AuthProvider, useAuth } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';

// Theme
const theme = extendTheme({
  colors: {
    brand: {
      50: '#fcf9f0',
      100: '#f8f0d9',
      200: '#f3e6c2',
      300: '#e8d7a6',
      400: '#d6c189',
      500: '#c3a55c', // Primary muted gold
      600: '#b08e4a',
      700: '#9a7a3c',
      800: '#7d622f',
      900: '#5c4823',
    },
    accent: {
      50: '#fdf8f2',
      100: '#f9ecdd',
      200: '#f2dcc1',
      300: '#e7c8a0',
      400: '#d5ae7d',
      500: '#c2975a', // Bronze color
      600: '#ad834c',
      700: '#916c3e',
      800: '#725430',
      900: '#543d23',
    },
    yellow: {
      50: '#fffee0',
      100: '#fffdc7',
      200: '#fffaad',
      300: '#fff794',
      400: '#fff47a',
      500: '#ffe600', // Bright yellow
      600: '#e6cf00',
      700: '#ccb800',
      800: '#b3a100',
      900: '#998a00',
    },
    lime: {
      50: '#faffd9',
      100: '#f8ffbf',
      200: '#f6ffa5',
      300: '#f5ff8c',
      400: '#f3ff72',
      500: '#f2ff26', // Lime yellow
      600: '#d9e621',
      700: '#c0cc1d',
      800: '#a8b319',
      900: '#8f9914',
    },
    gray: {
      50: '#f7f7f7',
      100: '#eeeeee',
      200: '#e2e2e2',
      300: '#d0d0d0',
      400: '#ababab',
      500: '#8a8a8a',
      600: '#636363',
      700: '#505050',
      800: '#323232',
      900: '#121212',
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
        color: 'gray.800',
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
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Router>
        </TaskProvider>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default App;