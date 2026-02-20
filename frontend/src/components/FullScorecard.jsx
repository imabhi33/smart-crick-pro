import React, { useState } from 'react';
import PlayerStatsModal from './PlayerStatsModal';

const FullScorecard = ({ matchData }) => {
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (!matchData) return null;

    const handlePlayerClick = (playerName) => {
        setSelectedPlayer(playerName);
        setIsModalOpen(true);
    };

    const renderInnings = (inningsData, battingRecords, bowlingRecords, teamName) => {
        if (!inningsData) return null;

        const teamBatting = battingRecords.filter(r => r.teamName === teamName);
        // Filter bowling records for the OTHER team (who bowled in this innings)
        const teamBowling = bowlingRecords.filter(r => r.teamName !== teamName);

        return (
            <div className="mb-8 animate-fade-in">
                <div className="flex justify-between items-center mb-4 bg-white/5 p-4 rounded-t-xl">
                    <h3 className="text-xl font-bold text-primary-blue">{teamName} Innings</h3>
                    <div className="text-xl font-bold">
                        {inningsData.runs}/{inningsData.wickets} <span className="text-sm text-gray-400">({inningsData.overs} ov)</span>
                    </div>
                </div>

                {/* Batting Table */}
                <div className="overflow-x-auto mb-6">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 text-gray-400 text-sm">
                                <th className="p-3">Batter</th>
                                <th className="p-3">Dismissal</th>
                                <th className="p-3 text-right">R</th>
                                <th className="p-3 text-right">B</th>
                                <th className="p-3 text-right">4s</th>
                                <th className="p-3 text-right">6s</th>
                                <th className="p-3 text-right">SR</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {teamBatting.map((record, idx) => (
                                <tr key={idx} className="hover:bg-white/5 transition-colors">
                                    <td
                                        className="p-3 font-medium text-primary-green cursor-pointer hover:underline"
                                        onClick={() => handlePlayerClick(record.playerName)}
                                    >
                                        {record.playerName}
                                    </td>
                                    <td className="p-3 text-sm text-gray-400">
                                        {record.isOut ? (
                                            <span>
                                                {record.dismissalType} b {record.dismissedBy}
                                            </span>
                                        ) : 'not out'}
                                    </td>
                                    <td className="p-3 text-right font-bold">{record.runs}</td>
                                    <td className="p-3 text-right">{record.balls}</td>
                                    <td className="p-3 text-right">{record.fours}</td>
                                    <td className="p-3 text-right">{record.sixes}</td>
                                    <td className="p-3 text-right">{record.strikeRate}</td>
                                </tr>
                            ))}
                            {/* Extras */}
                            <tr className="bg-white/5 font-semibold">
                                <td colSpan="2" className="p-3">Extras</td>
                                <td colSpan="5" className="p-3 text-right">
                                    {inningsData.extras.wides + inningsData.extras.noBalls + inningsData.extras.byes + inningsData.extras.legByes}
                                    <span className="text-xs text-gray-400 font-normal ml-2">
                                        (w {inningsData.extras.wides}, nb {inningsData.extras.noBalls}, b {inningsData.extras.byes}, lb {inningsData.extras.legByes})
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Bowling Table */}
                <h4 className="text-lg font-bold mb-3 text-primary-green">Bowling</h4>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 text-gray-400 text-sm">
                                <th className="p-3">Bowler</th>
                                <th className="p-3 text-right">O</th>
                                <th className="p-3 text-right">M</th>
                                <th className="p-3 text-right">R</th>
                                <th className="p-3 text-right">W</th>
                                <th className="p-3 text-right">ECO</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {teamBowling.map((record, idx) => (
                                <tr key={idx} className="hover:bg-white/5 transition-colors">
                                    <td
                                        className="p-3 font-medium cursor-pointer hover:underline text-blue-300"
                                        onClick={() => handlePlayerClick(record.playerName)}
                                    >
                                        {record.playerName}
                                    </td>
                                    <td className="p-3 text-right">{record.overs}</td>
                                    <td className="p-3 text-right">{record.maidens}</td>
                                    <td className="p-3 text-right">{record.runs}</td>
                                    <td className="p-3 text-right font-bold text-primary-blue">{record.wickets}</td>
                                    <td className="p-3 text-right">{record.economy}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    return (
        <div className="glass-effect rounded-2xl p-6">
            {renderInnings(matchData.innings1, matchData.battingRecords.filter(r => r.innings === 1), matchData.bowlingRecords.filter(r => r.innings === 1), matchData.innings1.battingTeam)}

            {matchData.innings2 && matchData.innings2.battingTeam && (
                <>
                    <div className="border-t border-white/10 my-8"></div>
                    {renderInnings(matchData.innings2, matchData.battingRecords.filter(r => r.innings === 2), matchData.bowlingRecords.filter(r => r.innings === 2), matchData.innings2.battingTeam)}
                </>
            )}

            <PlayerStatsModal
                playerName={selectedPlayer}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default FullScorecard;
