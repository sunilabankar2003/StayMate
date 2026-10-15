const User = require('../models/User');
const Property = require('../models/Property');
const MessService = require('../models/MessService');
const Report = require('../models/Report');
const Review = require('../models/Review');

// @desc    Get admin platform analytics & stats
// @route   GET /api/admin/stats
// @access  Private (Admin)
exports.getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalOwners = await User.countDocuments({ role: 'owner' });

    const totalProperties = await Property.countDocuments();
    const approvedProperties = await Property.countDocuments({ verificationStatus: 'approved' });
    const pendingProperties = await Property.countDocuments({ verificationStatus: 'pending' });
    const rejectedProperties = await Property.countDocuments({ verificationStatus: 'rejected' });

    const totalMessListings = await MessService.countDocuments();
    const pendingReports = await Report.countDocuments({ status: 'pending' });
    const totalReviews = await Review.countDocuments();

    // Recent properties
    const recentProperties = await Property.find()
      .populate('owner', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    // Recent reports
    const recentReports = await Report.find()
      .populate('reporter', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalStudents,
        totalOwners,
        totalProperties,
        approvedProperties,
        pendingProperties,
        rejectedProperties,
        totalMessListings,
        pendingReports,
        totalReviews,
        recentProperties,
        recentReports,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all users with search, filtering & pagination
// @route   GET /api/admin/users
// @access  Private (Admin)
exports.getAllUsers = async (req, res, next) => {
  try {
    const { keyword, role, status, page = 1, limit = 10 } = req.query;

    const query = {};

    if (keyword) {
      query.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { email: { $regex: keyword, $options: 'i' } },
        { phone: { $regex: keyword, $options: 'i' } },
      ];
    }

    if (role && role !== 'All') {
      query.role = role;
    }

    if (status === 'suspended') {
      query.isSuspended = true;
    } else if (status === 'active') {
      query.isSuspended = false;
    }

    const pageNumber = Math.max(1, parseInt(page, 10));
    const pageSize = Math.min(50, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNumber - 1) * pageSize;

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize);

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      totalPages: Math.ceil(total / pageSize),
      currentPage: pageNumber,
      data: users,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Suspend or reactivate user account
// @route   PATCH /api/admin/users/:id/suspend
// @access  Private (Admin)
exports.toggleUserSuspension = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (user.role === 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Cannot suspend administrator accounts',
      });
    }

    user.isSuspended = !user.isSuspended;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User account has been ${user.isSuspended ? 'suspended' : 'reactivated'} successfully`,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isSuspended: user.isSuspended,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all properties for admin management
// @route   GET /api/admin/properties
// @access  Private (Admin)
exports.getAllPropertiesAdmin = async (req, res, next) => {
  try {
    const { status, type, city, keyword, page = 1, limit = 10 } = req.query;

    const query = {};

    if (status && status !== 'All') {
      query.verificationStatus = status;
    }

    if (type && type !== 'All') {
      query.propertyType = type;
    }

    if (city) {
      query.city = { $regex: city.trim(), $options: 'i' };
    }

    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { locality: { $regex: keyword, $options: 'i' } },
      ];
    }

    const pageNumber = Math.max(1, parseInt(page, 10));
    const pageSize = Math.min(50, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNumber - 1) * pageSize;

    const total = await Property.countDocuments(query);
    const properties = await Property.find(query)
      .populate('owner', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize);

    res.status(200).json({
      success: true,
      count: properties.length,
      total,
      totalPages: Math.ceil(total / pageSize),
      currentPage: pageNumber,
      data: properties,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Verify property (Approve or Reject)
// @route   PATCH /api/admin/properties/:id/verify
// @access  Private (Admin)
exports.verifyProperty = async (req, res, next) => {
  try {
    const { status, rejectionReason } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Verification status must be approved or rejected',
      });
    }

    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    property.verificationStatus = status;
    if (status === 'rejected') {
      property.rejectionReason = rejectionReason || 'Listing did not satisfy platform verification guidelines.';
    } else {
      property.rejectionReason = '';
    }

    await property.save();

    res.status(200).json({
      success: true,
      message: `Property listing ${status} successfully`,
      data: property,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all reports
// @route   GET /api/admin/reports
// @access  Private (Admin)
exports.getAllReports = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const query = {};
    if (status && status !== 'All') {
      query.status = status;
    }

    const pageNumber = Math.max(1, parseInt(page, 10));
    const pageSize = Math.min(50, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNumber - 1) * pageSize;

    const total = await Report.countDocuments(query);
    const reports = await Report.find(query)
      .populate('reporter', 'name email role')
      .populate('resolvedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize);

    res.status(200).json({
      success: true,
      count: reports.length,
      total,
      totalPages: Math.ceil(total / pageSize),
      currentPage: pageNumber,
      data: reports,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Resolve or dismiss report
// @route   PATCH /api/admin/reports/:id/resolve
// @access  Private (Admin)
exports.resolveReport = async (req, res, next) => {
  try {
    const { status, resolutionNotes } = req.body;

    if (!['resolved', 'dismissed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be resolved or dismissed',
      });
    }

    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found',
      });
    }

    report.status = status;
    report.resolutionNotes = resolutionNotes || '';
    report.resolvedBy = req.user.id;
    await report.save();

    res.status(200).json({
      success: true,
      message: `Report marked as ${status}`,
      data: report,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all reviews for admin moderation
// @route   GET /api/admin/reviews
// @access  Private (Admin)
exports.getAllReviewsAdmin = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const pageNumber = Math.max(1, parseInt(page, 10));
    const pageSize = Math.min(50, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNumber - 1) * pageSize;

    const total = await Review.countDocuments();
    const reviews = await Review.find()
      .populate('user', 'name email')
      .populate('property', 'title address locality city')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize);

    res.status(200).json({
      success: true,
      count: reviews.length,
      total,
      totalPages: Math.ceil(total / pageSize),
      currentPage: pageNumber,
      data: reviews,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete review (Admin moderation)
// @route   DELETE /api/admin/reviews/:id
// @access  Private (Admin)
exports.deleteReviewAdmin = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    const propertyId = review.property;
    await Review.findByIdAndDelete(req.params.id);
    await Review.calculateAverageRating(propertyId);

    res.status(200).json({
      success: true,
      message: 'Review removed by administrator',
    });
  } catch (err) {
    next(err);
  }
};
