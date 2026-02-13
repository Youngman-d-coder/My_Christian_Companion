const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  time: {
    type: String, // Format: "HH:MM"
    required: true
  },
  days: [{
    type: String,
    enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  }],
  prayerType: {
    type: String,
    enum: ['rosary', 'angelus', 'divine-mercy', 'morning', 'evening', 'custom']
  },
  enabled: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for better query performance
reminderSchema.index({ user: 1, time: 1 }); // Compound index for user reminders by time
reminderSchema.index({ user: 1, enabled: 1 }); // For fetching active reminders

module.exports = mongoose.model('Reminder', reminderSchema);
