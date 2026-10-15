const mongoose = require('mongoose');

const roommateSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      required: true,
      min: 16,
      max: 100,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      required: true,
    },
    college: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    preferredArea: {
      type: String,
      required: true,
      trim: true,
    },
    budgetMin: {
      type: Number,
      required: true,
      min: 0,
    },
    budgetMax: {
      type: Number,
      required: true,
      min: 0,
    },
    roomPreference: {
      type: String,
      enum: ['Single', 'Shared', 'Any'],
      default: 'Shared',
    },
    foodPreference: {
      type: String,
      enum: ['Veg', 'Non-Veg', 'Any'],
      default: 'Any',
    },
    smokingPreference: {
      type: String,
      enum: ['Yes', 'No', 'Occasionally'],
      default: 'No',
    },
    drinkingPreference: {
      type: String,
      enum: ['Yes', 'No', 'Occasionally'],
      default: 'No',
    },
    sleepSchedule: {
      type: String,
      enum: ['Early Bird', 'Night Owl', 'Flexible'],
      default: 'Flexible',
    },
    studySchedule: {
      type: String,
      enum: ['Morning', 'Late Night', 'Flexible'],
      default: 'Flexible',
    },
    occupation: {
      type: String,
      default: 'Student',
    },
    about: {
      type: String,
      default: '',
    },
    profilePhoto: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

roommateSchema.index({ city: 1, preferredArea: 1 });
roommateSchema.index({ budgetMin: 1, budgetMax: 1 });
roommateSchema.index({ gender: 1 });

module.exports = mongoose.model('Roommate', roommateSchema);
