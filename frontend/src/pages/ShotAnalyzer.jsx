import { useState } from 'react';
import { shotData } from '../utils/shotData';

const ShotAnalyzer = () => {
  const [selectedShot, setSelectedShot] = useState(null);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return 'text-green-400 bg-green-400/20';
      case 'Medium':
        return 'text-yellow-400 bg-yellow-400/20';
      case 'Hard':
        return 'text-orange-400 bg-orange-400/20';
      case 'Very Hard':
        return 'text-red-400 bg-red-400/20';
      default:
        return 'text-gray-400 bg-gray-400/20';
    }
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl font-bold gradient-text mb-4">Shot Analyzer</h1>
          <p className="text-gray-400 text-lg">Master cricket shots with expert guidance</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Shot Selection */}
          <div className="lg:col-span-1">
            <div className="glass-effect rounded-2xl p-6 sticky top-20">
              <h2 className="text-2xl font-bold mb-4 text-primary-green">Select Shot</h2>
              <div className="space-y-2">
                {shotData.map((shot) => (
                  <button
                    key={shot.id}
                    onClick={() => setSelectedShot(shot)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 ${
                      selectedShot?.id === shot.id
                        ? 'bg-primary-blue text-white'
                        : 'bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{shot.name}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(shot.difficulty)}`}>
                        {shot.difficulty}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Shot Details */}
          <div className="lg:col-span-2">
            {selectedShot ? (
              <div className="glass-effect rounded-2xl p-8 animate-fade-in">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-4xl font-bold gradient-text">{selectedShot.name}</h2>
                  <span className={`px-4 py-2 rounded-full font-semibold ${getDifficultyColor(selectedShot.difficulty)}`}>
                    {selectedShot.difficulty}
                  </span>
                </div>

                <div className="space-y-6">
                  {/* Tips */}
                  <div className="bg-gradient-to-r from-primary-blue/20 to-transparent border-l-4 border-primary-blue rounded-lg p-6">
                    <h3 className="text-xl font-bold mb-3 text-primary-blue flex items-center">
                      <span className="mr-2">💡</span> Pro Tips
                    </h3>
                    <p className="text-gray-300 leading-relaxed">{selectedShot.tips}</p>
                  </div>

                  {/* When to Play */}
                  <div className="bg-gradient-to-r from-primary-green/20 to-transparent border-l-4 border-primary-green rounded-lg p-6">
                    <h3 className="text-xl font-bold mb-3 text-primary-green flex items-center">
                      <span className="mr-2">⏰</span> When to Play
                    </h3>
                    <p className="text-gray-300 leading-relaxed">{selectedShot.whenToPlay}</p>
                  </div>

                  {/* Common Mistakes */}
                  <div className="bg-gradient-to-r from-red-500/20 to-transparent border-l-4 border-red-500 rounded-lg p-6">
                    <h3 className="text-xl font-bold mb-3 text-red-400 flex items-center">
                      <span className="mr-2">⚠️</span> Common Mistakes
                    </h3>
                    <p className="text-gray-300 leading-relaxed">{selectedShot.commonMistakes}</p>
                  </div>
                </div>

                {/* Practice Tips */}
                <div className="mt-8 glass-effect rounded-xl p-6 border border-primary-blue/30">
                  <h3 className="text-lg font-bold mb-3 text-white">Practice Recommendations</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start">
                      <span className="text-primary-green mr-2">✓</span>
                      <span>Practice in front of a mirror to check your technique</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary-green mr-2">✓</span>
                      <span>Start with slow bowling and gradually increase pace</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary-green mr-2">✓</span>
                      <span>Record your practice sessions for self-analysis</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary-green mr-2">✓</span>
                      <span>Focus on footwork and body positioning</span>
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="glass-effect rounded-2xl p-12 text-center animate-fade-in">
                <div className="text-6xl mb-4">🏏</div>
                <h3 className="text-2xl font-bold mb-2 text-gray-300">Select a Shot</h3>
                <p className="text-gray-500">Choose a cricket shot from the list to view detailed analysis</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShotAnalyzer;
