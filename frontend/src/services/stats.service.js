import apiClient from './api.service';

const statsService = {
    getGroundStats: async (groundId) => {
        try {
            const response = await apiClient.get(`/stats/ground/${groundId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to fetch ground stats';
        }
    },

    getPlayerStats: async (playerName) => {
        try {
            const response = await apiClient.get(`/stats/player/${encodeURIComponent(playerName)}`);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to fetch player stats';
        }
    }
};

export default statsService;
