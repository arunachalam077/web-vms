import axios from 'axios';

const API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3001/api'
  : 'http://192.168.1.61:3001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor for logging
api.interceptors.request.use((config) => {
  console.log('API Request:', {
    url: config.url,
    method: config.method,
    data: config.data,
    headers: config.headers
  });
  return config;
});

// Add response interceptor for logging
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    return Promise.reject(error);
  }
);

// Add token to requests if it exists, but skip for visitor endpoints
api.interceptors.request.use((config) => {
  // Skip authentication for visitor endpoints
  if (config.url?.includes('/visitors/register') || config.url?.includes('/visitors/checkout')) {
    return config;
  }

  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/users/login', { email, password });
    return {
      token: response.data.token,
      user: {
        fullName: response.data.name,
        email: response.data.email
      }
    };
  },

  signup: async (fullName: string, email: string, password: string) => {
    const response = await api.post('/users/register', { fullName, email, password });
    return {
      token: response.data.token,
      user: {
        fullName: response.data.name,
        email: response.data.email
      }
    };
  },

  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
  },
};

export default api; 