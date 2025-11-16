import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import matchService from '../../services/match.service';

const CreatorDashboard = () => {
  const [myMatches, setMyMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { user, isMatchCreator } = useAuth();

  useEffect(() => {
    if (isMatchCreator()) {
      loadMyMatches();
    }
  }, []);

  const loadMyMatches = async () => {
    try {
      const response = await matchService.getMyMatches();
      if (response.success) {
        setMyMatches(response.data);
      }
      setLoading(false);
    } catch (err) {
      setError('Failed to load matches');
      setLoading(false);
    }
  };

  const getMatchStatusBadge = (status) => {
    const colors = {
      setup: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
      innings1: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      innings2: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      completed: 'bg-green-500/20 text-green-400 border-green-500/30'
    };
    return `px-3 py-1 rounded-full text-xs font-bold border ${colors[status] || colors.setup}`;
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'setup': return 'Not Started';
      case 'innings1': return 'Live - 1st Innings';
      case 'innings2': return 'Live - 2nd Innings';
      case 'completed': return 'Completed';
      default: return status;
    }
  };

  const getActionButton = (match) => {
    switch (match.status) {
      case 'setup':
        return (
          <Link
            to={`/match/${match._id}`}
            className="px-4 py-2 bg-primary-blue hover:bg-blue-600 rounded-lg font-semibold transition-colors"
          >
            🚀 Start Match
          </Link>
        );
      case 'innings1':
      case 'innings2':
        return (
          <Link
            to={`/match/${match._id}`}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg font-semibold transition-colors"
          >
            📊 Continue Scoring
          </Link>
        );
      case 'completed':
        return (
          <Link
            to={`/match/${match._id}`}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg font-semibold transition-colors"
          >
            👁️ View Match
          </Link>
        );
      default:
        return null;
    }
  };

  if (!isMatchCreator()) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-effect rounded-2xl p-12 text-center max-w-md">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-3xl font-bold text-red-400 mb-4">Access Denied</h2>
          <p className="text-gray-400 mb-6">Match Creator role required</p>
          <Link
            to="/apply"
            className="inline-block px-8 py-3 bg-gradient-to-r from-primary-blue to-primary-green rounded-lg font-semibold hover:scale-105 transition-transform"
          >
            Apply for Match Creator
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="glass-effect rounded-2xl p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold gradient-text mb-2">Creator Dashboard</h1>
              <p className="text-gray-400">Welcome back, {user?.name}</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400">Role</div>
              <div className="px-3 py-1 bg-primary-blue/20 text-primary-blue border border-primary-blue/30 rounded-full text-sm font-bold">
                Match Creator
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Link
            to="/scorecard"
            className="glass-effect rounded-xl p-6 text-center hover:scale-105 transition-all duration-300 group"
          >
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">🏏</div>
            <h3 className="text-xl font-bold mb-2 text-primary-green">Create Match</h3>
            <p className="text-gray-400 text-sm">Start a new cricket match</p>
          </Link>

          <div className="glass-effect rounded-xl p-6 text-center">
            <div className="text-4xl mb-3">📊</div>
            <h3 className="text-xl font-bold mb-2 text-primary-blue">{myMatches.length}</h3>
            <p className="text-gray-400 text-sm">Total Matches</p>
          </div>

          <div className="glass-effect rounded-xl p-6 text-center">
            <div className="text-4xl mb-3">🔴</div>
            <h3 className="text-xl font-bold mb-2 text-red-400">
              {myMatches.filter(m => m.status === 'innings1' || m.status === 'innings2').length}
            </h3>
            <p className="text-gray-400 text-sm">Live Matches</p>
          </div>

          <div className="glass-effect rounded-xl p-6 text-center">
            <div className="text-4xl mb-3">✅</div>
            <h3 className="text-xl font-bold mb-2 text-green-400">
              {myMatches.filter(m => m.status === 'completed').length}
            </h3>
            <p className="text-gray-400 text-sm">Completed</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* My Matches */}
        <div className="glass-effect rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-white">My Matches</h2>
            <Link
              to="/scorecard"
              className="px-6 py-3 bg-gradient-to-r from-primary-blue to-primary-green rounded-lg font-semibold hover:scale-105 transition-transform"
            >
              + Create New Match
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4 animate-bounce">🏏</div>
              <div className="text-xl font-bold gradient-text">Loading your matches...</div>
            </div>
          ) : myMatches.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🏏</div>
              <h3 className="text-2xl font-bold mb-4">No Matches Yet</h3>
              <p className="text-gray-400 mb-6">Create your first match to get started!</p>
              <Link
                to="/scorecard"
                className="inline-block px-8 py-3 bg-gradient-to-r from-primary-blue to-primary-green rounded-lg font-semibold hover:scale-105 transition-transform"
              >
                Create Your First Match
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {myMatches.map((match) => (
                <div key={match._id} className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-primary-blue/30 transition-all">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-2xl font-bold text-white">
                          {match.teamA.name} vs {match.teamB.name}
                        </h3>
                        <div className={getMatchStatusBadge(match.status)}>
                          {getStatusText(match.status)}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="text-gray-400">Venue</div>
                          <div className="text-white font-medium">{match.groundName}, {match.location}</div>
                        </div>
                        <div>
                          <div className="text-gray-400">Match Date</div>
                          <div className="text-white font-medium">{new Date(match.matchDate).toLocaleDateString()}</div>
                        </div>
                        <div>
                          <div className="text-gray-400">Overs</div>
                          <div className="text-white font-medium">{match.totalOvers}</div>
                        </div>
                      </div>

                      {(match.status === 'innings1' || match.status === 'innings2') && (
                        <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                          <div className="text-sm text-blue-400 font-bold mb-2">Current Score</div>
                          <div className="text-2xl font-bold text-white">
                            {match.currentInnings === 1 ? match.innings1?.runs : match.innings2?.runs}/
                            {match.currentInnings === 1 ? match.innings1?.wickets : match.innings2?.wickets}
                            <span className="text-sm text-gray-400 ml-2">
                              ({match.currentInnings === 1 ? match.innings1?.overs : match.innings2?.overs} overs)
                            </span>
                          </div>
                        </div>
                      )}

                      {match.status === 'completed' && match.result && (
                        <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                          <div className="text-sm text-green-400 font-bold mb-1">Match Result</div>
                          <div className="text-white">{match.result}</div>
                        </div>
                      )}
                    </div>

                    <div className="flex md:flex-col gap-2">
                      {getActionButton(match)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatorDashboard;
