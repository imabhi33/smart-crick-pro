import { useState } from 'react';
import { quizData } from '../utils/quizData';

const CricketQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);

  const handleAnswer = (index) => {
    setSelectedAnswer(index);
    
    if (index === quizData[currentQuestion].correct) {
      setScore(score + 1);
      setShowResult('correct');
    } else {
      setShowResult('incorrect');
    }

    setTimeout(() => {
      if (currentQuestion + 1 < quizData.length) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        setQuizComplete(true);
      }
    }, 1500);
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setQuizComplete(false);
  };

  const getScoreMessage = () => {
    const percentage = (score / quizData.length) * 100;
    if (percentage === 100) return "Perfect! You're a cricket genius! 🏆";
    if (percentage >= 80) return "Excellent! You know your cricket! 🎯";
    if (percentage >= 60) return "Good job! Keep learning! 👍";
    if (percentage >= 40) return "Not bad! Room for improvement! 📚";
    return "Keep practicing! You'll get better! 💪";
  };

  if (quizComplete) {
    return (
      <div className="min-h-screen py-12 px-4 flex items-center justify-center">
        <div className="max-w-2xl w-full glass-effect rounded-2xl p-12 text-center animate-fade-in">
          <div className="text-6xl mb-6">
            {score === quizData.length ? '🏆' : score >= quizData.length * 0.7 ? '🎉' : '📚'}
          </div>
          <h2 className="text-4xl font-bold gradient-text mb-4">Quiz Complete!</h2>
          <div className="text-6xl font-bold text-primary-blue mb-4">
            {score}/{quizData.length}
          </div>
          <p className="text-xl text-gray-300 mb-8">{getScoreMessage()}</p>
          
          <div className="mb-8">
            <div className="w-full bg-white/10 rounded-full h-4 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary-blue to-primary-green transition-all duration-1000"
                style={{ width: `${(score / quizData.length) * 100}%` }}
              ></div>
            </div>
            <div className="text-sm text-gray-400 mt-2">
              {Math.round((score / quizData.length) * 100)}% Correct
            </div>
          </div>

          <button
            onClick={restartQuiz}
            className="px-8 py-4 bg-gradient-to-r from-primary-blue to-primary-green rounded-full font-semibold text-white hover:scale-105 transition-transform duration-300 shadow-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const question = quizData[currentQuestion];

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-5xl font-bold gradient-text mb-4">Cricket Quiz</h1>
          <p className="text-gray-400 text-lg">Test your cricket knowledge</p>
        </div>

        {/* Progress */}
        <div className="glass-effect rounded-2xl p-6 mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-gray-400">
              Question {currentQuestion + 1} of {quizData.length}
            </span>
            <span className="text-sm font-bold text-primary-green">
              Score: {score}
            </span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-blue to-primary-green transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / quizData.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="glass-effect rounded-2xl p-8 mb-6 animate-slide-up">
          <h2 className="text-2xl font-bold mb-8 text-white leading-relaxed">
            {question.question}
          </h2>

          <div className="space-y-4">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => !showResult && handleAnswer(index)}
                disabled={showResult !== false}
                className={`w-full text-left px-6 py-4 rounded-xl font-medium transition-all duration-300 ${
                  showResult === false
                    ? 'bg-white/5 hover:bg-white/10 hover:scale-105 border border-white/10'
                    : selectedAnswer === index
                    ? showResult === 'correct'
                      ? 'bg-green-500/30 border-2 border-green-500'
                      : 'bg-red-500/30 border-2 border-red-500'
                    : index === question.correct
                    ? 'bg-green-500/30 border-2 border-green-500'
                    : 'bg-white/5 border border-white/10 opacity-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {showResult !== false && (
                    <span className="text-2xl">
                      {index === question.correct ? '✓' : selectedAnswer === index ? '✗' : ''}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Feedback */}
        {showResult && (
          <div className={`glass-effect rounded-2xl p-6 text-center animate-fade-in ${
            showResult === 'correct' ? 'border-2 border-green-500' : 'border-2 border-red-500'
          }`}>
            <div className="text-4xl mb-2">
              {showResult === 'correct' ? '✓' : '✗'}
            </div>
            <div className={`text-xl font-bold ${
              showResult === 'correct' ? 'text-green-400' : 'text-red-400'
            }`}>
              {showResult === 'correct' ? 'Correct!' : 'Incorrect!'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CricketQuiz;
