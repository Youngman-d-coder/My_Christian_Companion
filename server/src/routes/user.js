const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const User = require('../models/User');

// Validation middleware
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user preferences
router.put('/preferences', auth, [
  body('theme').optional().isIn(['light', 'dark', 'auto']).withMessage('Invalid theme value'),
  body('bibleTranslation').optional().isString().trim().withMessage('Invalid Bible translation'),
  body('notificationsEnabled').optional().isBoolean().withMessage('Invalid notification setting'),
  validateRequest
], async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $set: { preferences: req.body } },
      { new: true }
    ).select('-password');
    
    res.json(user);
  } catch (error) {
    console.error('Error updating preferences:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add bookmark
router.post('/bookmarks', auth, [
  body('book').trim().notEmpty().withMessage('Book is required'),
  body('chapter').isInt({ min: 1 }).withMessage('Chapter must be a positive integer'),
  body('verse').optional().isInt({ min: 1 }).withMessage('Verse must be a positive integer'),
  body('text').optional().isString().withMessage('Text must be a string'),
  validateRequest
], async (req, res) => {
  try {
    const { book, chapter, verse, text } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $push: { bookmarks: { book, chapter, verse, text } } },
      { new: true }
    ).select('-password');
    
    res.json(user.bookmarks);
  } catch (error) {
    console.error('Error adding bookmark:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Remove bookmark
router.delete('/bookmarks/:bookmarkId', auth, [
  param('bookmarkId').isMongoId().withMessage('Invalid bookmark ID'),
  validateRequest
], async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $pull: { bookmarks: { _id: req.params.bookmarkId } } },
      { new: true }
    ).select('-password');
    
    res.json(user.bookmarks);
  } catch (error) {
    console.error('Error removing bookmark:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add to reading history
router.post('/history', auth, [
  body('book').trim().notEmpty().withMessage('Book is required'),
  body('chapter').isInt({ min: 1 }).withMessage('Chapter must be a positive integer'),
  validateRequest
], async (req, res) => {
  try {
    const { book, chapter } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { 
        $push: { 
          readingHistory: { 
            $each: [{ book, chapter }],
            $slice: -100 // Keep only last 100 entries
          } 
        } 
      },
      { new: true }
    ).select('-password');
    
    res.json(user.readingHistory);
  } catch (error) {
    console.error('Error adding to history:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
