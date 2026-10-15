const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      required: [true, 'Please provide a rating between 1 and 5'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    comment: {
      type: String,
      required: [true, 'Please provide a review comment'],
      trim: true,
      maxlength: [1000, 'Comment cannot exceed 1000 characters'],
    },
  },
  {
    timestamps: true,
  }
);

// Prevent user from submitting more than one review per property
reviewSchema.index({ property: 1, user: 1 }, { unique: true });

// Static method to calculate average rating and update Property
reviewSchema.statics.calculateAverageRating = async function (propertyId) {
  const stats = await this.aggregate([
    { $match: { property: propertyId } },
    {
      $group: {
        _id: '$property',
        averageRating: { $avg: '$rating' },
        reviewCount: { $sum: 1 },
      },
    },
  ]);

  const Property = mongoose.model('Property');
  if (stats.length > 0) {
    await Property.findByIdAndUpdate(propertyId, {
      averageRating: Math.round(stats[0].averageRating * 10) / 10,
      reviewCount: stats[0].reviewCount,
    });
  } else {
    await Property.findByIdAndUpdate(propertyId, {
      averageRating: 0,
      reviewCount: 0,
    });
  }
};

// Call calculateAverageRating after save
reviewSchema.post('save', async function () {
  await this.constructor.calculateAverageRating(this.property);
});

// Call calculateAverageRating after delete/remove
reviewSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await doc.constructor.calculateAverageRating(doc.property);
  }
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
