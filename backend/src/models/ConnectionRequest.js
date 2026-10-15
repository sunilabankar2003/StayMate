const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
    message: {
      type: String,
      trim: true,
      maxlength: [500, 'Message cannot exceed 500 characters'],
      default: 'Hi, I would like to connect as a potential roommate!',
    },
  },
  {
    timestamps: true,
  }
);

connectionRequestSchema.index({ sender: 1, receiver: 1 }, { unique: true });
connectionRequestSchema.index({ receiver: 1, status: 1 });

const ConnectionRequest = mongoose.model('ConnectionRequest', connectionRequestSchema);

module.exports = ConnectionRequest;
