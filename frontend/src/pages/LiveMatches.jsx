import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import matchService from '../services/match.service';

const LiveMatches = () => {
  const { isMatchCreator, isAdmin } = useAuth();
  const [liveMatches, setLiveMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchLiveMatches = async () => {
    try {
      const response = await matchService.getLiveMatches();
      if (response.success) {
        setLiveMatches(response.data);
      }
      setLoading(false);
    } catch (err) {
      setError('Failed to load live matches');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveMatches();
  }, []);

  // Auto refresh every 5 seconds
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchLiveMatches();
    }, 5000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const getInningsData = (match) => {
    return match.currentInnings === 1 ? match.innings1 : match.innings2;
  };

  if (loading) {
    return (
      <div className="min-h-screen py-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🏏</div>
          <div className="text-2xl font-bold gradient-text">Loading Live Matches...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-5xl font-bold gradient-text mb-4">Live Matches</h1>
            <p className="text-gray-400 text-lg">Watch ongoing cricket matches in real-time</p>
          </div>
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              autoRefresh
                ? 'bg-primary-green text-black'
                : 'bg-white/5 hover:bg-white/10'
            }`}
          >
            {autoRefresh ? '🔄 Auto Refresh ON' : '⏸️ Auto Refresh OFF'}
          </button>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {liveMatches.length === 0 ? (
          <div className="glass-effect rounded-2xl p-12 text-center">
            <div className="text-6xl mb-4">🏏</div>
            <h2 className="text-3xl font-bold mb-4">No Live Matches</h2>
            <p className="text-gray-400 mb-6">There are no ongoing matches at the moment</p>
            {(isMatchCreator() || isAdmin()) ? (
              <Link
                to="/scorecard"
                className="inline-block px-8 py-3 bg-gradient-to-r from-primary-blue to-primary-green rounded-lg font-semibold hover:scale-105 transition-transform"
              >
                Start a New Match
              </Link>
            ) : (
              <Link
                to="/apply"
                className="inline-block px-8 py-3 bg-gradient-to-r from-primary-blue to-primary-green rounded-lg font-semibold hover:scale-105 transition-transform"
              >
                Apply to Create Matches
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {liveMatches.map((match) => {
              const innings = getInningsData(match);
              return (
                <Link
                  key={match._id}
                  to={`/match/${match._id}`}
                  className="glass-effect rounded-2xl p-6 hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-primary-blue/30"
                >
                  {/* Match Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="text-sm text-gray-400 mb-1">
                        {match.groundName}, {match.location}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(match.matchDate).toLocaleString()}
                      </div>
                    </div>
                    <div className="px-3 py-1 bg-red-500/20 border border-red-500 text-red-400 rounded-full text-xs font-bold animate-pulse">
                      🔴 LIVE
                    </div>
                  </div>

                  {/* Teams */}
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between items-center">
                      <div className="font-bold text-lg">{match.teamA.name}</div>
                      {match.innings1.battingTeam === match.teamA.name && (
                        <div className="text-2xl font-bold text-primary-blue">
                          {match.innings1.runs}/{match.innings1.wickets}
                          <span className="text-sm text-gray-400 ml-2">
                            ({match.innings1.overs}.{match.innings1.balls % 6})
                          </span>
                        </div>
                      )}
                      {match.innings2.battingTeam === match.teamA.name && (
                        <div className="text-2xl font-bold text-primary-green">
                          {match.innings2.runs}/{match.innings2.wickets}
                          <span className="text-sm text-gray-400 ml-2">
                            ({match.innings2.overs}.{match.innings2.balls % 6})
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="font-bold text-lg">{match.teamB.name}</div>
                      {match.innings1.battingTeam === match.teamB.name && (
                        <div className="text-2xl font-bold text-primary-blue">
                          {match.innings1.runs}/{match.innings1.wickets}
                          <span className="text-sm text-gray-400 ml-2">
                            ({match.innings1.overs}.{match.innings1.balls % 6})
                          </span>
                        </div>
                      )}
                      {match.innings2.battingTeam === match.teamB.name && (
                        <div className="text-2xl font-bold text-primary-green">
                          {match.innings2.runs}/{match.innings2.wickets}
                          <span className="text-sm text-gray-400 ml-2">
                            ({match.innings2.overs}.{match.innings2.balls % 6})
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Current Players */}
                  {match.striker && match.nonStriker && (
                    <div className="border-t border-white/10 pt-4 space-y-2">
                      <div className="text-sm text-gray-400 mb-2">Current Batsmen:</div>
                      <div className="flex justify-between text-sm">
                        <span className="text-primary-green">
                          {match.striker.name} *
                        </span>
                        <span className="font-bold">
                          {match.striker.runs} ({match.striker.balls})
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>{match.nonStriker.name}</span>
                        <span className="font-bold">
                          {match.nonStriker.runs} ({match.nonStriker.balls})
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Current Bowler */}
                  {match.currentBowler && (
                    <div className="border-t border-white/10 pt-4 mt-4">
                      <div className="text-sm text-gray-400 mb-2">Current Bowler:</div>
                      <div className="flex justify-between text-sm">
                        <span className="text-primary-blue">{match.currentBowler.name}</span>
                        <span className="font-bold">
                          {match.currentBowler.overs}.{match.currentBowler.balls % 6} - 
                          {match.currentBowler.runs}/{match.currentBowler.wickets}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Match Status */}
                  <div className="border-t border-white/10 pt-4 mt-4 text-center">
                    <div className="text-sm text-primary-green font-semibold">
                      {match.currentInnings === 1 ? '1st Innings' : '2nd Innings'} • 
                      {match.battingTeam} Batting
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveMatches;
