import api from './api';

export const chatService = {
  getConversations: async () => {
    return await api.get('/chat/conversations');
  },

  getOrCreateConversation: async (receiverId, propertyId = null) => {
    return await api.post('/chat/conversations', { receiverId, propertyId });
  },

  getMessages: async (conversationId) => {
    return await api.get(`/chat/conversations/${conversationId}/messages`);
  },

  sendMessage: async (conversationId, content) => {
    return await api.post('/chat/messages', { conversationId, content });
  },
};
