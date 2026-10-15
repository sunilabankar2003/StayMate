const express = require('express');
const router = express.Router();
const {
  getMessServices,
  getMessServiceById,
  createMessService,
  updateMessService,
  deleteMessService,
} = require('../controllers/messController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');
const upload = require('../middleware/upload');

router.get('/', getMessServices);
router.get('/:id', getMessServiceById);

router.post(
  '/',
  protect,
  authorize('admin', 'owner'),
  upload.array('images', 5),
  createMessService
);
router.put(
  '/:id',
  protect,
  authorize('admin', 'owner'),
  upload.array('images', 5),
  updateMessService
);
router.delete('/:id', protect, authorize('admin', 'owner'), deleteMessService);

module.exports = router;
