import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ScorePredictor from './pages/ScorePredictor';
import ShotAnalyzer from './pages/ShotAnalyzer';
import MatchSimulator from './pages/MatchSimulator';
import Scorecard from './pages/Scorecard';
import CricketQuiz from './pages/CricketQuiz';
import LiveMatches from './pages/LiveMatches';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import Apply from './pages/Application/Apply';
import AdminDashboard from './pages/Admin/AdminDashboard';
import CreatorDashboard from './pages/Creator/CreatorDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-primary-dark">
          <Navbar />
          <Routes>
            {/* Public Routes - No login required */}
            <Route path="/" element={<Home />} />
            <Route path="/live-matches" element={<LiveMatches />} />
            <Route path="/match/:id" element={<Scorecard />} />
            <Route path="/score-predictor" element={<ScorePredictor />} />
            <Route path="/shot-analyzer" element={<ShotAnalyzer />} />
            <Route path="/match-simulator" element={<MatchSimulator />} />
            <Route path="/quiz" element={<CricketQuiz />} />
            
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/apply" element={<Apply />} />
            
            {/* Admin Routes - Login required */}
            <Route path="/admin" element={<AdminDashboard />} />
            
            {/* Match Creator Routes - Login required */}
            <Route path="/creator" element={<CreatorDashboard />} />
            <Route path="/scorecard" element={<Scorecard />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
