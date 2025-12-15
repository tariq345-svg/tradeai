import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

// Create axios instance with default config
const client = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // This is crucial for sending cookies
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor
client.interceptors.request.use(
  (config) => {
    // All requests will automatically include cookies
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh the token
        await client.post('/auth/refresh-token');
        
        // Retry the original request
        return client(originalRequest);
      } catch (error) {
        // If refresh fails, clear any existing auth state
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    }
    
    // If it's a 401 and we've already tried to refresh, or it's another error
    if (error.response?.status === 401) {
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Helper function to handle API errors
const handleApiError = (error) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.error('API Error:', {
      status: error.response.status,
      data: error.response.data,
      headers: error.response.headers,
    });
  } else if (error.request) {
    // The request was made but no response was received
    console.error('No response received:', error.request);
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error('Request setup error:', error.message);
  }
  
  return Promise.reject(error);
};

// Auth API
export const register = async (userData) => {
  try {
    const response = await client.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const login = async (credentials) => {
  try {
    const response = await client.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await client.get('/auth/logout');
    // Redirect to login page after successful logout
    window.location.href = '/login';
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

// Stats API
export const getStats = async () => {
  try {
    const response = await client.get('/stats');
    return response.data.data; // Return the data object from the response
  } catch (error) {
    console.error('Error fetching stats:', error);
    throw error;
  }
};

// Trades API
export const getTrades = async (params = {}) => {
  try {
    const response = await client.get('/trades', { params });
    return response.data.data; // Return the data array from the response
  } catch (error) {
    console.error('Error fetching trades:', error);
    throw error;
  }
};

// Trade Operations
export const updateTrade = async (id, tradeData) => {
  try {
    const response = await client.put(`/trades/${id}`, tradeData);
    return response.data;
  } catch (error) {
    console.error('Error updating trade:', error);
    throw error;
  }
};

// Calendar API
export const getCalendar = async (month) => {
  try {
    const response = await client.get('/trades/calendar', { 
      params: { month } 
    });
    return response.data.data; // Return the data object from the response
  } catch (error) {
    console.error('Error fetching calendar data:', error);
    throw error;
  }
};


export default client;
