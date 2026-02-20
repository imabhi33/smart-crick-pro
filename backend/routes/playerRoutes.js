const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { uploadPlayersCSV, getSampleCSV, validatePlayers } = require('../controllers/playerController');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, 'players-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 2 // 2MB limit
    },
    fileFilter: function (req, file, cb) {
        const ext = path.extname(file.originalname).toLowerCase();
        if (ext !== '.csv') {
            return cb(new Error('Only CSV files are allowed'));
        }
        cb(null, true);
    }
});

// Routes
router.post('/upload-csv', upload.single('file'), uploadPlayersCSV);
router.get('/sample-csv', getSampleCSV);
router.post('/validate', validatePlayers);

module.exports = router;
