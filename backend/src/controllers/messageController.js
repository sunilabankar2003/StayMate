const Message = require("../models/Message");
const User = require("../models/User");
const { sendError } = require("../utils/apiResponse");

// Send a message
const sendMessage = async (req, res) => {
  try {
    const { receiverId } = req.params;
    const { message } = req.body;

    if (!message || !message.trim()) {
      return sendError(res, 400, "Message cannot be empty");
    }

    if (receiverId === req.user._id.toString()) {
      return sendError(res, 400, "You cannot message yourself");
    }

    const receiver = await User.findById(receiverId);

    if (!receiver) {
      return sendError(res, 404, "Receiver not found");
    }

    const newMessage = await Message.create({
      sender: req.user._id,
      receiver: receiverId,
      message: message.trim(),
    });

    const populatedMessage = await Message.findById(newMessage._id)
      .populate("sender", "name profilePhoto")
      .populate("receiver", "name profilePhoto");

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: populatedMessage,
    });
  } catch (error) {
    console.error("Send message error:", error);
    sendError(res, 500, "Failed to send message");
  }
};

// Get conversation between current user and another user
const getConversation = async (req, res) => {
  try {
    const { userId } = req.params;

    if (userId === req.user._id.toString()) {
      return sendError(res, 400, "Invalid conversation");
    }

    const otherUser = await User.findById(userId);

    if (!otherUser) {
      return sendError(res, 404, "User not found");
    }

    const messages = await Message.find({
      $or: [
        {
          sender: req.user._id,
          receiver: userId,
        },
        {
          sender: userId,
          receiver: req.user._id,
        },
      ],
    })
      .populate("sender", "name profilePhoto")
      .populate("receiver", "name profilePhoto")
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      count: messages.length,
      user: {
        _id: otherUser._id,
        name: otherUser.name,
        profilePhoto: otherUser.profilePhoto,
      },
      messages,
    });
  } catch (error) {
    console.error("Get conversation error:", error);
    sendError(res, 500, "Failed to fetch conversation");
  }
};

// Mark messages as read
const markMessagesAsRead = async (req, res) => {
  try {
    const { userId } = req.params;

    await Message.updateMany(
      {
        sender: userId,
        receiver: req.user._id,
        isRead: false,
      },
      {
        $set: { isRead: true },
      },
    );

    res.status(200).json({
      success: true,
      message: "Messages marked as read",
    });
  } catch (error) {
    console.error("Mark messages read error:", error);
    sendError(res, 500, "Failed to mark messages as read");
  }
};

// Get unread message count
const getUnreadCount = async (req, res) => {
  try {
    const count = await Message.countDocuments({
      receiver: req.user._id,
      isRead: false,
    });

    res.status(200).json({
      success: true,
      count,
    });
  } catch (error) {
    console.error("Unread count error:", error);
    sendError(res, 500, "Failed to get unread message count");
  }
};

module.exports = {
  sendMessage,
  getConversation,
  markMessagesAsRead,
  getUnreadCount,
};
