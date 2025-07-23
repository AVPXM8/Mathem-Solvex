import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import useMathJax from '../hooks/useMathJax';
import { Helmet } from 'react-helmet-async'; 
import styles from './SinglePostPage.module.css';

const SinglePostPage = () => {
    const { slug } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    // This hook ensures math formulas are rendered correctly after the post loads
    useMathJax([post]);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await api.get(`/posts/${slug}`);
                setPost(response.data);
            } catch (error) {
                console.error("Failed to fetch post", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [slug]); // Re-fetch if the slug in the URL changes

    if (loading) return <div className={styles.loading}>Loading Article...</div>;
    if (!post) return <div className={styles.loading}>Article not found.</div>;
    const pageTitle = `${post.title} | Maarula Classes`;
    const pageDescription = post.metaDescription || post.content.substring(0, 160).replace(/<[^>]+>/g, '');

    const articleSchema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": post.title,
        "description": pageDescription,
        "image": post.featuredImage || "/maarulalogo.png",
        "author": {
            "@type": "Organization",
            "name": "Maarula Classes"
        },
        "publisher": {
            "@type": "Organization",
            "name": "Maarula Classes",
            "logo": {
                "@type": "ImageObject",
                "url": "https://questions.maarula.in/maarulalogo.png"
            }
        },
        "datePublished": post.createdAt,
        "dateModified": post.updatedAt
    };

    return (
        <>
            {/* This adds dynamic Title and Description tags to the page for SEO */}
           <Helmet>
                <title>{pageTitle}</title>
                <meta name="description" content={pageDescription} />
                <link rel="canonical" href={`https://questions.maarula.in/articles/${post.slug}`} />
                <script type="application/ld+json">
                    {JSON.stringify(articleSchema)}
                </script>
            </Helmet>

            <article className={styles.container}>
                <header className={styles.postHeader}>
                    <p className={styles.category}>{post.category}</p>
                    <h1>{post.title}</h1>
                    <div className={styles.meta}>
                        <span>By {post.author}</span>
                        <span>{new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                </header>
                
                {post.featuredImage && (
                    <img src={post.featuredImage} alt={post.title} className={styles.featuredImage} />
                )}

                <div className={styles.postContent} dangerouslySetInnerHTML={{ __html: post.content }}></div>
            </article>
        </>
    );
};

export default SinglePostPage;
