const Match = require('../models/Match');

// @desc    End match with password
// @route   POST /api/matches/:id/end
// @access  Public (with password)
const endMatch = async (req, res) => {
  try {
    const { password } = req.body;
    const match = await Match.findById(req.params.id);

    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Match not found'
      });
    }

    // Check if match is already completed
    if (match.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Match is already completed'
      });
    }

    // Simple password check (you can make this more secure)
    const MATCH_END_PASSWORD = 'END123'; // Simple password for ending matches
    
    if (password !== MATCH_END_PASSWORD) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password'
      });
    }

    // End the match
    match.status = 'completed';
    
    // Calculate winner if not already set
    if (!match.winner) {
      const innings1Runs = match.innings1.runs || 0;
      const innings2Runs = match.innings2.runs || 0;
      
      if (innings2Runs > innings1Runs) {
        const wicketsLeft = 10 - match.innings2.wickets;
        match.winner = match.innings2.battingTeam;
        match.result = `${match.innings2.battingTeam} won by ${wicketsLeft} wickets`;
      } else if (innings1Runs > innings2Runs) {
        const runsMargin = innings1Runs - innings2Runs;
        match.winner = match.innings1.battingTeam;
        match.result = `${match.innings1.battingTeam} won by ${runsMargin} runs`;
      } else {
        match.result = 'Match Tied';
      }
    }

    await match.save();

    res.status(200).json({
      success: true,
      message: 'Match ended successfully',
      data: match
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = { endMatch };
