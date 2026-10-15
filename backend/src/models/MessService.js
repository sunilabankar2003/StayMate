const mongoose = require('mongoose');

const messServiceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide the mess or tiffin service name'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
      maxlength: [1500, 'Description cannot exceed 1500 characters'],
    },
    address: {
      type: String,
      required: [true, 'Please provide the address'],
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
      default: '',
    },
    pincode: {
      type: String,
      default: '',
    },
    coordinates: {
      lat: {
        type: Number,
        default: 12.9716,
      },
      lng: {
        type: Number,
        default: 77.5946,
      },
    },
    contactNumber: {
      type: String,
      required: [true, 'Please provide contact number'],
      trim: true,
    },
    mealTypes: {
      type: [String],
      default: ['Breakfast', 'Lunch', 'Dinner'],
    },
    foodType: {
      type: String,
      enum: ['Veg', 'Non-Veg', 'Both'],
      default: 'Veg',
    },
    monthlyPrice: {
      type: Number,
      required: [true, 'Please specify monthly subscription price'],
      min: [0, 'Price cannot be negative'],
    },
    dailyPrice: {
      type: Number,
      default: 0,
      min: [0, 'Price cannot be negative'],
    },
    mealTimings: {
      breakfast: { type: String, default: '7:30 AM - 9:30 AM' },
      lunch: { type: String, default: '12:30 PM - 2:30 PM' },
      dinner: { type: String, default: '7:30 PM - 10:00 PM' },
    },
    operatingDays: {
      type: [String],
      default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    },
    menu: {
      monday: { type: String, default: 'Roti, Dal Tadka, Seasonal Sabzi, Rice, Salad' },
      tuesday: { type: String, default: 'Paneer Butter Masala, Roti, Jeera Rice, Dal' },
      wednesday: { type: String, default: 'Chole, Bhature/Poori, Rice, Raita' },
      thursday: { type: String, default: 'Rajma Masala, Steamed Rice, Roti, Mix Veg' },
      friday: { type: String, default: 'Dal Makhani, Kadai Paneer / Egg Curry, Rice, Roti' },
      saturday: { type: String, default: 'Veg/Chicken Biryani, Salan, Raita, Sweet' },
      sunday: { type: String, default: 'Special Thali: Paneer / Chicken, Pulao, Gulab Jamun' },
    },
    images: {
      type: [String],
      default: [],
    },
    isVerified: {
      type: Boolean,
      default: true,
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
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

messServiceSchema.index({ city: 1, foodType: 1, isAvailable: 1, monthlyPrice: 1 });

const MessService = mongoose.model('MessService', messServiceSchema);

module.exports = MessService;
