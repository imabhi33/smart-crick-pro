import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/auth.service';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    const response = await authService.login(credentials);
    if (response.success) {
      setUser(response.data);
    }
    return response;
  };

  const signup = async (userData) => {
    const response = await authService.signup(userData);
    if (response.success) {
      setUser(response.data);
    }
    return response;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const isAdmin = () => user?.role === 'admin';
  const isMatchCreator = () => user?.role === 'match_creator';
  const isViewer = () => !user || user?.role === 'viewer';
  const isAuthenticated = () => !!user;

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    isAdmin,
    isMatchCreator,
    isViewer,
    isAuthenticated
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
