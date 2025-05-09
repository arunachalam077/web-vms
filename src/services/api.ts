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
    const response = await api.post('/users/register', { name: fullName, email, password });
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