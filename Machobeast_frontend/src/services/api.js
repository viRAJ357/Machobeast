import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor: Attach JWT Token from localStorage if exists
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('machobeast_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Global Error Handler
API.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred';
    
    // Auto logout if 401 Unauthorized
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('machobeast_token');
      localStorage.removeItem('machobeast_user');
    }

    return Promise.reject(new Error(message));
  }
);

export default API;
