const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');

// @desc    Upload and parse CSV file with players
// @route   POST /api/players/upload-csv
// @access  Public
const uploadPlayersCSV = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Please upload a CSV file'
            });
        }

        const players = [];
        const filePath = req.file.path;

        // Parse CSV file
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row) => {
                // Support multiple formats:
                // 1. Simple format: just "Player Name" or "name" column
                // 2. Detailed format: Player Name, Role, Batting Style, Bowling Style
                const playerName = row['Player Name'] || row['name'] || row['Name'] || Object.values(row)[0];

                if (playerName && playerName.trim()) {
                    players.push({
                        name: playerName.trim(),
                        role: row['Role'] || row['role'] || 'Player',
                        battingStyle: row['Batting Style'] || row['batting_style'] || '',
                        bowlingStyle: row['Bowling Style'] || row['bowling_style'] || ''
                    });
                }
            })
            .on('end', () => {
                // Delete the uploaded file after processing
                fs.unlinkSync(filePath);

                if (players.length === 0) {
                    return res.status(400).json({
                        success: false,
                        message: 'No valid players found in CSV file'
                    });
                }

                res.status(200).json({
                    success: true,
                    message: `Successfully parsed ${players.length} players from CSV`,
                    data: players
                });
            })
            .on('error', (error) => {
                // Delete the uploaded file on error
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }

                console.error('CSV parsing error:', error);
                res.status(500).json({
                    success: false,
                    message: 'Failed to parse CSV file. Please check the format.',
                    error: error.message
                });
            });

    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during file upload',
            error: error.message
        });
    }
};

// @desc    Get sample CSV template
// @route   GET /api/players/sample-csv
// @access  Public
const getSampleCSV = async (req, res) => {
    try {
        // Create sample CSV content
        const sampleCSV = `Player Name,Role,Batting Style,Bowling Style
Virat Kohli,Batsman,Right Hand,
Jasprit Bumrah,Bowler,,Right Arm Fast
Hardik Pandya,All-rounder,Right Hand,Right Arm Fast
Rishabh Pant,Wicket Keeper,Left Hand,
Rohit Sharma,Batsman,Right Hand,
Yuzvendra Chahal,Bowler,,Right Arm Leg Spin
Ravindra Jadeja,All-rounder,Left Hand,Left Arm Spin
KL Rahul,Wicket Keeper,Right Hand,
Shikhar Dhawan,Batsman,Left Hand,
Mohammed Shami,Bowler,,Right Arm Fast
Shreyas Iyer,Batsman,Right Hand,`;

        // Set headers for CSV download
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=sample_players.csv');

        res.status(200).send(sampleCSV);
    } catch (error) {
        console.error('Sample CSV error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate sample CSV',
            error: error.message
        });
    }
};

// @desc    Validate player list
// @route   POST /api/players/validate
// @access  Public
const validatePlayers = async (req, res) => {
    try {
        const { players } = req.body;

        if (!players || !Array.isArray(players)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide an array of players'
            });
        }

        if (players.length < 11) {
            return res.status(400).json({
                success: false,
                message: `Need at least 11 players. Currently have ${players.length}`
            });
        }

        if (players.length > 15) {
            return res.status(400).json({
                success: false,
                message: `Maximum 15 players allowed. Currently have ${players.length}`
            });
        }

        // Check for duplicate names
        const names = players.map(p => p.toLowerCase().trim());
        const duplicates = names.filter((name, index) => names.indexOf(name) !== index);

        if (duplicates.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Duplicate player names found: ${duplicates.join(', ')}`
            });
        }

        res.status(200).json({
            success: true,
            message: 'Player list is valid',
            data: {
                count: players.length,
                players: players
            }
        });

    } catch (error) {
        console.error('Validation error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during validation',
            error: error.message
        });
    }
};

module.exports = {
    uploadPlayersCSV,
    getSampleCSV,
    validatePlayers
};
