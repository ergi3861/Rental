import axios from 'axios';

const API = axios.create({
  baseURL: 'http://rentalbackend.railway.app/api',
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    const isAuthRoute = config.url.includes('/auth/login') || config.url.includes('/auth/signup');

    if (token && !isAuthRoute) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;
