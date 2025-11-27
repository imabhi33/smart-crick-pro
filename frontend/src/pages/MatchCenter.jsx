import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import matchService from '../services/match.service';
import FullScorecard from '../components/FullScorecard';
import Commentary from '../components/Commentary';
import GroundStats from '../components/GroundStats';

const MatchCenter = () => {
    const { id } = useParams();
    const [matchData, setMatchData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('live'); // live, scorecard, commentary, info

    const loadMatch = async () => {
        try {
            const response = await matchService.getMatch(id);
            if (response.success) {
                setMatchData(response.data);
            }
        } catch (err) {
            setError('Failed to load match data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMatch();

        // Only set up polling if match is not completed
        if (matchData?.status !== 'completed') {
            const interval = setInterval(loadMatch, 3000);
            return () => clearInterval(interval);
        }
    }, [id, matchData?.status]);

    if (loading) return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
    if (error) return <div className="min-h-screen flex items-center justify-center text-red-400">{error}</div>;
    if (!matchData) return <div className="min-h-screen flex items-center justify-center text-white">Match not found</div>;

    const currentInnings = matchData.currentInnings === 1 ? matchData.innings1 : matchData.innings2;
    const battingTeam = matchData.battingTeam;
    const bowlingTeam = matchData.bowlingTeam;

    return (
        <div className="min-h-screen py-8 px-4 pb-20">
            <div className="max-w-6xl mx-auto">
                {/* Match Header */}
                <div className="glass-effect rounded-2xl p-6 mb-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold gradient-text mb-1">
                                {matchData.teamA.name} vs {matchData.teamB.name}
                            </h1>
                            <p className="text-gray-400 text-sm">
                                {matchData.groundName}, {matchData.location} • {new Date(matchData.matchDate).toLocaleDateString()}
                            </p>
                        </div>
                        <div className="text-center md:text-right">
                            <div className="text-sm font-semibold text-primary-green mb-1">
                                {matchData.status === 'completed' ? matchData.result : 'LIVE'}
                            </div>
                            <div className="text-3xl font-bold">
                                {currentInnings.runs}/{currentInnings.wickets} <span className="text-lg text-gray-400">({currentInnings.overs} ov)</span>
                            </div>
                            <div className="text-sm text-gray-400">
                                {battingTeam} CRR: {currentInnings.overs > 0 ? (currentInnings.runs / currentInnings.overs).toFixed(2) : '0.00'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex overflow-x-auto gap-2 mb-6 pb-2 scrollbar-hide">
                    {['live', 'scorecard', 'commentary', 'info'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-2 rounded-full font-semibold capitalize whitespace-nowrap transition-all ${activeTab === tab
                                ? 'bg-primary-blue text-white shadow-lg shadow-primary-blue/20'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="animate-fade-in">
                    {activeTab === 'live' && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 space-y-6">
                                {/* Match Equation & Run Rates */}
                                <div className="glass-effect rounded-2xl p-6">
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

                                {/* Current Status */}
                                <div className="glass-effect rounded-2xl p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="font-bold text-gray-300">Batting</h3>
                                    </div>
                                    <div className="space-y-3">
                                        {/* Striker */}
                                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border-l-4 border-primary-blue">
                                            <div>
                                                <div className="font-bold text-lg">{matchData.striker?.name || 'Striker'}*</div>
                                                <div className="text-xs text-gray-400">
                                                    SR: {matchData.striker?.balls > 0 ? ((matchData.striker.runs / matchData.striker.balls) * 100).toFixed(1) : '0.0'}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-bold text-xl">{matchData.striker?.runs || 0}</div>
                                                <div className="text-xs text-gray-400">({matchData.striker?.balls || 0})</div>
                                            </div>
                                        </div>
                                        {/* Non-Striker */}
                                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                                            <div>
                                                <div className="font-bold text-lg">{matchData.nonStriker?.name || 'Non-Striker'}</div>
                                                <div className="text-xs text-gray-400">
                                                    SR: {matchData.nonStriker?.balls > 0 ? ((matchData.nonStriker.runs / matchData.nonStriker.balls) * 100).toFixed(1) : '0.0'}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-bold text-xl">{matchData.nonStriker?.runs || 0}</div>
                                                <div className="text-xs text-gray-400">({matchData.nonStriker?.balls || 0})</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        <h3 className="font-bold text-gray-300 mb-4">Bowling</h3>
                                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border-l-4 border-primary-green">
                                            <div>
                                                <div className="font-bold text-lg">{matchData.currentBowler?.name || 'Bowler'}</div>
                                                <div className="text-xs text-gray-400">
                                                    ECO: {matchData.currentBowler?.overs > 0 ? (matchData.currentBowler.runs / matchData.currentBowler.overs).toFixed(2) : '0.00'}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-bold text-xl">
                                                    {matchData.currentBowler?.wickets || 0}-{matchData.currentBowler?.runs || 0}
                                                </div>
                                                <div className="text-xs text-gray-400">
                                                    {matchData.currentBowler?.overs || 0}.{matchData.currentBowler?.balls || 0}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Recent Balls */}
                                <div className="glass-effect rounded-2xl p-6">
                                    <h3 className="font-bold text-gray-300 mb-4">Recent Balls</h3>
                                    <div className="flex gap-2 overflow-x-auto pb-2">
                                        {matchData.currentOver?.map((ball, idx) => (
                                            <div
                                                key={idx}
                                                className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${ball.isWicket ? 'bg-red-500 text-white' :
                                                    ball.runs === 4 ? 'bg-blue-500 text-white' :
                                                        ball.runs === 6 ? 'bg-green-500 text-white' :
                                                            'bg-white/10 text-gray-300'
                                                    }`}
                                            >
                                                {ball.isWicket ? 'W' :
                                                    ball.isWide ? 'wd' :
                                                        ball.isNoBall ? 'nb' :
                                                            ball.runs}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar: Commentary Preview */}
                            <div className="lg:col-span-1">
                                <h3 className="font-bold text-gray-300 mb-4">Recent Commentary</h3>
                                <Commentary matchData={{ ...matchData, ballByBall: matchData.ballByBall.slice(-5) }} />
                                <button
                                    onClick={() => setActiveTab('commentary')}
                                    className="w-full mt-4 py-2 text-primary-blue text-sm font-semibold hover:underline"
                                >
                                    View Full Commentary
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'scorecard' && <FullScorecard matchData={matchData} />}

                    {activeTab === 'commentary' && <Commentary matchData={matchData} />}

                    {activeTab === 'info' && (
                        <div className="space-y-6">
                            <GroundStats groundId={matchData.groundId} />

                            <div className="glass-effect rounded-2xl p-6">
                                <h3 className="text-xl font-bold mb-4 gradient-text">Match Info</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <div className="text-sm text-gray-400 mb-1">Match</div>
                                        <div className="font-semibold">{matchData.teamA.name} vs {matchData.teamB.name}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-400 mb-1">Date</div>
                                        <div className="font-semibold">{new Date(matchData.matchDate).toLocaleString()}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-400 mb-1">Toss</div>
                                        <div className="font-semibold">
                                            {matchData.tossWinner ? `${matchData.tossWinner} won the toss and elected to ${matchData.electedTo}` : 'Toss not yet happened'}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-400 mb-1">Venue</div>
                                        <div className="font-semibold">{matchData.groundName}, {matchData.location}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MatchCenter;
