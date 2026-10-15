const mongoose = require('mongoose');

const messSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Mess name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    area: {
      type: String,
      required: true,
    },
    latitude: {
      type: Number,
      default: 18.5204,
    },
    longitude: {
      type: Number,
      default: 73.8567,
    },
    monthlyPrice: {
      type: Number,
      required: [true, 'Monthly price is required'],
      min: 0,
    },
    foodType: {
      type: String,
      enum: ['Veg', 'Non-Veg', 'Both'],
      required: true,
    },
    meals: {
      type: [String],
      enum: ['Breakfast', 'Lunch', 'Dinner'],
      default: ['Lunch', 'Dinner'],
    },
    menu: {
      monday: { type: String, default: 'Roti, Dal, Paneer/Sabzi, Rice, Salad' },
      tuesday: { type: String, default: 'Roti, Chana Masala, Jeera Rice, Gulab Jamun' },
      wednesday: { type: String, default: 'Roti, Dal Tadka, Seasonal Veg, Curd Rice' },
      thursday: { type: String, default: 'Puri, Aloo Dum, Dal Fry, Pulao' },
      friday: { type: String, default: 'Roti, Mix Veg, Dal Makhani, Steamed Rice' },
      saturday: { type: String, default: 'Roti, Special Sabzi, Biryani / Khichdi, Sweet' },
      sunday: { type: String, default: 'Special Feast / Non-Veg option / Paneer Tikka' },
    },
    images: {
      type: [String],
      default: [],
    },
    contact: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    isVerified: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

messSchema.index({ city: 1, area: 1, foodType: 1 });
messSchema.index({ monthlyPrice: 1 });

module.exports = mongoose.model('Mess', messSchema);
