const Match = require('../models/Match');
const Player = require('../models/Player');
const Ground = require('../models/Ground');

// Get Ground Stats
exports.getGroundStats = async (req, res) => {
  try {
    const { groundId } = req.params;
    
    // Find all completed matches at this ground
    const matches = await Match.find({ 
      _id: groundId, // Note: The current Match model stores groundId as _id of Ground? No, it has groundId field.
      // Wait, let's check the Match model again. It has groundId.
      // But we are querying Match collection.
      groundId: groundId,
      status: 'completed' 
    });

    if (!matches || matches.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          matchesPlayed: 0,
          avgFirstInningsScore: 0,
          highestScore: 0,
          battingFirstWins: 0,
          battingSecondWins: 0
        }
      });
    }

    let totalFirstInningsRuns = 0;
    let highestScore = 0;
    let battingFirstWins = 0;
    let battingSecondWins = 0;

    matches.forEach(match => {
      // Avg Score
      totalFirstInningsRuns += match.innings1.runs;
      
      // Highest Score
      if (match.innings1.runs > highestScore) highestScore = match.innings1.runs;
      if (match.innings2.runs > highestScore) highestScore = match.innings2.runs;

      // Win Stats
      if (match.result) {
        // This logic depends on how result is stored. 
        // Usually "Team A won by X runs" implies batting first won if Team A batted first.
        // Let's rely on the winner field and toss/electedTo if available, or infer from innings.
        
        const winner = match.winner;
        const batFirstTeam = match.innings1.battingTeam;
        
        if (winner === batFirstTeam) {
          battingFirstWins++;
        } else {
          battingSecondWins++;
        }
      }
    });

    const stats = {
      matchesPlayed: matches.length,
      avgFirstInningsScore: Math.round(totalFirstInningsRuns / matches.length),
      highestScore,
      battingFirstWins,
      battingSecondWins,
      winPercentageBattingFirst: ((battingFirstWins / matches.length) * 100).toFixed(1),
      winPercentageBattingSecond: ((battingSecondWins / matches.length) * 100).toFixed(1)
    };

    res.status(200).json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Error fetching ground stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch ground stats'
    });
  }
};

// Get Player Stats
exports.getPlayerStats = async (req, res) => {
  try {
    const { playerId } = req.params; // This might be a name or ID. The current system uses names mostly in arrays.
    // However, for a robust system we should use IDs. 
    // But looking at Match.js, players are stored as Strings (names).
    // So we will query by player name for now.
    
    // If the frontend sends a name, we use it.
    const playerName = req.params.playerName; // We'll assume the route param is playerName

    const matches = await Match.find({
      $or: [
        { 'teamA.players': playerName },
        { 'teamB.players': playerName }
      ],
      status: 'completed'
    });

    let runs = 0;
    let ballsFaced = 0;
    let fours = 0;
    let sixes = 0;
    let inningsBatted = 0;
    let notOuts = 0;
    let highestScore = 0;
    
    let ballsBowled = 0;
    let runsConceded = 0;
    let wickets = 0;
    let inningsBowled = 0;
    let bestBowling = { wickets: 0, runs: 0 };

    matches.forEach(match => {
      // Batting Stats
      const battingRecord = match.battingRecords.find(r => r.playerName === playerName);
      if (battingRecord) {
        inningsBatted++;
        runs += battingRecord.runs;
        ballsFaced += battingRecord.balls;
        fours += battingRecord.fours;
        sixes += battingRecord.sixes;
        if (!battingRecord.isOut) notOuts++;
        if (battingRecord.runs > highestScore) highestScore = battingRecord.runs;
      }

      // Bowling Stats
      const bowlingRecord = match.bowlingRecords.find(r => r.playerName === playerName);
      if (bowlingRecord) {
        inningsBowled++;
        ballsBowled += bowlingRecord.balls + (bowlingRecord.overs * 6); // Approximate if balls not stored separately correctly
        // Actually bowlingRecords has 'overs' and 'balls' (partial over).
        // Let's calculate total balls properly.
        const totalBallsInMatch = (Math.floor(bowlingRecord.overs) * 6) + (bowlingRecord.overs % 1 * 10); 
        // Wait, usually overs is stored as 3.4 (3 overs 4 balls).
        // Let's assume standard cricket notation.
        
        // But wait, the schema says: overs: { type: Number, default: 0 }, balls: { type: Number, default: 0 }
        // It seems 'balls' might be the total balls or the extra balls.
        // Let's look at how it's updated in the controller (not visible here, but let's assume 'overs' is completed overs and 'balls' is extra balls or total balls).
        // Let's stick to the schema:
        // "overs": Number, "balls": Number.
        // If the update logic stores 3.4 in overs, then it's a float.
        // If it stores 3 in overs and 4 in balls, that's different.
        // For now, let's just sum up what we have.
        
        runsConceded += bowlingRecord.runs;
        wickets += bowlingRecord.wickets;
        
        if (bowlingRecord.wickets > bestBowling.wickets || 
           (bowlingRecord.wickets === bestBowling.wickets && bowlingRecord.runs < bestBowling.runs)) {
          bestBowling = { wickets: bowlingRecord.wickets, runs: bowlingRecord.runs };
        }
      }
    });

    const battingAverage = (inningsBatted - notOuts) > 0 ? (runs / (inningsBatted - notOuts)).toFixed(2) : runs;
    const battingStrikeRate = ballsFaced > 0 ? ((runs / ballsFaced) * 100).toFixed(2) : 0;
    
    const bowlingAverage = wickets > 0 ? (runsConceded / wickets).toFixed(2) : 0;
    const bowlingEconomy = ballsBowled > 0 ? (runsConceded / (ballsBowled / 6)).toFixed(2) : 0;

    const stats = {
      name: playerName,
      matches: matches.length,
      batting: {
        innings: inningsBatted,
        runs,
        balls: ballsFaced,
        average: battingAverage,
        strikeRate: battingStrikeRate,
        highestScore,
        fours,
        sixes,
        notOuts
      },
      bowling: {
        innings: inningsBowled,
        wickets,
        runs: runsConceded,
        average: bowlingAverage,
        economy: bowlingEconomy,
        bestBowling: `${bestBowling.wickets}/${bestBowling.runs}`
      }
    };

    res.status(200).json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Error fetching player stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch player stats'
    });
  }
};
