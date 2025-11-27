const Match = require('../models/Match');
const Player = require('../models/Player');
const Ground = require('../models/Ground');

// Get Ground Stats
exports.getGroundStats = async (req, res) => {
  try {
    const { groundId } = req.params;

    // Find all completed matches at this ground
    const matches = await Match.find({
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
      if (match.innings2?.runs > highestScore) highestScore = match.innings2.runs;

      // Win Stats
      if (match.result) {
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
    const { playerId } = req.params;
    const playerName = req.params.playerName;

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
        // FIXED: Use only balls field which contains total balls bowled
        ballsBowled += bowlingRecord.balls || 0;

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
