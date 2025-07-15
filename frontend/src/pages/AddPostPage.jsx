// src/pages/AddPostPage.jsx - FINAL VERSION WITH TINYMCE

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';
import toast from 'react-hot-toast';

// Use the TinyMCE Editor, just like in your AddQuestionPage
import { Editor } from '@tinymce/tinymce-react';

import styles from './AddQuestionPage.module.css'; // We can reuse the same form styles

const AddPostPage = () => {
    const { id } = useParams();
    const isEditMode = Boolean(id);

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('Blog');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const tinymceApiKey = import.meta.env.VITE_TINYMCE_API_KEY;

    useEffect(() => {
        if (isEditMode) {
            setLoading(true);
            // This route gets a single post by its ID, which we need to add to the backend
            api.get(`/posts/id/${id}`)
                .then(res => {
                    setTitle(res.data.title);
                    setContent(res.data.content);
                    setCategory(res.data.category);
                })
                .catch(() => toast.error("Failed to load post data."))
                .finally(() => setLoading(false));
        }
    }, [id, isEditMode]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const postData = { title, content, category };
        
        try {
            if (isEditMode) {
                await api.put(`/posts/${id}`, postData);
                toast.success('Post updated successfully!');
            } else {
                await api.post('/posts', postData);
                toast.success('Post created successfully!');
            }
            navigate('/admin/posts');
        } catch (error) {
            toast.error('Failed to save post.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Configuration for the TinyMCE editor for writing blog posts
    const editorConfig = {
        height: 500,
        menubar: true,
        plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'help', 'wordcount'
        ],
        toolbar: 
            'undo redo | styles | bold italic underline | ' +
            'alignleft aligncenter alignright | bullist numlist outdent indent | ' +
            'link image media | code'
    };

    if (loading && isEditMode) return <h2>Loading Post...</h2>;

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit}>
                <div className={styles.header}>
                    <h1>{isEditMode ? 'Edit Post' : 'Create New Post'}</h1>
                    <button type="submit" className={styles.submitBtn} disabled={loading}>
                        {loading ? 'Saving...' : (isEditMode ? 'Update Post' : 'Publish Post')}
                    </button>
                </div>
                
                <fieldset className={styles.fieldset}>
                    <legend>Post Details</legend>
                    <div className={styles.inputGroup}>
                        <label>Post Title</label>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter a catchy title" required />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Category</label>
                        <select value={category} onChange={(e) => setCategory(e.target.value)}>
                            <option value="Blog">Blog Post</option>
                            <option value="News">News</option>
                            <option value="Notification">Exam Notification</option>
                        </select>
                    </div>
                </fieldset>

                <fieldset className={styles.fieldset}>
                    <legend>Content</legend>
                    <Editor
                        apiKey={tinymceApiKey}
                        value={content}
                        init={editorConfig}
                        onEditorChange={(newContent) => setContent(newContent)}
                    />
                </fieldset>
            </form>
        </div>
    );
};

export default AddPostPage;
