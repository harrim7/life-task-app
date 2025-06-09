import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';

// Pages
import Dashboard from './pages/Dashboard';
import TaskDetail from './pages/TaskDetail';
import CreateTask from './pages/CreateTask';
import Login from './pages/Login';
import Register from './pages/Register';

// Context
import { AuthProvider } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';

// Layout
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';

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

function App() {
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <TaskProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<PrivateRoute><Layout><Dashboard /></Layout></PrivateRoute>} />
              <Route path="/tasks/create" element={<PrivateRoute><Layout><CreateTask /></Layout></PrivateRoute>} />
              <Route path="/tasks/:id" element={<PrivateRoute><Layout><TaskDetail /></Layout></PrivateRoute>} />
            </Routes>
          </Router>
        </TaskProvider>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default App;
