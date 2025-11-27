import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import matchService from '../services/match.service';

const Scorecard = () => {
  const { id } = useParams(); // Get match ID from URL
  const { user, isMatchCreator, isAdmin, isAuthenticated } = useAuth();
  const [currentMatchId, setCurrentMatchId] = useState(id || null);
  const [viewMode, setViewMode] = useState(false); // Start in edit mode, will be set based on permissions
  const [isMatchOwner, setIsMatchOwner] = useState(false);

  // Match Setup State
  const [matchSetup, setMatchSetup] = useState({
    groundName: '',
    location: '',
    totalOvers: '',
    teamA: { name: '', players: ['', '', '', '', '', '', '', '', '', '', ''] },
    teamB: { name: '', players: ['', '', '', '', '', '', '', '', '', '', ''] },
    battingTeam: ''
  });

  // Game State
  const [gameStarted, setGameStarted] = useState(false);
  const [matchData, setMatchData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Player Selection
  const [showPlayerSelection, setShowPlayerSelection] = useState(false);
  const [selectedStriker, setSelectedStriker] = useState('');
  const [selectedNonStriker, setSelectedNonStriker] = useState('');
  const [selectedBowler, setSelectedBowler] = useState('');

  // Modals
  const [showBowlerInput, setShowBowlerInput] = useState(false);
  const [newBowlerName, setNewBowlerName] = useState('');
  const [showBatsmanInput, setShowBatsmanInput] = useState(false);
  const [newBatsmanName, setNewBatsmanName] = useState('');
  const [showEndMatchModal, setShowEndMatchModal] = useState(false);
  const [endMatchPassword, setEndMatchPassword] = useState('');

  // Access Control: Only match creators and admins can create/edit matches
  // Public users can only view matches
  const canEditMatch = () => {
    if (!id) {
      // Creating new match - requires match creator or admin
      return isMatchCreator() || isAdmin();
    }
    // Viewing/editing existing match
    // Public can view, but only owner/admin can edit
    return isMatchOwner || isAdmin();
  };

  // Load match if ID is provided in URL
  useEffect(() => {
    if (id) {
      loadMatch(id);
    }
  }, [id]);

  // Load existing match
  const loadMatch = async (matchId) => {
    try {
      setLoading(true);
      const response = await matchService.getMatch(matchId);

      if (response.success) {
        setMatchData(response.data);
        setCurrentMatchId(response.data._id);

        // Check if current user is the match creator or admin
        const canEdit = user && (response.data.createdBy === user._id || isAdmin());
        setIsMatchOwner(canEdit);

        // Set view mode: only view-only if user cannot edit AND match is completed
        if (!canEdit || response.data.status === 'completed') {
          setViewMode(true);
        } else {
          setViewMode(false);
        }

        // Check if we need to show player selection
        // This happens when: status is setup OR when innings starts but no players selected yet
        if (response.data.status === 'setup') {
          setShowPlayerSelection(true);
          setGameStarted(false);
        } else if ((response.data.status === 'innings1' || response.data.status === 'innings2') &&
          (!response.data.striker || !response.data.nonStriker || !response.data.currentBowler)) {
          // Innings started but players not selected yet (happens at start of innings 2)
          setShowPlayerSelection(true);
          setGameStarted(false);
        } else if (response.data.status === 'innings1' || response.data.status === 'innings2') {
          // Match is in progress with players selected
          setGameStarted(true);
          setShowPlayerSelection(false);
        }
      }

      setLoading(false);
    } catch (err) {
      setError('Failed to load match');
      setLoading(false);
    }
  };

  // Auto-refresh match data every 3 seconds when viewing
  useEffect(() => {
    if (viewMode && currentMatchId && gameStarted) {
      const interval = setInterval(() => {
        loadMatch(currentMatchId);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [viewMode, currentMatchId, gameStarted]);

  // Create Match
  const createMatch = async () => {
    try {
      setLoading(true);
      setError('');

      // Validation
      if (!matchSetup.groundName || !matchSetup.location || !matchSetup.totalOvers) {
        setError('Please fill ground details and overs');
        setLoading(false);
        return;
      }

      if (!matchSetup.teamA.name || !matchSetup.teamB.name) {
        setError('Please enter team names');
        setLoading(false);
        return;
      }

      // Check all players are filled
      const teamAFilled = matchSetup.teamA.players.every(p => p.trim() !== '');
      const teamBFilled = matchSetup.teamB.players.every(p => p.trim() !== '');

      if (!teamAFilled || !teamBFilled) {
        setError('Please enter all 11 players for both teams');
        setLoading(false);
        return;
      }

      if (!matchSetup.battingTeam) {
        setError('Please select batting team');
        setLoading(false);
        return;
      }

      const response = await matchService.createMatch(matchSetup);

      if (response.success) {
        setCurrentMatchId(response.data._id);
        setMatchData(response.data);
        setShowPlayerSelection(true);
      }

      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create match');
      setLoading(false);
    }
  };

  // Start Match with selected players
  const startMatchWithPlayers = async () => {
    try {
      setLoading(true);
      setError('');

      if (!selectedStriker || !selectedNonStriker || !selectedBowler) {
        setError('Please select all players');
        setLoading(false);
        return;
      }

      const response = await matchService.startMatch(currentMatchId, {
        striker: selectedStriker,
        nonStriker: selectedNonStriker,
        bowler: selectedBowler
      });

      if (response.success) {
        setMatchData(response.data);
        setGameStarted(true);
        setShowPlayerSelection(false);
      }

      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to start match');
      setLoading(false);
    }
  };

  // Handle Score Update
  const handleScore = async (runs, isWide = false, isNoBall = false, isWicket = false) => {
    try {
      setLoading(true);
      setError('');

      const scoreData = {
        runs,
        isWide,
        isNoBall,
        isWicket
      };

      const response = await matchService.updateScore(currentMatchId, scoreData);

      if (response.success) {
        const previousInnings = matchData?.currentInnings;
        setMatchData(response.data);

        // Check if innings changed (innings 1 ended, innings 2 starting)
        if (previousInnings === 1 && response.data.currentInnings === 2 && response.data.status === 'innings2') {
          // Innings changed - need to select new players
          setGameStarted(false);
          setShowPlayerSelection(true);
          setSelectedStriker('');
          setSelectedNonStriker('');
          setSelectedBowler('');
          return;
        }

        // Check if need new bowler
        if (response.data.currentBowler === null && response.data.status !== 'completed') {
          setShowBowlerInput(true);
        }

        // Check if need new batsman
        if (isWicket && response.data.striker === null && response.data.status !== 'completed') {
          setShowBatsmanInput(true);
        }
      }

      setLoading(false);
    } catch (err) {
      const errorData = err.response?.data;
      setError(errorData?.message || 'Failed to update score');

      // Show appropriate modal based on error
      if (errorData?.needsBowler) {
        setShowBowlerInput(true);
      }
      if (errorData?.needsBatsmen) {
        setShowBatsmanInput(true);
      }

      setLoading(false);
    }
  };

  // Change Bowler
  const changeBowler = async () => {
    try {
      if (!newBowlerName) return;

      setLoading(true);
      const response = await matchService.updateScore(currentMatchId, {
        runs: 0,
        newBowler: newBowlerName
      });

      if (response.success) {
        setMatchData(response.data);
        setShowBowlerInput(false);
        setNewBowlerName('');
      }

      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change bowler');
      setLoading(false);
    }
  };

  // Add New Batsman
  const addNewBatsman = async () => {
    try {
      if (!newBatsmanName) return;

      setLoading(true);
      const response = await matchService.updateScore(currentMatchId, {
        runs: 0,
        newBatsman: newBatsmanName
      });

      if (response.success) {
        setMatchData(response.data);
        setShowBatsmanInput(false);
        setNewBatsmanName('');
      }

      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add batsman');
      setLoading(false);
    }
  };

  const calculateStrikeRate = (runs, balls) => {
    return balls > 0 ? ((runs / balls) * 100).toFixed(1) : '0.0';
  };

  const calculateEconomy = (runs, balls) => {
    const overs = balls / 6;
    return overs > 0 ? (runs / overs).toFixed(2) : '0.00';
  };

  const handleEndMatch = async () => {
    try {
      if (!endMatchPassword) {
        setError('Please enter password');
        return;
      }

      setLoading(true);
      const response = await matchService.endMatch(currentMatchId, endMatchPassword);

      if (response.success) {
        setMatchData(response.data);
        setShowEndMatchModal(false);
        setEndMatchPassword('');
        alert('Match ended successfully!');
      }

      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid password or failed to end match');
      setLoading(false);
    }
  };

  const resetMatch = () => {
    if (confirm('Start new match? Current match data is saved in database.')) {
      setGameStarted(false);
      setMatchData(null);
      setCurrentMatchId(null);
      setShowPlayerSelection(false);
      setViewMode(false);
      setMatchSetup({
        groundName: '',
        location: '',
        totalOvers: '',
        teamA: { name: '', players: ['', '', '', '', '', '', '', '', '', '', ''] },
        teamB: { name: '', players: ['', '', '', '', '', '', '', '', '', '', ''] },
        battingTeam: ''
      });
      window.history.pushState({}, '', '/scorecard');
    }
  };

  const updateTeamAPlayer = (index, value) => {
    const newPlayers = [...matchSetup.teamA.players];
    newPlayers[index] = value;
    setMatchSetup({
      ...matchSetup,
      teamA: { ...matchSetup.teamA, players: newPlayers }
    });
  };

  const updateTeamBPlayer = (index, value) => {
    const newPlayers = [...matchSetup.teamB.players];
    newPlayers[index] = value;
    setMatchSetup({
      ...matchSetup,
      teamB: { ...matchSetup.teamB, players: newPlayers }
    });
  };

  // Player Selection Screen
  if (showPlayerSelection && matchData) {
    const battingTeamPlayers = matchData.battingTeam === matchData.teamA.name
      ? matchData.teamA.players
      : matchData.teamB.players;

    const bowlingTeamPlayers = matchData.bowlingTeam === matchData.teamA.name
      ? matchData.teamA.players
      : matchData.teamB.players;

    const isInnings2 = matchData.currentInnings === 2;
    const targetScore = isInnings2 ? matchData.innings1.runs + 1 : null;

    return (
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="glass-effect rounded-2xl p-8">
            <h2 className="text-3xl font-bold gradient-text mb-6 text-center">
              {isInnings2 ? `Innings 2 - Select Opening Players` : 'Select Opening Players'}
            </h2>

            {isInnings2 && (
              <div className="bg-primary-blue/20 border border-primary-blue/30 rounded-lg p-4 mb-6 text-center">
                <div className="text-sm text-gray-400 mb-1">Target Score</div>
                <div className="text-3xl font-bold text-primary-blue">{targetScore}</div>
                <div className="text-sm text-gray-400 mt-1">
                  {matchData.innings1.battingTeam} scored {matchData.innings1.runs}/{matchData.innings1.wickets} in {matchData.innings1.overs} overs
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            <div className="space-y-6">
              {/* Striker */}
              <div>
                <label className="block text-lg font-medium mb-3 text-primary-green">
                  Select Striker ({matchData.battingTeam})
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {battingTeamPlayers
                    .filter(player => {
                      // Filter out players who are already out in current innings
                      const battingRecord = matchData.battingRecords?.find(
                        record => record.playerName === player && record.innings === matchData.currentInnings
                      );
                      return !battingRecord || !battingRecord.isOut;
                    })
                    .map((player, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedStriker(player)}
                        className={`px-4 py-3 rounded-lg font-medium transition-all ${selectedStriker === player
                          ? 'bg-primary-blue text-white'
                          : 'bg-white/5 hover:bg-white/10'
                          }`}
                        disabled={selectedNonStriker === player}
                      >
                        {player}
                      </button>
                    ))}
                </div>
              </div>

              {/* Non-Striker */}
              <div>
                <label className="block text-lg font-medium mb-3 text-primary-green">
                  Select Non-Striker ({matchData.battingTeam})
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {battingTeamPlayers
                    .filter(player => {
                      // Filter out players who are already out in current innings
                      const battingRecord = matchData.battingRecords?.find(
                        record => record.playerName === player && record.innings === matchData.currentInnings
                      );
                      return !battingRecord || !battingRecord.isOut;
                    })
                    .map((player, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedNonStriker(player)}
                        className={`px-4 py-3 rounded-lg font-medium transition-all ${selectedNonStriker === player
                          ? 'bg-primary-blue text-white'
                          : 'bg-white/5 hover:bg-white/10'
                          }`}
                        disabled={selectedStriker === player}
                      >
                        {player}
                      </button>
                    ))}
                </div>
              </div>

              {/* Bowler */}
              <div>
                <label className="block text-lg font-medium mb-3 text-primary-green">
                  Select Opening Bowler ({matchData.bowlingTeam})
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {bowlingTeamPlayers.map((player, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedBowler(player)}
                      className={`px-4 py-3 rounded-lg font-medium transition-all ${selectedBowler === player
                        ? 'bg-primary-green text-black'
                        : 'bg-white/5 hover:bg-white/10'
                        }`}
                    >
                      {player}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={startMatchWithPlayers}
                disabled={loading || !selectedStriker || !selectedNonStriker || !selectedBowler}
                className="w-full py-4 bg-gradient-to-r from-primary-blue to-primary-green rounded-lg font-bold text-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Starting...' : '🏏 Start Match'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Access Control Check - Show access denied if trying to create without permission
  if (!id && !isMatchCreator() && !isAdmin()) {
    return (
      <div className="min-h-screen py-12 px-4 flex items-center justify-center">
        <div className="glass-effect rounded-2xl p-12 text-center max-w-md">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-3xl font-bold text-red-400 mb-4">Access Restricted</h2>
          <p className="text-gray-400 mb-6">
            Only approved Match Creators can create matches. Apply to become a Match Creator to get started!
          </p>
          <div className="flex flex-col gap-3">
            <Link
              to="/apply"
              className="px-8 py-3 bg-gradient-to-r from-primary-blue to-primary-green rounded-lg font-semibold hover:scale-105 transition-transform"
            >
              📋 Apply as Match Creator
            </Link>
            <Link
              to="/live-matches"
              className="px-8 py-3 bg-white/10 border border-white/20 rounded-lg font-semibold hover:bg-white/20 transition-all"
            >
              👁️ View Live Matches
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Match Setup Screen (continued in next part...)

  // Match Setup Screen
  if (!gameStarted) {
    return (
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-5xl font-bold gradient-text mb-4">Match Setup</h1>
            <p className="text-gray-400 text-lg">Configure your cricket match</p>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <div className="glass-effect rounded-2xl p-8 space-y-6">
            {/* Ground Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-primary-green">Ground Name</label>
                <input
                  type="text"
                  placeholder="e.g., Eden Gardens"
                  value={matchSetup.groundName}
                  onChange={(e) => setMatchSetup({ ...matchSetup, groundName: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-blue"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-primary-green">Location</label>
                <input
                  type="text"
                  placeholder="e.g., Kolkata"
                  value={matchSetup.location}
                  onChange={(e) => setMatchSetup({ ...matchSetup, location: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-blue"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-primary-green">Total Overs</label>
                <input
                  type="number"
                  placeholder="e.g., 5, 10, 20"
                  value={matchSetup.totalOvers}
                  onChange={(e) => setMatchSetup({ ...matchSetup, totalOvers: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-blue"
                />
              </div>
            </div>

            {/* Team A */}
            <div className="border-t border-white/10 pt-6">
              <h3 className="text-2xl font-bold mb-4 text-primary-blue">Team A</h3>
              <input
                type="text"
                placeholder="Team A Name"
                value={matchSetup.teamA.name}
                onChange={(e) => setMatchSetup({ ...matchSetup, teamA: { ...matchSetup.teamA, name: e.target.value } })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-blue mb-4"
              />
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {matchSetup.teamA.players.map((player, idx) => (
                  <input
                    key={idx}
                    type="text"
                    placeholder={`Player ${idx + 1}`}
                    value={player}
                    onChange={(e) => updateTeamAPlayer(idx, e.target.value)}
                    className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-blue text-sm"
                  />
                ))}
              </div>
            </div>

            {/* Team B */}
            <div className="border-t border-white/10 pt-6">
              <h3 className="text-2xl font-bold mb-4 text-primary-green">Team B</h3>
              <input
                type="text"
                placeholder="Team B Name"
                value={matchSetup.teamB.name}
                onChange={(e) => setMatchSetup({ ...matchSetup, teamB: { ...matchSetup.teamB, name: e.target.value } })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-green mb-4"
              />
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {matchSetup.teamB.players.map((player, idx) => (
                  <input
                    key={idx}
                    type="text"
                    placeholder={`Player ${idx + 1}`}
                    value={player}
                    onChange={(e) => updateTeamBPlayer(idx, e.target.value)}
                    className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-green text-sm"
                  />
                ))}
              </div>
            </div>

            {/* Batting Team Selection */}
            <div className="border-t border-white/10 pt-6">
              <label className="block text-lg font-medium mb-3 text-primary-green">Select Batting Team</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setMatchSetup({ ...matchSetup, battingTeam: matchSetup.teamA.name })}
                  className={`py-4 rounded-lg font-bold text-lg transition-all ${matchSetup.battingTeam === matchSetup.teamA.name
                    ? 'bg-primary-blue text-white'
                    : 'bg-white/5 hover:bg-white/10'
                    }`}
                  disabled={!matchSetup.teamA.name}
                >
                  {matchSetup.teamA.name || 'Team A'}
                </button>
                <button
                  onClick={() => setMatchSetup({ ...matchSetup, battingTeam: matchSetup.teamB.name })}
                  className={`py-4 rounded-lg font-bold text-lg transition-all ${matchSetup.battingTeam === matchSetup.teamB.name
                    ? 'bg-primary-green text-black'
                    : 'bg-white/5 hover:bg-white/10'
                    }`}
                  disabled={!matchSetup.teamB.name}
                >
                  {matchSetup.teamB.name || 'Team B'}
                </button>
              </div>
            </div>

            <button
              onClick={createMatch}
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-primary-blue to-primary-green rounded-lg font-bold text-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Match...' : '🏏 Create Match'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Match Complete Screen
  if (matchData && matchData.status === 'completed') {
    return (
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="glass-effect rounded-2xl p-12 text-center animate-fade-in">
            <div className="text-6xl mb-6">🏆</div>
            <h1 className="text-4xl font-bold gradient-text mb-4">Match Complete!</h1>
            <div className="text-3xl font-bold text-primary-green mb-8">{matchData.result}</div>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="bg-white/5 rounded-xl p-6">
                <div className="text-sm text-gray-400 mb-2">1st Innings</div>
                <div className="text-xl font-bold">{matchData.innings1.battingTeam}</div>
                <div className="text-3xl font-bold text-primary-blue mt-2">
                  {matchData.innings1.runs}/{matchData.innings1.wickets}
                </div>
                <div className="text-sm text-gray-400 mt-1">
                  ({matchData.innings1.overs} overs)
                </div>
              </div>
              <div className="bg-white/5 rounded-xl p-6">
                <div className="text-sm text-gray-400 mb-2">2nd Innings</div>
                <div className="text-xl font-bold">{matchData.innings2.battingTeam}</div>
                <div className="text-3xl font-bold text-primary-green mt-2">
                  {matchData.innings2.runs}/{matchData.innings2.wickets}
                </div>
                <div className="text-sm text-gray-400 mt-1">
                  ({matchData.innings2.overs} overs)
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-sm text-gray-400">
                Ground: {matchData.groundName}, {matchData.location}
              </div>
              <div className="text-sm text-gray-400">
                Date: {new Date(matchData.matchDate).toLocaleString()}
              </div>
            </div>

            <button
              onClick={resetMatch}
              className="mt-8 px-8 py-3 bg-gradient-to-r from-primary-blue to-primary-green rounded-lg font-semibold hover:scale-105 transition-transform"
            >
              Start New Match
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Live Scoring Screen (continued in next message due to length...)
  const currentInnings = matchData?.currentInnings === 1 ? matchData?.innings1 : matchData?.innings2;

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Header */}
        <div className="glass-effect rounded-2xl p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl font-bold gradient-text">{matchData?.teamA.name} vs {matchData?.teamB.name}</h2>
              <p className="text-sm text-gray-400">
                Innings {matchData?.currentInnings} • {matchData?.groundName}, {matchData?.location}
              </p>
            </div>
            <div className="flex gap-2">
              {!viewMode && (
                <button
                  onClick={() => setShowEndMatchModal(true)}
                  className="px-4 py-2 bg-red-500/20 border border-red-500 text-red-400 rounded-lg text-sm hover:bg-red-500/30 transition-colors"
                >
                  🔒 End Match
                </button>
              )}
              {!viewMode && (
                <button
                  onClick={resetMatch}
                  className="px-4 py-2 bg-white/5 border border-white/10 text-gray-400 rounded-lg text-sm hover:bg-white/10 transition-colors"
                >
                  New Match
                </button>
              )}
            </div>
          </div>

          {/* Score Display */}
          <div className="text-center py-6 border-y border-white/10">
            <div className="text-6xl font-bold gradient-text mb-2">
              {currentInnings?.runs}/{currentInnings?.wickets}
            </div>
            <div className="text-2xl text-gray-400">
              Overs: {currentInnings?.overs}.{currentInnings?.balls % 6} / {matchData?.totalOvers}
            </div>
            <div className="text-lg text-primary-green mt-2">
              {matchData?.battingTeam} Batting
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Current Batsmen */}
          <div className="lg:col-span-2 glass-effect rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-4 text-primary-blue">Current Batsmen</h3>
            <div className="space-y-3">
              {matchData?.striker && (() => {
                // Check if striker is out
                const strikerRecord = matchData.battingRecords?.find(
                  record => record.playerName === matchData.striker.name && record.innings === matchData.currentInnings
                );
                const isStrikerOut = strikerRecord?.isOut;

                return !isStrikerOut && (
                  <div className="bg-white/5 rounded-lg p-4 border-l-4 border-primary-green">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-lg">{matchData.striker.name} *</span>
                      <span className="text-2xl font-bold text-primary-green">{matchData.striker.runs}</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-sm text-gray-400">
                      <div>Balls: {matchData.striker.balls}</div>
                      <div>4s: {matchData.striker.fours}</div>
                      <div>6s: {matchData.striker.sixes}</div>
                      <div>SR: {calculateStrikeRate(matchData.striker.runs, matchData.striker.balls)}</div>
                    </div>
                  </div>
                );
              })()}

              {matchData?.nonStriker && (() => {
                // Check if non-striker is out
                const nonStrikerRecord = matchData.battingRecords?.find(
                  record => record.playerName === matchData.nonStriker.name && record.innings === matchData.currentInnings
                );
                const isNonStrikerOut = nonStrikerRecord?.isOut;

                return !isNonStrikerOut && (
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-lg">{matchData.nonStriker.name}</span>
                      <span className="text-2xl font-bold">{matchData.nonStriker.runs}</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-sm text-gray-400">
                      <div>Balls: {matchData.nonStriker.balls}</div>
                      <div>4s: {matchData.nonStriker.fours}</div>
                      <div>6s: {matchData.nonStriker.sixes}</div>
                      <div>SR: {calculateStrikeRate(matchData.nonStriker.runs, matchData.nonStriker.balls)}</div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Current Bowler */}
          <div className="glass-effect rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-4 text-primary-green">Current Bowler</h3>
            {matchData?.currentBowler && (
              <div className="bg-white/5 rounded-lg p-4">
                <div className="font-bold text-lg mb-3">{matchData.currentBowler.name}</div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Overs:</span>
                    <span className="font-bold">{matchData.currentBowler.overs}.{matchData.currentBowler.balls % 6}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Runs:</span>
                    <span className="font-bold">{matchData.currentBowler.runs}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Wickets:</span>
                    <span className="font-bold text-red-400">{matchData.currentBowler.wickets}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Economy:</span>
                    <span className="font-bold text-primary-blue">
                      {calculateEconomy(matchData.currentBowler.runs, matchData.currentBowler.balls)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Scoring Buttons - Only show if not in view mode */}
        {!viewMode && (
          <div className="glass-effect rounded-2xl p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold gradient-text">Scoring Buttons</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowBowlerInput(true)}
                  className="px-4 py-2 bg-primary-green/20 text-primary-green border border-primary-green/30 rounded-lg hover:bg-primary-green/30 transition-all text-sm font-semibold"
                >
                  🎳 Change Bowler
                </button>
                <button
                  onClick={() => setShowBatsmanInput(true)}
                  className="px-4 py-2 bg-primary-blue/20 text-primary-blue border border-primary-blue/30 rounded-lg hover:bg-primary-blue/30 transition-all text-sm font-semibold"
                >
                  🏏 Change Batsman
                </button>
              </div>
            </div>
            <div className="grid grid-cols-4 md:grid-cols-8 gap-3 mb-4">
              <button onClick={() => handleScore(0)} disabled={loading} className="py-4 bg-gray-600 hover:bg-gray-500 rounded-lg font-bold text-lg transition-colors disabled:opacity-50">0</button>
              <button onClick={() => handleScore(1)} disabled={loading} className="py-4 bg-blue-600 hover:bg-blue-500 rounded-lg font-bold text-lg transition-colors disabled:opacity-50">1</button>
              <button onClick={() => handleScore(2)} disabled={loading} className="py-4 bg-green-600 hover:bg-green-500 rounded-lg font-bold text-lg transition-colors disabled:opacity-50">2</button>
              <button onClick={() => handleScore(3)} disabled={loading} className="py-4 bg-yellow-600 hover:bg-yellow-500 rounded-lg font-bold text-lg transition-colors disabled:opacity-50">3</button>
              <button onClick={() => handleScore(4)} disabled={loading} className="py-4 bg-orange-600 hover:bg-orange-500 rounded-lg font-bold text-lg transition-colors disabled:opacity-50">4</button>
              <button onClick={() => handleScore(6)} disabled={loading} className="py-4 bg-purple-600 hover:bg-purple-500 rounded-lg font-bold text-lg transition-colors disabled:opacity-50">6</button>
              <button onClick={() => handleScore(0, false, false, true)} disabled={loading} className="py-4 bg-red-600 hover:bg-red-500 rounded-lg font-bold text-lg transition-colors disabled:opacity-50">W</button>
              <button onClick={() => handleScore(0, true)} disabled={loading} className="py-4 bg-pink-600 hover:bg-pink-500 rounded-lg font-bold text-sm transition-colors disabled:opacity-50">WD</button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => handleScore(0, false, true)} disabled={loading} className="py-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-bold transition-colors disabled:opacity-50">No Ball</button>
              <button onClick={() => handleScore(1, true)} disabled={loading} className="py-3 bg-pink-600 hover:bg-pink-500 rounded-lg font-bold transition-colors disabled:opacity-50">Wide + 1</button>
            </div>
          </div>
        )}

        {/* Batting Statistics */}
        {matchData?.battingRecords && matchData.battingRecords.length > 0 && (
          <div className="glass-effect rounded-2xl p-6 mb-6">
            <h3 className="text-xl font-bold mb-4 text-primary-blue">Batting Statistics</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-2">Batsman</th>
                    <th className="text-center py-3 px-2">R</th>
                    <th className="text-center py-3 px-2">B</th>
                    <th className="text-center py-3 px-2">4s</th>
                    <th className="text-center py-3 px-2">6s</th>
                    <th className="text-center py-3 px-2">SR</th>
                    <th className="text-center py-3 px-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {matchData.battingRecords
                    .filter(record => record.innings === matchData.currentInnings)
                    .map((record, idx) => (
                      <tr key={idx} className={`border-b border-white/5 hover:bg-white/5 ${record.isOut ? 'opacity-60' : ''}`}>
                        <td className="py-3 px-2 font-medium">
                          {record.playerName}
                          {!record.isOut && record.playerName === matchData.striker?.name && <span className="text-primary-green ml-1">*</span>}
                        </td>
                        <td className="text-center py-3 px-2 font-bold">{record.runs}</td>
                        <td className="text-center py-3 px-2 text-gray-400">{record.balls}</td>
                        <td className="text-center py-3 px-2 text-gray-400">{record.fours}</td>
                        <td className="text-center py-3 px-2 text-gray-400">{record.sixes}</td>
                        <td className="text-center py-3 px-2 text-primary-blue font-semibold">
                          {record.balls > 0 ? ((record.runs / record.balls) * 100).toFixed(1) : '0.0'}
                        </td>
                        <td className="text-center py-3 px-2">
                          {record.isOut ? (
                            <span className="text-red-400 font-semibold">OUT</span>
                          ) : (
                            <span className="text-green-400">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Bowling Statistics */}
        {matchData?.bowlingRecords && matchData.bowlingRecords.length > 0 && (
          <div className="glass-effect rounded-2xl p-6 mb-6">
            <h3 className="text-xl font-bold mb-4 text-primary-green">Bowling Statistics</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-2">Bowler</th>
                    <th className="text-center py-3 px-2">O</th>
                    <th className="text-center py-3 px-2">R</th>
                    <th className="text-center py-3 px-2">W</th>
                    <th className="text-center py-3 px-2">Econ</th>
                  </tr>
                </thead>
                <tbody>
                  {matchData.bowlingRecords
                    .filter(record => record.innings === matchData.currentInnings)
                    .map((record, idx) => (
                      <tr key={idx} className="border-b border-white/5 hover:bg-white/5">
                        <td className="py-3 px-2 font-medium">
                          {record.playerName}
                          {record.playerName === matchData.currentBowler?.name && <span className="text-primary-green ml-1">*</span>}
                        </td>
                        <td className="text-center py-3 px-2 text-gray-400">
                          {record.overs}.{record.balls % 6}
                        </td>
                        <td className="text-center py-3 px-2 font-bold">{record.runs}</td>
                        <td className="text-center py-3 px-2 text-red-400 font-bold">{record.wickets}</td>
                        <td className="text-center py-3 px-2 text-primary-blue font-semibold">
                          {record.balls > 0 ? ((record.runs / (record.balls / 6)).toFixed(2)) : '0.00'}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* View Mode Indicator */}
        {viewMode && (
          <div className="glass-effect rounded-2xl p-6 mb-6 text-center">
            <div className="text-4xl mb-3">👁️</div>
            <h3 className="text-xl font-bold gradient-text mb-2">Viewing Live Match</h3>
            <p className="text-gray-400 text-sm">Auto-refreshing every 3 seconds</p>
          </div>
        )}

        {/* Modals - Only show if not in view mode */}
        {/* Match Equation & Run Rates */}
        <div className="glass-effect rounded-2xl p-6 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-3 bg-white/5 rounded-xl">
              <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Current Run Rate</div>
              <div className="text-2xl font-bold text-white">
                {(() => {
                  const innings = matchData.currentInnings === 1 ? matchData.innings1 : matchData.innings2;
                  const overs = innings.overs + (innings.balls % 6) / 6;
                  return overs > 0 ? (innings.runs / overs).toFixed(2) : '0.00';
                })()}
              </div>
            </div>

            {matchData.currentInnings === 2 && (
              <>
                <div className="p-3 bg-white/5 rounded-xl">
                  <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Required Run Rate</div>
                  <div className="text-2xl font-bold text-primary-green">
                    {(() => {
                      const target = matchData.innings1.runs + 1;
                      const runsNeeded = target - matchData.innings2.runs;
                      const ballsRemaining = (matchData.totalOvers * 6) - matchData.innings2.balls;
                      const oversRemaining = ballsRemaining / 6;
                      return oversRemaining > 0 && runsNeeded > 0
                        ? (runsNeeded / oversRemaining).toFixed(2)
                        : '-';
                    })()}
                  </div>
                </div>
                <div className="p-3 bg-white/5 rounded-xl col-span-2 md:col-span-2">
                  <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Match Equation</div>
                  <div className="text-xl font-bold text-white">
                    Need <span className="text-primary-green">{matchData.innings1.runs + 1 - matchData.innings2.runs}</span> runs in <span className="text-primary-blue">{(matchData.totalOvers * 6) - matchData.innings2.balls}</span> balls
                  </div>
                </div>
              </>
            )}

            {matchData.currentInnings === 1 && (
              <div className="p-3 bg-white/5 rounded-xl col-span-2 md:col-span-3">
                <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Projected Score</div>
                <div className="text-xl font-bold text-white">
                  {(() => {
                    const innings = matchData.innings1;
                    const overs = innings.overs + (innings.balls % 6) / 6;
                    const crr = overs > 0 ? innings.runs / overs : 0;
                    return crr > 0 ? Math.round(crr * matchData.totalOvers) : '-';
                  })()}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modals - Only show if not in view mode */}
        {!viewMode && showBowlerInput && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 backdrop-blur-sm overflow-y-auto">
            <div className="glass-effect rounded-2xl p-8 max-w-2xl w-full my-8 animate-fade-in border-2 border-primary-green/30">
              <div className="text-center mb-8">
                <div className="text-5xl mb-3">🎳</div>
                <h3 className="text-3xl font-bold gradient-text mb-2">Select Next Bowler</h3>
                <p className="text-gray-400">Choose a bowler for the next over</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                {matchData?.bowlingTeam === matchData?.teamA.name
                  ? matchData?.teamA.players.map((player, idx) => {
                    // Check if player just bowled the last over
                    const lastBall = matchData.ballByBall && matchData.ballByBall.length > 0
                      ? matchData.ballByBall[matchData.ballByBall.length - 1]
                      : null;
                    const lastBowler = lastBall ? lastBall.bowler : null;
                    const isLastBowler = lastBowler === player;
                    const isSelected = newBowlerName === player;

                    return (
                      <button
                        key={idx}
                        onClick={() => !isLastBowler && setNewBowlerName(player)}
                        disabled={isLastBowler}
                        className={`relative p-4 rounded-xl text-left transition-all duration-200 border ${isSelected
                            ? 'bg-primary-green/20 border-primary-green shadow-[0_0_15px_rgba(34,197,94,0.3)]'
                            : isLastBowler
                              ? 'bg-white/5 border-white/5 opacity-50 cursor-not-allowed'
                              : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                          }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className={`font-bold text-lg ${isSelected ? 'text-primary-green' : 'text-white'}`}>
                              {player}
                            </div>
                            <div className="text-xs text-gray-400 mt-1">Bowler</div>
                          </div>
                          {isSelected && (
                            <div className="h-6 w-6 rounded-full bg-primary-green flex items-center justify-center text-black text-xs">
                              ✓
                            </div>
                          )}
                        </div>
                        {isLastBowler && (
                          <div className="mt-2 inline-block px-2 py-1 bg-red-500/20 text-red-400 text-xs font-bold rounded">
                            JUST BOWLED
                          </div>
                        )}
                      </button>
                    );
                  })
                  : matchData?.teamB.players.map((player, idx) => {
                    // Check if player just bowled the last over
                    const lastBall = matchData.ballByBall && matchData.ballByBall.length > 0
                      ? matchData.ballByBall[matchData.ballByBall.length - 1]
                      : null;
                    const lastBowler = lastBall ? lastBall.bowler : null;
                    const isLastBowler = lastBowler === player;
                    const isSelected = newBowlerName === player;

                    return (
                      <button
                        key={idx}
                        onClick={() => !isLastBowler && setNewBowlerName(player)}
                        disabled={isLastBowler}
                        className={`relative p-4 rounded-xl text-left transition-all duration-200 border ${isSelected
                            ? 'bg-primary-green/20 border-primary-green shadow-[0_0_15px_rgba(34,197,94,0.3)]'
                            : isLastBowler
                              ? 'bg-white/5 border-white/5 opacity-50 cursor-not-allowed'
                              : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                          }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className={`font-bold text-lg ${isSelected ? 'text-primary-green' : 'text-white'}`}>
                              {player}
                            </div>
                            <div className="text-xs text-gray-400 mt-1">Bowler</div>
                          </div>
                          {isSelected && (
                            <div className="h-6 w-6 rounded-full bg-primary-green flex items-center justify-center text-black text-xs">
                              ✓
                            </div>
                          )}
                        </div>
                        {isLastBowler && (
                          <div className="mt-2 inline-block px-2 py-1 bg-red-500/20 text-red-400 text-xs font-bold rounded">
                            JUST BOWLED
                          </div>
                        )}
                      </button>
                    );
                  })
                }
              </div>

              <div className="flex justify-end">
                <button
                  onClick={changeBowler}
                  disabled={!newBowlerName || loading}
                  className="px-8 py-3 bg-gradient-to-r from-primary-blue to-primary-green rounded-xl font-bold hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  Confirm Bowler
                </button>
              </div>
            </div>
          </div>
        )}

        {!viewMode && showBatsmanInput && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 backdrop-blur-sm overflow-y-auto">
            <div className="glass-effect rounded-2xl p-8 max-w-2xl w-full my-8 animate-fade-in border-2 border-primary-blue/30">
              <div className="text-center mb-8">
                <div className="text-5xl mb-3">🏏</div>
                <h3 className="text-3xl font-bold gradient-text mb-2">Select New Batsman</h3>
                <p className="text-gray-400">Choose the next batsman to come to the crease</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                {matchData?.battingTeam === matchData?.teamA.name
                  ? matchData?.teamA.players.map((player, idx) => {
                    // Check status
                    const battingRecord = matchData.battingRecords.find(
                      record => record.playerName === player && record.innings === matchData.currentInnings
                    );
                    const isOut = battingRecord?.isOut;
                    const isBatting = (matchData.striker?.name === player || matchData.nonStriker?.name === player);
                    const isDisabled = isOut || isBatting;
                    const isSelected = newBatsmanName === player;

                    return (
                      <button
                        key={idx}
                        onClick={() => !isDisabled && setNewBatsmanName(player)}
                        disabled={isDisabled}
                        className={`relative p-4 rounded-xl text-left transition-all duration-200 border ${isSelected
                            ? 'bg-primary-blue/20 border-primary-blue shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                            : isDisabled
                              ? 'bg-white/5 border-white/5 opacity-50 cursor-not-allowed'
                              : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                          }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className={`font-bold text-lg ${isSelected ? 'text-primary-blue' : 'text-white'}`}>
                              {player}
                            </div>
                            <div className="text-xs text-gray-400 mt-1">Batsman</div>
                          </div>
                          {isSelected && (
                            <div className="h-6 w-6 rounded-full bg-primary-blue flex items-center justify-center text-white text-xs">
                              ✓
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2 mt-2">
                          {isOut && <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs font-bold rounded">OUT</span>}
                          {isBatting && <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded">BATTING</span>}
                          {!isOut && !isBatting && <span className="px-2 py-1 bg-gray-500/20 text-gray-400 text-xs font-bold rounded">YET TO BAT</span>}
                        </div>
                      </button>
                    );
                  })
                  : matchData?.teamB.players.map((player, idx) => {
                    // Check status
                    const battingRecord = matchData.battingRecords.find(
                      record => record.playerName === player && record.innings === matchData.currentInnings
                    );
                    const isOut = battingRecord?.isOut;
                    const isBatting = (matchData.striker?.name === player || matchData.nonStriker?.name === player);
                    const isDisabled = isOut || isBatting;
                    const isSelected = newBatsmanName === player;

                    return (
                      <button
                        key={idx}
                        onClick={() => !isDisabled && setNewBatsmanName(player)}
                        disabled={isDisabled}
                        className={`relative p-4 rounded-xl text-left transition-all duration-200 border ${isSelected
                            ? 'bg-primary-blue/20 border-primary-blue shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                            : isDisabled
                              ? 'bg-white/5 border-white/5 opacity-50 cursor-not-allowed'
                              : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                          }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className={`font-bold text-lg ${isSelected ? 'text-primary-blue' : 'text-white'}`}>
                              {player}
                            </div>
                            <div className="text-xs text-gray-400 mt-1">Batsman</div>
                          </div>
                          {isSelected && (
                            <div className="h-6 w-6 rounded-full bg-primary-blue flex items-center justify-center text-white text-xs">
                              ✓
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2 mt-2">
                          {isOut && <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs font-bold rounded">OUT</span>}
                          {isBatting && <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded">BATTING</span>}
                          {!isOut && !isBatting && <span className="px-2 py-1 bg-gray-500/20 text-gray-400 text-xs font-bold rounded">YET TO BAT</span>}
                        </div>
                      </button>
                    );
                  })
                }
              </div>

              <div className="flex justify-end">
                <button
                  onClick={addNewBatsman}
                  disabled={!newBatsmanName || loading}
                  className="px-8 py-3 bg-gradient-to-r from-primary-blue to-primary-green rounded-xl font-bold hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  Confirm Batsman
                </button>
              </div>
            </div>
          </div>
        )}
        {/* End Match Modal */}
        {!viewMode && showEndMatchModal && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="glass-effect rounded-2xl p-8 max-w-md w-full animate-fade-in border-2 border-red-500/30">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">🔒</div>
                <h3 className="text-3xl font-bold gradient-text mb-2">End Match</h3>
                <p className="text-gray-400">Enter password to end this match</p>
              </div>

              {error && (
                <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-4 text-sm">
                  {error}
                </div>
              )}

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2 text-gray-400">
                  Match End Password
                </label>
                <input
                  type="password"
                  placeholder="Enter password (Hint: END123)"
                  value={endMatchPassword}
                  onChange={(e) => setEndMatchPassword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleEndMatch()}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-red-500 transition-colors text-center text-lg"
                  autoFocus
                />
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Password is required to prevent accidental match ending
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowEndMatchModal(false);
                    setEndMatchPassword('');
                    setError('');
                  }}
                  className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEndMatch}
                  disabled={!endMatchPassword || loading}
                  className="flex-1 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-lg font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Ending...' : 'End Match'}
                </button>
              </div>

              <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <p className="text-xs text-yellow-400 text-center">
                  ⚠️ This will permanently end the match and calculate the final result
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Scorecard;
