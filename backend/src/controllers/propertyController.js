const Property = require('../models/Property');
const Review = require('../models/Review');
const Favorite = require('../models/Favorite');
const Conversation = require('../models/Conversation');

// @desc    Get all properties (with filtering, sorting & pagination)
// @route   GET /api/properties
// @access  Public
exports.getProperties = async (req, res, next) => {
  try {
    const {
      keyword,
      city,
      locality,
      propertyType,
      minRent,
      maxRent,
      genderPreference,
      occupancyType,
      amenities,
      foodAvailability,
      sort,
      page = 1,
      limit = 9,
    } = req.query;

    const query = {
      verificationStatus: 'approved',
      isAvailable: true,
    };

    // Keyword search (title, description, locality, city)
    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
        { locality: { $regex: keyword, $options: 'i' } },
        { city: { $regex: keyword, $options: 'i' } },
      ];
    }

    // City & Locality
    if (city) {
      query.city = { $regex: `^${city.trim()}$`, $options: 'i' };
    }
    if (locality) {
      query.locality = { $regex: locality.trim(), $options: 'i' };
    }

    // Property Type
    if (propertyType && propertyType !== 'All') {
      query.propertyType = propertyType;
    }

    // Rent Range
    if (minRent || maxRent) {
      query.monthlyRent = {};
      if (minRent) query.monthlyRent.$gte = Number(minRent);
      if (maxRent) query.monthlyRent.$lte = Number(maxRent);
    }

    // Gender Preference
    if (genderPreference && genderPreference !== 'All') {
      query.genderPreference = { $in: [genderPreference, 'Any'] };
    }

    // Occupancy Type
    if (occupancyType && occupancyType !== 'All') {
      query.occupancyType = { $in: [occupancyType, 'Any'] };
    }

    // Amenities (all matched)
    if (amenities) {
      const amenitiesList = Array.isArray(amenities)
        ? amenities
        : amenities.split(',').map((a) => a.trim());
      if (amenitiesList.length > 0) {
        query.amenities = { $all: amenitiesList };
      }
    }

    // Food Availability
    if (foodAvailability !== undefined && foodAvailability !== '') {
      query.foodAvailability = foodAvailability === 'true';
    }

    // Sorting
    let sortOption = { createdAt: -1 }; // default newest
    if (sort === 'rent_asc') {
      sortOption = { monthlyRent: 1 };
    } else if (sort === 'rent_desc') {
      sortOption = { monthlyRent: -1 };
    } else if (sort === 'rating_desc') {
      sortOption = { averageRating: -1, reviewCount: -1 };
    }

    const pageNumber = Math.max(1, parseInt(page, 10));
    const pageSize = Math.min(50, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNumber - 1) * pageSize;

    const total = await Property.countDocuments(query);
    const properties = await Property.find(query)
      .populate('owner', 'name profileImage phone')
      .sort(sortOption)
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

// @desc    Get single property by ID
// @route   GET /api/properties/:id
// @access  Public
exports.getPropertyById = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id).populate(
      'owner',
      'name email phone profileImage occupation createdAt'
    );

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    // Fetch reviews for this property
    const reviews = await Review.find({ property: property._id })
      .populate('user', 'name profileImage occupation')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        ...property.toObject(),
        reviews,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new property listing
// @route   POST /api/properties
// @access  Private (Owner, Admin)
exports.createProperty = async (req, res, next) => {
  try {
    const propertyData = { ...req.body };

    // Attach owner
    propertyData.owner = req.user.id;

    // Handle parsed fields if sent as form-data
    if (typeof propertyData.amenities === 'string') {
      try {
        propertyData.amenities = JSON.parse(propertyData.amenities);
      } catch {
        propertyData.amenities = propertyData.amenities.split(',').map((s) => s.trim()).filter(Boolean);
      }
    }

    if (typeof propertyData.mealsIncluded === 'string') {
      try {
        propertyData.mealsIncluded = JSON.parse(propertyData.mealsIncluded);
      } catch {
        propertyData.mealsIncluded = propertyData.mealsIncluded.split(',').map((s) => s.trim()).filter(Boolean);
      }
    }

    if (typeof propertyData.coordinates === 'string') {
      try {
        propertyData.coordinates = JSON.parse(propertyData.coordinates);
      } catch {
        propertyData.coordinates = { lat: 12.9716, lng: 77.5946 };
      }
    }

    // Parse numbers
    if (propertyData.monthlyRent) propertyData.monthlyRent = Number(propertyData.monthlyRent);
    if (propertyData.securityDeposit) propertyData.securityDeposit = Number(propertyData.securityDeposit);
    if (propertyData.availableRooms) propertyData.availableRooms = Number(propertyData.availableRooms);
    if (propertyData.totalRooms) propertyData.totalRooms = Number(propertyData.totalRooms);

    // Handle uploaded files
    const images = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        images.push(`/uploads/${file.filename}`);
      });
    }

    // If string images array passed in body (e.g. from seed or external urls)
    if (propertyData.images && Array.isArray(propertyData.images)) {
      images.push(...propertyData.images);
    }

    propertyData.images = images.length > 0 ? images : ['/uploads/default-property.jpg'];

    // If user is Admin, auto-approve; if Owner, set pending
    propertyData.verificationStatus = req.user.role === 'admin' ? 'approved' : 'pending';

    const property = await Property.create(propertyData);

    res.status(201).json({
      success: true,
      message:
        propertyData.verificationStatus === 'approved'
          ? 'Property created and published successfully'
          : 'Property submitted successfully! It is pending administrator verification.',
      data: property,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update property
// @route   PUT /api/properties/:id
// @access  Private (Owner, Admin)
exports.updateProperty = async (req, res, next) => {
  try {
    let property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    // Make sure user is property owner or admin
    if (property.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this property',
      });
    }

    const updateData = { ...req.body };

    // Handle parsed fields if string
    if (typeof updateData.amenities === 'string') {
      try {
        updateData.amenities = JSON.parse(updateData.amenities);
      } catch {
        updateData.amenities = updateData.amenities.split(',').map((s) => s.trim()).filter(Boolean);
      }
    }

    if (typeof updateData.mealsIncluded === 'string') {
      try {
        updateData.mealsIncluded = JSON.parse(updateData.mealsIncluded);
      } catch {
        updateData.mealsIncluded = updateData.mealsIncluded.split(',').map((s) => s.trim()).filter(Boolean);
      }
    }

    if (typeof updateData.coordinates === 'string') {
      try {
        updateData.coordinates = JSON.parse(updateData.coordinates);
      } catch {
        // keep existing
      }
    }

    // If new files uploaded, append or replace
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((f) => `/uploads/${f.filename}`);
      updateData.images = [...(property.images || []), ...newImages];
    }

    // Keep verification status pending if edited by owner
    if (req.user.role !== 'admin' && property.verificationStatus === 'rejected') {
      updateData.verificationStatus = 'pending';
      updateData.rejectionReason = '';
    }

    property = await Property.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Property updated successfully',
      data: property,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete property
// @route   DELETE /api/properties/:id
// @access  Private (Owner, Admin)
exports.deleteProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    // Make sure user is property owner or admin
    if (property.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this property',
      });
    }

    await Property.findByIdAndDelete(req.params.id);

    // Delete associated reviews & favorites
    await Review.deleteMany({ property: property._id });
    await Favorite.deleteMany({ property: property._id });

    res.status(200).json({
      success: true,
      message: 'Property deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Toggle property availability
// @route   PATCH /api/properties/:id/availability
// @access  Private (Owner, Admin)
exports.toggleAvailability = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    if (property.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this property status',
      });
    }

    property.isAvailable = !property.isAvailable;
    await property.save();

    res.status(200).json({
      success: true,
      message: `Property marked as ${property.isAvailable ? 'Available' : 'Occupied / Unavailable'}`,
      data: property,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get properties owned by logged in user
// @route   GET /api/properties/owner/me
// @access  Private (Owner, Admin)
exports.getMyProperties = async (req, res, next) => {
  try {
    const properties = await Property.find({ owner: req.user.id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: properties.length,
      data: properties,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get owner statistics
// @route   GET /api/properties/owner/stats
// @access  Private (Owner, Admin)
exports.getOwnerStats = async (req, res, next) => {
  try {
    const properties = await Property.find({ owner: req.user.id });
    const propertyIds = properties.map((p) => p._id);

    const totalProperties = properties.length;
    const approvedProperties = properties.filter((p) => p.verificationStatus === 'approved').length;
    const pendingProperties = properties.filter((p) => p.verificationStatus === 'pending').length;
    const rejectedProperties = properties.filter((p) => p.verificationStatus === 'rejected').length;
    const availableProperties = properties.filter((p) => p.isAvailable && p.verificationStatus === 'approved').length;

    // Inquiries count (conversations tied to owner properties)
    const totalInquiries = await Conversation.countDocuments({
      property: { $in: propertyIds },
    });

    // Total reviews and average rating
    const totalReviews = properties.reduce((acc, p) => acc + (p.reviewCount || 0), 0);
    const avgRating = totalProperties > 0
      ? (properties.reduce((acc, p) => acc + (p.averageRating || 0), 0) / totalProperties).toFixed(1)
      : 0;

    res.status(200).json({
      success: true,
      data: {
        totalProperties,
        approvedProperties,
        pendingProperties,
        rejectedProperties,
        availableProperties,
        totalInquiries,
        totalReviews,
        avgRating: Number(avgRating),
      },
    });
  } catch (err) {
    next(err);
  }
};
