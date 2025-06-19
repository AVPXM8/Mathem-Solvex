// src/pages/QuestionListPage.jsx - FINAL VERSION
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import styles from './QuestionListPage.module.css';

//const API_URL = 'http://localhost:3001/api/questions';
const API_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001') + '/api/questions';
const QuestionListPage = () => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();

    useEffect(() => {
        const fetchQuestions = async () => {
            if (!token) return setLoading(false);
            try {
                const response = await axios.get(API_URL);
                setQuestions(response.data);
            } catch (error) {
                console.error("Failed to fetch questions", error);
            } finally {
                setLoading(false);
            }
        };
        fetchQuestions();
    }, [token]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to permanently delete this question?')) {
            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                await axios.delete(`${API_URL}/${id}`, config);
                setQuestions(questions.filter((question) => question._id !== id));
                alert('Question deleted successfully!');
            } catch (error) {
                console.error('Failed to delete question', error);
                alert('Error: Could not delete the question.');
            }
        }
    };

    if (loading) return <h2>Loading Questions...</h2>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Question Management</h1>
                <Link to="/admin/questions/add" className={styles.addBtn}>
                    + Add New Question
                </Link>
            </div>
            <p>You have a total of {questions.length} questions in your database.</p>
            <table className={styles.questionsTable}>
                <thead>
                    <tr>
                        <th>Exam</th>
                        <th>Subject</th>
                        <th>Question Text (Preview)</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {questions.length > 0 ? (
                        questions.map((question) => (
                            <tr key={question._id}>
                                <td>{question.exam}</td>
                                <td>{question.subject}</td>
                                <td dangerouslySetInnerHTML={{ __html: question.questionText.substring(0, 100) + '...' }}></td>
                                <td className={styles.actionsCell}>
                                    {/* This is now a link that goes to the edit page */}
                                    <Link to={`/admin/questions/edit/${question._id}`} className={styles.editBtn}>
                                        Edit
                                    </Link>
                                    <button onClick={() => handleDelete(question._id)} className={styles.deleteBtn}>Delete</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4">No questions found. Click 'Add New Question' to get started.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default QuestionListPage;