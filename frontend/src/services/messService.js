import api from './api';

export const messService = {
  getMessServices: async (params = {}) => {
    return await api.get('/mess', { params });
  },

  getMessServiceById: async (id) => {
    return await api.get(`/mess/${id}`);
  },

  createMessService: async (formData) => {
    return await api.post('/mess', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  updateMessService: async (id, formData) => {
    return await api.put(`/mess/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  deleteMessService: async (id) => {
    return await api.delete(`/mess/${id}`);
  },
};
