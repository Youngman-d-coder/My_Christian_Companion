const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Reminder = require('../models/Reminder');
const logger = require('../utils/logger');

// Validation middleware
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Get all reminders for user
router.get('/', auth, async (req, res) => {
  try {
    const reminders = await Reminder.find({ user: req.user.userId }).sort({ time: 1 });
    res.json(reminders);
  } catch (error) {
    logger.error('Error fetching reminders:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create reminder
router.post('/', auth, [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('time').matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Time must be in HH:MM format'),
  body('days').isArray({ min: 1 }).withMessage('At least one day must be selected'),
  body('prayerType').isIn(['morning', 'evening', 'rosary', 'angelus', 'divine_mercy', 'custom']).withMessage('Invalid prayer type'),
  validateRequest
], async (req, res) => {
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
    logger.error('Error creating reminder:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update reminder
router.put('/:id', auth, [
  param('id').isMongoId().withMessage('Invalid reminder ID'),
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
  body('time').optional().matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Time must be in HH:MM format'),
  body('days').optional().isArray({ min: 1 }).withMessage('At least one day must be selected'),
  body('prayerType').optional().isIn(['morning', 'evening', 'rosary', 'angelus', 'divine_mercy', 'custom']).withMessage('Invalid prayer type'),
  validateRequest
], async (req, res) => {
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
    logger.error('Error updating reminder:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete reminder
router.delete('/:id', auth, [
  param('id').isMongoId().withMessage('Invalid reminder ID'),
  validateRequest
], async (req, res) => {
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
    logger.error('Error deleting reminder:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
