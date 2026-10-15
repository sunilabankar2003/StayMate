const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

const setupChatSocket = (io) => {
  // Socket.IO authentication middleware
  io.use(async (socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.split(' ')[1] ||
        (socket.handshake.headers?.cookie &&
          socket.handshake.headers.cookie
            .split(';')
            .find((c) => c.trim().startsWith('token='))
            ?.split('=')[1]);

      if (!token) {
        return next(new Error('Authentication error: Token required'));
      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'staymate_super_secret_jwt_key_2026_mca_project'
      );

      const user = await User.findById(decoded.id);
      if (!user || user.isSuspended) {
        return next(new Error('Authentication error: User invalid or suspended'));
      }

      socket.user = user;
      next();
    } catch (err) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.user._id.toString();
    console.log(`Socket connected: User ${socket.user.name} (${userId})`);

    // Join personal user room for private notifications
    socket.join(`user:${userId}`);

    // Join a specific conversation room
    socket.on('join_conversation', async (conversationId) => {
      try {
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
          return socket.emit('error', { message: 'Conversation not found' });
        }

        const isParticipant = conversation.participants.some(
          (p) => p.toString() === userId
        );

        if (!isParticipant) {
          return socket.emit('error', {
            message: 'Unauthorized: You are not a participant in this conversation',
          });
        }

        socket.join(`conversation:${conversationId}`);
        console.log(`User ${socket.user.name} joined conversation room: ${conversationId}`);
      } catch (err) {
        socket.emit('error', { message: 'Failed to join conversation room' });
      }
    });

    // Leave a conversation room
    socket.on('leave_conversation', (conversationId) => {
      socket.leave(`conversation:${conversationId}`);
    });

    // Handle typing indicators
    socket.on('typing', ({ conversationId }) => {
      socket.to(`conversation:${conversationId}`).emit('user_typing', {
        userId,
        userName: socket.user.name,
      });
    });

    socket.on('stop_typing', ({ conversationId }) => {
      socket.to(`conversation:${conversationId}`).emit('user_stop_typing', {
        userId,
      });
    });

    // Handle sending message via Socket
    socket.on('send_message', async (data) => {
      try {
        const { conversationId, content } = data;
        if (!conversationId || !content || !content.trim()) return;

        const conversation = await Conversation.findById(conversationId);
        if (!conversation) return;

        const isParticipant = conversation.participants.some(
          (p) => p.toString() === userId
        );
        if (!isParticipant) return;

        const receiverId = conversation.participants.find(
          (p) => p.toString() !== userId
        );

        const message = await Message.create({
          conversation: conversationId,
          sender: userId,
          receiver: receiverId,
          content: content.trim(),
        });

        conversation.lastMessage = message._id;
        conversation.lastMessageAt = new Date();
        await conversation.save();

        await message.populate('sender', 'name profileImage');

        // Broadcast to everyone in conversation room
        io.to(`conversation:${conversationId}`).emit('new_message', message);

        // Send unread notification to receiver's personal room
        io.to(`user:${receiverId}`).emit('unread_message_notification', {
          conversationId,
          senderName: socket.user.name,
          content: message.content,
        });
      } catch (err) {
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: User ${socket.user.name}`);
    });
  });
};

module.exports = setupChatSocket;
