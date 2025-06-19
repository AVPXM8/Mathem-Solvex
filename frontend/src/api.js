import axios from 'axios';

// This is the dynamic base URL for all API calls.
const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

const api = axios.create({
    baseURL: `${API_URL}/api`,
});

// This automatically attaches the admin token to secure requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('adminToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;