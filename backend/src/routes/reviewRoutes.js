const express = require('express');
const router = express.Router();
const {
  createReview,
  getPropertyReviews,
  getMyReviews,
  updateReview,
  deleteReview,
} = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

router.post('/', protect, createReview);
router.get('/property/:propertyId', getPropertyReviews);
router.get('/me', protect, getMyReviews);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);

module.exports = router;
