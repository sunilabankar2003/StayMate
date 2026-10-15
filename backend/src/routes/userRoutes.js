const express = require('express');
const router = express.Router();
const {
  updateProfile,
  uploadAvatar,
  getUserPublicProfile,
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.put('/profile', protect, updateProfile);
router.post('/avatar', protect, upload.single('avatar'), uploadAvatar);
router.get('/:id/public', protect, getUserPublicProfile);

module.exports = router;
