const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reportedItemType: {
      type: String,
      required: true,
      enum: ['Property', 'User', 'Review', 'MessService'],
    },
    reportedItemId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'reportedItemType',
    },
    reason: {
      type: String,
      required: [true, 'Please provide a reason for this report'],
      trim: true,
      maxlength: [200, 'Reason cannot exceed 200 characters'],
    },
    details: {
      type: String,
      trim: true,
      maxlength: [1000, 'Details cannot exceed 1000 characters'],
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'resolved', 'dismissed'],
      default: 'pending',
    },
    resolutionNotes: {
      type: String,
      default: '',
    },
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

reportSchema.index({ status: 1, createdAt: -1 });

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
