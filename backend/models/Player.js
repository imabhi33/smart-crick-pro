const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  matchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Match',
    required: true
  },
  teamName: {
    type: String,
    required: true
  },
  // Batting Stats
  runs: {
    type: Number,
    default: 0
  },
  ballsFaced: {
    type: Number,
    default: 0
  },
  fours: {
    type: Number,
    default: 0
  },
  sixes: {
    type: Number,
    default: 0
  },
  strikeRate: {
    type: Number,
    default: 0
  },
  isOut: {
    type: Boolean,
    default: false
  },
  // Bowling Stats
  oversBowled: {
    type: Number,
    default: 0
  },
  ballsBowled: {
    type: Number,
    default: 0
  },
  runsConceded: {
    type: Number,
    default: 0
  },
  wicketsTaken: {
    type: Number,
    default: 0
  },
  maidens: {
    type: Number,
    default: 0
  },
  economy: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Player', playerSchema);
