import { create } from 'zustand';
import axios from 'axios';
import toast from 'react-hot-toast';

// Define types for the API responses
interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    refreshToken: string;
    user: {
      _id: string;
      email: string;
      firstName: string;
      lastName: string;
      role: string;
      isVerified?: boolean;
      isActive?: boolean;
    }
  }
}

// Set the base URL for all axios requests
axios.defaults.baseURL = 'http://localhost:5000';
console.log('Axios base URL set to:', axios.defaults.baseURL);

// Log all request and response data for debugging
const logNetworkActivity = () => {
  // Request debugging
  axios.interceptors.request.use(
    config => {
      console.log(`🚀 REQUEST: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`, {
        headers: config.headers,
        data: config.data,
        params: config.params
      });
      return config;
    },
    error => {
      console.error('❌ REQUEST ERROR:', error);
      return Promise.reject(error);
    }
  );
  
  // Response debugging
  axios.interceptors.response.use(
    response => {
      console.log(`✅ RESPONSE: ${response.status} ${response.config.url}`, {
        data: response.data,
        headers: response.headers
      });
      return response;
    },
    error => {
      console.error('❌ RESPONSE ERROR:', {
        error: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url,
        method: error.config?.method
      });
      return Promise.reject(error);
    }
  );
};

// Initialize request/response logging
logNetworkActivity();

// Simple auth store
const useAuthStore = create((set) => ({
  token: localStorage.getItem('token'),
  refreshToken: localStorage.getItem('refreshToken'),
  user: null,
  isLoading: false,
  isAuthenticated: !!localStorage.getItem('token'),

  register: async (userData) => {
    set({ isLoading: true });
    try {
      // Log the exact data being sent
      console.log('Registering user with data:', JSON.stringify(userData, null, 2));
      
      // Create a properly formatted payload exactly as the server expects
      const payload = {
        email: userData.email,
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role === 'STUDENT' ? 'student' : 'alumni', // Convert to lowercase as expected by the server
        ...(userData.role === 'ALUMNI' && userData.graduationYear 
          ? { graduationYear: userData.graduationYear } 
          : {})
      };
      
      console.log('Formatted payload for server:', JSON.stringify(payload, null, 2));
      
      // Make sure we're hitting the correct endpoint
      const endpoint = '/api/auth/signup';
      console.log(`Making registration request to: ${axios.defaults.baseURL}${endpoint}`);
      
      // Make the API call with the formatted payload
      const response = await axios.post<AuthResponse>(endpoint, payload, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 10000 // 10s timeout
      }); 
      
      console.log('Registration response structure:', {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        dataKeys: Object.keys(response.data || {})
      });
      
      // Extract data from the response
      const { success, data } = response.data;
      
      if (success && data) {
        const { token, refreshToken, user } = data;
        
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
        
        set({ 
          token, 
          refreshToken,
          user, 
          isAuthenticated: true, 
          isLoading: false 
        });
        
        toast.success('Registration successful!');
        return { success: true };
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      console.error('Registration error:', error);
      
      // More detailed error reporting
      if (error.response) {
        const errorMessage = error.response.data?.message || error.response.data || 'Registration failed';
        console.error('Server error:', {
          status: error.response.status,
          message: errorMessage
        });
        toast.error(errorMessage);
        set({ isLoading: false });
        return { success: false, error: errorMessage };
      } else if (error.request) {
        const errorMessage = 'No response from server. Please check your connection.';
        console.error('No response received:', error.request);
        toast.error(errorMessage);
        set({ isLoading: false });
        return { success: false, error: errorMessage };
      } else {
        const errorMessage = error.message || 'An unexpected error occurred';
        console.error('Error:', errorMessage);
        toast.error(errorMessage);
        set({ isLoading: false });
        return { success: false, error: errorMessage };
      }
    }
  },

  login: async (credentials) => {
    set({ isLoading: true });
    try {
      console.log('Logging in with credentials:', JSON.stringify(credentials, null, 2));
      
      // Create a properly formatted payload
      const payload = {
        email: credentials.email,
        password: credentials.password
      };
      
      const response = await axios.post<AuthResponse>('/api/auth/login', payload);
      console.log('Login response:', response.data);
      
      // Extract data from the response
      const { success, data } = response.data;
      
      if (success && data) {
        const { token, refreshToken, user } = data;
        
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
        
        set({ 
          token, 
          refreshToken,
          user, 
          isAuthenticated: true, 
          isLoading: false 
        });
        
        toast.success('Login successful!');
        return { success: true };
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // More detailed error reporting
      if (error.response) {
        console.error('Server response:', error.response.status, error.response.data);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error setting up request:', error.message);
      }
      
      const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials.';
      toast.error(errorMessage);
      set({ isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    set({ token: null, refreshToken: null, user: null, isAuthenticated: false });
    toast.success('Logged out successfully');
  },

  getProfile: async () => {
    if (!localStorage.getItem('token')) return;
    
    try {
      const response = await axios.get('/api/auth/profile', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      // Use type assertion for the response data
      const data = response.data as { user: any };
      set({ user: data.user });
    } catch (error) {
      console.error('Get profile error:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        set({ token: null, refreshToken: null, user: null, isAuthenticated: false });
      }
    }
  }
}));

// Add axios interceptor to handle auth
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('Axios request:', config.method?.toUpperCase(), config.url, config.data);
    return config;
  },
  (error) => {
    console.error('Axios request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
axios.interceptors.response.use(
  (response) => {
    console.log('Axios response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('Axios response error:', 
      error.response?.status || 'Network Error', 
      error.response?.data || error.message,
      error.config?.url
    );
    return Promise.reject(error);
  }
);

export default useAuthStore; 