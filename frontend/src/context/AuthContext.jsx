// src/context/AuthContext.jsx - FINAL CORRECTED VERSION

import React, { createContext, useState, useContext, useEffect } from 'react';
// import axios from 'axios';
import api from '../api'; // Use the new handler as we are using central api handler
// This is the base URL for your backend. It's dynamic for deployment.
//const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('adminToken'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        try {
            // 👇 THIS IS THE CORRECTED LINE 👇
            // It correctly combines the base URL with the specific path for the admin login.
            //const response = await axios.post(`${API_BASE_URL}/api/admin/login`, { username, password });
            const response = await api.post('/admin/login', { username, password });
            if (response.data && response.data.token) {
                localStorage.setItem('adminToken', response.data.token);
                setToken(response.data.token);
                return true;
            }
            return false;
        } catch (err) {
            throw new Error(err.response?.data?.message || 'Login failed!');
        }
    };

    const logout = () => {
        localStorage.removeItem('adminToken');
        setToken(null);
    };

    const value = { token, login, logout, loading };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);