import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user, isAdmin, isMatchCreator, isAuthenticated } = useAuth();

  const features = [
    {
      title: 'Live Matches',
      description: 'Watch ongoing cricket matches in real-time',
      icon: '🔴',
      path: '/live-matches',
      color: 'from-red-500 to-pink-500',
      public: true
    },
    {
      title: 'Scorecard System',
      description: 'Create and manage live cricket matches',
      icon: '📝',
      path: '/scorecard',
      color: 'from-blue-500 to-cyan-500',
      public: false,
      requiresCreator: true
    },
    {
      title: 'Score Predictor',
      description: 'Predict match outcomes with advanced analytics',
      icon: '📊',
      path: '/score-predictor',
      color: 'from-green-500 to-emerald-500',
      public: true
    },
    {
      title: 'Shot Analyzer',
      description: 'Master cricket shots with expert tips',
      icon: '🏏',
      path: '/shot-analyzer',
      color: 'from-purple-500 to-pink-500',
      public: true
    },
    {
      title: 'Match Simulator',
      description: 'Experience realistic match simulations',
      icon: '⚡',
      path: '/match-simulator',
      color: 'from-orange-500 to-red-500',
      public: true
    },
    {
      title: 'Cricket Quiz',
      description: 'Test your cricket knowledge',
      icon: '🎯',
      path: '/quiz',
      color: 'from-yellow-500 to-orange-500',
      public: true
    }
  ];

  // Filter features based on user role
  const visibleFeatures = features.filter(feature => {
    if (feature.public) return true;
    if (feature.requiresCreator && (isMatchCreator() || isAdmin())) return true;
    return false;
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-blue/20 to-primary-green/20 animate-pulse"></div>
        
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="mb-8 animate-bounce-slow">
            <img 
              src="/logo.png" 
              alt="SmartCrick Pro" 
              className="h-32 w-32 mx-auto drop-shadow-2xl"
            />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 gradient-text animate-fade-in">
            SmartCrick Pro
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 animate-slide-up">
            Your Ultimate Cricket Analytics & Training Platform
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 animate-fade-in">
            <Link
              to="/live-matches"
              className="px-8 py-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-full font-semibold text-white hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-red-500/50"
            >
              🔴 Watch Live Matches
            </Link>
            
            {/* Show different CTAs based on user role */}
            {isAdmin() && (
              <>
                <Link
                  to="/admin"
                  className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-800 rounded-full font-semibold text-white hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-red-600/50"
                >
                  ⚙️ Admin Dashboard
                </Link>
                <Link
                  to="/scorecard"
                  className="px-8 py-4 bg-gradient-to-r from-primary-green to-emerald-500 rounded-full font-semibold text-white hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-primary-green/50"
                >
                  🏏 Create Match
                </Link>
              </>
            )}
            
            {isMatchCreator() && !isAdmin() && (
              <>
                <Link
                  to="/creator"
                  className="px-8 py-4 bg-gradient-to-r from-primary-blue to-cyan-500 rounded-full font-semibold text-white hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-primary-blue/50"
                >
                  📊 My Dashboard
                </Link>
                <Link
                  to="/scorecard"
                  className="px-8 py-4 bg-gradient-to-r from-primary-green to-emerald-500 rounded-full font-semibold text-white hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-primary-green/50"
                >
                  🏏 Create Match
                </Link>
              </>
            )}
            
            {/* Show Apply button only for non-creators and non-admins */}
            {!isMatchCreator() && !isAdmin() && (
              <Link
                to="/apply"
                className="px-8 py-4 bg-gradient-to-r from-primary-blue to-primary-green rounded-full font-semibold text-white hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-primary-blue/50"
              >
                📋 Apply as Match Creator
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 gradient-text">
            Explore Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleFeatures.map((feature, index) => (
              <Link
                key={index}
                to={feature.path}
                className="group glass-effect rounded-2xl p-6 hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-primary-blue/30"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`text-6xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                
                <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-primary-green transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                  {feature.description}
                </p>
                
                {feature.requiresCreator && !isMatchCreator() && !isAdmin() && (
                  <div className="mt-3 text-xs text-yellow-400 bg-yellow-400/10 border border-yellow-400/30 rounded px-2 py-1">
                    🔒 Match Creator access required
                  </div>
                )}
                
                <div className={`mt-4 h-1 w-0 group-hover:w-full transition-all duration-500 bg-gradient-to-r ${feature.color} rounded-full`}></div>
              </Link>
            ))}
          </div>
          
          {/* Call to Action for Public Users and Logged-in Viewers */}
          {!isMatchCreator() && !isAdmin() && (
            <div className="mt-12 glass-effect rounded-2xl p-8 text-center">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-3xl font-bold gradient-text mb-4">Want to Create Matches?</h3>
              <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
                Apply to become a Match Creator and start organizing your own cricket matches. 
                Create scorecards, manage live matches, and share results with your community!
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  to="/apply"
                  className="px-8 py-4 bg-gradient-to-r from-primary-blue to-primary-green rounded-lg font-semibold hover:scale-105 transition-transform"
                >
                  📋 {isAuthenticated() ? 'Apply Now' : 'Apply as Match Creator'}
                </Link>
                {!isAuthenticated() && (
                  <Link
                    to="/login"
                    className="px-8 py-4 bg-white/10 border border-white/20 rounded-lg font-semibold hover:bg-white/20 transition-all"
                  >
                    Already have an account? Login
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 glass-effect">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="animate-fade-in">
              <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">6</div>
              <div className="text-gray-400">Modules</div>
            </div>
            <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">100%</div>
              <div className="text-gray-400">Offline</div>
            </div>
            <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">∞</div>
              <div className="text-gray-400">Simulations</div>
            </div>
            <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">24/7</div>
              <div className="text-gray-400">Available</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
