const MessService = require('../models/MessService');

// @desc    Get all mess and tiffin services
// @route   GET /api/mess
// @access  Public
exports.getMessServices = async (req, res, next) => {
  try {
    const {
      keyword,
      city,
      locality,
      foodType,
      maxPrice,
      mealType,
      sort,
      page = 1,
      limit = 9,
    } = req.query;

    const query = {
      isAvailable: true,
      isVerified: true,
    };

    if (keyword) {
      query.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
        { locality: { $regex: keyword, $options: 'i' } },
        { city: { $regex: keyword, $options: 'i' } },
      ];
    }

    if (city) {
      query.city = { $regex: `^${city.trim()}$`, $options: 'i' };
    }

    if (locality) {
      query.locality = { $regex: locality.trim(), $options: 'i' };
    }

    if (foodType && foodType !== 'All') {
      query.foodType = foodType;
    }

    if (maxPrice) {
      query.monthlyPrice = { $lte: Number(maxPrice) };
    }

    if (mealType && mealType !== 'All') {
      query.mealTypes = { $in: [mealType] };
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') {
      sortOption = { monthlyPrice: 1 };
    } else if (sort === 'price_desc') {
      sortOption = { monthlyPrice: -1 };
    } else if (sort === 'rating_desc') {
      sortOption = { averageRating: -1 };
    }

    const pageNumber = Math.max(1, parseInt(page, 10));
    const pageSize = Math.min(50, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNumber - 1) * pageSize;

    const total = await MessService.countDocuments(query);
    const messServices = await MessService.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(pageSize);

    res.status(200).json({
      success: true,
      count: messServices.length,
      total,
      totalPages: Math.ceil(total / pageSize),
      currentPage: pageNumber,
      data: messServices,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single mess service details
// @route   GET /api/mess/:id
// @access  Public
exports.getMessServiceById = async (req, res, next) => {
  try {
    const mess = await MessService.findById(req.params.id);

    if (!mess) {
      return res.status(404).json({
        success: false,
        message: 'Mess service not found',
      });
    }

    res.status(200).json({
      success: true,
      data: mess,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new mess service
// @route   POST /api/mess
// @access  Private (Admin, Owner)
exports.createMessService = async (req, res, next) => {
  try {
    const messData = { ...req.body };
    messData.createdBy = req.user.id;

    if (typeof messData.mealTypes === 'string') {
      try {
        messData.mealTypes = JSON.parse(messData.mealTypes);
      } catch {
        messData.mealTypes = messData.mealTypes.split(',').map((s) => s.trim()).filter(Boolean);
      }
    }

    if (typeof messData.operatingDays === 'string') {
      try {
        messData.operatingDays = JSON.parse(messData.operatingDays);
      } catch {
        messData.operatingDays = messData.operatingDays.split(',').map((s) => s.trim()).filter(Boolean);
      }
    }

    if (typeof messData.mealTimings === 'string') {
      try {
        messData.mealTimings = JSON.parse(messData.mealTimings);
      } catch {
        // default
      }
    }

    if (typeof messData.menu === 'string') {
      try {
        messData.menu = JSON.parse(messData.menu);
      } catch {
        // default
      }
    }

    if (typeof messData.coordinates === 'string') {
      try {
        messData.coordinates = JSON.parse(messData.coordinates);
      } catch {
        messData.coordinates = { lat: 12.9716, lng: 77.5946 };
      }
    }

    if (messData.monthlyPrice) messData.monthlyPrice = Number(messData.monthlyPrice);
    if (messData.dailyPrice) messData.dailyPrice = Number(messData.dailyPrice);

    const images = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        images.push(`/uploads/${file.filename}`);
      });
    }
    if (messData.images && Array.isArray(messData.images)) {
      images.push(...messData.images);
    }
    messData.images = images.length > 0 ? images : ['/uploads/default-mess.jpg'];

    const mess = await MessService.create(messData);

    res.status(201).json({
      success: true,
      message: 'Mess service listing created successfully',
      data: mess,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update mess service
// @route   PUT /api/mess/:id
// @access  Private (Admin, Owner)
exports.updateMessService = async (req, res, next) => {
  try {
    let mess = await MessService.findById(req.params.id);

    if (!mess) {
      return res.status(404).json({
        success: false,
        message: 'Mess service not found',
      });
    }

    if (mess.createdBy && mess.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this mess listing',
      });
    }

    const updateData = { ...req.body };

    if (typeof updateData.mealTypes === 'string') {
      try {
        updateData.mealTypes = JSON.parse(updateData.mealTypes);
      } catch {
        updateData.mealTypes = updateData.mealTypes.split(',').map((s) => s.trim()).filter(Boolean);
      }
    }

    if (typeof updateData.menu === 'string') {
      try {
        updateData.menu = JSON.parse(updateData.menu);
      } catch {
        // keep existing
      }
    }

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((f) => `/uploads/${f.filename}`);
      updateData.images = [...(mess.images || []), ...newImages];
    }

    mess = await MessService.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Mess service updated successfully',
      data: mess,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete mess service
// @route   DELETE /api/mess/:id
// @access  Private (Admin, Owner)
exports.deleteMessService = async (req, res, next) => {
  try {
    const mess = await MessService.findById(req.params.id);

    if (!mess) {
      return res.status(404).json({
        success: false,
        message: 'Mess service not found',
      });
    }

    if (mess.createdBy && mess.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this mess listing',
      });
    }

    await MessService.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Mess service deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};
