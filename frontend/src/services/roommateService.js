import api from './api';

export const roommateService = {
  getRoommates: async (params = {}) => {
    return await api.get('/roommates', { params });
  },

  getRoommateProfile: async (id) => {
    return await api.get(`/roommates/${id}`);
  },

  sendConnectionRequest: async (id, message) => {
    return await api.post(`/roommates/${id}/connect`, { message });
  },

  getMyConnectionRequests: async () => {
    return await api.get('/roommates/connections/all');
  },

  respondToConnectionRequest: async (id, status) => {
    return await api.put(`/roommates/connections/${id}`, { status });
  },
};
