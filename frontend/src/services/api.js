import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to inject JWT token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('portfolio_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for friendly error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Optional: Clear token if expired
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        localStorage.removeItem('portfolio_token');
        localStorage.removeItem('portfolio_user');
      }
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
  changePassword: (data) => api.put('/auth/change-password', data),
};

// Profile endpoints
export const profileAPI = {
  getProfile: () => api.get('/profile'),
  updateProfile: (data) => api.put('/profile', data),
};

// Projects endpoints
export const projectAPI = {
  getAll: (params) => api.get('/projects', { params }),
  getOne: (idOrSlug) => api.get(`/projects/${idOrSlug}`),
  create: (data) => api.post('/projects', data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
};

// Skills endpoints
export const skillAPI = {
  getAll: (params) => api.get('/skills', { params }),
  create: (data) => api.post('/skills', data),
  update: (id, data) => api.put(`/skills/${id}`, data),
  delete: (id) => api.delete(`/skills/${id}`),
};

// Experience & Education endpoints
export const experienceAPI = {
  getAll: (params) => api.get('/experience', { params }),
  create: (data) => api.post('/experience', data),
  update: (id, data) => api.put(`/experience/${id}`, data),
  delete: (id) => api.delete(`/experience/${id}`),
};

// Certificate endpoints
export const certificateAPI = {
  getAll: () => api.get('/certificates'),
  create: (data) => api.post('/certificates', data),
  update: (id, data) => api.put(`/certificates/${id}`, data),
  delete: (id) => api.delete(`/certificates/${id}`),
};

// Messages endpoints
export const messageAPI = {
  send: (data) => api.post('/messages', data),
  getAll: () => api.get('/messages'),
  toggleRead: (id, read) => api.put(`/messages/${id}/read`, { read }),
  delete: (id) => api.delete(`/messages/${id}`),
};

// Media endpoints
export const mediaAPI = {
  getAll: (params) => api.get('/media', { params }),
  create: (data) => api.post('/media', data),
  delete: (id) => api.delete(`/media/${id}`),
};

// Image Upload endpoint (ImgBB / Cloudinary / Base64 fallback)
export const uploadAPI = {
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export default api;
