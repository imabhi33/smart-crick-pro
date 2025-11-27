import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import matchService from '../services/match.service';

const AllMatches = () => {
    const { isMatchCreator, isAdmin } = useAuth();
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('all'); // all, live, completed

    const fetchMatches = async () => {
        try {
            const response = await matchService.getAllMatches();
            if (response.success) {
                setMatches(response.data);
            }
            setLoading(false);
        } catch (err) {
            setError('Failed to load matches');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMatches();
    }, []);

    const getFilteredMatches = () => {
        if (filter === 'live') {
            return matches.filter(m => m.status === 'innings1' || m.status === 'innings2');
        } else if (filter === 'completed') {
            return matches.filter(m => m.status === 'completed');
        }
        return matches;
    };

    const filteredMatches = getFilteredMatches();

    if (loading) {
        return (
            <div className="min-h-screen py-12 px-4 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4 animate-bounce">🏏</div>
                    <div className="text-2xl font-bold gradient-text">Loading Matches...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-5xl font-bold gradient-text mb-4">All Matches</h1>
                        <p className="text-gray-400 text-lg">Browse all cricket matches</p>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-3 mb-6">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-6 py-3 rounded-lg font-semibold transition-all ${filter === 'all'
                                ? 'bg-primary-blue text-white'
                                : 'bg-white/5 hover:bg-white/10'
                            }`}
                    >
                        All Matches ({matches.length})
                    </button>
                    <button
                        onClick={() => setFilter('live')}
                        className={`px-6 py-3 rounded-lg font-semibold transition-all ${filter === 'live'
                                ? 'bg-green-500 text-white'
                                : 'bg-white/5 hover:bg-white/10'
                            }`}
                    >
                        🔴 Live ({matches.filter(m => m.status === 'innings1' || m.status === 'innings2').length})
                    </button>
                    <button
                        onClick={() => setFilter('completed')}
                        className={`px-6 py-3 rounded-lg font-semibold transition-all ${filter === 'completed'
                                ? 'bg-gray-600 text-white'
                                : 'bg-white/5 hover:bg-white/10'
                            }`}
                    >
                        Completed ({matches.filter(m => m.status === 'completed').length})
                    </button>
                </div>

                {error && (
                    <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {filteredMatches.length === 0 ? (
                    <div className="glass-effect rounded-2xl p-12 text-center">
                        <div className="text-6xl mb-4">🏏</div>
                        <h2 className="text-3xl font-bold mb-4">No Matches Found</h2>
                        <p className="text-gray-400 mb-6">
                            {filter === 'live' ? 'No live matches at the moment' :
                                filter === 'completed' ? 'No completed matches yet' :
                                    'No matches available'}
                        </p>
                        {(isMatchCreator() || isAdmin()) && (
                            <Link
                                to="/scorecard"
                                className="inline-block px-8 py-3 bg-gradient-to-r from-primary-blue to-primary-green rounded-lg font-semibold hover:scale-105 transition-transform"
                            >
                                Start a New Match
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {filteredMatches.map((match) => {
                            const isLive = match.status === 'innings1' || match.status === 'innings2';
                            const isCompleted = match.status === 'completed';

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
                                        {isLive && (
                                            <div className="px-3 py-1 bg-red-500/20 border border-red-500 text-red-400 rounded-full text-xs font-bold animate-pulse">
                                                🔴 LIVE
                                            </div>
                                        )}
                                        {isCompleted && (
                                            <div className="px-3 py-1 bg-green-500/20 border border-green-500 text-green-400 rounded-full text-xs font-bold">
                                                ✓ COMPLETED
                                            </div>
                                        )}
                                    </div>

                                    {/* Teams & Scores */}
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
                                            {match.innings2?.battingTeam === match.teamA.name && (
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
                                            {match.innings2?.battingTeam === match.teamB.name && (
                                                <div className="text-2xl font-bold text-primary-green">
                                                    {match.innings2.runs}/{match.innings2.wickets}
                                                    <span className="text-sm text-gray-400 ml-2">
                                                        ({match.innings2.overs}.{match.innings2.balls % 6})
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Match Result */}
                                    {isCompleted && match.result && (
                                        <div className="border-t border-white/10 pt-4 text-center">
                                            <div className="text-sm font-semibold text-primary-green">
                                                {match.result}
                                            </div>
                                        </div>
                                    )}

                                    {/* Match Status for Live */}
                                    {isLive && (
                                        <div className="border-t border-white/10 pt-4 text-center">
                                            <div className="text-sm text-primary-green font-semibold">
                                                {match.currentInnings === 1 ? '1st Innings' : '2nd Innings'} •
                                                {match.battingTeam} Batting
                                            </div>
                                        </div>
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllMatches;
