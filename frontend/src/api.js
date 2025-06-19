// src/api.js - FINAL, SIMPLIFIED VERSION

import axios from 'axios';

// This creates a central instance of axios for your entire app.
// By setting the baseURL to '/api', all requests will automatically go
// to the correct domain, whether on localhost or on your live Render site.
const api = axios.create({
    baseURL: '/api' 
});

// This "interceptor" automatically adds your login token to every secure request.
// This logic does not need to change.
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('adminToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
// import axios from 'axios';

// // This is the dynamic base URL for all API calls.
// const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

// const api = axios.create({
//     baseURL: `${API_URL}/api`,
// });

// // This automatically attaches the admin token to secure requests
// api.interceptors.request.use(
//     (config) => {
//         const token = localStorage.getItem('adminToken');
//         if (token) {
//             config.headers['Authorization'] = `Bearer ${token}`;
//         }
//         return config;
//     },
//     (error) => Promise.reject(error)
// );

// export default api;

