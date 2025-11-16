const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - require authentication
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ success: false, message: 'User not found' });
      }

      if (!req.user.isActive) {
        return res.status(403).json({ success: false, message: 'Account is disabled' });
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }
};

// Admin only
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ 
      success: false, 
      message: 'Access denied. Admin only.' 
    });
  }
};

// Match Creator or Admin
const matchCreatorOrAdmin = (req, res, next) => {
  if (req.user && (req.user.role === 'match_creator' || req.user.role === 'admin')) {
    next();
  } else {
    res.status(403).json({ 
      success: false, 
      message: 'Access denied. Match Creator role required.' 
    });
  }
};

// Check if user is match creator or admin for specific match
const canEditMatch = async (req, res, next) => {
  try {
    const Match = require('../models/Match');
    const match = await Match.findById(req.params.id);

    if (!match) {
      return res.status(404).json({ success: false, message: 'Match not found' });
    }

    // Admin can edit any match
    if (req.user.role === 'admin') {
      return next();
    }

    // Match creator can only edit their own matches
    if (req.user.role === 'match_creator' && match.createdBy.toString() === req.user._id.toString()) {
      return next();
    }

    res.status(403).json({ 
      success: false, 
      message: 'You do not have permission to edit this match' 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { 
  protect, 
  adminOnly, 
  matchCreatorOrAdmin,
  canEditMatch 
};
