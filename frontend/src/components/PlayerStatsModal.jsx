import React, { useEffect, useState } from 'react';
import statsService from '../services/stats.service';

const PlayerStatsModal = ({ playerName, isOpen, onClose }) => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen && playerName) {
            loadStats();
        }
    }, [isOpen, playerName]);

    const loadStats = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await statsService.getPlayerStats(playerName);
            if (response.success) {
                setStats(response.data);
            }
        } catch (err) {
            setError('Failed to load player stats');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-[#1a2332] border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl transform transition-all scale-100">

                {/* Header */}
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-gradient-to-r from-primary-blue/10 to-transparent">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-1">{playerName}</h2>
                        <div className="text-sm text-gray-400">Career Statistics</div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
                    >
                        ✕
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 max-h-[70vh] overflow-y-auto">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="w-10 h-10 border-4 border-primary-blue border-t-transparent rounded-full animate-spin mb-4"></div>
                            <div className="text-gray-400">Loading stats...</div>
                        </div>
                    ) : error ? (
                        <div className="text-center py-8 text-red-400 bg-red-500/10 rounded-xl border border-red-500/20">
                            {error}
                        </div>
                    ) : stats ? (
                        <div className="space-y-8">

                            {/* Summary Cards */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-white/5 p-4 rounded-xl text-center border border-white/5">
                                    <div className="text-2xl font-bold text-white">{stats.matches}</div>
                                    <div className="text-xs text-gray-400 uppercase tracking-wider">Matches</div>
                                </div>
                                <div className="bg-white/5 p-4 rounded-xl text-center border border-white/5">
                                    <div className="text-2xl font-bold text-primary-green">{stats.batting.runs}</div>
                                    <div className="text-xs text-gray-400 uppercase tracking-wider">Runs</div>
                                </div>
                                <div className="bg-white/5 p-4 rounded-xl text-center border border-white/5">
                                    <div className="text-2xl font-bold text-primary-blue">{stats.bowling.wickets}</div>
                                    <div className="text-xs text-gray-400 uppercase tracking-wider">Wickets</div>
                                </div>
                                <div className="bg-white/5 p-4 rounded-xl text-center border border-white/5">
                                    <div className="text-2xl font-bold text-purple-400">{stats.batting.highestScore}</div>
                                    <div className="text-xs text-gray-400 uppercase tracking-wider">Highest</div>
                                </div>
                            </div>

                            {/* Batting Stats */}
                            <div>
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <span className="text-xl">🏏</span> Batting Career
                                </h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead>
                                            <tr className="bg-white/5 text-gray-400">
                                                <th className="p-3 rounded-l-lg">Inns</th>
                                                <th className="p-3">Runs</th>
                                                <th className="p-3">Balls</th>
                                                <th className="p-3">Avg</th>
                                                <th className="p-3">SR</th>
                                                <th className="p-3">4s</th>
                                                <th className="p-3 rounded-r-lg">6s</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-white">
                                            <tr className="border-b border-white/5">
                                                <td className="p-3 font-medium">{stats.batting.innings}</td>
                                                <td className="p-3 font-bold">{stats.batting.runs}</td>
                                                <td className="p-3">{stats.batting.balls}</td>
                                                <td className="p-3">{stats.batting.average}</td>
                                                <td className="p-3">{stats.batting.strikeRate}</td>
                                                <td className="p-3">{stats.batting.fours}</td>
                                                <td className="p-3">{stats.batting.sixes}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Bowling Stats */}
                            <div>
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <span className="text-xl">⚾</span> Bowling Career
                                </h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead>
                                            <tr className="bg-white/5 text-gray-400">
                                                <th className="p-3 rounded-l-lg">Inns</th>
                                                <th className="p-3">Wickets</th>
                                                <th className="p-3">Runs</th>
                                                <th className="p-3">Avg</th>
                                                <th className="p-3">Eco</th>
                                                <th className="p-3 rounded-r-lg">Best</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-white">
                                            <tr className="border-b border-white/5">
                                                <td className="p-3 font-medium">{stats.bowling.innings}</td>
                                                <td className="p-3 font-bold">{stats.bowling.wickets}</td>
                                                <td className="p-3">{stats.bowling.runs}</td>
                                                <td className="p-3">{stats.bowling.average}</td>
                                                <td className="p-3">{stats.bowling.economy}</td>
                                                <td className="p-3">{stats.bowling.bestBowling}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-400">No stats available</div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-white/10 bg-white/5 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors font-medium"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PlayerStatsModal;
