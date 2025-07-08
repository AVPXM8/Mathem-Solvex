// src/pages/QuestionListPage.jsx - FINAL CORRECTED VERSION

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // This component is for navigation
import api from '../api';
import styles from './QuestionListPage.module.css';
import MathPreview from '../components/MathPreview';
import toast from 'react-hot-toast';


const QuestionListPage = () => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingIds, setDeletingIds] = useState(new Set());
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await api.get('/questions');
                setQuestions(response.data);
            } catch (error) {
                console.error("Failed to fetch questions", error);
            } finally {
                setLoading(false);
            }
        };
        fetchQuestions();
    }, []);

   const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to permanently delete this question?')) {
            const originalQuestions = [...questions];

            // Instantly add the ID to our 'deleting' set.
            // This will trigger a CSS animation to hide the row immediately.
            setDeletingIds(prev => new Set(prev).add(id));
            
            try {
                // Send the delete request to the server in the background.
                await api.delete(`/questions/${id}`);
                
                // Once the server confirms, permanently remove it from the main state.
                setQuestions(prev => prev.filter((q) => q._id !== id));
                toast.success('Question deleted successfully!');

            } catch (error) {
                toast.error('Delete failed on server. Restoring question.');
                // If the delete fails, restore the original list and make the row visible again.
                setQuestions(originalQuestions);
                console.error('Failed to delete question:', error);
            } finally {
                // Always remove the ID from the deleting set after the operation is complete.
                setDeletingIds(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(id);
                    return newSet;
                });
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
            <div className={styles.tableWrapper}>
                <table className={styles.questionsTable}>
                    <thead>
                        <tr>
                            <th>Exam</th>
                            <th>Subject</th>
                            <th>Question Preview</th>
                            <th className={styles.actionsHeader}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {questions.length > 0 ? (
                            questions.map((question) => (
                                 <tr key={question._id} className={deletingIds.has(question._id) ? styles.deleting : ''}>
                                {/* // <tr key={question._id}> */}
                                    <td>{question.exam}</td>
                                    <td>{question.subject}</td>
                                    {/* <td>
                                        <div className={styles.questionPreview}>
                                            {question.questionText.replace(/<[^>]+>/g, '').substring(0, 100)}...
                                        </div>
                                    </td> */}

                                    {/* // here update for better maths  */}
                                    <td>
  <div className={styles.questionPreview}>
    <MathPreview
      latexString={question.questionText}
      style={{ maxWidth: '400px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
    />
  </div>
</td>

                                    <td className={styles.actionsCell}>
                                        {/* 👇 THIS IS THE FIX: The Edit button is now a Link 👇 */}
                                        <Link to={`/admin/questions/edit/${question._id}`} className={styles.editBtn}>
                                            Edit
                                        </Link>
                                        <button onClick={() => handleDelete(question._id)} className={styles.deleteBtn}>
                                            Delete
                                        </button>
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
        </div>
    );
};

export default QuestionListPage;