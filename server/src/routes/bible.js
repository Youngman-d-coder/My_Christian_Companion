const express = require('express');
const router = express.Router();
const axios = require('axios');

// Bible API endpoints - using api.bible for comprehensive translation support
const BIBLE_API_KEY = process.env.BIBLE_API_KEY || '';
const BIBLE_API_BASE = 'https://api.scripture.api.bible/v1';

// Get available Bible translations
router.get('/translations', async (req, res) => {
  try {
    // Return popular translations
    const translations = [
      { id: 'KJV', name: 'King James Version', language: 'English' },
      { id: 'NIV', name: 'New International Version', language: 'English' },
      { id: 'ESV', name: 'English Standard Version', language: 'English' },
      { id: 'NKJV', name: 'New King James Version', language: 'English' },
      { id: 'NLT', name: 'New Living Translation', language: 'English' },
      { id: 'NASB', name: 'New American Standard Bible', language: 'English' },
      { id: 'RSV', name: 'Revised Standard Version', language: 'English' },
      { id: 'NRSV', name: 'New Revised Standard Version', language: 'English' },
      { id: 'DRA', name: 'Douay-Rheims American Edition', language: 'English' },
      { id: 'WEB', name: 'World English Bible', language: 'English' }
    ];
    
    res.json(translations);
  } catch (error) {
    console.error('Error fetching translations:', error);
    res.status(500).json({ error: 'Failed to fetch translations' });
  }
});

// Get list of books
router.get('/books', (req, res) => {
  const books = {
    oldTestament: [
      'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy',
      'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel',
      '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles',
      'Ezra', 'Nehemiah', 'Esther', 'Job', 'Psalms', 'Proverbs',
      'Ecclesiastes', 'Song of Solomon', 'Isaiah', 'Jeremiah',
      'Lamentations', 'Ezekiel', 'Daniel', 'Hosea', 'Joel',
      'Amos', 'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk',
      'Zephaniah', 'Haggai', 'Zechariah', 'Malachi'
    ],
    newTestament: [
      'Matthew', 'Mark', 'Luke', 'John', 'Acts',
      'Romans', '1 Corinthians', '2 Corinthians', 'Galatians',
      'Ephesians', 'Philippians', 'Colossians',
      '1 Thessalonians', '2 Thessalonians', '1 Timothy',
      '2 Timothy', 'Titus', 'Philemon', 'Hebrews', 'James',
      '1 Peter', '2 Peter', '1 John', '2 John', '3 John',
      'Jude', 'Revelation'
    ]
  };
  
  res.json(books);
});

// Get a specific chapter
router.get('/:translation/:book/:chapter', async (req, res) => {
  try {
    const { translation, book, chapter } = req.params;
    
    // For demo purposes, return sample data
    // In production, integrate with actual Bible API
    const sampleVerses = generateSampleVerses(book, parseInt(chapter));
    
    res.json({
      translation,
      book,
      chapter: parseInt(chapter),
      verses: sampleVerses
    });
  } catch (error) {
    console.error('Error fetching chapter:', error);
    res.status(500).json({ error: 'Failed to fetch chapter' });
  }
});

// Get a specific verse
router.get('/:translation/:book/:chapter/:verse', async (req, res) => {
  try {
    const { translation, book, chapter, verse } = req.params;
    
    // For demo purposes, return sample data
    res.json({
      translation,
      book,
      chapter: parseInt(chapter),
      verse: parseInt(verse),
      text: `Sample verse text for ${book} ${chapter}:${verse}`
    });
  } catch (error) {
    console.error('Error fetching verse:', error);
    res.status(500).json({ error: 'Failed to fetch verse' });
  }
});

// Search Bible verses
router.get('/search', async (req, res) => {
  try {
    const { query, translation = 'KJV' } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    // For demo purposes, return sample results
    res.json({
      query,
      translation,
      results: []
    });
  } catch (error) {
    console.error('Error searching verses:', error);
    res.status(500).json({ error: 'Failed to search verses' });
  }
});

// Helper function to generate sample verses
function generateSampleVerses(book, chapter) {
  const verseCount = Math.min(chapter === 1 ? 31 : 20, 50);
  const verses = [];
  
  for (let i = 1; i <= verseCount; i++) {
    verses.push({
      number: i,
      text: `This is verse ${i} of ${book} chapter ${chapter}. [Sample text for demonstration]`
    });
  }
  
  return verses;
}

module.exports = router;
