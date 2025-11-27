import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GroundStats = ({ groundId }) => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            if (!groundId) return;
            try {
                // Use the configured axios instance or base URL if available, otherwise relative path
                // Assuming there is a configured axios instance in services/api.js or similar, 
                // but for now let's use a direct fetch with the environment variable or relative path
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

        fetchStats();
    }, [groundId]);

    if (loading) return <div className="text-center py-4">Loading stats...</div>;
    if (!stats) return null;

    return (
        <div className="glass-effect rounded-2xl p-6 animate-fade-in">
            <h3 className="text-xl font-bold mb-6 gradient-text">Ground Statistics</h3>

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
