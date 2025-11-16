import { Link } from 'react-router-dom';

const Home = () => {
  const features = [
    {
      title: 'Score Predictor',
      description: 'Predict match outcomes with advanced analytics',
      icon: '📊',
      path: '/score-predictor',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Shot Analyzer',
      description: 'Master cricket shots with expert tips',
      icon: '🏏',
      path: '/shot-analyzer',
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Match Simulator',
      description: 'Experience realistic match simulations',
      icon: '⚡',
      path: '/match-simulator',
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Scorecard System',
      description: 'Track and manage match statistics',
      icon: '📝',
      path: '/scorecard',
      color: 'from-orange-500 to-red-500'
    },
    {
      title: 'Cricket Quiz',
      description: 'Test your cricket knowledge',
      icon: '🎯',
      path: '/quiz',
      color: 'from-yellow-500 to-orange-500'
    }
  ];

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
              to="/score-predictor"
              className="px-8 py-4 bg-gradient-to-r from-primary-blue to-primary-green rounded-full font-semibold text-white hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-primary-blue/50"
            >
              Get Started
            </Link>
            <Link
              to="/quiz"
              className="px-8 py-4 glass-effect rounded-full font-semibold hover:bg-white/10 transition-all duration-300"
            >
              Take Quiz
            </Link>
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
            {features.map((feature, index) => (
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
                
                <div className={`mt-4 h-1 w-0 group-hover:w-full transition-all duration-500 bg-gradient-to-r ${feature.color} rounded-full`}></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 glass-effect">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="animate-fade-in">
              <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">5</div>
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
