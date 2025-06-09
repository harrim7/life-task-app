import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

interface User {
  _id: string;
  name: string;
  email: string;
  preferences?: {
    theme?: string;
    reminderFrequency?: string;
    notificationMethods?: {
      email?: boolean;
      push?: boolean;
    };
  };
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUserPreferences: (preferences: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!token);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const response = await fetch('/api/auth/me', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            localStorage.removeItem('token');
            setToken(null);
            setIsAuthenticated(false);
            throw new Error('Session expired, please login again');
          }

          const userData = await response.json();
          setUser(userData);
          setIsAuthenticated(true);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to authenticate');
          setUser(null);
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data.user);
      setIsAuthenticated(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Registration failed');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data.user);
      setIsAuthenticated(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUserPreferences = async (preferences: any) => {
    if (!user) throw new Error('Not authenticated');
    
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/auth/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ preferences }),
      });

      if (!response.ok) {
        throw new Error('Failed to update preferences');
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update preferences');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // For demo purposes, we'll add a mock login since we don't have a real auth backend yet
  const mockLogin = () => {
    const mockUser: User = {
      _id: '64f78d9e1d41c82b3d6c80a1',
      name: 'Demo User',
      email: 'demo@example.com',
      preferences: {
        theme: 'light',
        reminderFrequency: 'daily',
        notificationMethods: {
          email: true,
          push: false
        }
      }
    };
    
    const mockToken = 'mock-token-12345';
    localStorage.setItem('token', mockToken);
    setToken(mockToken);
    setUser(mockUser);
    setIsAuthenticated(true);
    setLoading(false);
  };

  // Initialize with mock user for demo
  useEffect(() => {
    // In a real app, we'd check for a token and validate it
    // For demo, we'll just set a mock user
    if (!user && !loading) {
      mockLogin();
    }
  }, [user, loading]);

  const value = {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
    updateUserPreferences,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
