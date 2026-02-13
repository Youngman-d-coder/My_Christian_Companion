const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  denomination: {
    type: String,
    enum: ['catholic', 'protestant', 'orthodox', 'anglican', 'other'],
    default: 'other'
  },
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'auto'
    },
    bibleTranslation: {
      type: String,
      default: 'KJV'
    },
    notificationsEnabled: {
      type: Boolean,
      default: true
    }
  },
  bookmarks: [{
    book: String,
    chapter: Number,
    verse: Number,
    text: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  readingHistory: [{
    book: String,
    chapter: Number,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for better query performance
userSchema.index({ email: 1 }); // Already unique, but explicit
userSchema.index({ createdAt: -1 }); // For sorting users by creation date

module.exports = mongoose.model('User', userSchema);
