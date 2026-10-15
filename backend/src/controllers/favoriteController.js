const Favorite = require('../models/Favorite');
const Property = require('../models/Property');

// @desc    Get user's favorite properties
// @route   GET /api/favorites
// @access  Private
exports.getFavorites = async (req, res, next) => {
  try {
    const favorites = await Favorite.find({ user: req.user.id })
      .populate({
        path: 'property',
        populate: { path: 'owner', select: 'name phone profileImage' },
      })
      .sort({ createdAt: -1 });

    // Filter out any properties that might have been deleted
    const validFavorites = favorites.filter((f) => f.property !== null);

    res.status(200).json({
      success: true,
      count: validFavorites.length,
      data: validFavorites.map((f) => f.property),
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Add property to favorites
// @route   POST /api/favorites/:propertyId
// @access  Private
exports.addFavorite = async (req, res, next) => {
  try {
    const { propertyId } = req.params;

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    // Check if already favorited
    let favorite = await Favorite.findOne({
      user: req.user.id,
      property: propertyId,
    });

    if (favorite) {
      return res.status(200).json({
        success: true,
        message: 'Property already saved in favorites',
        data: favorite,
      });
    }

    favorite = await Favorite.create({
      user: req.user.id,
      property: propertyId,
    });

    res.status(201).json({
      success: true,
      message: 'Property saved to favorites',
      data: favorite,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Remove property from favorites
// @route   DELETE /api/favorites/:propertyId
// @access  Private
exports.removeFavorite = async (req, res, next) => {
  try {
    const { propertyId } = req.params;

    const favorite = await Favorite.findOneAndDelete({
      user: req.user.id,
      property: propertyId,
    });

    if (!favorite) {
      return res.status(404).json({
        success: false,
        message: 'Property was not in your favorites',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Property removed from favorites',
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Check if property is favorited
// @route   GET /api/favorites/check/:propertyId
// @access  Private
exports.checkFavorite = async (req, res, next) => {
  try {
    const favorite = await Favorite.findOne({
      user: req.user.id,
      property: req.params.propertyId,
    });

    res.status(200).json({
      success: true,
      isFavorite: !!favorite,
    });
  } catch (err) {
    next(err);
  }
};
