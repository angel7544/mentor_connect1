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

// Add a retry mechanism for failed requests
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If the error is due to a network issue and hasn't been retried yet
    if (error.message.includes('Network Error') && !originalRequest._retry) {
      console.log('Network error detected, retrying request...');
      originalRequest._retry = true;
      
      // Wait a second before retrying
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return axios(originalRequest);
    }
    
    return Promise.reject(error);
  }
);

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

// Add localStorage persistence for authentication
const getStoredAuthState = () => {
  try {
    const storedAuth = localStorage.getItem('auth');
    if (storedAuth) {
      const parsedAuth = JSON.parse(storedAuth);
      console.log('Retrieved stored auth state:', parsedAuth.isAuthenticated);
      return parsedAuth;
    }
  } catch (error) {
    console.error('Error parsing stored auth state:', error);
    localStorage.removeItem('auth');
  }
  return {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null
  };
};

// Simple auth store
const useAuthStore = create((set) => ({
  // Initial state from localStorage or default values
  ...getStoredAuthState(),

  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      // Validate required fields
      if (!userData.email || !userData.password || !userData.firstName || !userData.lastName) {
        const errorMessage = 'All required fields must be filled in';
        set({ isLoading: false, error: errorMessage });
        return { success: false, error: errorMessage };
      }
      
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

  login: async (loginData: { email: string; password: string } | string, secondParam?: string) => {
    try {
      set({ isLoading: true, error: null });
      
      // Handle both object-style and separate parameter calls
      const email = typeof loginData === 'object' ? loginData.email : loginData;
      const password = typeof loginData === 'object' ? loginData.password : secondParam;
      
      console.log('Logging in with credentials:', JSON.stringify({ email, password }, null, 2));
      
      if (!email || !password) {
        const errorMessage = 'Email and password are required';
        console.error(errorMessage);
        set({ isLoading: false, error: errorMessage });
        return { success: false, error: errorMessage };
      }
      
      // Create a properly formatted payload
      const payload = {
        email,
        password
      };
      
      const response = await axios.post<AuthResponse>('/api/auth/login', payload);
      console.log('Login response:', response.data);
      
      // Extract data from the response
      const { success, data: responseData } = response.data;
      
      if (success && responseData) {
        const { token, refreshToken, user } = responseData;
        
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
        
        set({ 
          user, 
          token, 
          isAuthenticated: true, 
          isLoading: false, 
          error: null 
        });
        
        // Store auth state in localStorage
        localStorage.setItem('auth', JSON.stringify({ 
          user, 
          token, 
          isAuthenticated: true, 
          isLoading: false, 
          error: null 
        }));
        
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
    // Clear localStorage
    localStorage.removeItem('auth');
    
    // Clear state
    set({ 
      user: null, 
      token: null, 
      isAuthenticated: false, 
      isLoading: false 
    });
    
    console.log('User logged out, auth state cleared');
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
        localStorage.removeItem('auth'); // Updated from token removal
        set({ token: null, user: null, isAuthenticated: false });
      }
    }
  }
}));

// Add axios interceptor to handle auth
axios.interceptors.request.use(
  (config) => {
    // Get token from local storage auth object
    let token;
    try {
      const authData = localStorage.getItem('auth');
      if (authData) {
        const parsed = JSON.parse(authData);
        token = parsed.token;
      }
    } catch (e) {
      console.error('Error parsing auth data:', e);
    }
    
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