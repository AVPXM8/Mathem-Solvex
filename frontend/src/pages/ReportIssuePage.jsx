// src/pages/ReportIssuePage.jsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
//import axios from 'axios';
import api from '../api';
import styles from './AddQuestionPage.module.css'; // We can reuse the admin form styles

//const API_URL = 'http://localhost:3001/api/reports';
//const API_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001') + '/api/reports';

const ReportIssuePage = () => {
    const { id: questionId } = useParams(); // Get the question ID from the URL
    const [issueDescription, setIssueDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (issueDescription.trim().length < 10) {
            setError('Please provide a detailed description of the issue.');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            await api.post('/reports', {
                questionId,
                issueDescription,
            });
            setSuccess('Thank you! Your report has been submitted successfully. You will be redirected shortly.');
            // Redirect back to the question page after a short delay
            setTimeout(() => {
                navigate(`/question/${questionId}`);
            }, 3000);
        } catch (err) {
            setError('Failed to submit report. Please try again later.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <h1>Report an Issue</h1>
            <p>Please provide a detailed description of the problem you found with this question.</p>

            {success ? (
                <p className={styles.success}>{success}</p>
            ) : (
                <form onSubmit={handleSubmit}>
                    {error && <p className={styles.error}>{error}</p>}

                    <div className={styles.inputGroup}>
                        <label htmlFor="issueDescription">Issue Description</label>
                        <textarea
                            id="issueDescription"
                            value={issueDescription}
                            onChange={(e) => setIssueDescription(e.target.value)}
                            rows="6"
                            placeholder="e.g., 'The correct answer is marked incorrectly', 'There is a typo in the explanation', etc."
                            required
                            className={styles.textarea}
                        />
                    </div>

                    <button type="submit" className={styles.submitBtn} disabled={loading}>
                        {loading ? 'Submitting...' : 'Submit Report'}
                    </button>
                </form>
            )}
        </div>
    );
};

export default ReportIssuePage;