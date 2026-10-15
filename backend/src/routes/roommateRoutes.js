const express = require('express');
const router = express.Router();
const {
  getRoommates,
  getRoommateProfile,
  sendConnectionRequest,
  getMyConnectionRequests,
  respondToConnectionRequest,
} = require('../controllers/roommateController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getRoommates);
router.get('/connections/all', protect, getMyConnectionRequests);
router.get('/:id', protect, getRoommateProfile);
router.post('/:id/connect', protect, sendConnectionRequest);
router.put('/connections/:id', protect, respondToConnectionRequest);

module.exports = router;
