// src/pages/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './HomePage.module.css';

const HomePage = () => {
    return (
        <>
            <div className={styles.hero}>
                <h1>Welcome to the Maarula Classes Question Bank</h1>
                <p>Your one-stop destination for NIMCET, CUET PG, and other MCA Entrance previous year questions and solutions.</p>
                <div className={styles.buttonContainer}>
                    <Link to="/questions?exam=NIMCET" className={styles.ctaButton}>Browse NIMCET Questions</Link>
                    <Link to="/questions?exam=CUET PG" className={styles.ctaButton}>Browse CUET PG Questions</Link>
                </div>
            </div>

            {/* 👇 NEW PROMOTIONAL SECTION 👇 */}
            <div className={styles.promoSection}>
                <div className={styles.promoContent}>
                    <h2>Supercharge Your Preparation</h2>
                    <p>Get access to exclusive content, timed mock tests, and personalized performance analysis with the Maarula Mathem E-Learning App.</p>
                    <a href="https://play.google.com/store/apps/details?id=com.maarula.classes&pcampaignid=web_share" target="_blank" rel="noopener noreferrer" className={styles.promoButton}>Download The App</a>
                </div>
                <div className={styles.promoImage}>
                    <img src="/success-stories.jpg" alt="Student Success Stories"width="560" height="560"/>
                </div>
            </div>
        </>
    );
};

export default HomePage;