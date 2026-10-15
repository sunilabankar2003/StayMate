const express = require('express');
const router = express.Router();
const {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  toggleAvailability,
  getMyProperties,
  getOwnerStats,
} = require('../controllers/propertyController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');
const upload = require('../middleware/upload');

// Owner specific routes (must be before :id)
router.get('/owner/me', protect, authorize('owner', 'admin'), getMyProperties);
router.get('/owner/stats', protect, authorize('owner', 'admin'), getOwnerStats);

// Public listings
router.get('/', getProperties);
router.get('/:id', getPropertyById);

// Owner/Admin CRUD
router.post(
  '/',
  protect,
  authorize('owner', 'admin'),
  upload.array('images', 8),
  createProperty
);
router.put(
  '/:id',
  protect,
  authorize('owner', 'admin'),
  upload.array('images', 8),
  updateProperty
);
router.delete('/:id', protect, authorize('owner', 'admin'), deleteProperty);
router.patch(
  '/:id/availability',
  protect,
  authorize('owner', 'admin'),
  toggleAvailability
);

module.exports = router;
