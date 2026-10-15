import api from './api';

export const reportService = {
  createReport: async (reportData) => {
    return await api.post('/reports', reportData);
  },

  getMyReports: async () => {
    return await api.get('/reports/me');
  },
};
