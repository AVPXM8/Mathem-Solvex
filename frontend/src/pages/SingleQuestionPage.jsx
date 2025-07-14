// export default SingleQuestionPage;
import React, { useState, useEffect,useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import ReactPlayer from 'react-player/youtube';
import useMathJax from '../hooks/useMathJax';
import MathPreview from '../components/MathPreview';
import { reRenderMathJax } from '../utils/mathjax';
import styles from './SingleQuestionPage.module.css';

const SingleQuestionPage = () => {
    const { id } = useParams();
    const [question, setQuestion] = useState(null); // Start with null
    const [loading, setLoading] = useState(true);
    const [relatedQuestions, setRelatedQuestions] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [showExplanation, setShowExplanation] = useState(false);
    const [showVideo, setShowVideo] = useState(false);
    const explanationRef = useRef(null);
    const feedbackRef = useRef(null);

    // This hook will re-render MathJax when the question or related questions are loaded
    useMathJax([question, relatedQuestions]);

    useEffect(() => {
        setLoading(true);
        // Reset all states when a new question ID is detected
        setQuestion(null);
        setRelatedQuestions([]);
        setShowExplanation(false);
        setShowVideo(false);
        setIsSubmitted(false);
        setSelectedOption(null);

        const fetchAllData = async () => {
            try {
                // Fetch both the main question and the related questions at the same time
                const questionPromise = api.get(`/questions/${id}`);
                const relatedPromise = api.get(`/questions/${id}/related`);

                const [questionRes, relatedRes] = await Promise.all([questionPromise, relatedPromise]);
                
                setQuestion(questionRes.data);
                setRelatedQuestions(relatedRes.data);

            } catch (err) {
                console.error("Failed to fetch question data", err);
                setQuestion(null); // Ensure question is null on error
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, [id]);
    useEffect(() => {
    // If the answer has just been submitted, scroll to the feedback card
    if (isSubmitted && feedbackRef.current) {
        feedbackRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'center' // 'center' provides a better viewing experience
        });
    }
}, [isSubmitted]);
    const handleOptionSelect = (index) => {
        if (!isSubmitted) {
            setSelectedOption(index);
            setIsSubmitted(true); // Immediately check the answer
            setShowExplanation(true); 
            setTimeout(reRenderMathJax, 0);
        }
    };

    const handleSubmit = () => {
        if (selectedOption === null) {
            alert('Please select an option first.');
            return;
        }
        setIsSubmitted(true);
        setTimeout(reRenderMathJax, 0);
    };
    const handleToggleExplanation = () => {
    setShowExplanation((prev) => {
        setTimeout(reRenderMathJax, 0);
        return !prev;
    });
};


    // This is the crucial fix. We show a loading message until the data is ready.
    if (loading) {
        return <div className={styles.loading}>Loading Question...</div>;
    }

    // If after loading, the question is still not found, show an error.
    if (!question) {
        return <div className={styles.loading}>Question not found or could not be loaded.</div>;
    }

    const isCorrect = question.options[selectedOption]?.isCorrect;

    // The rest of the component will only render if 'question' is not null.
    return (
        <div className={styles.pageLayout}>
            <div className={styles.mainContent}>
                <div className={styles.breadcrumb}>
                    <Link to="/questions">Question Library</Link> &rsaquo; {question.subject}
                </div>
                <div className={styles.questionCard}>
                    <div className={styles.questionHeader}>
                        <span>{question.exam} | {question.subject} | {question.year}</span>
                    </div>
                    
                    <MathPreview latexString={question.questionText} className={styles.questionBody} />
                    {question.questionImageURL && <img src={question.questionImageURL} alt="Question" className={styles.mainImage} />}

                    <h3 className={styles.optionsHeader}>Choose the correct answer:</h3>
                    <div className={styles.optionsGrid}>
                        {question.options.map((option, index) => {
                            let buttonClass = styles.optionButton;
                            if (isSubmitted) {
                                if (option.isCorrect) buttonClass += ` ${styles.correct}`;
                                else if (index === selectedOption) buttonClass += ` ${styles.incorrect}`;
                            } else if (index === selectedOption) {
                                buttonClass += ` ${styles.selected}`;
                            }
                            
                            return (
                                <button key={index} className={buttonClass} onClick={() => handleOptionSelect(index)} disabled={isSubmitted}>
                                    <span className={styles.optionLetter}>{String.fromCharCode(65 + index)}</span>
                                    <MathPreview latexString={option.text || ''} className={styles.optionContent} />
                                    {option.imageURL && <img src={option.imageURL} alt={`Option ${index + 1}`} className={styles.optionImage} />}
                                </button>
                            );
                        })}
                    </div>
                    
                    {!isSubmitted && (
                        <div className={styles.submitContainer}>
                            <button onClick={handleSubmit} className={styles.submitBtn} disabled={selectedOption === null}>Choose an Answer to solution</button>
                        </div>
                    )}
                </div>

                {isSubmitted && (
                    <div ref={feedbackRef} className={styles.feedbackCard}>
                        <p className={isCorrect ? styles.correctText : styles.incorrectText}>
                            {isCorrect ? '✅ Correct Answer! Well done.' : "Oops! That's not correct. Please review the explanation for better understanding."

}
                        </p>
                        <div className={styles.buttonGroup}>
                            <button onClick={handleToggleExplanation} className={styles.explanationBtn}>
                                    {showExplanation ? 'Hide' : 'Show'} Detailed Explanation
                            </button>

                            {question.videoURL && (
                                <button onClick={() => setShowVideo(!showVideo)} className={styles.explanationBtn}>
                                    {showVideo ? 'Hide' : 'Show'} Video Solution
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {showExplanation && (
                    <div ref={explanationRef} className={styles.explanationBox}>
                        <h3>Explanation</h3>
                        {question.explanationText ? <MathPreview latexString={question.explanationText} /> : <p>No text explanation available.</p>}
                        {question.explanationImageURL && <img src={question.explanationImageURL} alt="Explanation diagram" className={styles.mainImage} />}
                    </div>
                )}
                
                {showVideo && question.videoURL && (
                    <div className={styles.explanationBox}>
                        <h3>Video Explanation</h3>
                        <div className={styles.playerContainer}>
                            <ReactPlayer url={question.videoURL} width="100%" height="100%" controls={true} className={styles.reactPlayer}/>
                        </div>
                    </div>
                )}
                <div className={styles.reportSection}>
                    <Link to={`/report-issue/${id}`}>Report an issue with this question</Link>
                </div>
            </div>

            <aside className={styles.sidebar}>
                {relatedQuestions.length > 0 && (
                    <div className={styles.sidebarBlock}>
                        <h3>Related Questions</h3>
                        <div className={styles.relatedList}>
                            {relatedQuestions.map(q => (
                                <Link to={`/question/${q._id}`} key={q._id} className={styles.relatedItem}>
                                    <MathPreview latexString={q.questionText.substring(0, 80) + '...'} />
                                    <span>&rsaquo;</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </aside>
        </div>
    );
};

export default SingleQuestionPage;
