import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import styles from './DashboardPage.module.css';

const API_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001') + '/api/questions/stats';

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
    const { token, loading } = useAuth(); // Get the new 'loading' state

    useEffect(() => {
        // This function will now only run when loading is finished AND a token exists.
        const fetchStats = async () => {
            if (!loading && token) {
                try {
                    const config = { headers: { Authorization: `Bearer ${token}` } };
                    const response = await axios.get(API_URL, config);
                    setStats(response.data);
                } catch (err) {
                    console.error("Failed to fetch stats:", err);
                    setError('Could not load dashboard statistics. Please try refreshing the page.');
                }
            }
        };
        fetchStats();
    }, [token, loading]); // The effect depends on both token and loading state

    if (loading) {
        return <h2>Loading Dashboard...</h2>;
    }

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