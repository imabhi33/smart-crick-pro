const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');
const { protect } = require('../middleware/auth');

// Public routes
router.get('/ground/:groundId', statsController.getGroundStats);
router.get('/player/:playerName', statsController.getPlayerStats);

module.exports = router;
