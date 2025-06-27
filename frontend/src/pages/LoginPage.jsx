 import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import styles from './LoginPage.module.css';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    // This new state will control the login button's disabled status.
    const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);

    const recaptchaRef = useRef(null); 
    const auth = useAuth();
    const navigate = useNavigate();
    const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        // Get the token directly. It's guaranteed to be there because the button was enabled.
        const recaptchaToken = recaptchaRef.current.getValue();

        // A final check, just in case the token expired.
        if (!recaptchaToken) {
            setError('CAPTCHA token expired. Please verify again.');
            setIsCaptchaVerified(false); // Disable button again
            return;
        }

        setLoading(true);
        try {
            const success = await auth.login(username, password, recaptchaToken);
            if (success) {
                navigate('/admin/dashboard');
            }
        } catch (err) {
            setError(err.message || 'An error occurred.');
            // If login fails (e.g., wrong password), reset the reCAPTCHA.
            recaptchaRef.current.reset();
            setIsCaptchaVerified(false); // Disable login button again
        } finally {
            setLoading(false);
        }
    };

    // This function runs WHEN the user successfully checks the box
    const handleCaptchaChange = (token) => {
        if (token) {
            // A token exists, so the user is verified. Enable the login button.
            setIsCaptchaVerified(true);
            setError(''); // Clear any old errors
        }
    };

    // This function runs IF the CAPTCHA token expires after a timeout
    const handleCaptchaExpired = () => {
        // The token is no longer valid. Disable the login button.
        setIsCaptchaVerified(false);
    };

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.loginContainer}>
                <div className={styles.leftPanel}>
                    <img src="/maarulalogo.png" alt="Maarula Classes Logo" className={styles.logo} />
                    <h2>Welcome to the</h2>
                    <h1>Admin Control Panel</h1>
                    <p>Manage your question bank with power and ease.</p>
                </div>
                <div className={styles.rightPanel}>
                    <div className={styles.loginCard}>
                        <h2 className={styles.title}>Admin Login</h2>
                        <form onSubmit={handleSubmit}>
                            {error && <p className={styles.error}>{error}</p>}
                            <div className={styles.inputGroup}>
                                <label htmlFor="username">Username</label>
                                <div className={styles.inputWrapper}>
                                    <i className="fas fa-user"></i>
                                    <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter your username" required />
                                </div>
                            </div>
                            <div className={styles.inputGroup}>
                                <label htmlFor="password">Password</label>
                                <div className={styles.inputWrapper}>
                                    <i className="fas fa-lock"></i>
                                    <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" required />
                                </div>
                            </div>
                            <div className={styles.recaptchaContainer}>
                                <ReCAPTCHA
                                    ref={recaptchaRef}
                                    sitekey={recaptchaSiteKey}
                                    onChange={handleCaptchaChange}
                                    onExpired={handleCaptchaExpired}
                                />
                            </div>
                            {/* The button is now disabled until the CAPTCHA is verified */}
                            <button type="submit" className={styles.loginButton} disabled={!isCaptchaVerified || loading}>
                                {loading ? 'Verifying...' : 'Login Securely'}
                            </button>
                        </form>
                    </div>
                     <p className={styles.goBackLink}>
                        <Link to="/">&larr; Go back to Student Portal</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
