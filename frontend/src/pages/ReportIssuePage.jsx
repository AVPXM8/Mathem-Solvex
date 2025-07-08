// src/pages/ReportIssuePage.jsx - FINAL ENHANCED UI VERSION

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import styles from './AddQuestionPage.module.css'; 


const ReportIssuePage = () => {
    const { id: questionId } = useParams();
    const [issueDescription, setIssueDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (issueDescription.trim().length < 10) {
            setError('Please provide a detailed description of the issue (at least 10 characters).');
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
        // 👇 The form is now wrapped in a card for a professional look 👇
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <h1>Report an Issue</h1>
                    <p>Help us improve by providing a detailed description of the problem you found.</p>
                </div>
                <div className={styles.cardBody}>
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
                                    rows="8" // This gives the text area a much better default height
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
            </div>
        </div>
    );
};

export default ReportIssuePage;