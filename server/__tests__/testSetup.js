const express = require('express');
const cors = require('cors');

// Create app without database connection for testing
const createTestApp = () => {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());

  // Routes
  app.use('/api/auth', require('../src/routes/auth'));
  app.use('/api/prayers', require('../src/routes/prayers'));
  app.use('/api/reminders', require('../src/routes/reminders'));
  app.use('/api/bible', require('../src/routes/bible'));
  app.use('/api/user', require('../src/routes/user'));

  // Health check
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Christian Companion API is running' });
  });

  return app;
};

module.exports = { createTestApp };
