import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'student' | 'alumni' | 'admin';
  isVerified?: boolean;
  isActive?: boolean;
}

// API Response Types
interface AuthResponse {
  data: {
    token: string;
    refreshToken: string;
    user: User;
  };
  message: string;
  success: boolean;
}

interface UserResponse {
  data: User;
  message: string;
  success: boolean;
}

interface TokenResponse {
  data: {
    token: string;
  };
  message: string;
  success: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<User | undefined>;
  signup: (userData: any) => Promise<User | undefined>;
  logout: () => void;
  refreshToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,
  login: async () => undefined,
  signup: async () => undefined,
  logout: () => {},
  refreshToken: async () => false
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

// Configure axios defaults
axios.defaults.baseURL = 'http://localhost:5000';
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.withCredentials = true;

// Add request interceptor for debugging
axios.interceptors.request.use(
  (config) => {
    console.log('Making request:', {
      url: config.url,
      method: config.method,
      headers: config.headers,
      data: config.data
    });
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
axios.interceptors.response.use(
  (response) => {
    console.log('Received response:', {
      status: response.status,
      data: response.data,
      headers: response.headers
    });
    return response;
  },
  (error) => {
    console.error('Response error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    return Promise.reject(error);
  }
);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [refreshTokenValue, setRefreshToken] = useState<string | null>(localStorage.getItem('refreshToken'));
  const [loading, setLoading] = useState(true);
  
  const isAuthenticated = !!token && !!user;

  // Load user on initial render or when token changes
  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get<UserResponse>('/api/auth/me');
        setUser(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load user', error);
        // Try to refresh the token if current one is invalid
        const refreshed = await refreshToken();
        if (!refreshed) {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          setToken(null);
          setRefreshToken(null);
          setUser(null);
        }
        setLoading(false);
      }
    };

    loadUser();
  }, [token]);

  const login = async (email: string, password: string): Promise<User | undefined> => {
    setLoading(true);
    try {
      const response = await axios.post<AuthResponse>('/api/auth/login', { email, password });
      const { token, refreshToken, user } = response.data.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      
      setToken(token);
      setRefreshToken(refreshToken);
      setUser(user);
      setLoading(false);
      
      return user;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const signup = async (userData: any): Promise<User | undefined> => {
    setLoading(true);
    try {
      console.log('Attempting signup with data:', JSON.stringify(userData));
      
      // Make sure axios has the base URL configured
      let baseURL = '';
      if (!axios.defaults.baseURL) {
        baseURL = 'http://localhost:5000'; // Default server URL
        console.log('Setting base URL:', baseURL);
        axios.defaults.baseURL = baseURL;
      }
      
      // Log the full URL for debugging
      const fullURL = `${axios.defaults.baseURL || ''}/api/auth/signup`;
      console.log('Making signup request to:', fullURL);
      
      const response = await axios.post<AuthResponse>(
        '/api/auth/signup', 
        userData,
        { 
          headers: { 'Content-Type': 'application/json' },
          timeout: 10000 // 10 second timeout
        }
      );
      
      console.log('Signup response:', response.data);
      
      const { token, refreshToken, user } = response.data.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      
      setToken(token);
      setRefreshToken(refreshToken);
      setUser(user);
      setLoading(false);
      
      return user;
    } catch (error: any) {
      setLoading(false);
      
      // Enhanced error logging for debugging
      console.error('Signup failed with error:', error);
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        console.error('Error response headers:', error.response.headers);
        
        // Rethrow with more specific message from the server if available
        if (error.response.data && error.response.data.message) {
          throw new Error(error.response.data.message);
        }
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
        throw new Error('No response from server. Please check your connection and try again.');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error setting up request:', error.message);
      }
      
      // If we got here without a more specific error, just rethrow the original
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    setToken(null);
    setRefreshToken(null);
    setUser(null);
  };

  const refreshToken = async (): Promise<boolean> => {
    if (!refreshTokenValue) return false;
    
    try {
      const response = await axios.post<TokenResponse>('/api/auth/refresh-token', {
        refreshToken: refreshTokenValue
      });
      
      const newToken = response.data.data.token;
      localStorage.setItem('token', newToken);
      setToken(newToken);
      
      return true;
    } catch (error) {
      console.error('Failed to refresh token', error);
      return false;
    }
  };

  const value = {
    user,
    token,
    isAuthenticated,
    loading,
    login,
    signup,
    logout,
    refreshToken
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext; 