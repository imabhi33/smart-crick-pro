import { useState, useEffect } from 'react';
import { saveToLocalStorage, loadFromLocalStorage } from '../utils/localStorage';

const Scorecard = () => {
  // Match Setup State
  const [matchSetup, setMatchSetup] = useState({
    totalOvers: '',
    teamA: '',
    teamB: '',
    battingTeam: '',
    bowlingTeam: '',
    striker: '',
    nonStriker: '',
    bowler: ''
  });

  // Game State
  const [gameStarted, setGameStarted] = useState(false);
  const [innings, setInnings] = useState(1);
  const [currentInnings, setCurrentInnings] = useState({
    battingTeam: '',
    bowlingTeam: '',
    runs: 0,
    wickets: 0,
    overs: 0,
    balls: 0,
    striker: { name: '', runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false },
    nonStriker: { name: '', runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false },
    currentBowler: { name: '', overs: 0, balls: 0, runs: 0, wickets: 0, maidens: 0 },
    currentOver: [],
    allBatsmen: [],
    allBowlers: [],
    ballByBall: []
  });

  const [firstInningsScore, setFirstInningsScore] = useState(null);
  const [matchComplete, setMatchComplete] = useState(false);
  const [winner, setWinner] = useState('');
  const [showBowlerInput, setShowBowlerInput] = useState(false);
  const [newBowlerName, setNewBowlerName] = useState('');
  const [showBatsmanInput, setShowBatsmanInput] = useState(false);
  const [newBatsmanName, setNewBatsmanName] = useState('');

  // Load saved data
  useEffect(() => {
    const saved = loadFromLocalStorage();
    if (saved && saved.gameStarted) {
      setGameStarted(saved.gameStarted);
      setMatchSetup(saved.matchSetup);
      setCurrentInnings(saved.currentInnings);
      setInnings(saved.innings || 1);
      setFirstInningsScore(saved.firstInningsScore);
    }
  }, []);

  // Save data
  useEffect(() => {
    if (gameStarted) {
      saveToLocalStorage({
        gameStarted,
        matchSetup,
        currentInnings,
        innings,
        firstInningsScore
      });
    }
  }, [gameStarted, matchSetup, currentInnings, innings, firstInningsScore]);

  // Start Match
  const startMatch = () => {
    if (!matchSetup.totalOvers || !matchSetup.teamA || !matchSetup.teamB || 
        !matchSetup.battingTeam || !matchSetup.striker || !matchSetup.nonStriker || !matchSetup.bowler) {
      alert('Please fill all fields');
      return;
    }

    setCurrentInnings({
      battingTeam: matchSetup.battingTeam,
      bowlingTeam: matchSetup.bowlingTeam,
      runs: 0,
      wickets: 0,
      overs: 0,
      balls: 0,
      striker: { name: matchSetup.striker, runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false },
      nonStriker: { name: matchSetup.nonStriker, runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false },
      currentBowler: { name: matchSetup.bowler, overs: 0, balls: 0, runs: 0, wickets: 0, maidens: 0 },
      currentOver: [],
      allBatsmen: [
        { name: matchSetup.striker, runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false },
        { name: matchSetup.nonStriker, runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false }
      ],
      allBowlers: [{ name: matchSetup.bowler, overs: 0, balls: 0, runs: 0, wickets: 0, maidens: 0 }],
      ballByBall: []
    });
    setGameStarted(true);
  };

  // Handle Scoring
  const handleScore = (runs, isWide = false, isNoBall = false, isWicket = false) => {
    if (currentInnings.wickets >= 10 || currentInnings.overs >= parseInt(matchSetup.totalOvers)) return;

    let newInnings = { ...currentInnings };
    const isLegalDelivery = !isWide && !isNoBall;

    // Update runs
    newInnings.runs += runs;
    if (isWide || isNoBall) newInnings.runs += 1;

    // Update striker
    if (!isWicket) {
      newInnings.striker.runs += runs;
      if (isLegalDelivery) newInnings.striker.balls += 1;
      if (runs === 4) newInnings.striker.fours += 1;
      if (runs === 6) newInnings.striker.sixes += 1;
    }

    // Update bowler
    newInnings.currentBowler.runs += runs;
    if (isWide || isNoBall) newInnings.currentBowler.runs += 1;
    if (isLegalDelivery) newInnings.currentBowler.balls += 1;
    if (isWicket) newInnings.currentBowler.wickets += 1;

    // Update balls and overs
    if (isLegalDelivery) {
      newInnings.balls += 1;
      newInnings.currentOver.push({ runs, isWide, isNoBall, isWicket });
      
      if (newInnings.balls % 6 === 0) {
        newInnings.overs += 1;
        newInnings.currentBowler.overs = Math.floor(newInnings.currentBowler.balls / 6);
        
        // Check for maiden
        const overRuns = newInnings.currentOver.reduce((sum, ball) => sum + ball.runs, 0);
        if (overRuns === 0 && newInnings.currentOver.every(b => !b.isWide && !b.isNoBall)) {
          newInnings.currentBowler.maidens += 1;
        }
        
        newInnings.currentOver = [];
        setShowBowlerInput(true);
        
        // Change strike
        const temp = newInnings.striker;
        newInnings.striker = newInnings.nonStriker;
        newInnings.nonStriker = temp;
      }
    }

    // Handle wicket
    if (isWicket) {
      newInnings.wickets += 1;
      newInnings.striker.isOut = true;
      
      // Update all batsmen
      const batsmanIndex = newInnings.allBatsmen.findIndex(b => b.name === newInnings.striker.name);
      if (batsmanIndex !== -1) {
        newInnings.allBatsmen[batsmanIndex] = { ...newInnings.striker };
      }
      
      if (newInnings.wickets < 10) {
        setShowBatsmanInput(true);
      }
    }

    // Strike rotation on odd runs
    if (!isWicket && isLegalDelivery && (runs === 1 || runs === 3)) {
      const temp = newInnings.striker;
      newInnings.striker = newInnings.nonStriker;
      newInnings.nonStriker = temp;
    }

    // Update all batsmen and bowlers
    const strikerIndex = newInnings.allBatsmen.findIndex(b => b.name === newInnings.striker.name);
    if (strikerIndex !== -1) newInnings.allBatsmen[strikerIndex] = { ...newInnings.striker };
    
    const nonStrikerIndex = newInnings.allBatsmen.findIndex(b => b.name === newInnings.nonStriker.name);
    if (nonStrikerIndex !== -1) newInnings.allBatsmen[nonStrikerIndex] = { ...newInnings.nonStriker };
    
    const bowlerIndex = newInnings.allBowlers.findIndex(b => b.name === newInnings.currentBowler.name);
    if (bowlerIndex !== -1) {
      newInnings.allBowlers[bowlerIndex] = { ...newInnings.currentBowler };
    }

    // Add to ball by ball
    newInnings.ballByBall.push({
      over: `${newInnings.overs}.${newInnings.balls % 6}`,
      bowler: newInnings.currentBowler.name,
      batsman: newInnings.striker.name,
      runs,
      isWide,
      isNoBall,
      isWicket
    });

    setCurrentInnings(newInnings);

    // Check innings complete
    if (newInnings.wickets >= 10 || newInnings.overs >= parseInt(matchSetup.totalOvers)) {
      completeInnings(newInnings);
    }
  };

  const completeInnings = (innings) => {
    if (innings === 1) {
      setFirstInningsScore({ runs: currentInnings.runs, wickets: currentInnings.wickets });
      alert(`${currentInnings.battingTeam} scored ${currentInnings.runs}/${currentInnings.wickets}`);
      // Start 2nd innings
      setTimeout(() => {
        if (confirm('Start 2nd innings?')) {
          startSecondInnings();
        }
      }, 1000);
    } else {
      // Match complete
      declareWinner();
    }
  };

  const startSecondInnings = () => {
    const newBattingTeam = matchSetup.battingTeam === matchSetup.teamA ? matchSetup.teamB : matchSetup.teamA;
    const newBowlingTeam = matchSetup.battingTeam === matchSetup.teamA ? matchSetup.teamA : matchSetup.teamB;
    
    const striker = prompt('Enter striker name:');
    const nonStriker = prompt('Enter non-striker name:');
    const bowler = prompt('Enter bowler name:');
    
    if (!striker || !nonStriker || !bowler) return;

    setInnings(2);
    setCurrentInnings({
      battingTeam: newBattingTeam,
      bowlingTeam: newBowlingTeam,
      runs: 0,
      wickets: 0,
      overs: 0,
      balls: 0,
      striker: { name: striker, runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false },
      nonStriker: { name: nonStriker, runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false },
      currentBowler: { name: bowler, overs: 0, balls: 0, runs: 0, wickets: 0, maidens: 0 },
      currentOver: [],
      allBatsmen: [
        { name: striker, runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false },
        { name: nonStriker, runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false }
      ],
      allBowlers: [{ name: bowler, overs: 0, balls: 0, runs: 0, wickets: 0, maidens: 0 }],
      ballByBall: []
    });
  };

  const declareWinner = () => {
    const target = firstInningsScore.runs + 1;
    let result = '';
    
    if (currentInnings.runs >= target) {
      const wicketsLeft = 10 - currentInnings.wickets;
      result = `${currentInnings.battingTeam} won by ${wicketsLeft} wickets`;
    } else if (currentInnings.runs < target) {
      const runsMargin = firstInningsScore.runs - currentInnings.runs;
      result = `${currentInnings.bowlingTeam} won by ${runsMargin} runs`;
    } else {
      result = 'Match Tied!';
    }
    
    setWinner(result);
    setMatchComplete(true);
  };

  const changeBowler = () => {
    if (!newBowlerName) return;
    
    let newInnings = { ...currentInnings };
    
    // Check if bowler exists
    const existingBowler = newInnings.allBowlers.find(b => b.name === newBowlerName);
    if (existingBowler) {
      newInnings.currentBowler = { ...existingBowler };
    } else {
      newInnings.currentBowler = { name: newBowlerName, overs: 0, balls: 0, runs: 0, wickets: 0, maidens: 0 };
      newInnings.allBowlers.push({ ...newInnings.currentBowler });
    }
    
    setCurrentInnings(newInnings);
    setShowBowlerInput(false);
    setNewBowlerName('');
  };

  const addNewBatsman = () => {
    if (!newBatsmanName) return;
    
    let newInnings = { ...currentInnings };
    newInnings.striker = { name: newBatsmanName, runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false };
    newInnings.allBatsmen.push({ ...newInnings.striker });
    
    setCurrentInnings(newInnings);
    setShowBatsmanInput(false);
    setNewBatsmanName('');
  };

  const calculateStrikeRate = (runs, balls) => {
    return balls > 0 ? ((runs / balls) * 100).toFixed(1) : '0.0';
  };

  const calculateEconomy = (runs, balls) => {
    const overs = balls / 6;
    return overs > 0 ? (runs / overs).toFixed(2) : '0.00';
  };

  const resetMatch = () => {
    if (confirm('Reset match? All data will be lost.')) {
      setGameStarted(false);
      setMatchComplete(false);
      setInnings(1);
      setFirstInningsScore(null);
      setWinner('');
      setMatchSetup({
        totalOvers: '',
        teamA: '',
        teamB: '',
        battingTeam: '',
        bowlingTeam: '',
        striker: '',
        nonStriker: '',
        bowler: ''
      });
    }
  };

  // Match Setup Screen
  if (!gameStarted) {
    return (
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-5xl font-bold gradient-text mb-4">Match Setup</h1>
            <p className="text-gray-400 text-lg">Configure your cricket match</p>
          </div>

          <div className="glass-effect rounded-2xl p-8 space-y-6">
            {/* Match Details */}
            <div>
              <label className="block text-sm font-medium mb-2 text-primary-green">Number of Overs</label>
              <input
                type="number"
                placeholder="e.g., 5, 10, 20"
                value={matchSetup.totalOvers}
                onChange={(e) => setMatchSetup({ ...matchSetup, totalOvers: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-blue"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-primary-green">Team A Name</label>
                <input
                  type="text"
                  placeholder="Team A"
                  value={matchSetup.teamA}
                  onChange={(e) => setMatchSetup({ ...matchSetup, teamA: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-blue"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-primary-green">Team B Name</label>
                <input
                  type="text"
                  placeholder="Team B"
                  value={matchSetup.teamB}
                  onChange={(e) => setMatchSetup({ ...matchSetup, teamB: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-blue"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-primary-green">Batting Team</label>
                <select
                  value={matchSetup.battingTeam}
                  onChange={(e) => {
                    const batting = e.target.value;
                    const bowling = batting === matchSetup.teamA ? matchSetup.teamB : matchSetup.teamA;
                    setMatchSetup({ ...matchSetup, battingTeam: batting, bowlingTeam: bowling });
                  }}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-blue text-white appearance-none cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23B8FF3C'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 0.75rem center',
                    backgroundSize: '1.5em 1.5em',
                    paddingRight: '2.5rem'
                  }}
                >
                  <option value="" className="bg-primary-dark text-gray-400">Select Team</option>
                  <option value={matchSetup.teamA} className="bg-primary-dark text-white">{matchSetup.teamA || 'Team A'}</option>
                  <option value={matchSetup.teamB} className="bg-primary-dark text-white">{matchSetup.teamB || 'Team B'}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-primary-green">Bowling Team</label>
                <input
                  type="text"
                  value={matchSetup.bowlingTeam}
                  readOnly
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-gray-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-primary-green">Striker (Batsman 1)</label>
                <input
                  type="text"
                  placeholder="Striker name"
                  value={matchSetup.striker}
                  onChange={(e) => setMatchSetup({ ...matchSetup, striker: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-blue"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-primary-green">Non-Striker (Batsman 2)</label>
                <input
                  type="text"
                  placeholder="Non-striker name"
                  value={matchSetup.nonStriker}
                  onChange={(e) => setMatchSetup({ ...matchSetup, nonStriker: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-blue"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-primary-green">Opening Bowler</label>
              <input
                type="text"
                placeholder="Bowler name"
                value={matchSetup.bowler}
                onChange={(e) => setMatchSetup({ ...matchSetup, bowler: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-blue"
              />
            </div>

            <button
              onClick={startMatch}
              className="w-full py-4 bg-gradient-to-r from-primary-blue to-primary-green rounded-lg font-bold text-lg hover:scale-105 transition-transform"
            >
              🏏 Start Match
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Match Complete Screen
  if (matchComplete) {
    return (
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="glass-effect rounded-2xl p-12 text-center animate-fade-in">
            <div className="text-6xl mb-6">🏆</div>
            <h1 className="text-4xl font-bold gradient-text mb-4">Match Complete!</h1>
            <div className="text-3xl font-bold text-primary-green mb-8">{winner}</div>
            
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="bg-white/5 rounded-xl p-6">
                <div className="text-sm text-gray-400 mb-2">1st Innings</div>
                <div className="text-2xl font-bold">{firstInningsScore.runs}/{firstInningsScore.wickets}</div>
              </div>
              <div className="bg-white/5 rounded-xl p-6">
                <div className="text-sm text-gray-400 mb-2">2nd Innings</div>
                <div className="text-2xl font-bold">{currentInnings.runs}/{currentInnings.wickets}</div>
              </div>
            </div>

            <button
              onClick={resetMatch}
              className="px-8 py-3 bg-gradient-to-r from-primary-blue to-primary-green rounded-lg font-semibold hover:scale-105 transition-transform"
            >
              Start New Match
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Live Scoring Screen
  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="glass-effect rounded-2xl p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl font-bold gradient-text">{currentInnings.battingTeam} vs {currentInnings.bowlingTeam}</h2>
              <p className="text-sm text-gray-400">Innings {innings} • {matchSetup.totalOvers} Overs Match</p>
            </div>
            <button onClick={resetMatch} className="px-4 py-2 bg-red-500/20 border border-red-500 text-red-400 rounded-lg text-sm hover:bg-red-500/30">
              Reset Match
            </button>
          </div>
          
          {/* Score Display */}
          <div className="text-center py-6 border-y border-white/10">
            <div className="text-6xl font-bold gradient-text mb-2">
              {currentInnings.runs}/{currentInnings.wickets}
            </div>
            <div className="text-2xl text-gray-400">
              Overs: {Math.floor(currentInnings.balls / 6)}.{currentInnings.balls % 6} / {matchSetup.totalOvers}
            </div>
            {firstInningsScore && (
              <div className="text-sm text-primary-green mt-2">
                Target: {firstInningsScore.runs + 1} | Need {firstInningsScore.runs + 1 - currentInnings.runs} runs
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Current Batsmen */}
          <div className="lg:col-span-2 glass-effect rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-4 text-primary-blue">Current Batsmen</h3>
            <div className="space-y-3">
              <div className="bg-white/5 rounded-lg p-4 border-l-4 border-primary-green">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-lg">{currentInnings.striker.name} *</span>
                  <span className="text-2xl font-bold text-primary-green">{currentInnings.striker.runs}</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-sm text-gray-400">
                  <div>Balls: {currentInnings.striker.balls}</div>
                  <div>4s: {currentInnings.striker.fours}</div>
                  <div>6s: {currentInnings.striker.sixes}</div>
                  <div>SR: {calculateStrikeRate(currentInnings.striker.runs, currentInnings.striker.balls)}</div>
                </div>
              </div>

              <div className="bg-white/5 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-lg">{currentInnings.nonStriker.name}</span>
                  <span className="text-2xl font-bold">{currentInnings.nonStriker.runs}</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-sm text-gray-400">
                  <div>Balls: {currentInnings.nonStriker.balls}</div>
                  <div>4s: {currentInnings.nonStriker.fours}</div>
                  <div>6s: {currentInnings.nonStriker.sixes}</div>
                  <div>SR: {calculateStrikeRate(currentInnings.nonStriker.runs, currentInnings.nonStriker.balls)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Current Bowler */}
          <div className="glass-effect rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-4 text-primary-green">Current Bowler</h3>
            <div className="bg-white/5 rounded-lg p-4">
              <div className="font-bold text-lg mb-3">{currentInnings.currentBowler.name}</div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Overs:</span>
                  <span className="font-bold">{Math.floor(currentInnings.currentBowler.balls / 6)}.{currentInnings.currentBowler.balls % 6}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Runs:</span>
                  <span className="font-bold">{currentInnings.currentBowler.runs}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Wickets:</span>
                  <span className="font-bold text-red-400">{currentInnings.currentBowler.wickets}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Economy:</span>
                  <span className="font-bold text-primary-blue">{calculateEconomy(currentInnings.currentBowler.runs, currentInnings.currentBowler.balls)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scoring Buttons */}
        <div className="glass-effect rounded-2xl p-6 mb-6">
          <h3 className="text-xl font-bold mb-4 gradient-text">Scoring Buttons</h3>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-3 mb-4">
            <button onClick={() => handleScore(0)} className="py-4 bg-gray-600 hover:bg-gray-500 rounded-lg font-bold text-lg transition-colors">0</button>
            <button onClick={() => handleScore(1)} className="py-4 bg-blue-600 hover:bg-blue-500 rounded-lg font-bold text-lg transition-colors">1</button>
            <button onClick={() => handleScore(2)} className="py-4 bg-green-600 hover:bg-green-500 rounded-lg font-bold text-lg transition-colors">2</button>
            <button onClick={() => handleScore(3)} className="py-4 bg-yellow-600 hover:bg-yellow-500 rounded-lg font-bold text-lg transition-colors">3</button>
            <button onClick={() => handleScore(4)} className="py-4 bg-orange-600 hover:bg-orange-500 rounded-lg font-bold text-lg transition-colors">4</button>
            <button onClick={() => handleScore(6)} className="py-4 bg-purple-600 hover:bg-purple-500 rounded-lg font-bold text-lg transition-colors">6</button>
            <button onClick={() => handleScore(0, false, false, true)} className="py-4 bg-red-600 hover:bg-red-500 rounded-lg font-bold text-lg transition-colors">W</button>
            <button onClick={() => handleScore(0, true)} className="py-4 bg-pink-600 hover:bg-pink-500 rounded-lg font-bold text-sm transition-colors">WD</button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => handleScore(0, false, true)} className="py-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-bold transition-colors">No Ball</button>
            <button onClick={() => handleScore(1, true)} className="py-3 bg-pink-600 hover:bg-pink-500 rounded-lg font-bold transition-colors">Wide + 1</button>
          </div>
        </div>

        {/* Current Over */}
        {currentInnings.currentOver.length > 0 && (
          <div className="glass-effect rounded-2xl p-6 mb-6">
            <h3 className="text-xl font-bold mb-4 text-primary-green">Current Over</h3>
            <div className="flex gap-2 flex-wrap">
              {currentInnings.currentOver.map((ball, idx) => (
                <div key={idx} className={`px-4 py-2 rounded-lg font-bold ${
                  ball.isWicket ? 'bg-red-600' :
                  ball.isWide || ball.isNoBall ? 'bg-pink-600' :
                  ball.runs === 6 ? 'bg-purple-600' :
                  ball.runs === 4 ? 'bg-orange-600' :
                  ball.runs === 0 ? 'bg-gray-600' : 'bg-blue-600'
                }`}>
                  {ball.isWicket ? 'W' : ball.isWide ? 'WD' : ball.isNoBall ? 'NB' : ball.runs}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Scorecards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Batting Scorecard */}
          <div className="glass-effect rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-4 text-primary-blue">Batting Scorecard</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-2">Batsman</th>
                    <th className="text-center py-2">R</th>
                    <th className="text-center py-2">B</th>
                    <th className="text-center py-2">4s</th>
                    <th className="text-center py-2">6s</th>
                    <th className="text-center py-2">SR</th>
                  </tr>
                </thead>
                <tbody>
                  {currentInnings.allBatsmen.map((batsman, idx) => (
                    <tr key={idx} className="border-b border-white/5">
                      <td className="py-2">
                        {batsman.name}
                        {batsman.name === currentInnings.striker.name && ' *'}
                        {batsman.isOut && ' (out)'}
                      </td>
                      <td className="text-center py-2 font-bold">{batsman.runs}</td>
                      <td className="text-center py-2">{batsman.balls}</td>
                      <td className="text-center py-2">{batsman.fours}</td>
                      <td className="text-center py-2">{batsman.sixes}</td>
                      <td className="text-center py-2 text-primary-green">{calculateStrikeRate(batsman.runs, batsman.balls)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bowling Scorecard */}
          <div className="glass-effect rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-4 text-primary-green">Bowling Scorecard</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-2">Bowler</th>
                    <th className="text-center py-2">O</th>
                    <th className="text-center py-2">R</th>
                    <th className="text-center py-2">W</th>
                    <th className="text-center py-2">Econ</th>
                  </tr>
                </thead>
                <tbody>
                  {currentInnings.allBowlers.map((bowler, idx) => (
                    <tr key={idx} className="border-b border-white/5">
                      <td className="py-2">
                        {bowler.name}
                        {bowler.name === currentInnings.currentBowler.name && ' *'}
                      </td>
                      <td className="text-center py-2">{Math.floor(bowler.balls / 6)}.{bowler.balls % 6}</td>
                      <td className="text-center py-2">{bowler.runs}</td>
                      <td className="text-center py-2 font-bold text-red-400">{bowler.wickets}</td>
                      <td className="text-center py-2 text-primary-blue">{calculateEconomy(bowler.runs, bowler.balls)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modals */}
        {showBowlerInput && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="glass-effect rounded-2xl p-8 max-w-md w-full animate-fade-in">
              <h3 className="text-2xl font-bold mb-4 gradient-text">Change Bowler</h3>
              <p className="text-gray-400 mb-4">Over complete! Enter next bowler name:</p>
              <input
                type="text"
                placeholder="Bowler name"
                value={newBowlerName}
                onChange={(e) => setNewBowlerName(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-blue mb-4"
                autoFocus
              />
              <button
                onClick={changeBowler}
                className="w-full py-3 bg-gradient-to-r from-primary-blue to-primary-green rounded-lg font-bold hover:scale-105 transition-transform"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {showBatsmanInput && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="glass-effect rounded-2xl p-8 max-w-md w-full animate-fade-in">
              <h3 className="text-2xl font-bold mb-4 gradient-text">New Batsman</h3>
              <p className="text-gray-400 mb-4">Wicket! Enter new batsman name:</p>
              <input
                type="text"
                placeholder="Batsman name"
                value={newBatsmanName}
                onChange={(e) => setNewBatsmanName(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-blue mb-4"
                autoFocus
              />
              <button
                onClick={addNewBatsman}
                className="w-full py-3 bg-gradient-to-r from-primary-blue to-primary-green rounded-lg font-bold hover:scale-105 transition-transform"
              >
                Continue
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Scorecard;
