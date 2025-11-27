import React from 'react';

const Commentary = ({ matchData }) => {
    if (!matchData || !matchData.ballByBall || matchData.ballByBall.length === 0) {
        return (
            <div className="text-center py-8 text-gray-400">
                No commentary available yet.
            </div>
        );
    }

    // Sort by latest first
    const commentary = [...matchData.ballByBall].reverse();

    return (
        <div className="space-y-4">
            {commentary.map((ball, index) => (
                <div key={index} className="glass-effect p-4 rounded-xl border-l-4 border-l-primary-blue animate-fade-in">
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-3">
                            <span className="text-lg font-bold text-primary-blue">
                                {ball.over}
                            </span>
                            <div className="flex flex-col">
                                <span className="font-semibold text-white">
                                    {ball.bowler} to {ball.batsman}
                                </span>
                                <span className="text-xs text-gray-400">
                                    {new Date(ball.timestamp).toLocaleTimeString()}
                                </span>
                            </div>
                        </div>
                        <div className={`px-3 py-1 rounded-lg font-bold ${ball.isWicket ? 'bg-red-500/20 text-red-400' :
                                ball.runs === 4 ? 'bg-blue-500/20 text-blue-400' :
                                    ball.runs === 6 ? 'bg-green-500/20 text-green-400' :
                                        'bg-white/10 text-white'
                            }`}>
                            {ball.isWicket ? 'OUT' :
                                ball.isWide ? 'WD' :
                                    ball.isNoBall ? 'NB' :
                                        ball.runs}
                        </div>
                    </div>
                    <p className="text-gray-300 text-sm">
                        {ball.commentary || (ball.isWicket ? `WICKET! ${ball.dismissalType}` : `${ball.runs} runs`)}
                    </p>
                </div>
            ))}
        </div>
    );
};

export default Commentary;
