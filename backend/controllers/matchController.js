const Match = require('../models/Match');
const Ground = require('../models/Ground');
const Player = require('../models/Player');

// @desc    Create new match
// @route   POST /api/matches
// @access  Private (Match Creator or Admin)
const createMatch = async (req, res) => {
  try {
    const { groundName, location, totalOvers, teamA, teamB, battingTeam, tossWinner, electedTo } = req.body;

    // Validation
    if (!groundName || !location || !totalOvers || !teamA || !teamB || !battingTeam) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    if (!teamA.name || !teamA.players || teamA.players.length !== 11) {
      return res.status(400).json({
        success: false,
        message: 'Team A must have exactly 11 players'
      });
    }

    if (!teamB.name || !teamB.players || teamB.players.length !== 11) {
      return res.status(400).json({
        success: false,
        message: 'Team B must have exactly 11 players'
      });
    }

    // Create or get ground
    let ground = await Ground.findOne({ name: groundName, location });
    if (!ground) {
      ground = await Ground.create({
        name: groundName,
        location,
        createdBy: null
      });
    }

    // Determine bowling team
    const bowlingTeam = battingTeam === teamA.name ? teamB.name : teamA.name;

    // Create match
    const match = await Match.create({
      groundId: ground._id,
      groundName,
      location,
      matchDate: new Date(),
      totalOvers,
      teamA,
      teamB,
      battingTeam,
      bowlingTeam,
      innings1: {
        battingTeam,
        runs: 0,
        wickets: 0,
        overs: 0,
        balls: 0,
        extras: { wides: 0, noBalls: 0, byes: 0, legByes: 0 }
      },
      battingRecords: [],
      bowlingRecords: [],
      currentOver: [],
      status: 'setup',
      createdBy: req.user._id
    });

    res.status(201).json({
      success: true,
      message: 'Match created successfully',
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

// @desc    Start match (select striker, non-striker, bowler)
// @route   POST /api/matches/:id/start
// @access  Public
const startMatch = async (req, res) => {
  try {
    const { striker, nonStriker, bowler } = req.body;
    const match = await Match.findById(req.params.id);

    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Match not found'
      });
    }

    // Validation
    if (!striker || !nonStriker || !bowler) {
      return res.status(400).json({
        success: false,
        message: 'Please select striker, non-striker, and bowler'
      });
    }

    // Initialize batting records for striker and non-striker
    const battingPosition = match.battingRecords.filter(b => b.innings === match.currentInnings).length;
    
    match.battingRecords.push({
      innings: match.currentInnings,
      teamName: match.battingTeam,
      playerName: striker,
      runs: 0,
      balls: 0,
      fours: 0,
      sixes: 0,
      strikeRate: 0,
      isOut: false,
      position: battingPosition + 1
    });

    match.battingRecords.push({
      innings: match.currentInnings,
      teamName: match.battingTeam,
      playerName: nonStriker,
      runs: 0,
      balls: 0,
      fours: 0,
      sixes: 0,
      strikeRate: 0,
      isOut: false,
      position: battingPosition + 2
    });

    // Initialize bowling record for bowler
    match.bowlingRecords.push({
      innings: match.currentInnings,
      teamName: match.bowlingTeam,
      playerName: bowler,
      overs: 0,
      balls: 0,
      runs: 0,
      wickets: 0,
      maidens: 0,
      economy: 0,
      wides: 0,
      noBalls: 0
    });

    // Update match
    match.striker = { name: striker, runs: 0, balls: 0, fours: 0, sixes: 0 };
    match.nonStriker = { name: nonStriker, runs: 0, balls: 0, fours: 0, sixes: 0 };
    match.currentBowler = { name: bowler, overs: 0, balls: 0, runs: 0, wickets: 0, maidens: 0, currentOverRuns: 0 };
    match.status = match.currentInnings === 1 ? 'innings1' : 'innings2';

    await match.save();

    res.status(200).json({
      success: true,
      message: 'Match started successfully',
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

// Helper function to update batting record
const updateBattingRecord = (match, playerName, runs, balls, fours, sixes, isOut, dismissalType, dismissedBy) => {
  const record = match.battingRecords.find(
    b => b.innings === match.currentInnings && b.playerName === playerName
  );
  
  if (record) {
    record.runs = runs;
    record.balls = balls;
    record.fours = fours;
    record.sixes = sixes;
    record.strikeRate = balls > 0 ? ((runs / balls) * 100).toFixed(2) : 0;
    if (isOut) {
      record.isOut = true;
      record.dismissalType = dismissalType;
      record.dismissedBy = dismissedBy;
    }
  }
};

// Helper function to update bowling record
const updateBowlingRecord = (match, playerName, balls, runs, wickets, wides, noBalls) => {
  let record = match.bowlingRecords.find(
    b => b.innings === match.currentInnings && b.playerName === playerName
  );
  
  if (!record) {
    // Create new bowling record if doesn't exist
    match.bowlingRecords.push({
      innings: match.currentInnings,
      teamName: match.bowlingTeam,
      playerName,
      overs: 0,
      balls: 0,
      runs: 0,
      wickets: 0,
      maidens: 0,
      economy: 0,
      wides: 0,
      noBalls: 0
    });
    record = match.bowlingRecords[match.bowlingRecords.length - 1];
  }
  
  // Ensure all values are valid numbers
  record.balls = Number(balls) || 0;
  record.overs = Math.floor(record.balls / 6);
  record.runs = Number(runs) || 0;
  record.wickets = Number(wickets) || 0;
  record.wides = Number(wides) || 0;
  record.noBalls = Number(noBalls) || 0;
  const overs = record.balls / 6;
  record.economy = overs > 0 ? Number((record.runs / overs).toFixed(2)) : 0;
};

// @desc    Update score (ball by ball)
// @route   POST /api/matches/:id/score
// @access  Public
const updateScore = async (req, res) => {
  try {
    const { runs, isWide, isNoBall, isWicket, dismissalType, newBatsman, newBowler } = req.body;
    const match = await Match.findById(req.params.id);

    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Match not found'
      });
    }

    // If only changing players (no actual scoring), skip validation
    const isOnlyPlayerChange = (newBowler || newBatsman) && runs === 0 && !isWide && !isNoBall && !isWicket;
    
    if (!isOnlyPlayerChange) {
      // Check if bowler is selected (skip if newBowler is being provided)
      if (!newBowler && (!match.currentBowler || !match.currentBowler.name)) {
        return res.status(400).json({
          success: false,
          message: 'Please select a bowler first',
          needsBowler: true
        });
      }

      // Check if batsmen are selected (skip if newBatsman is being provided)
      if (!newBatsman && (!match.striker || !match.striker.name || !match.nonStriker || !match.nonStriker.name)) {
        return res.status(400).json({
          success: false,
          message: 'Please select batsmen first',
          needsBatsmen: true
        });
      }
    }

    const currentInnings = match.currentInnings === 1 ? match.innings1 : match.innings2;
    const isLegalDelivery = !isWide && !isNoBall;

    // Only update scores if not just changing players
    if (!isOnlyPlayerChange) {
      // Update runs
      currentInnings.runs += runs;
      if (isWide) {
        currentInnings.runs += 1;
        currentInnings.extras.wides += 1;
      }
      if (isNoBall) {
        currentInnings.runs += 1;
        currentInnings.extras.noBalls += 1;
      }

      // Update striker
      if (!isWicket && isLegalDelivery && match.striker) {
        match.striker.runs += runs;
        match.striker.balls += 1;
        if (runs === 4) match.striker.fours += 1;
        if (runs === 6) match.striker.sixes += 1;
        
        // Update batting record
        updateBattingRecord(
          match,
          match.striker.name,
          match.striker.runs,
          match.striker.balls,
          match.striker.fours,
          match.striker.sixes,
          false,
          null,
          null
        );
      }

      // Update bowler
      if (match.currentBowler) {
        match.currentBowler.runs += runs;
        match.currentBowler.currentOverRuns += runs;
        if (isWide) {
          match.currentBowler.runs += 1;
          match.currentBowler.currentOverRuns += 1;
        }
        if (isNoBall) {
          match.currentBowler.runs += 1;
          match.currentBowler.currentOverRuns += 1;
        }
        if (isLegalDelivery) match.currentBowler.balls += 1;
        if (isWicket) match.currentBowler.wickets += 1;

        // Update bowling record
        updateBowlingRecord(
          match,
          match.currentBowler.name,
          match.currentBowler.balls,
          match.currentBowler.runs,
          match.currentBowler.wickets,
          isWide ? 1 : 0,
          isNoBall ? 1 : 0
        );
      }

      // Update balls and overs
      if (isLegalDelivery) {
        currentInnings.balls += 1;
        match.currentOver.push({ runs, isWide, isNoBall, isWicket });
        
        // Check if over complete
        if (currentInnings.balls % 6 === 0) {
          currentInnings.overs += 1;
          if (match.currentBowler) {
            match.currentBowler.overs = Math.floor(match.currentBowler.balls / 6);
            
            // Check for maiden
            if (match.currentBowler.currentOverRuns === 0 && match.currentOver.every(b => !b.isWide && !b.isNoBall)) {
              match.currentBowler.maidens += 1;
            }
          }
          
          match.currentOver = [];
          if (match.currentBowler) match.currentBowler.currentOverRuns = 0;
          
          // Change strike at end of over
          const temp = match.striker;
          match.striker = match.nonStriker;
          match.nonStriker = temp;
          
          // Need new bowler
          if (!newBowler) {
            match.currentBowler = null;
          }
        }
      }

      // Handle wicket
      if (isWicket) {
        currentInnings.wickets += 1;
        
        // Update batting record as out
        if (match.striker && match.currentBowler) {
          updateBattingRecord(
            match,
            match.striker.name,
            match.striker.runs,
            match.striker.balls,
            match.striker.fours,
            match.striker.sixes,
            true,
            dismissalType || 'bowled',
            match.currentBowler.name
          );
          
          // Save to player stats
          await Player.create({
            name: match.striker.name,
            matchId: match._id,
            teamName: match.battingTeam,
            runs: match.striker.runs,
            ballsFaced: match.striker.balls,
            fours: match.striker.fours,
            sixes: match.striker.sixes,
            strikeRate: match.striker.balls > 0 ? (match.striker.runs / match.striker.balls * 100).toFixed(2) : 0,
            isOut: true
          });
        }
        
        if (newBatsman && currentInnings.wickets < 10) {
          // Add new batsman to batting records
          const battingPosition = match.battingRecords.filter(b => b.innings === match.currentInnings).length;
          match.battingRecords.push({
            innings: match.currentInnings,
            teamName: match.battingTeam,
            playerName: newBatsman,
            runs: 0,
            balls: 0,
            fours: 0,
            sixes: 0,
            strikeRate: 0,
            isOut: false,
            position: battingPosition + 1
          });
          
          match.striker = { name: newBatsman, runs: 0, balls: 0, fours: 0, sixes: 0 };
        } else {
          match.striker = null;
        }
      }

      // Strike rotation on odd runs
      if (!isWicket && isLegalDelivery && (runs === 1 || runs === 3)) {
        const temp = match.striker;
        match.striker = match.nonStriker;
        match.nonStriker = temp;
      }
    } // End of !isOnlyPlayerChange block

    // Handle manual batsman change (when not after wicket)
    if (newBatsman && !isWicket) {
      // Check if batsman already has a record
      const existingBatsman = match.battingRecords.find(
        b => b.innings === match.currentInnings && b.playerName === newBatsman
      );
      
      if (!existingBatsman) {
        // Add new batsman to batting records
        const battingPosition = match.battingRecords.filter(b => b.innings === match.currentInnings).length;
        match.battingRecords.push({
          innings: match.currentInnings,
          teamName: match.battingTeam,
          playerName: newBatsman,
          runs: 0,
          balls: 0,
          fours: 0,
          sixes: 0,
          strikeRate: 0,
          isOut: false,
          position: battingPosition + 1
        });
      }
      
      // Replace striker with new batsman
      match.striker = { name: newBatsman, runs: 0, balls: 0, fours: 0, sixes: 0 };
    }

    // Change bowler if provided
    if (newBowler) {
      // Check if bowler already has a record
      const existingBowler = match.bowlingRecords.find(
        b => b.innings === match.currentInnings && b.playerName === newBowler
      );
      
      if (existingBowler) {
        match.currentBowler = {
          name: newBowler,
          overs: Number(existingBowler.overs) || 0,
          balls: Number(existingBowler.balls) || 0,
          runs: Number(existingBowler.runs) || 0,
          wickets: Number(existingBowler.wickets) || 0,
          maidens: Number(existingBowler.maidens) || 0,
          currentOverRuns: 0
        };
      } else {
        match.bowlingRecords.push({
          innings: match.currentInnings,
          teamName: match.bowlingTeam,
          playerName: newBowler,
          overs: 0,
          balls: 0,
          runs: 0,
          wickets: 0,
          maidens: 0,
          economy: 0,
          wides: 0,
          noBalls: 0
        });
        match.currentBowler = { 
          name: newBowler, 
          overs: 0, 
          balls: 0, 
          runs: 0, 
          wickets: 0, 
          maidens: 0, 
          currentOverRuns: 0 
        };
      }
    }

    // Add to ball by ball
    const commentary = generateCommentary(runs, isWide, isNoBall, isWicket, match.striker?.name, match.currentBowler?.name);
    match.ballByBall.push({
      innings: match.currentInnings,
      over: `${currentInnings.overs}.${currentInnings.balls % 6}`,
      bowler: match.currentBowler?.name,
      batsman: match.striker?.name,
      runs,
      isWide,
      isNoBall,
      isWicket,
      dismissalType: isWicket ? (dismissalType || 'bowled') : null,
      commentary
    });

    // Check innings complete
    if (currentInnings.wickets >= 10 || currentInnings.overs >= match.totalOvers) {
      if (match.currentInnings === 1) {
        // Start innings 2
        match.currentInnings = 2;
        match.status = 'innings2';
        
        // Swap teams
        const tempTeam = match.battingTeam;
        match.battingTeam = match.bowlingTeam;
        match.bowlingTeam = tempTeam;
        
        match.innings2 = {
          battingTeam: match.battingTeam,
          runs: 0,
          wickets: 0,
          overs: 0,
          balls: 0,
          extras: { wides: 0, noBalls: 0, byes: 0, legByes: 0 }
        };
        
        // Reset players (will be selected again)
        match.striker = null;
        match.nonStriker = null;
        match.currentBowler = null;
        match.currentOver = [];
      } else {
        // Match complete
        match.status = 'completed';
        
        // Determine winner
        if (match.innings2.runs > match.innings1.runs) {
          const wicketsLeft = 10 - match.innings2.wickets;
          match.winner = match.innings2.battingTeam;
          match.result = `${match.innings2.battingTeam} won by ${wicketsLeft} wickets`;
        } else if (match.innings1.runs > match.innings2.runs) {
          const runsMargin = match.innings1.runs - match.innings2.runs;
          match.winner = match.innings1.battingTeam;
          match.result = `${match.innings1.battingTeam} won by ${runsMargin} runs`;
        } else {
          match.result = 'Match Tied';
        }
      }
    }

    await match.save();

    res.status(200).json({
      success: true,
      message: 'Score updated successfully',
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

// Generate commentary
const generateCommentary = (runs, isWide, isNoBall, isWicket, batsman, bowler) => {
  if (isWicket) return `OUT! ${batsman} is dismissed by ${bowler}`;
  if (isWide) return `Wide ball! Extra run added`;
  if (isNoBall) return `No ball! Free hit coming up`;
  if (runs === 6) return `SIX! ${batsman} smashes it out of the park!`;
  if (runs === 4) return `FOUR! Beautiful shot by ${batsman}`;
  if (runs === 0) return `Dot ball. Good bowling by ${bowler}`;
  return `${runs} run${runs > 1 ? 's' : ''} scored`;
};

// @desc    Get match by ID
// @route   GET /api/matches/:id
// @access  Public
const getMatch = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);

    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Match not found'
      });
    }

    res.status(200).json({
      success: true,
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

// @desc    Get all matches
// @route   GET /api/matches
// @access  Public
const getAllMatches = async (req, res) => {
  try {
    const matches = await Match.find()
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      count: matches.length,
      data: matches
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

// @desc    Get live matches (ongoing)
// @route   GET /api/matches/live
// @access  Public
const getLiveMatches = async (req, res) => {
  try {
    const liveMatches = await Match.find({
      status: { $in: ['innings1', 'innings2'] }
    })
      .sort({ updatedAt: -1 })
      .limit(20);

    res.status(200).json({
      success: true,
      count: liveMatches.length,
      data: liveMatches
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

// @desc    Get player stats
// @route   GET /api/matches/:id/players
// @access  Public
const getPlayerStats = async (req, res) => {
  try {
    const players = await Player.find({ matchId: req.params.id });

    res.status(200).json({
      success: true,
      count: players.length,
      data: players
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

// @desc    Get my matches (Match Creator)
// @route   GET /api/matches/user/my-matches
// @access  Private (Match Creator)
const getMyMatches = async (req, res) => {
  try {
    const matches = await Match.find({ createdBy: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: matches.length,
      data: matches
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

module.exports = {
  createMatch,
  startMatch,
  updateScore,
  getMatch,
  getAllMatches,
  getLiveMatches,
  getMyMatches,
  getPlayerStats
};
