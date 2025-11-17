import axios from 'axios';

// Get API URL from environment variable
let API_URL = import.meta.env.VITE_API_URL ;

// Automatically append /api if not present
if (!API_URL.endsWith('/api')) {
  API_URL = API_URL.replace(/\/$/, '') + '/api'; // Remove trailing slash if exists, then add /api
}

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests (optional - for future auth features)
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Just return error, no redirect
    return Promise.reject(error);
  }
);

export default apiClient;
