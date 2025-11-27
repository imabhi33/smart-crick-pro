import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAdmin, isMatchCreator, isAuthenticated, logout } = useAuth();

  // Public links - visible to everyone
  const publicLinks = [
    { path: '/', label: 'Home' },
    { path: '/live-matches', label: '🔴 Live Matches' },
    { path: '/all-matches', label: '📋 All Matches' },
    { path: '/score-predictor', label: 'Score Predictor' },
    { path: '/shot-analyzer', label: 'Shot Analyzer' },
    { path: '/match-simulator', label: 'Match Simulator' },
    { path: '/quiz', label: 'Quiz' },
  ];

  // Note: Admin and Creator links are dynamically added based on role
  // No need for separate arrays as they're constructed in the navLinks logic

  // Determine which links to show based on user role
  let navLinks = [...publicLinks];

  if (isAdmin()) {
    // Admin gets admin dashboard + scorecard creation + public links
    navLinks = [
      { path: '/admin', label: '⚙️ Admin Dashboard' },
      { path: '/scorecard', label: '🏏 Create Match' },
      ...publicLinks
    ];
  } else if (isMatchCreator()) {
    // Match Creator gets creator dashboard + scorecard creation + public links
    navLinks = [
      { path: '/creator', label: '📊 Dashboard' },
      { path: '/scorecard', label: '🏏 Create Match' },
      ...publicLinks
    ];
  } else if (isAuthenticated() && !isMatchCreator() && !isAdmin()) {
    // Logged in viewer - show apply option
    navLinks = [
      { path: '/apply', label: '📋 Apply as Creator' },
      ...publicLinks
    ];
  }

  return (
    <nav className="glass-effect sticky top-0 z-50 border-b border-white/10 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <img
                src="/logo.png"
                alt="SmartCrick Pro"
                className="h-9 w-9 transition-transform group-hover:scale-110"
              />
            </div>
            <div className="hidden sm:block">
              <span className="text-lg font-bold gradient-text">SmartCrick</span>
              <span className="text-xs text-gray-400 ml-1">Pro</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${location.pathname === link.path
                    ? 'bg-primary-blue/20 text-primary-blue border border-primary-blue/30'
                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth Section */}
          <div className="hidden lg:flex items-center space-x-3">
            {!isAuthenticated() ? (
              <>
                <Link
                  to="/signup"
                  className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                >
                  Sign Up
                </Link>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-primary-blue to-primary-green rounded-lg hover:shadow-lg hover:shadow-primary-blue/30 transition-all"
                >
                  Login
                </Link>
              </>
            ) : (
              <>
                <div className="flex items-center space-x-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/10">
                  <div className="text-xs">
                    <div className="text-gray-400">Welcome</div>
                    <div className="font-semibold text-white">{user?.name?.split(' ')[0]}</div>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-bold ${isAdmin() ? 'bg-red-500/20 text-red-400' :
                      isMatchCreator() ? 'bg-blue-500/20 text-blue-400' :
                        'bg-gray-500/20 text-gray-400'
                    }`}>
                    {isAdmin() ? 'Admin' : isMatchCreator() ? 'Creator' : 'Viewer'}
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden pb-4 animate-slide-up border-t border-white/10 mt-2">
            <div className="py-2 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${location.pathname === link.path
                      ? 'bg-primary-blue/20 text-primary-blue border border-primary-blue/30'
                      : 'text-gray-300 hover:bg-white/5 hover:text-white'
                    }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Mobile Auth Section */}
            <div className="mt-4 pt-4 border-t border-white/10">
              {!isAuthenticated() ? (
                <div className="space-y-2">
                  <Link
                    to="/signup"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-2.5 text-sm font-medium text-center text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                  >
                    Sign Up
                  </Link>
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-2.5 text-sm font-medium text-center bg-gradient-to-r from-primary-blue to-primary-green rounded-lg"
                  >
                    Login
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="px-4 py-3 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs text-gray-400">Welcome</div>
                        <div className="font-semibold text-white text-sm">{user?.name}</div>
                      </div>
                      <div className={`px-2 py-1 rounded text-xs font-bold ${isAdmin() ? 'bg-red-500/20 text-red-400' :
                          isMatchCreator() ? 'bg-blue-500/20 text-blue-400' :
                            'bg-gray-500/20 text-gray-400'
                        }`}>
                        {isAdmin() ? 'Admin' : isMatchCreator() ? 'Creator' : 'Viewer'}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="block w-full px-4 py-2.5 text-sm font-medium text-red-400 hover:bg-red-500/10 rounded-lg text-center transition-all"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
