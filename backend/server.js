const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // In development, allow localhost
    if (process.env.NODE_ENV !== 'production') {
      const allowedLocalOrigins = ['http://localhost:4000', 'http://localhost:5173', 'http://localhost:3000'];
      if (allowedLocalOrigins.includes(origin)) {
        return callback(null, true);
      }
    }

    // In production, allow specific domains and all Vercel preview URLs
    const allowedOrigins = [
      'https://smartcric.vercel.app',
      'https://smart-crick-pro.vercel.app',
      'https://smart-crick-pro.netlify.app',
      process.env.FRONTEND_URL
    ].filter(Boolean);

    // Check if origin matches allowed origins or is a Vercel preview URL
    if (allowedOrigins.includes(origin) || origin.includes('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));
app.use('/api/matches', require('./routes/matchRoutes'));
app.use('/api/stats', require('./routes/statsRoutes'));

// Health check route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'SmartCrick Pro API is running',
    version: '1.0.0'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV}`);
});
