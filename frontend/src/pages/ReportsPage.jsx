// src/pages/ReportsPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import styles from './QuestionListPage.module.css'; // We can reuse the same table styles

const API_URL = 'http://localhost:3001/api/reports';

const ReportsPage = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();

    useEffect(() => {
        const fetchReports = async () => {
            if (!token) return setLoading(false);
            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const response = await axios.get(API_URL, config);
                setReports(response.data);
            } catch (error) {
                console.error("Failed to fetch reports", error);
            } finally {
                setLoading(false);
            }
        };
        fetchReports();
    }, [token]);

    const handleResolve = async (id) => {
        if (window.confirm('Are you sure you want to mark this report as resolved? It will be deleted.')) {
            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                await axios.delete(`<span class="math-inline">\{API\_URL\}/</span>{id}`, config);
                setReports(reports.filter((report) => report._id !== id));
                alert('Report resolved and removed.');
            } catch (error) {
                console.error('Failed to delete report', error);
                alert('Error: Could not remove the report.');
            }
        }
    };

    if (loading) {
        return <h2>Loading Reports...</h2>;
    }

    return (
        <div className={styles.container}>
            <h1>Reported Issues</h1>
            <p>A total of {reports.length} issues have been reported by users.</p>

            <table className={styles.questionsTable}>
                <thead>
                    <tr>
                        <th>Question Subject</th>
                        <th>Issue Description</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {reports.length > 0 ? (
                        reports.map((report) => (
                            <tr key={report._id}>
                                <td>{report.questionId?.subject || 'N/A'}</td>
                                <td>{report.issueDescription}</td>
                                <td><span className={styles.statusPending}>{report.status}</span></td>
                                <td className={styles.actionsCell}>
                                    <button onClick={() => handleResolve(report._id)} className={styles.deleteBtn}>Resolve (Delete)</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4">No issues reported yet.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ReportsPage;