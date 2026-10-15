const User = require('../models/User');

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      phone: req.body.phone,
      bio: req.body.bio,
      gender: req.body.gender,
      occupation: req.body.occupation,
      collegeOrCompany: req.body.collegeOrCompany,
      budgetMin: req.body.budgetMin !== undefined ? Number(req.body.budgetMin) : undefined,
      budgetMax: req.body.budgetMax !== undefined ? Number(req.body.budgetMax) : undefined,
      preferredCity: req.body.preferredCity,
      preferredLocality: req.body.preferredLocality,
      preferredAccommodationType: req.body.preferredAccommodationType,
    };

    if (req.body.roommatePreferences) {
      fieldsToUpdate.roommatePreferences = {
        cleanliness: req.body.roommatePreferences.cleanliness || 'moderate',
        foodHabit: req.body.roommatePreferences.foodHabit || 'any',
        smoking: req.body.roommatePreferences.smoking || 'non_smoker',
        sleepSchedule: req.body.roommatePreferences.sleepSchedule || 'flexible',
        studyWorkRoutine: req.body.roommatePreferences.studyWorkRoutine || 'moderate',
        preferredGender: req.body.roommatePreferences.preferredGender || 'any',
        moveInDate: req.body.roommatePreferences.moveInDate || undefined,
      };
    }

    // Clean undefined fields
    Object.keys(fieldsToUpdate).forEach((key) => {
      if (fieldsToUpdate[key] === undefined) {
        delete fieldsToUpdate[key];
      }
    });

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Upload avatar / profile image
// @route   POST /api/users/avatar
// @access  Private
exports.uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image file',
      });
    }

    const avatarUrl = `/uploads/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profileImage: avatarUrl },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Profile image updated successfully',
      data: {
        profileImage: user.profileImage,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get user public profile
// @route   GET /api/users/:id/public
// @access  Private
exports.getUserPublicProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select(
      'name profileImage occupation bio gender collegeOrCompany budgetMin budgetMax preferredCity preferredLocality preferredAccommodationType roommatePreferences createdAt'
    );

    if (!user || user.isSuspended) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found',
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(err);
  }
};
