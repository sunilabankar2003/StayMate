const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const User = require('../models/User');

// @desc    Get user's conversations
// @route   GET /api/chat/conversations
// @access  Private
exports.getConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user.id,
    })
      .populate('participants', 'name email phone profileImage occupation role')
      .populate('property', 'title address locality city images monthlyRent')
      .populate('lastMessage')
      .sort({ lastMessageAt: -1 });

    res.status(200).json({
      success: true,
      count: conversations.length,
      data: conversations,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get or create conversation with another user
// @route   POST /api/chat/conversations
// @access  Private
exports.getOrCreateConversation = async (req, res, next) => {
  try {
    const { receiverId, propertyId } = req.body;

    if (!receiverId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide receiver ID',
      });
    }

    if (receiverId === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot start conversation with yourself',
      });
    }

    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Search query for existing conversation
    const query = {
      participants: { $all: [req.user.id, receiverId], $size: 2 },
    };
    if (propertyId) {
      query.property = propertyId;
    }

    let conversation = await Conversation.findOne(query)
      .populate('participants', 'name email phone profileImage occupation role')
      .populate('property', 'title address locality city images monthlyRent')
      .populate('lastMessage');

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [req.user.id, receiverId],
        property: propertyId || null,
        lastMessageAt: new Date(),
      });

      conversation = await Conversation.findById(conversation._id)
        .populate('participants', 'name email phone profileImage occupation role')
        .populate('property', 'title address locality city images monthlyRent');
    }

    res.status(200).json({
      success: true,
      data: conversation,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get messages for a conversation
// @route   GET /api/chat/conversations/:conversationId/messages
// @access  Private
exports.getMessages = async (req, res, next) => {
  try {
    const { conversationId } = req.params;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found',
      });
    }

    // Verify user is a participant
    const isParticipant = conversation.participants.some(
      (p) => p.toString() === req.user.id
    );

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view messages in this conversation',
      });
    }

    const messages = await Message.find({ conversation: conversationId })
      .populate('sender', 'name profileImage')
      .sort({ createdAt: 1 });

    // Mark unread messages as read
    await Message.updateMany(
      {
        conversation: conversationId,
        receiver: req.user.id,
        read: false,
      },
      { read: true }
    );

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Send a message in a conversation
// @route   POST /api/chat/messages
// @access  Private
exports.sendMessage = async (req, res, next) => {
  try {
    const { conversationId, content } = req.body;

    if (!conversationId || !content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide conversation ID and message content',
      });
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found',
      });
    }

    // Verify user is a participant
    const isParticipant = conversation.participants.some(
      (p) => p.toString() === req.user.id
    );

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'You are not a participant in this conversation',
      });
    }

    // Determine receiver
    const receiverId = conversation.participants.find(
      (p) => p.toString() !== req.user.id
    );

    const message = await Message.create({
      conversation: conversationId,
      sender: req.user.id,
      receiver: receiverId,
      content: content.trim(),
    });

    // Update conversation lastMessage
    conversation.lastMessage = message._id;
    conversation.lastMessageAt = new Date();
    await conversation.save();

    await message.populate('sender', 'name profileImage');

    // Emit Socket.IO message if io instance exists on req.app
    const io = req.app.get('io');
    if (io) {
      io.to(`conversation:${conversationId}`).emit('new_message', message);
      io.to(`user:${receiverId}`).emit('unread_message_notification', {
        conversationId,
        senderName: req.user.name,
        content: message.content,
      });
    }

    res.status(201).json({
      success: true,
      data: message,
    });
  } catch (err) {
    next(err);
  }
};
