const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAllUsers,
  toggleUserSuspension,
  getAllPropertiesAdmin,
  verifyProperty,
  getAllReports,
  resolveReport,
  getAllReviewsAdmin,
  deleteReviewAdmin,
} = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

// All admin routes require protect and admin role
router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.patch('/users/:id/suspend', toggleUserSuspension);
router.get('/properties', getAllPropertiesAdmin);
router.patch('/properties/:id/verify', verifyProperty);
router.get('/reports', getAllReports);
router.patch('/reports/:id/resolve', resolveReport);
router.get('/reviews', getAllReviewsAdmin);
router.delete('/reviews/:id', deleteReviewAdmin);

module.exports = router;
