import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://resuscanx.onrender.com/api' 
  : 'http://localhost:12001/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  
  register: (name: string, email: string, password: string) =>
    api.post('/auth/register', { name, email, password }),
    
  demoLogin: () => api.get('/auth/demo'),
};

export const analysisAPI = {
  analyze: (formData: FormData) =>
    api.post('/analysis/analyze', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  
  getHistory: () => api.get('/analysis/history'),
  
  getAnalysis: (id: string) => api.get(`/analysis/${id}`),
};

export const chatAPI = {
  sendMessage: (analysisId: string, message: string) =>
    api.post(`/chat/analysis/${analysisId}`, { message }),
};

export const atsAPI = {
  checkATS: (formData: FormData) =>
    api.post('/ats/check', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  
  getTips: () => api.get('/ats/tips'),
};

export default api;