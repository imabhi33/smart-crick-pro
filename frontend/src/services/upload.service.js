import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const uploadService = {
    // Upload CSV file with players
    uploadPlayerCSV: async (file) => {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await axios.post(`${API_URL}/players/upload-csv`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            return response.data;
        } catch (error) {
            console.error('CSV upload error:', error);
            throw error.response?.data || { success: false, message: 'Failed to upload CSV file' };
        }
    },

    // Download sample CSV template
    downloadSampleCSV: async () => {
        try {
            const response = await axios.get(`${API_URL}/players/sample-csv`, {
                responseType: 'blob'
            });

            // Create blob link to download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'sample_players.csv');
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);

            return { success: true, message: 'Sample CSV downloaded' };
        } catch (error) {
            console.error('Sample CSV download error:', error);
            throw error.response?.data || { success: false, message: 'Failed to download sample CSV' };
        }
    },

    // Validate player list
    validatePlayers: async (players) => {
        try {
            const response = await axios.post(`${API_URL}/players/validate`, { players });
            return response.data;
        } catch (error) {
            console.error('Player validation error:', error);
            throw error.response?.data || { success: false, message: 'Failed to validate players' };
        }
    }
};

export default uploadService;
