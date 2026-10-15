const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide a property title'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a property description'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    propertyType: {
      type: String,
      required: [true, 'Please specify property type'],
      enum: {
        values: ['PG', 'Flat', 'Hostel'],
        message: 'Property type must be PG, Flat, or Hostel',
      },
    },
    monthlyRent: {
      type: Number,
      required: [true, 'Please specify monthly rent'],
      min: [0, 'Rent cannot be negative'],
    },
    securityDeposit: {
      type: Number,
      default: 0,
      min: [0, 'Security deposit cannot be negative'],
    },
    address: {
      type: String,
      required: [true, 'Please provide the complete address'],
      trim: true,
    },
    locality: {
      type: String,
      required: [true, 'Please provide locality / area'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'Please provide city'],
      trim: true,
    },
    state: {
      type: String,
      trim: true,
      default: '',
    },
    pincode: {
      type: String,
      trim: true,
      default: '',
    },
    coordinates: {
      lat: {
        type: Number,
        default: 12.9716, // Default Bangalore center fallback
      },
      lng: {
        type: Number,
        default: 77.5946,
      },
    },
    availableRooms: {
      type: Number,
      default: 1,
      min: [0, 'Available rooms cannot be negative'],
    },
    totalRooms: {
      type: Number,
      default: 1,
      min: [1, 'Total rooms must be at least 1'],
    },
    occupancyType: {
      type: String,
      enum: ['Single', 'Double', 'Triple', 'Any'],
      default: 'Single',
    },
    genderPreference: {
      type: String,
      enum: ['Male', 'Female', 'Any'],
      default: 'Any',
    },
    amenities: {
      type: [String],
      default: [],
    },
    foodAvailability: {
      type: Boolean,
      default: false,
    },
    foodType: {
      type: String,
      enum: ['Veg', 'Non-Veg', 'Both', 'None'],
      default: 'None',
    },
    mealsIncluded: {
      type: [String],
      default: [],
    },
    images: {
      type: [String],
      default: [],
    },
    verificationStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    rejectionReason: {
      type: String,
      default: '',
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for search optimization
propertySchema.index({ city: 1, verificationStatus: 1, isAvailable: 1, monthlyRent: 1 });
propertySchema.index({ propertyType: 1, genderPreference: 1 });
propertySchema.index({ owner: 1 });

const Property = mongoose.model('Property', propertySchema);

module.exports = Property;
