// src/pages/LoginPage.jsx  Login Page is smarter. It uses the AuthContext to handle the login logic.
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import styles from './LoginPage.module.css';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const auth = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const success = await auth.login(username, password);
            if (success) {
                navigate('/admin/dashboard'); // Redirect to dashboard on successful login
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginCard}>
                <h1 className={styles.title}>Admin Panel Login</h1>
                <p className={styles.subtitle}>Please enter your credentials to proceed.</p>
                <form onSubmit={handleSubmit}>
                    {error && <p className={styles.error}>{error}</p>}
                    <div className={styles.inputGroup}>
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className={styles.loginButton}>Login</button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;