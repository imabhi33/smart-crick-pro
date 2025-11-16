import { useState } from 'react';

const ScorePredictor = () => {
  const [formData, setFormData] = useState({
    team1: '',
    team2: '',
    runs: '',
    balls: '',
    wickets: ''
  });
  const [prediction, setPrediction] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const calculatePrediction = () => {
    const { runs, balls, wickets } = formData;
    
    if (!runs || !balls || !wickets) {
      alert('Please fill all fields');
      return;
    }

    const runsNum = parseInt(runs);
    const ballsNum = parseInt(balls);
    const wicketsNum = parseInt(wickets);
    
    // Simple prediction algorithm
    const runRate = runsNum / (ballsNum / 6);
    const wicketsLeft = 10 - wicketsNum;
    const ballsLeft = 120 - ballsNum; // Assuming T20
    
    const projectedScore = runsNum + (runRate * (ballsLeft / 6));
    const winPercentage = Math.min(95, Math.max(5, 
      (projectedScore / 200) * 100 * (wicketsLeft / 10)
    ));

    setPrediction({
      projectedScore: Math.round(projectedScore),
      winPercentage: Math.round(winPercentage),
      runRate: runRate.toFixed(2),
      requiredRunRate: ((200 - runsNum) / (ballsLeft / 6)).toFixed(2)
    });
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl font-bold gradient-text mb-4">Score Predictor</h1>
          <p className="text-gray-400 text-lg">Predict match outcomes with real-time analytics</p>
        </div>

        <div className="glass-effect rounded-2xl p-8 mb-8 animate-slide-up">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-primary-green">
                Team 1
              </label>
              <input
                type="text"
                name="team1"
                value={formData.team1}
                onChange={handleChange}
                placeholder="Enter team name"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-blue transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-primary-green">
                Team 2
              </label>
              <input
                type="text"
                name="team2"
                value={formData.team2}
                onChange={handleChange}
                placeholder="Enter team name"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-blue transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium mb-2 text-primary-green">
                Runs Scored
              </label>
              <input
                type="number"
                name="runs"
                value={formData.runs}
                onChange={handleChange}
                placeholder="0"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-blue transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-primary-green">
                Balls Faced
              </label>
              <input
                type="number"
                name="balls"
                value={formData.balls}
                onChange={handleChange}
                placeholder="0"
                max="120"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-blue transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-primary-green">
                Wickets Lost
              </label>
              <input
                type="number"
                name="wickets"
                value={formData.wickets}
                onChange={handleChange}
                placeholder="0"
                max="10"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-blue transition-colors"
              />
            </div>
          </div>

          <button
            onClick={calculatePrediction}
            className="w-full py-4 bg-gradient-to-r from-primary-blue to-primary-green rounded-lg font-semibold text-white hover:scale-105 transition-transform duration-300 shadow-lg"
          >
            Calculate Prediction
          </button>
        </div>

        {prediction && (
          <div className="glass-effect rounded-2xl p-8 animate-fade-in">
            <h2 className="text-3xl font-bold mb-6 gradient-text text-center">
              Prediction Results
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white/5 rounded-xl p-6 border border-primary-blue/30">
                <div className="text-sm text-gray-400 mb-2">Projected Score</div>
                <div className="text-4xl font-bold text-primary-blue">
                  {prediction.projectedScore}
                </div>
              </div>

              <div className="bg-white/5 rounded-xl p-6 border border-primary-green/30">
                <div className="text-sm text-gray-400 mb-2">Current Run Rate</div>
                <div className="text-4xl font-bold text-primary-green">
                  {prediction.runRate}
                </div>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Win Probability</span>
                <span className="text-sm font-bold text-primary-green">
                  {prediction.winPercentage}%
                </span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-6 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary-blue to-primary-green rounded-full transition-all duration-1000 flex items-center justify-center text-xs font-bold"
                  style={{ width: `${prediction.winPercentage}%` }}
                >
                  {prediction.winPercentage > 20 && `${prediction.winPercentage}%`}
                </div>
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="text-sm text-gray-400">Required Run Rate (to reach 200)</div>
              <div className="text-2xl font-bold text-white mt-1">
                {prediction.requiredRunRate} runs per over
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScorePredictor;
