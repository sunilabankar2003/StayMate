const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      maxlength: [60, 'Name cannot exceed 60 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    role: {
      type: String,
      enum: {
        values: ['student', 'owner', 'admin'],
        message: 'Role must be student, owner, or admin',
      },
      default: 'student',
    },
    profileImage: {
      type: String,
      default: '',
    },
    occupation: {
      type: String,
      trim: true,
      default: 'Student',
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
      default: '',
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other', ''],
      default: '',
    },
    collegeOrCompany: {
      type: String,
      trim: true,
      default: '',
    },
    budgetMin: {
      type: Number,
      default: 3000,
      min: 0,
    },
    budgetMax: {
      type: Number,
      default: 15000,
      min: 0,
    },
    preferredCity: {
      type: String,
      trim: true,
      default: '',
    },
    preferredLocality: {
      type: String,
      trim: true,
      default: '',
    },
    preferredAccommodationType: {
      type: String,
      enum: ['PG', 'Flat', 'Hostel', 'Any'],
      default: 'Any',
    },
    roommatePreferences: {
      cleanliness: {
        type: String,
        enum: ['very_clean', 'moderate', 'relaxed'],
        default: 'moderate',
      },
      foodHabit: {
        type: String,
        enum: ['vegetarian', 'non_vegetarian', 'eggetarian', 'vegan', 'any'],
        default: 'any',
      },
      smoking: {
        type: String,
        enum: ['non_smoker', 'smoker', 'occasional'],
        default: 'non_smoker',
      },
      sleepSchedule: {
        type: String,
        enum: ['early_bird', 'night_owl', 'flexible'],
        default: 'flexible',
      },
      studyWorkRoutine: {
        type: String,
        enum: ['quiet_studious', 'moderate', 'social'],
        default: 'moderate',
      },
      preferredGender: {
        type: String,
        enum: ['male', 'female', 'any'],
        default: 'any',
      },
      moveInDate: {
        type: Date,
      },
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isSuspended: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Encrypt password using bcryptjs before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare user password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Indexing for roommate search
userSchema.index({ role: 1, preferredCity: 1, isSuspended: 1 });

const User = mongoose.model('User', userSchema);

module.exports = User;
