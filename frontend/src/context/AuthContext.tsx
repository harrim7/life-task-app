import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import axios from 'axios';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  
  // Check if user is logged in when component mounts
  useEffect(() => {
    const checkAuth = async () => {
      const savedToken = localStorage.getItem('token');
      
      if (savedToken) {
        setIsLoading(true);
        try {
          // In a real app, you would verify the token with your backend
          // For this demo, we'll simulate a successful verification
          
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // For demo purposes, create a mock user
          const mockUser = {
            id: '1',
            name: 'Demo User',
            email: 'demo@example.com'
          };
          
          setUser(mockUser);
          setToken(savedToken);
        } catch (error) {
          console.error('Auth error:', error);
          localStorage.removeItem('token');
          setToken(null);
        } finally {
          setIsLoading(false);
        }
      }
      
      setIsInitialized(true);
    };
    
    checkAuth();
  }, []);
  
  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // In a real app, you would call your API
      // For this demo, we'll simulate a successful login for demo@example.com
      
      if (email === 'demo@example.com' || email === 'test@example.com') {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockUser = {
          id: '1',
          name: 'Demo User',
          email: email
        };
        
        const mockToken = 'mock-jwt-token';
        
        setUser(mockUser);
        setToken(mockToken);
        localStorage.setItem('token', mockToken);
        
        return;
      }
      
      // For a real API call it would look something like this:
      // const response = await axios.post('/api/auth/login', { email, password });
      // setUser(response.data.user);
      // setToken(response.data.token);
      // localStorage.setItem('token', response.data.token);
      
      throw new Error('Invalid credentials');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Register function
  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // In a real app, you would call your API
      // For this demo, we'll simulate a successful registration
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For a real API call it would look something like this:
      // const response = await axios.post('/api/auth/register', { name, email, password });
      // setUser(response.data.user);
      // setToken(response.data.token);
      // localStorage.setItem('token', response.data.token);
      
      // Instead, let's just simulate a successful registration
      const mockUser = {
        id: '2',
        name,
        email
      };
      
      const mockToken = 'mock-jwt-token';
      
      setUser(mockUser);
      setToken(mockToken);
      localStorage.setItem('token', mockToken);
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
  };
  
  // Set up axios interceptor for authentication
  useEffect(() => {
    const interceptor = axios.interceptors.request.use(
      config => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      error => Promise.reject(error)
    );
    
    return () => {
      axios.interceptors.request.eject(interceptor);
    };
  }, [token]);
  
  // Context value
  const value = {
    user,
    token,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout
  };
  
  return (
    <AuthContext.Provider value={value}>
      {isInitialized ? children : <div>Loading...</div>}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;