import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import toast from 'react-hot-toast';
import styles from './QuestionListPage.module.css'; // We can reuse the same table styles

const PostListPage = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await api.get('/posts');
                setPosts(response.data);
            } catch (error) {
                toast.error("Failed to fetch posts.");
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to permanently delete this post?')) {
            try {
                await api.delete(`/posts/${id}`);
                setPosts(prevPosts => prevPosts.filter(post => post._id !== id));
                toast.success('Post deleted successfully!');
            } catch (error) {
                toast.error('Failed to delete post.');
                console.error(error);
            }
        }
    };

    if (loading) return <h2>Loading Posts...</h2>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Content Management</h1>
                <Link to="/admin/posts/add" className={styles.addBtn}>
                    + Add New Post
                </Link>
            </div>
            <p>You have published {posts.length} articles or notifications.</p>

            <div className={styles.tableWrapper}>
                <table className={styles.questionsTable}>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Category</th>
                            <th>Date Published</th>
                            <th className={styles.actionsHeader}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {posts.length > 0 ? (
                            posts.map(post => (
                                <tr key={post._id}>
                                    <td>{post.title}</td>
                                    <td>{post.category}</td>
                                    <td>{new Date(post.createdAt).toLocaleDateString()}</td>
                                    <td className={styles.actionsCell}>
                                        <Link to={`/admin/posts/edit/${post._id}`} className={styles.editBtn}>Edit</Link>
                                        <button onClick={() => handleDelete(post._id)} className={styles.deleteBtn}>Delete</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4">No posts found. Click 'Add New Post' to get started.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PostListPage;