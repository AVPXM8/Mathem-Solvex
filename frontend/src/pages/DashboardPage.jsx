// // src/pages/DashboardPage.jsx

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useAuth } from '../context/AuthContext';
// import styles from './DashboardPage.module.css'; // We will create this CSS file next

// const API_URL = 'http://localhost:3001/api/questions/stats';

// const DashboardPage = () => {
//     const [stats, setStats] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const { token } = useAuth(); // Get the auth token to make a secure request

//     // This effect runs once when the component loads
//     // useEffect(() => {
//     //     const fetchStats = async () => {
//     //         try {
//     //             // Set up the authorization header to prove we are a logged-in admin
//     //             const config = {
//     //                 headers: {
//     //                     Authorization: `Bearer ${token}`
//     //                 }
//     //             };
//     //             // Make the API call to our new '/stats' endpoint
//     //             const response = await axios.get(API_URL, config);
//     //             setStats(response.data); // Store the stats in our component's state
//     //         } catch (error) {
//     //             console.error("Failed to fetch stats:", error);
//     //         } finally {
//     //             setLoading(false); // Stop showing the loading message
//     //         }
//     //     };

//     //     if (token) {
//     //         fetchStats();
//     //     }
//     // }, [token]); // The effect re-runs if the token changes
//     // src/pages/DashboardPage.jsx

// // TEMPORARY DEBUGGING VERSION - REPLACE THE OLD USEEFFECT WITH THIS
//  // src/pages/DashboardPage.jsx

// // TEMPORARY DEBUGGING VERSION - REPLACE THE OLD USEEFFECT WITH THIS
// useEffect(() => {
//     if (token) {
//         setLoading(true);
//         axios.get('http://localhost:3001/api/questions/stats', {
//             headers: { Authorization: `Bearer ${token}` }
//         })
//         .then(res => {
//             // If successful, show the data
//             alert('SUCCESS: The server sent back data: ' + JSON.stringify(res.data));
//             setStats(res.data);
//         })
//         .catch(err => {
//             // THIS ALERT IS THE MOST IMPORTANT PART
//             // It will pop up with the exact error message from the server.
//             alert('ERROR: The API call failed. Here is the server response: ' + JSON.stringify(err.response?.data || err.message));
//             console.error("Failed to fetch stats", err);
//         })
//         .finally(() => {
//             setLoading(false);
//         });
//     } else {
//         setLoading(false); // If there's no token, don't try to fetch
//     }
// }, [token]);

//     // Show a loading message while data is being fetched
//     if (loading) {
//         return <h2>Loading Dashboard...</h2>;
//     }

//     // Render the final dashboard UI with the stats
//     return (
//         <div>
//             <h1>Dashboard Overview</h1>
//             <div className={styles.statsGrid}>
//                 <div className={styles.statCard}>
//                     <h3>Total Questions</h3>
//                     <p>{stats?.totalQuestions ?? 0}</p>
//                 </div>
//                 <div className={styles.statCard}>
//                     <h3>Total Subjects</h3>
//                     <p>{stats?.totalSubjects ?? 0}</p>
//                 </div>
//                 <div className={styles.statCard}>
//                     <h3>Total Exams</h3>
//                     <p>{stats?.totalExams ?? 0}</p>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default DashboardPage;
// src/pages/DashboardPage.jsx - FINAL ROBUST VERSION

 // new updated code 
 import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import styles from './DashboardPage.module.css';

const API_URL = 'http://localhost:3001/api/questions/stats';

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
    const { token } = useAuth();

    useEffect(() => {
        if (token) {
            const fetchStats = async () => {
                try {
                    const config = { headers: { Authorization: `Bearer ${token}` } };
                    const response = await axios.get(API_URL, config);
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