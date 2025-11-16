import { useState } from 'react';

const CoinFlip = () => {
  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState(null);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [history, setHistory] = useState([]);

  const flipCoin = () => {
    if (!selectedChoice) {
      alert('Please select Heads or Tails first!');
      return;
    }

    setIsFlipping(true);
    setShowResult(false);
    setResult(null);

    // Simulate coin flip with random result
    setTimeout(() => {
      const coinResult = Math.random() < 0.5 ? 'heads' : 'tails';
      setResult(coinResult);
      setIsFlipping(false);
      
      // Show result after animation
      setTimeout(() => {
        setShowResult(true);
        const won = coinResult === selectedChoice;
        setHistory(prev => [...prev, { choice: selectedChoice, result: coinResult, won }]);
      }, 300);
    }, 1500);
  };

  const reset = () => {
    setResult(null);
    setSelectedChoice(null);
    setShowResult(false);
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl font-bold gradient-text mb-4">Coin Toss</h1>
          <p className="text-gray-400 text-lg">Make your choice and flip the coin!</p>
        </div>

        {/* Main Card */}
        <div className="glass-effect rounded-3xl p-8 mb-8">
          {/* Choice Selection */}
          {!showResult && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-center mb-6">Choose Your Call</h3>
              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                <button
                  onClick={() => setSelectedChoice('heads')}
                  disabled={isFlipping}
                  className={`p-6 rounded-2xl font-bold text-lg transition-all duration-300 ${
                    selectedChoice === 'heads'
                      ? 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/50 scale-105'
                      : 'bg-white/5 border border-white/10 hover:bg-white/10'
                  } ${isFlipping ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="text-4xl mb-2">👑</div>
                  <div>Heads</div>
                </button>
                <button
                  onClick={() => setSelectedChoice('tails')}
                  disabled={isFlipping}
                  className={`p-6 rounded-2xl font-bold text-lg transition-all duration-300 ${
                    selectedChoice === 'tails'
                      ? 'bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/50 scale-105'
                      : 'bg-white/5 border border-white/10 hover:bg-white/10'
                  } ${isFlipping ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="text-4xl mb-2">🎯</div>
                  <div>Tails</div>
                </button>
              </div>
            </div>
          )}

          {/* Coin Display */}
          <div className="flex justify-center items-center mb-8" style={{ minHeight: '300px' }}>
            <div className="relative">
              {/* Coin */}
              <div
                className={`w-48 h-48 rounded-full flex items-center justify-center text-6xl font-bold shadow-2xl transition-all duration-300 ${
                  isFlipping ? 'coin-flip' : ''
                } ${
                  result === 'heads'
                    ? 'bg-gradient-to-br from-yellow-400 to-yellow-600'
                    : result === 'tails'
                    ? 'bg-gradient-to-br from-gray-300 to-gray-500'
                    : 'bg-gradient-to-br from-yellow-400 to-yellow-600'
                }`}
                style={{
                  animation: isFlipping ? 'spin 0.6s ease-in-out infinite' : 'none',
                  transformStyle: 'preserve-3d'
                }}
              >
                {!isFlipping && !result && '🪙'}
                {!isFlipping && result === 'heads' && '👑'}
                {!isFlipping && result === 'tails' && '🎯'}
                {isFlipping && '🪙'}
              </div>

              {/* Glow Effect */}
              {isFlipping && (
                <div className="absolute inset-0 rounded-full bg-blue-500/30 blur-xl animate-pulse"></div>
              )}
            </div>
          </div>

          {/* Result Display */}
          {showResult && (
            <div className="text-center mb-8 animate-fade-in">
              <div className={`inline-block px-8 py-4 rounded-2xl ${
                result === selectedChoice
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg shadow-green-500/50'
                  : 'bg-gradient-to-r from-red-500 to-red-600 shadow-lg shadow-red-500/50'
              }`}>
                <div className="text-3xl font-bold mb-2">
                  {result === selectedChoice ? '🎉 You Won!' : '😔 You Lost!'}
                </div>
                <div className="text-lg">
                  Result: <span className="font-bold capitalize">{result}</span>
                </div>
                <div className="text-sm opacity-80 mt-1">
                  Your choice: <span className="font-bold capitalize">{selectedChoice}</span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            {!showResult ? (
              <button
                onClick={flipCoin}
                disabled={isFlipping || !selectedChoice}
                className="btn-primary text-lg px-12 py-4"
              >
                {isFlipping ? (
                  <>
                    <span className="inline-block animate-spin mr-2">⚡</span>
                    Flipping...
                  </>
                ) : (
                  <>
                    <span className="mr-2">🪙</span>
                    Flip Coin
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={reset}
                className="btn-secondary text-lg px-12 py-4"
              >
                <span className="mr-2">🔄</span>
                Flip Again
              </button>
            )}
          </div>
        </div>

        {/* History */}
        {history.length > 0 && (
          <div className="glass-effect rounded-2xl p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center justify-between">
              <span>Toss History</span>
              <button
                onClick={() => setHistory([])}
                className="text-sm px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
              >
                Clear
              </button>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {history.slice().reverse().map((item, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-xl border ${
                    item.won
                      ? 'bg-green-500/10 border-green-500/30'
                      : 'bg-red-500/10 border-red-500/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-400">Your choice</div>
                      <div className="font-semibold capitalize">{item.choice}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-400">Result</div>
                      <div className="font-semibold capitalize">{item.result}</div>
                    </div>
                    <div className="text-2xl">
                      {item.won ? '✅' : '❌'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-white/10 flex justify-around text-center">
              <div>
                <div className="text-2xl font-bold text-green-400">
                  {history.filter(h => h.won).length}
                </div>
                <div className="text-sm text-gray-400">Wins</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-400">
                  {history.filter(h => !h.won).length}
                </div>
                <div className="text-sm text-gray-400">Losses</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-400">
                  {history.length > 0 ? ((history.filter(h => h.won).length / history.length) * 100).toFixed(0) : 0}%
                </div>
                <div className="text-sm text-gray-400">Win Rate</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoinFlip;
