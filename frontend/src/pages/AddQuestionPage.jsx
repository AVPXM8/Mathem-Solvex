// For Admin add question page
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { Editor } from '@tinymce/tinymce-react';
import styles from './AddQuestionPage.module.css';

const AddQuestionPage = () => {
    const { id } = useParams();
    const isEditMode = Boolean(id);

    const [formData, setFormData] = useState({
        exam: 'NIMCET', subject: '', year: new Date().getFullYear(),
        questionText: '', explanationText: '', videoURL: '',
        options: [
            { text: '', imageURL: '', isCorrect: true }, { text: '', imageURL: '', isCorrect: false },
            { text: '', imageURL: '', isCorrect: false }, { text: '', imageURL: '', isCorrect: false },
        ],
    });
    const [imageFiles, setImageFiles] = useState({});
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const auth = useAuth();
    const navigate = useNavigate();
    const tinymceApiKey = import.meta.env.VITE_TINYMCE_API_KEY;

    useEffect(() => {
        if (isEditMode) {
            setLoading(true);
            api.get(`/questions/${id}`)
                .then(res => setFormData(res.data))
                .catch(err => setError('Failed to load question data.'))
                .finally(() => setLoading(false));
        }
    }, [id, isEditMode]);
    
    // --- All  handler functions (handleInputChange, handleSubmit, etc.) 
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    const handleEditorChange = (content, fieldName, optionIndex = null) => {
        if (optionIndex !== null) {
            const newOptions = [...formData.options];
            newOptions[optionIndex].text = content;
            setFormData(prev => ({ ...prev, options: newOptions }));
        } else {
            setFormData(prev => ({ ...prev, [fieldName]: content }));
        }
    };
    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (files[0]) {
            setImageFiles(prev => ({ ...prev, [name]: files[0] }));
        }
    };
    const handleCorrectOptionChange = (index) => {
        const newOptions = formData.options.map((opt, i) => ({ ...opt, isCorrect: i === index }));
        setFormData(prev => ({ ...prev, options: newOptions }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        const submissionData = new FormData();
        submissionData.append('exam', formData.exam);
        submissionData.append('subject', formData.subject);
        submissionData.append('year', formData.year);
        submissionData.append('questionText', formData.questionText);
        submissionData.append('explanationText', formData.explanationText);
        submissionData.append('videoURL', formData.videoURL);
        submissionData.append('options', JSON.stringify(formData.options));
        for (const key in imageFiles) {
            if (imageFiles[key]) {
                submissionData.append(key, imageFiles[key]);
            }
        }
        try {
            if (isEditMode) {
                await api.put(`/questions/${id}`, submissionData);
                alert('Question updated successfully!');
            } else {
                await api.post('/questions', submissionData);
                alert('Question added successfully!');
            }
            navigate('/admin/questions');
        } catch (err) {
            setError('Failed to save question. Please review all fields.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    // --- End of handler functions ---
    // configuration for the tinymice editor
    const editorConfig = {
        height: 250,
        menubar: false,
        plugins: 'lists link image charmap searchreplace visualblocks wordcount codesample',
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
                            <p className={styles.optionLabel}>Option {String.fromCharCode(65 + index)}</p>
                            <Editor apiKey={tinymceApiKey} value={option.text} onEditorChange={(content) => handleEditorChange(content, 'text', index)} init={{...editorConfig, height: 120}} />
                            <div className={styles.optionMeta}>
                                <div>
                                    <label className={styles.fileLabel}>Image for Option (Optional):</label>
                                    <input type="file" name={`option_${index}_image`} onChange={handleFileChange} accept="image/*" />
                                </div>
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