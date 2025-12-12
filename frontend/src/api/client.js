import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

const client = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Add request interceptor to include token
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh the token
        const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {}, {
          withCredentials: true
        });
        
        const { token } = response.data;
        localStorage.setItem('token', token);
        
        // Retry the original request with new token
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return client(originalRequest);
      } catch (error) {
        // If refresh fails, redirect to login
        localStorage.removeItem('token');
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }
    
    return Promise.reject(error);
  }
);

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
    const { token, user } = response.data;
    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    }
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await client.post('/auth/logout');
  } finally {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
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
