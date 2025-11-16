import apiClient from './api.service';

const matchService = {
  // Create new match
  createMatch: async (matchData) => {
    const response = await apiClient.post('/matches', matchData);
    return response.data;
  },

  // Start match (select players)
  startMatch: async (matchId, players) => {
    const response = await apiClient.post(`/matches/${matchId}/start`, players);
    return response.data;
  },

  // Update score
  updateScore: async (matchId, scoreData) => {
    const response = await apiClient.post(`/matches/${matchId}/score`, scoreData);
    return response.data;
  },

  // Get match by ID
  getMatch: async (matchId) => {
    const response = await apiClient.get(`/matches/${matchId}`);
    return response.data;
  },

  // Get all matches
  getAllMatches: async () => {
    const response = await apiClient.get('/matches');
    return response.data;
  },

  // Get my matches (Match Creator)
  getMyMatches: async () => {
    const response = await apiClient.get('/matches/user/my-matches');
    return response.data;
  },

  // Get live matches
  getLiveMatches: async () => {
    const response = await apiClient.get('/matches/live');
    return response.data;
  },

  // Get player stats
  getPlayerStats: async (matchId) => {
    const response = await apiClient.get(`/matches/${matchId}/players`);
    return response.data;
  },

  // End match with password
  endMatch: async (matchId, password) => {
    const response = await apiClient.post(`/matches/${matchId}/end`, { password });
    return response.data;
  }
};

export default matchService;
