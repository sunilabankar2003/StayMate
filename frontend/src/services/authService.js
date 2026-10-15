import api from './api';

export const authService = {
  login: async (credentials) => {
    const res = await api.post('/auth/login', credentials);
    if (res.token) {
      localStorage.setItem('staymate_token', res.token);
    }
    return res;
  },

  register: async (userData) => {
    const res = await api.post('/auth/register', userData);
    if (res.token) {
      localStorage.setItem('staymate_token', res.token);
    }
    return res;
  },

  getMe: async () => {
    return await api.get('/auth/me');
  },

  logout: async () => {
    localStorage.removeItem('staymate_token');
    return await api.post('/auth/logout');
  },

  updatePassword: async (passwords) => {
    return await api.put('/auth/update-password', passwords);
  },

  updateProfile: async (data) => {
    return await api.put('/users/profile', data);
  },

  uploadAvatar: async (formData) => {
    return await api.post('/users/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};
