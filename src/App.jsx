import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ScorePredictor from './pages/ScorePredictor';
import ShotAnalyzer from './pages/ShotAnalyzer';
import MatchSimulator from './pages/MatchSimulator';
import Scorecard from './pages/Scorecard';
import CricketQuiz from './pages/CricketQuiz';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-primary-dark">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/score-predictor" element={<ScorePredictor />} />
          <Route path="/shot-analyzer" element={<ShotAnalyzer />} />
          <Route path="/match-simulator" element={<MatchSimulator />} />
          <Route path="/scorecard" element={<Scorecard />} />
          <Route path="/quiz" element={<CricketQuiz />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
