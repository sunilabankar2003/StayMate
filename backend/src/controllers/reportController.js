const Report = require('../models/Report');

// @desc    Submit a report for suspicious/inappropriate content
// @route   POST /api/reports
// @access  Private
exports.createReport = async (req, res, next) => {
  try {
    const { reportedItemType, reportedItemId, reason, details } = req.body;

    if (!reportedItemType || !reportedItemId || !reason) {
      return res.status(400).json({
        success: false,
        message: 'Please provide reported item type, ID, and reason',
      });
    }

    if (!['Property', 'User', 'Review', 'MessService'].includes(reportedItemType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid item type to report',
      });
    }

    const report = await Report.create({
      reporter: req.user.id,
      reportedItemType,
      reportedItemId,
      reason: reason.trim(),
      details: details ? details.trim() : '',
    });

    res.status(201).json({
      success: true,
      message: 'Report submitted successfully. Our moderators will review it shortly.',
      data: report,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get user's submitted reports
// @route   GET /api/reports/me
// @access  Private
exports.getMyReports = async (req, res, next) => {
  try {
    const reports = await Report.find({ reporter: req.user.id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reports.length,
      data: reports,
    });
  } catch (err) {
    next(err);
  }
};
