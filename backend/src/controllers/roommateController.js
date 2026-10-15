const User = require('../models/User');
const ConnectionRequest = require('../models/ConnectionRequest');
const Conversation = require('../models/Conversation');
const { calculateCompatibility } = require('../services/roommateService');

// @desc    Find compatible roommates with normalized score
// @route   GET /api/roommates
// @access  Private
exports.getRoommates = async (req, res, next) => {
  try {
    const {
      city,
      locality,
      maxBudget,
      genderPreference,
      cleanliness,
      foodHabit,
      smoking,
      minCompatibility = 0,
    } = req.query;

    const currentUser = await User.findById(req.user.id);

    // Build filter for potential roommates (students only, not current user, not suspended)
    const query = {
      role: 'student',
      _id: { $ne: currentUser._id },
      isSuspended: false,
    };

    if (city) {
      query.preferredCity = { $regex: city.trim(), $options: 'i' };
    }

    if (locality) {
      query.preferredLocality = { $regex: locality.trim(), $options: 'i' };
    }

    if (maxBudget) {
      query.budgetMin = { $lte: Number(maxBudget) };
    }

    if (genderPreference && genderPreference !== 'any') {
      query.gender = genderPreference;
    }

    if (cleanliness) {
      query['roommatePreferences.cleanliness'] = cleanliness;
    }

    if (foodHabit) {
      query['roommatePreferences.foodHabit'] = foodHabit;
    }

    if (smoking) {
      query['roommatePreferences.smoking'] = smoking;
    }

    const candidates = await User.find(query).select(
      'name profileImage occupation bio gender collegeOrCompany budgetMin budgetMax preferredCity preferredLocality preferredAccommodationType roommatePreferences createdAt'
    );

    // Fetch existing connection requests involving currentUser
    const connectionRequests = await ConnectionRequest.find({
      $or: [{ sender: currentUser._id }, { receiver: currentUser._id }],
    });

    const requestMap = {};
    connectionRequests.forEach((reqDoc) => {
      const otherId =
        reqDoc.sender.toString() === currentUser._id.toString()
          ? reqDoc.receiver.toString()
          : reqDoc.sender.toString();
      requestMap[otherId] = {
        id: reqDoc._id,
        status: reqDoc.status,
        isSender: reqDoc.sender.toString() === currentUser._id.toString(),
      };
    });

    // Score and format each candidate
    const scoredCandidates = candidates
      .map((candidate) => {
        const { compatibility, breakdown } = calculateCompatibility(currentUser, candidate);
        return {
          _id: candidate._id,
          name: candidate.name,
          profileImage: candidate.profileImage,
          occupation: candidate.occupation,
          bio: candidate.bio,
          gender: candidate.gender,
          collegeOrCompany: candidate.collegeOrCompany,
          budgetMin: candidate.budgetMin,
          budgetMax: candidate.budgetMax,
          preferredCity: candidate.preferredCity,
          preferredLocality: candidate.preferredLocality,
          preferredAccommodationType: candidate.preferredAccommodationType,
          roommatePreferences: candidate.roommatePreferences,
          compatibility,
          breakdown,
          connection: requestMap[candidate._id.toString()] || null,
        };
      })
      .filter((c) => c.compatibility >= Number(minCompatibility))
      .sort((a, b) => b.compatibility - a.compatibility);

    res.status(200).json({
      success: true,
      count: scoredCandidates.length,
      data: scoredCandidates,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get detailed roommate profile with compatibility analysis
// @route   GET /api/roommates/:id
// @access  Private
exports.getRoommateProfile = async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.user.id);
    const candidate = await User.findById(req.params.id).select(
      'name profileImage occupation bio gender collegeOrCompany budgetMin budgetMax preferredCity preferredLocality preferredAccommodationType roommatePreferences createdAt isSuspended'
    );

    if (!candidate || candidate.isSuspended) {
      return res.status(404).json({
        success: false,
        message: 'Roommate profile not found or inactive',
      });
    }

    const { compatibility, breakdown } = calculateCompatibility(currentUser, candidate);

    const connection = await ConnectionRequest.findOne({
      $or: [
        { sender: currentUser._id, receiver: candidate._id },
        { sender: candidate._id, receiver: currentUser._id },
      ],
    });

    let connectionInfo = null;
    if (connection) {
      connectionInfo = {
        id: connection._id,
        status: connection.status,
        isSender: connection.sender.toString() === currentUser._id.toString(),
        message: connection.message,
      };
    }

    res.status(200).json({
      success: true,
      data: {
        ...candidate.toObject(),
        compatibility,
        breakdown,
        connection: connectionInfo,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Send connection request to a potential roommate
// @route   POST /api/roommates/:id/connect
// @access  Private
exports.sendConnectionRequest = async (req, res, next) => {
  try {
    const receiverId = req.params.id;

    if (receiverId === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot connect with yourself',
      });
    }

    const receiver = await User.findById(receiverId);
    if (!receiver || receiver.isSuspended) {
      return res.status(404).json({
        success: false,
        message: 'Target user not found',
      });
    }

    // Check if a request already exists between these users
    const existing = await ConnectionRequest.findOne({
      $or: [
        { sender: req.user.id, receiver: receiverId },
        { sender: receiverId, receiver: req.user.id },
      ],
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Connection request already ${existing.status}`,
      });
    }

    const connection = await ConnectionRequest.create({
      sender: req.user.id,
      receiver: receiverId,
      message: req.body.message || 'Hi, I would like to connect as a potential roommate!',
    });

    res.status(201).json({
      success: true,
      message: 'Connection request sent successfully',
      data: connection,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get user's connection requests (incoming & outgoing)
// @route   GET /api/roommates/connections/all
// @access  Private
exports.getMyConnectionRequests = async (req, res, next) => {
  try {
    const received = await ConnectionRequest.find({ receiver: req.user.id })
      .populate('sender', 'name profileImage occupation collegeOrCompany preferredCity')
      .sort({ createdAt: -1 });

    const sent = await ConnectionRequest.find({ sender: req.user.id })
      .populate('receiver', 'name profileImage occupation collegeOrCompany preferredCity')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        received,
        sent,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Accept or reject connection request
// @route   PUT /api/roommates/connections/:id
// @access  Private
exports.respondToConnectionRequest = async (req, res, next) => {
  try {
    const { status } = req.body; // 'accepted' or 'rejected'

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be accepted or rejected',
      });
    }

    const connection = await ConnectionRequest.findById(req.params.id);

    if (!connection) {
      return res.status(404).json({
        success: false,
        message: 'Connection request not found',
      });
    }

    if (connection.receiver.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only respond to requests sent to you',
      });
    }

    connection.status = status;
    await connection.save();

    // If accepted, ensure a Conversation exists so they can chat immediately
    let conversation = null;
    if (status === 'accepted') {
      conversation = await Conversation.findOne({
        participants: { $all: [connection.sender, connection.receiver], $size: 2 },
      });

      if (!conversation) {
        conversation = await Conversation.create({
          participants: [connection.sender, connection.receiver],
        });
      }
    }

    res.status(200).json({
      success: true,
      message: `Connection request ${status}`,
      data: {
        connection,
        conversationId: conversation ? conversation._id : null,
      },
    });
  } catch (err) {
    next(err);
  }
};
