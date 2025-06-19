// src/pages/DashboardPage.jsx - FINAL CORRECTED VERSION

import React, { useState, useEffect } from 'react';
import api from '../api'; // Use our new central API handler
import { useAuth } from '../context/AuthContext';
import styles from './DashboardPage.module.css';

const StatCard = ({ title, value, icon }) => (
    <div className={styles.statCard}>
        <div className={styles.statIcon}>{icon}</div>
        <div className={styles.statInfo}>
            <h3>{title}</h3>
            <p>{value}</p>
        </div>
    </div>
);

const DashboardPage = () => {
    const [stats, setStats] = useState(null);
    const [error, setError] = useState('');
    const { token } = useAuth(); // We still need the token to trigger the effect

    useEffect(() => {
        // This effect will run once the user is logged in (has a token)
        if (token) {
            const fetchStats = async () => {
                try {
                    // The API call is now simpler and more reliable
                    const response = await api.get('/questions/stats');
                    setStats(response.data);
                } catch (err) {
                    console.error("Failed to fetch stats:", err);
                    setError('Could not load dashboard statistics. Please try refreshing the page.');
                }
            };
            fetchStats();
        }
    }, [token]);

    return (
        <div>
            <h1>Dashboard Overview</h1>
            {error && <p className={styles.error}>{error}</p>}
            <div className={styles.statsGrid}>
                <StatCard title="Total Questions" value={stats ? stats.totalQuestions : '...'} icon="❓" />
                <StatCard title="Total Subjects" value={stats ? stats.totalSubjects : '...'} icon="📚" />
                <StatCard title="Total Exams" value={stats ? stats.totalExams : '...'} icon="🏆" />
            </div>
        </div>
    );
};

export default DashboardPage;