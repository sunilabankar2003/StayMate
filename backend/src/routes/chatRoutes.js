const express = require('express');
const router = express.Router();
const {
  getConversations,
  getOrCreateConversation,
  getMessages,
  sendMessage,
} = require('../controllers/chatController');
const { protect } = require('../middleware/auth');

router.get('/conversations', protect, getConversations);
router.post('/conversations', protect, getOrCreateConversation);
router.get('/conversations/:conversationId/messages', protect, getMessages);
router.post('/messages', protect, sendMessage);

module.exports = router;
