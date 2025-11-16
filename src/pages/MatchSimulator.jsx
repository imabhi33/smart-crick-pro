import { useState } from 'react';

const MatchSimulator = () => {
  const [gameState, setGameState] = useState({
    tossWon: false,
    choice: null,
    batting: false,
    score: 0,
    wickets: 0,
    balls: 0,
    currentOver: [],
    allOvers: [],
    isComplete: false
  });

  const outcomes = [
    { value: 0, label: 'Dot Ball', color: 'bg-gray-500' },
    { value: 1, label: '1 Run', color: 'bg-blue-500' },
    { value: 2, label: '2 Runs', color: 'bg-green-500' },
    { value: 3, label: '3 Runs', color: 'bg-yellow-500' },
    { value: 4, label: 'FOUR!', color: 'bg-orange-500' },
    { value: 6, label: 'SIX!', color: 'bg-purple-500' },
    { value: 'W', label: 'WICKET!', color: 'bg-red-500' }
  ];

  const handleToss = () => {
    const won = Math.random() > 0.5;
    setGameState({ ...gameState, tossWon: won });
  };

  const handleChoice = (choice) => {
    setGameState({
      ...gameState,
      choice,
      batting: choice === 'bat'
    });
  };

  const playBall = () => {
    if (gameState.wickets >= 10 || gameState.balls >= 120) {
      setGameState({ ...gameState, isComplete: true });
      return;
    }

    const random = Math.random();
    let outcome;
    
    if (random < 0.3) outcome = outcomes[0]; // Dot
    else if (random < 0.5) outcome = outcomes[1]; // 1
    else if (random < 0.65) outcome = outcomes[2]; // 2
    else if (random < 0.75) outcome = outcomes[3]; // 3
    else if (random < 0.88) outcome = outcomes[4]; // 4
    else if (random < 0.95) outcome = outcomes[5]; // 6
    else outcome = outcomes[6]; // Wicket

    const newScore = outcome.value === 'W' ? gameState.score : gameState.score + outcome.value;
    const newWickets = outcome.value === 'W' ? gameState.wickets + 1 : gameState.wickets;
    const newBalls = gameState.balls + 1;
    const newCurrentOver = [...gameState.currentOver, outcome];

    let newAllOvers = [...gameState.allOvers];
    if (newCurrentOver.length === 6) {
      newAllOvers.push(newCurrentOver);
      setGameState({
        ...gameState,
        score: newScore,
        wickets: newWickets,
        balls: newBalls,
        currentOver: [],
        allOvers: newAllOvers,
        isComplete: newWickets >= 10 || newBalls >= 120
      });
    } else {
      setGameState({
        ...gameState,
        score: newScore,
        wickets: newWickets,
        balls: newBalls,
        currentOver: newCurrentOver,
        isComplete: newWickets >= 10 || newBalls >= 120
      });
    }
  };

  const resetGame = () => {
    setGameState({
      tossWon: false,
      choice: null,
      batting: false,
      score: 0,
      wickets: 0,
      balls: 0,
      currentOver: [],
      allOvers: [],
      isComplete: false
    });
  };

  const getOvers = () => {
    return `${Math.floor(gameState.balls / 6)}.${gameState.balls % 6}`;
  };

  const getRunRate = () => {
    const overs = gameState.balls / 6;
    return overs > 0 ? (gameState.score / overs).toFixed(2) : '0.00';
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl font-bold gradient-text mb-4">Match Simulator</h1>
          <p className="text-gray-400 text-lg">Experience realistic cricket match simulation</p>
        </div>

        {!gameState.tossWon ? (
          <div className="glass-effect rounded-2xl p-12 text-center animate-fade-in">
            <div className="text-6xl mb-6">🪙</div>
            <h2 className="text-3xl font-bold mb-4">Toss Time!</h2>
            <p className="text-gray-400 mb-8">Click the button to toss the coin</p>
            <button
              onClick={handleToss}
              className="px-12 py-4 bg-gradient-to-r from-primary-blue to-primary-green rounded-full font-semibold text-white hover:scale-105 transition-transform duration-300 shadow-lg"
            >
              Toss Coin
            </button>
          </div>
        ) : !gameState.choice ? (
          <div className="glass-effect rounded-2xl p-12 text-center animate-fade-in">
            <div className="text-6xl mb-6">🏆</div>
            <h2 className="text-3xl font-bold mb-4 text-primary-green">You Won the Toss!</h2>
            <p className="text-gray-400 mb-8">What would you like to do?</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => handleChoice('bat')}
                className="px-8 py-4 bg-primary-blue rounded-xl font-semibold hover:scale-105 transition-transform duration-300"
              >
                🏏 Bat First
              </button>
              <button
                onClick={() => handleChoice('bowl')}
                className="px-8 py-4 bg-primary-green text-black rounded-xl font-semibold hover:scale-105 transition-transform duration-300"
              >
                ⚾ Bowl First
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Scoreboard */}
            <div className="glass-effect rounded-2xl p-8 animate-fade-in">
              <div className="grid grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-5xl font-bold gradient-text">{gameState.score}</div>
                  <div className="text-gray-400 mt-2">Runs</div>
                </div>
                <div>
                  <div className="text-5xl font-bold text-red-400">{gameState.wickets}</div>
                  <div className="text-gray-400 mt-2">Wickets</div>
                </div>
                <div>
                  <div className="text-5xl font-bold text-primary-blue">{getOvers()}</div>
                  <div className="text-gray-400 mt-2">Overs</div>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-white/10 text-center">
                <div className="text-sm text-gray-400">Run Rate</div>
                <div className="text-2xl font-bold text-primary-green">{getRunRate()}</div>
              </div>
            </div>

            {/* Current Over */}
            {gameState.currentOver.length > 0 && (
              <div className="glass-effect rounded-2xl p-6 animate-slide-up">
                <h3 className="text-xl font-bold mb-4 text-primary-green">Current Over</h3>
                <div className="flex gap-2 flex-wrap">
                  {gameState.currentOver.map((ball, index) => (
                    <div
                      key={index}
                      className={`${ball.color} px-4 py-2 rounded-lg font-bold text-white min-w-[60px] text-center`}
                    >
                      {ball.value}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Controls */}
            {!gameState.isComplete ? (
              <div className="glass-effect rounded-2xl p-8 text-center">
                <button
                  onClick={playBall}
                  className="px-12 py-4 bg-gradient-to-r from-primary-blue to-primary-green rounded-full font-semibold text-white hover:scale-105 transition-transform duration-300 shadow-lg text-xl"
                >
                  ⚡ Play Ball
                </button>
              </div>
            ) : (
              <div className="glass-effect rounded-2xl p-8 text-center animate-fade-in">
                <div className="text-6xl mb-4">🏁</div>
                <h2 className="text-3xl font-bold mb-4 gradient-text">Innings Complete!</h2>
                <div className="text-2xl mb-6">
                  Final Score: <span className="font-bold text-primary-blue">{gameState.score}/{gameState.wickets}</span>
                </div>
                <button
                  onClick={resetGame}
                  className="px-8 py-3 bg-gradient-to-r from-primary-blue to-primary-green rounded-full font-semibold text-white hover:scale-105 transition-transform duration-300"
                >
                  Start New Match
                </button>
              </div>
            )}

            {/* Over History */}
            {gameState.allOvers.length > 0 && (
              <div className="glass-effect rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-4 text-primary-green">Over Summary</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {gameState.allOvers.map((over, overIndex) => (
                    <div key={overIndex} className="bg-white/5 rounded-lg p-4">
                      <div className="text-sm text-gray-400 mb-2">Over {overIndex + 1}</div>
                      <div className="flex gap-2 flex-wrap">
                        {over.map((ball, ballIndex) => (
                          <div
                            key={ballIndex}
                            className={`${ball.color} px-3 py-1 rounded text-sm font-bold text-white`}
                          >
                            {ball.value}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchSimulator;
