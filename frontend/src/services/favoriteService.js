import api from './api';

export const favoriteService = {
  getFavorites: async () => {
    return await api.get('/favorites');
  },

  addFavorite: async (propertyId) => {
    return await api.post(`/favorites/${propertyId}`);
  },

  removeFavorite: async (propertyId) => {
    return await api.delete(`/favorites/${propertyId}`);
  },

  checkFavorite: async (propertyId) => {
    return await api.get(`/favorites/check/${propertyId}`);
  },
};
