import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import useMathJax from '../hooks/useMathJax';
import styles from './ArticleListPage.module.css';

const ArticleListPage = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useMathJax([posts, loading]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await api.get('/posts');
                setPosts(response.data);
            } catch (error) {
                console.error("Failed to fetch posts", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.pageHeader}>
                <h1>Articles & Exam News</h1>
                <p>The latest updates, strategies, and insights for NIMCET & CUET PG aspirants.</p>
            </div>

            {loading ? (
                <p>Loading articles...</p>
            ) : (
                <div className={styles.postGrid}>
                    {posts.map(post => (
                       <Link to={`/articles/${post.slug}`} key={post._id} className={styles.postCard}>
                            {/* We can add featured images later */}
                            <div className={styles.postContent}>
                                <span className={styles.postCategory}>{post.category}</span>
                                <h2 className={styles.postTitle}>{post.title}</h2>
                                <p className={styles.postExcerpt} dangerouslySetInnerHTML={{ __html: post.content.substring(0, 150) + '...' }}></p>
                                <span className={styles.readMore}>Read Full Article &rarr;</span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ArticleListPage;
