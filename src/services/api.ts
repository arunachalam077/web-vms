import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
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