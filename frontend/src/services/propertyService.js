import api from './api';

export const propertyService = {
  getProperties: async (params = {}) => {
    return await api.get('/properties', { params });
  },

  getPropertyById: async (id) => {
    return await api.get(`/properties/${id}`);
  },

  createProperty: async (formData) => {
    return await api.post('/properties', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  updateProperty: async (id, formData) => {
    return await api.put(`/properties/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  deleteProperty: async (id) => {
    return await api.delete(`/properties/${id}`);
  },

  toggleAvailability: async (id) => {
    return await api.patch(`/properties/${id}/availability`);
  },

  getMyProperties: async () => {
    return await api.get('/properties/owner/me');
  },

  getOwnerStats: async () => {
    return await api.get('/properties/owner/stats');
  },
};
