import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle network errors or storage access errors gracefully
    if (!error.response) {
      console.warn('Network error or request blocked:', error.message);
      return Promise.reject(error);
    }
    
    // Don't redirect on 401 for public pages/endpoints
    const publicPaths = ['/', '/services', '/login', '/register', '/privacy-policy', '/terms-of-service', '/refund-policy', '/contact'];
    const isPublicPage = publicPaths.some(path => 
      window.location.pathname === path || window.location.pathname.startsWith('/services/')
    );
    const isPublicEndpoint = error.config?.url?.includes('/auth/me') || 
                             error.config?.url?.includes('/services');
    
    if (error.response?.status === 401 && !isPublicEndpoint && !isPublicPage) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  updatePassword: (data) => api.put('/auth/password', data),
};

// Services API
export const servicesAPI = {
  getAll: (params) => api.get('/services', { params }),
  getById: (id) => api.get(`/services/${id}`),
  getCategories: () => api.get('/services/categories'),
  create: (data) => api.post('/services', data),
  update: (id, data) => api.put(`/services/${id}`, data),
  delete: (id) => api.delete(`/services/${id}`),
};

// Orders API
export const ordersAPI = {
  create: (data) => api.post('/orders', data),
  getAll: (params) => api.get('/orders', { params }),
  getById: (id) => api.get(`/orders/${id}`),
  getAllAdmin: (params) => api.get('/orders/admin/all', { params }),
  getStats: () => api.get('/orders/admin/stats'),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
};

// Wallet API
export const walletAPI = {
  getBalance: () => api.get('/wallet/balance'),
  getHistory: (params) => api.get('/wallet/history', { params }),
  createPaymentOrder: (amount) => api.post('/wallet/add-funds', { amount }),
  verifyPayment: (data) => api.post('/wallet/verify-payment', data),
  adminAddFunds: (data) => api.post('/wallet/admin/add-funds', data),
  getAllTransactions: (params) => api.get('/wallet/admin/transactions', { params }),
};

// Admin API
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: (params) => api.get('/admin/users', { params }),
  getUser: (id) => api.get(`/admin/users/${id}`),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
};

export default api;
