import api from './api';

export const adminService = {
  getDashboardStats: async () => {
    return await api.get('/admin/stats');
  },

  getAllUsers: async (params = {}) => {
    return await api.get('/admin/users', { params });
  },

  toggleUserSuspension: async (id) => {
    return await api.patch(`/admin/users/${id}/suspend`);
  },

  getAllPropertiesAdmin: async (params = {}) => {
    return await api.get('/admin/properties', { params });
  },

  verifyProperty: async (id, status, rejectionReason = '') => {
    return await api.patch(`/admin/properties/${id}/verify`, {
      status,
      rejectionReason,
    });
  },

  getAllReports: async (params = {}) => {
    return await api.get('/admin/reports', { params });
  },

  resolveReport: async (id, status, resolutionNotes = '') => {
    return await api.patch(`/admin/reports/${id}/resolve`, {
      status,
      resolutionNotes,
    });
  },

  getAllReviewsAdmin: async (params = {}) => {
    return await api.get('/admin/reviews', { params });
  },

  deleteReviewAdmin: async (id) => {
    return await api.delete(`/admin/reviews/${id}`);
  },
};
