import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GroundStats = ({ groundId }) => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, [groundId]);

    const fetchStats = async () => {
        if (!groundId) return;
        setLoading(true);
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const response = await axios.get(`${API_URL}/stats/ground/${groundId}`);
            if (response.data.success) {
                setStats(response.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch ground stats', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="glass-effect rounded-2xl p-6 animate-fade-in">
                <div className="h-6 bg-white/10 rounded w-1/3 mb-6 animate-pulse"></div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="bg-white/5 p-4 rounded-xl">
                            <div className="h-8 bg-white/10 rounded mb-2 animate-pulse"></div>
                            <div className="h-4 bg-white/10 rounded w-2/3 animate-pulse"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (!stats || stats.matchesPlayed === 0) {
        return (
            <div className="glass-effect rounded-2xl p-6 text-center">
                <p className="text-gray-400">No ground statistics available yet.</p>
                <p className="text-sm text-gray-500 mt-2">Complete matches will appear here</p>
            </div>
        );
    }

    return (
        <div className="glass-effect rounded-2xl p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold gradient-text">Ground Statistics</h3>
                <button
                    onClick={fetchStats}
                    className="text-primary-blue hover:text-primary-green transition-colors p-2 rounded-lg hover:bg-white/5"
                    title="Refresh statistics"
                >
                    🔄
                </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/5 p-4 rounded-xl text-center">
                    <div className="text-3xl font-bold text-primary-blue">{stats.matchesPlayed}</div>
                    <div className="text-sm text-gray-400 mt-1">Matches Played</div>
                </div>
                <div className="bg-white/5 p-4 rounded-xl text-center">
                    <div className="text-3xl font-bold text-primary-green">{stats.avgFirstInningsScore}</div>
                    <div className="text-sm text-gray-400 mt-1">Avg 1st Innings</div>
                </div>
                <div className="bg-white/5 p-4 rounded-xl text-center">
                    <div className="text-3xl font-bold text-yellow-400">{stats.highestScore}</div>
                    <div className="text-sm text-gray-400 mt-1">Highest Score</div>
                </div>
                <div className="bg-white/5 p-4 rounded-xl text-center">
                    <div className="text-3xl font-bold text-purple-400">{stats.winPercentageBattingFirst}%</div>
                    <div className="text-sm text-gray-400 mt-1">Bat 1st Win %</div>
                </div>
            </div>

            <div className="mt-6">
                <div className="flex items-center gap-4 mb-2">
                    <div className="text-sm text-gray-400 w-24">Bat 1st Wins</div>
                    <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary-blue"
                            style={{ width: `${stats.winPercentageBattingFirst}%` }}
                        ></div>
                    </div>
                    <div className="text-sm font-bold">{stats.battingFirstWins}</div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-sm text-gray-400 w-24">Bat 2nd Wins</div>
                    <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary-green"
                            style={{ width: `${stats.winPercentageBattingSecond}%` }}
                        ></div>
                    </div>
                    <div className="text-sm font-bold">{stats.battingSecondWins}</div>
                </div>
            </div>
        </div>
    );
};

export default GroundStats;
