const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Reminder = require('../models/Reminder');

// Get all reminders for user
router.get('/', auth, async (req, res) => {
  try {
    const reminders = await Reminder.find({ user: req.user.userId }).sort({ time: 1 });
    res.json(reminders);
  } catch (error) {
    console.error('Error fetching reminders:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create reminder
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, time, days, prayerType } = req.body;
    
    const reminder = new Reminder({
      user: req.user.userId,
      title,
      description,
      time,
      days,
      prayerType
    });

    await reminder.save();
    res.status(201).json(reminder);
  } catch (error) {
    console.error('Error creating reminder:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update reminder
router.put('/:id', auth, async (req, res) => {
  try {
    const reminder = await Reminder.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      req.body,
      { new: true }
    );
    
    if (!reminder) {
      return res.status(404).json({ error: 'Reminder not found' });
    }
    
    res.json(reminder);
  } catch (error) {
    console.error('Error updating reminder:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete reminder
router.delete('/:id', auth, async (req, res) => {
  try {
    const reminder = await Reminder.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId
    });
    
    if (!reminder) {
      return res.status(404).json({ error: 'Reminder not found' });
    }
    
    res.json({ message: 'Reminder deleted successfully' });
  } catch (error) {
    console.error('Error deleting reminder:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
