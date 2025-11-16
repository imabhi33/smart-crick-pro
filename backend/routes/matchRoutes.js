const express = require('express');
const router = express.Router();
const {
  createMatch,
  startMatch,
  updateScore,
  getMatch,
  getAllMatches,
  getPlayerStats,
  getLiveMatches,
  getMyMatches
} = require('../controllers/matchController');
const { endMatch } = require('../controllers/endMatchController');
const { protect, matchCreatorOrAdmin, canEditMatch } = require('../middleware/auth');

// Public routes - specific routes first
router.get('/live', getLiveMatches);
router.get('/', getAllMatches);

// Protected routes - Match Creator or Admin
router.post('/', protect, matchCreatorOrAdmin, createMatch);
router.get('/user/my-matches', protect, matchCreatorOrAdmin, getMyMatches);

// Protected routes - Only match creator or admin can edit
router.post('/:id/start', protect, canEditMatch, startMatch);
router.post('/:id/score', protect, canEditMatch, updateScore);
router.post('/:id/end', protect, canEditMatch, endMatch);

// Parameterized routes - must come last
router.get('/:id/players', getPlayerStats);
router.get('/:id', getMatch);

module.exports = router;
