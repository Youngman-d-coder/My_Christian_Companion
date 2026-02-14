const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const logger = require('./utils/logger');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();

const app = express();

// Security headers with helmet
// Disable in test environment to avoid conflicts with test setup
if (process.env.NODE_ENV !== 'test') {
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },
    crossOriginEmbedderPolicy: false,
  }));
}

// Compression middleware
app.use(compression());

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter rate limit for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login/register attempts per windowMs
  message: 'Too many authentication attempts, please try again later.',
  skipSuccessfulRequests: true,
});

// CORS configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:4173',
  process.env.CLIENT_URL,
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      logger.warn(`Blocked CORS request from origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(limiter);

// Data sanitization against NoSQL injection (disable in test mode to avoid conflicts)
if (process.env.NODE_ENV !== 'test') {
  app.use(mongoSanitize({
    replaceWith: '_',
    onSanitize: ({ req, key }) => {
      logger.warn(`Sanitized request from ${req.ip}: removed key "${key}"`);
    },
  }));
}

// Routes
app.use('/api/auth', authLimiter, require('./routes/auth'));
app.use('/api/prayers', require('./routes/prayers'));
app.use('/api/hymns', require('./routes/hymns'));
app.use('/api/reminders', require('./routes/reminders'));
app.use('/api/bible', require('./routes/bible'));
app.use('/api/user', require('./routes/user'));
app.use('/api/saints', require('./routes/saints'));
app.use('/api/daily', require('./routes/daily'));
app.use('/api/nigerian', require('./routes/nigerian'));

// Health check
app.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({ 
    status: 'ok', 
    message: 'Christian Companion API is running',
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
});

// 404 handler - must be after all routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler - must be last
app.use(errorHandler);

// Database connection
const connectDB = async () => {
  try {
    if (process.env.MONGODB_URI) {
      await mongoose.connect(process.env.MONGODB_URI);
      logger.info('MongoDB connected successfully');
    } else {
      // In production, MongoDB is required
      if (process.env.NODE_ENV === 'production') {
        logger.error('CRITICAL: MongoDB URI is required in production');
        throw new Error('MongoDB URI is required in production environment');
      }
      logger.warn('MongoDB URI not provided, running without database');
    }
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
    logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
};

startServer();

module.exports = app;
