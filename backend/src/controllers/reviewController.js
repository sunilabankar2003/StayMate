const Review = require('../models/Review');
const Property = require('../models/Property');

// @desc    Add review for a property
// @route   POST /api/reviews
// @access  Private (Student)
exports.createReview = async (req, res, next) => {
  try {
    const { propertyId, rating, comment } = req.body;

    if (!propertyId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Please provide property ID, rating (1-5), and review comment',
      });
    }

    const numRating = Number(rating);
    if (numRating < 1 || numRating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5',
      });
    }

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    // Check if user already reviewed this property
    const existingReview = await Review.findOne({
      property: propertyId,
      user: req.user.id,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a review for this property. You can edit your existing review.',
      });
    }

    const review = await Review.create({
      property: propertyId,
      user: req.user.id,
      rating: numRating,
      comment: comment.trim(),
    });

    await review.populate('user', 'name profileImage occupation');

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: review,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all reviews for a property
// @route   GET /api/reviews/property/:propertyId
// @access  Public
exports.getPropertyReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ property: req.params.propertyId })
      .populate('user', 'name profileImage occupation')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get reviews submitted by logged in user
// @route   GET /api/reviews/me
// @access  Private
exports.getMyReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ user: req.user.id })
      .populate('property', 'title address locality city images averageRating')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
exports.updateReview = async (req, res, next) => {
  try {
    let review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to edit this review',
      });
    }

    if (req.body.rating) {
      const r = Number(req.body.rating);
      if (r < 1 || r > 5) {
        return res.status(400).json({
          success: false,
          message: 'Rating must be between 1 and 5',
        });
      }
      review.rating = r;
    }

    if (req.body.comment) {
      review.comment = req.body.comment.trim();
    }

    await review.save();
    await Review.calculateAverageRating(review.property);

    res.status(200).json({
      success: true,
      message: 'Review updated successfully',
      data: review,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review',
      });
    }

    const propertyId = review.property;
    await Review.findByIdAndDelete(req.params.id);
    await Review.calculateAverageRating(propertyId);

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};
