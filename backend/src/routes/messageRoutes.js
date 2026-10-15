const express = require('express');

const {
  sendMessage,
  getConversation,
  markMessagesAsRead,
  getUnreadCount,
} = require('../controllers/messageController');

const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

// Unread count
router.get('/unread-count', authenticate, getUnreadCount);

// Conversation
router.get(
  '/conversation/:userId',
  authenticate,
  getConversation
);

// Send message
router.post(
  '/:receiverId',
  authenticate,
  sendMessage
);

// Mark messages as read
router.put(
  '/read/:userId',
  authenticate,
  markMessagesAsRead
);

module.exports = router;