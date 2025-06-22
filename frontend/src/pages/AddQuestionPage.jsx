 // src/pages/AddQuestionPage.jsx - FINAL COMPLETE VERSION

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
//import axios from 'axios';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { Editor } from '@tinymce/tinymce-react';
import styles from './AddQuestionPage.module.css';

//const API_URL = 'http://localhost:3001/api/questions';
 //const API_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001') + '/api/questions';
const AddQuestionPage = () => {
    // Get the question ID from the URL. If it exists, we are in "Edit Mode".
    const { id } = useParams();
    const isEditMode = Boolean(id);

    // A single state object to hold all form data
    const [formData, setFormData] = useState({
        exam: 'NIMCET',
        subject: '',
        year: new Date().getFullYear(),
        questionText: '',
        explanationText: '',
        videoURL: '',
        options: [
            { text: '', imageURL: '', isCorrect: true },
            { text: '', imageURL: '', isCorrect: false },
            { text: '', imageURL: '', isCorrect: false },
            { text: '', imageURL: '', isCorrect: false },
        ],
    });
    // A separate state to hold the actual file objects for upload
    const [imageFiles, setImageFiles] = useState({});
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const auth = useAuth();
    const navigate = useNavigate();
    const tinymceApiKey = import.meta.env.VITE_TINYMCE_API_KEY;

    // This code runs only in "Edit Mode" to fetch the existing question data
    useEffect(() => {
        if (isEditMode) {
            setLoading(true);
            //axios.get(`${API_URL}/${id}`)
            // This now correctly uses our central 'api' handler to fetch the question
            api.get(`/questions/${id}`)
                .then(res => {
                    // Populate the form with data from the database
                    setFormData({
                        exam: res.data.exam || 'NIMCET',
                        subject: res.data.subject || '',
                        year: res.data.year || new Date().getFullYear(),
                        questionText: res.data.questionText || '',
                        explanationText: res.data.explanationText || '',
                        videoURL: res.data.videoURL || '',
                        options: res.data.options || [
                            { text: '', imageURL: '', isCorrect: true }, { text: '', imageURL: '', isCorrect: false },
                            { text: '', imageURL: '', isCorrect: false }, { text: '', imageURL: '', isCorrect: false },
                        ],
                    });
                })
                .catch(err => {
                    setError('Failed to load question data.');
                    console.error(err);
                })
                .finally(() => setLoading(false));
        }
    }, [id, isEditMode]);

    // Generic handler for simple text/select inputs
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Handler for all rich text editor changes
    const handleEditorChange = (content, fieldName, optionIndex = null) => {
        if (optionIndex !== null) {
            const newOptions = [...formData.options];
            newOptions[optionIndex].text = content;
            setFormData(prev => ({ ...prev, options: newOptions }));
        } else {
            setFormData(prev => ({ ...prev, [fieldName]: content }));
        }
    };

    // Handler for all file input changes
    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (files[0]) {
            setImageFiles(prev => ({ ...prev, [name]: files[0] }));
        }
    };

    // Handler to set which option is the correct one
    const handleCorrectOptionChange = (index) => {
        const newOptions = formData.options.map((opt, i) => ({ ...opt, isCorrect: i === index }));
        setFormData(prev => ({ ...prev, options: newOptions }));
    };

    // Function to handle the final form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // We use FormData because we are sending files (images)
        const submissionData = new FormData();
        submissionData.append('exam', formData.exam);
        submissionData.append('subject', formData.subject);
        submissionData.append('year', formData.year);
        submissionData.append('questionText', formData.questionText);
        submissionData.append('explanationText', formData.explanationText);
        submissionData.append('videoURL', formData.videoURL);
        submissionData.append('options', JSON.stringify(formData.options));
        
        // Append all image files to the form data
        for (const key in imageFiles) {
            if (imageFiles[key]) {
                submissionData.append(key, imageFiles[key]);
            }
        }

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${auth.token}`,
                },
            };
            
            if (isEditMode) {
                // If we are editing, send a PUT request to update
                //await axios.put(`${API_URL}/${id}`, submissionData, config);
                await api.put(`/questions/${id}`, submissionData);
                alert('Question updated successfully!');
            } else {
                // If we are adding, send a POST request to create
                //await axios.post(API_URL, submissionData, config);
                await api.post('/questions', submissionData);
                alert('Question added successfully!');
            }
            navigate('/admin/questions'); // Go back to the list page after success

        } catch (err) {
            setError('Failed to save question. Please review all fields.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    
    // Configuration for the TinyMCE editor
    const editorConfig = {
    height: 250,
    menubar: false,
    plugins: 'lists link image charmap searchreplace visualblocks wordcount codesample',
    // We have added 'superscript subscript' to the toolbar
    toolbar: 'undo redo | blocks | bold italic superscript subscript | alignleft aligncenter alignright | bullist numlist | link image charmap codesample',
};

    if (loading && isEditMode) {
        return <h2>Loading question for editing...</h2>;
    }

    return (
        <div className={styles.container}>
            <h1>{isEditMode ? 'Edit Question' : 'Add New Question'}</h1>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                {error && <p className={styles.error}>{error}</p>}
                
                <div className={styles.grid}>
                    <div className={styles.inputGroup}>
                        <label>Exam</label>
                        <select name="exam" value={formData.exam} onChange={handleInputChange}>
                            <option value="NIMCET">NIMCET</option>
                            <option value="CUET PG">CUET PG</option>
                            <option value="JEE">JEE</option>
                        </select>
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Subject</label>
                        <input type="text" name="subject" value={formData.subject} onChange={handleInputChange} placeholder="e.g., Mathematics" required />
                    </div>
                     <div className={styles.inputGroup}>
                        <label>Year</label>
                        <input type="number" name="year" value={formData.year} onChange={handleInputChange} placeholder="e.g., 2024" required />
                    </div>
                </div>

                <div className={styles.inputGroup}>
                    <label>Video Explanation URL (Optional)</label>
                    <input type="text" name="videoURL" value={formData.videoURL} onChange={handleInputChange} placeholder="Paste YouTube link here" />
                </div>

                <div className={styles.inputGroup}>
                    <label>Question Text</label>
                    <Editor apiKey={tinymceApiKey} value={formData.questionText} onEditorChange={(content) => handleEditorChange(content, 'questionText')} init={editorConfig} />
                    <label className={styles.fileLabel}>Image for Question (Optional):</label>
                    <input type="file" name="questionImage" onChange={handleFileChange} accept="image/*" />
                </div>

                <div className={styles.inputGroup}>
                    <label>Options (Select the correct answer)</label>
                    {formData.options.map((option, index) => (
                        <div key={index} className={styles.optionContainer}>
                            <p className={styles.optionLabel}>Option {index + 1}</p>
                            <Editor apiKey={tinymceApiKey} value={option.text} onEditorChange={(content) => handleEditorChange(content, 'text', index)} init={{...editorConfig, height: 150}} />
                            <div className={styles.optionMeta}>
                                <label className={styles.fileLabel}>Image for Option {index + 1} (Optional):</label>
                                <input type="file" name={`option_${index}_image`} onChange={handleFileChange} accept="image/*" />
                                <label className={styles.radioLabel}>
                                    <input type="radio" name="correctOption" checked={option.isCorrect} onChange={() => handleCorrectOptionChange(index)} /> Correct Answer
                                </label>
                            </div>
                        </div>
                    ))}
                </div>

                <div className={styles.inputGroup}>
                    <label>Explanation</label>
                    <Editor apiKey={tinymceApiKey} value={formData.explanationText} onEditorChange={(content) => handleEditorChange(content, 'explanationText')} init={editorConfig} />
                    <label className={styles.fileLabel}>Image for Explanation (Optional):</label>
                    <input type="file" name="explanationImage" onChange={handleFileChange} accept="image/*" />
                </div>

                <button type="submit" className={styles.submitBtn} disabled={loading}>
                    {loading ? 'Saving...' : (isEditMode ? 'Update Question' : 'Save Question')}
                </button>
            </form>
        </div>
    );
};

export default AddQuestionPage;