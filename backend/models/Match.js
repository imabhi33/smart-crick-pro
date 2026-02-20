const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  // Match Details
  groundId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ground',
    required: true
  },
  groundName: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  matchDate: {
    type: Date,
    default: Date.now
  },
  totalOvers: {
    type: Number,
    required: true
  },

  // Teams
  teamA: {
    name: { type: String, required: true },
    players: [{
      type: mongoose.Schema.Types.Mixed, // Supports both String and Object for backward compatibility
      // When object format:
      // {
      //   name: String,
      //   role: String (optional: 'Batsman', 'All-rounder', 'Bowler', 'Wicket Keeper'),
      //   captain: Boolean,
      //   viceCaptain: Boolean,
      //   wicketKeeper: Boolean
      // }
    }]
  },
  teamB: {
    name: { type: String, required: true },
    players: [{
      type: mongoose.Schema.Types.Mixed, // Supports both String and Object for backward compatibility
    }]
  },

  // Current Match State
  currentInnings: {
    type: Number,
    default: 1
  },
  battingTeam: {
    type: String,
    required: false // Will be set during player configuration step
  },
  bowlingTeam: {
    type: String,
    required: false // Will be set during player configuration step
  },

  // Innings 1
  innings1: {
    battingTeam: String,
    runs: { type: Number, default: 0 },
    wickets: { type: Number, default: 0 },
    overs: { type: Number, default: 0 },
    balls: { type: Number, default: 0 },
    extras: {
      wides: { type: Number, default: 0 },
      noBalls: { type: Number, default: 0 },
      byes: { type: Number, default: 0 },
      legByes: { type: Number, default: 0 }
    }
  },

  // Innings 2
  innings2: {
    battingTeam: String,
    runs: { type: Number, default: 0 },
    wickets: { type: Number, default: 0 },
    overs: { type: Number, default: 0 },
    balls: { type: Number, default: 0 },
    extras: {
      wides: { type: Number, default: 0 },
      noBalls: { type: Number, default: 0 },
      byes: { type: Number, default: 0 },
      legByes: { type: Number, default: 0 }
    }
  },

  // Complete Batting Records
  battingRecords: [{
    innings: Number,
    teamName: String,
    playerName: String,
    runs: { type: Number, default: 0 },
    balls: { type: Number, default: 0 },
    fours: { type: Number, default: 0 },
    sixes: { type: Number, default: 0 },
    strikeRate: { type: Number, default: 0 },
    isOut: { type: Boolean, default: false },
    dismissalType: String, // bowled, caught, lbw, run out, etc.
    dismissedBy: String, // bowler name
    position: Number // batting order
  }],

  // Complete Bowling Records
  bowlingRecords: [{
    innings: Number,
    teamName: String,
    playerName: String,
    overs: { type: Number, default: 0 },
    balls: { type: Number, default: 0 },
    runs: { type: Number, default: 0 },
    wickets: { type: Number, default: 0 },
    maidens: { type: Number, default: 0 },
    economy: { type: Number, default: 0 },
    wides: { type: Number, default: 0 },
    noBalls: { type: Number, default: 0 }
  }],

  // Current Players
  striker: {
    name: String,
    runs: { type: Number, default: 0 },
    balls: { type: Number, default: 0 },
    fours: { type: Number, default: 0 },
    sixes: { type: Number, default: 0 }
  },
  nonStriker: {
    name: String,
    runs: { type: Number, default: 0 },
    balls: { type: Number, default: 0 },
    fours: { type: Number, default: 0 },
    sixes: { type: Number, default: 0 }
  },
  currentBowler: {
    name: String,
    overs: { type: Number, default: 0 },
    balls: { type: Number, default: 0 },
    runs: { type: Number, default: 0 },
    wickets: { type: Number, default: 0 },
    maidens: { type: Number, default: 0 },
    currentOverRuns: { type: Number, default: 0 }
  },

  // Current Over Balls
  currentOver: [{
    runs: Number,
    isWide: Boolean,
    isNoBall: Boolean,
    isWicket: Boolean
  }],

  // Match Status
  status: {
    type: String,
    enum: ['setup', 'innings1', 'innings2', 'completed'],
    default: 'setup'
  },
  winner: {
    type: String,
    default: null
  },
  result: {
    type: String,
    default: null
  },

  // Ball by Ball Commentary
  ballByBall: [{
    innings: Number,
    over: String,
    bowler: String,
    batsman: String,
    runs: Number,
    isWide: Boolean,
    isNoBall: Boolean,
    isWicket: Boolean,
    dismissalType: String,
    commentary: String,
    timestamp: { type: Date, default: Date.now }
  }],

  // Partnership Records
  partnerships: [{
    innings: Number,
    batsman1: String,
    batsman2: String,
    runs: Number,
    balls: Number
  }],

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tossWinner: {
    type: String,
    default: null
  },
  electedTo: {
    type: String,
    enum: ['bat', 'bowl', null],
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
matchSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Match', matchSchema);
