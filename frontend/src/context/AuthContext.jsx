import React, { createContext, useState, useContext, useEffect, useMemo, useCallback } from 'react';
import api from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('adminToken'));
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // Used to prevent rendering until auth check is done

    // This function will now only run once when the app first loads.
    // It checks if a token from a previous session is still valid.
    useEffect(() => {
        const verifyUser = async () => {
            if (token) {
                try {
                    // We use the '/api/admin/me' route to ask the server "who am I?"
                    // The api handler will automatically attach the token.
                    const response = await api.get('/admin/me');
                    setUser(response.data); // If successful, store the user data
                } catch (error) {
                    // If the token is expired or invalid, the server will send an error.
                    // We log out to clear the bad token.
                    console.error("Session token is invalid, logging out.");
                    logout();
                }
            }
            // We are finished with the initial loading/verification.
            setLoading(false);
        };
        verifyUser();
    }, []); // The empty array [] ensures this runs only once.

    // We wrap the login function in useCallback so it doesn't get re-created on every render.
    const login = useCallback(async (username, password, recaptchaToken) => {
        try {
            const response = await api.post('/admin/login', { username, password, recaptchaToken });
            if (response.data && response.data.token) {
                localStorage.setItem('adminToken', response.data.token);
                setToken(response.data.token);
                setUser(response.data); // Set user from login response
                return true;
            }
            return false;
        } catch (err) {
            throw new Error(err.response?.data?.message || 'Login failed!');
        }
    }, []);

    // We also wrap logout in useCallback.
    const logout = useCallback(() => {
        localStorage.removeItem('adminToken');
        setToken(null);
        setUser(null);
    }, []);

    // This is the most important fix.
    // useMemo ensures that the 'value' object is only re-created when the `token` or `loading` state actually changes.
    // This prevents the unnecessary re-renders that were resetting your CAPTCHA.
    const value = useMemo(() => ({
        token,
        user,
        loading,
        login,
        logout
    }), [token, user, loading, login, logout]);

    return (
        <AuthContext.Provider value={value}>
            {/* Don't render the rest of the app until the initial auth check is complete */}
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
