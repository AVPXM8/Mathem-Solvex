import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import ReactPlayer from 'react-player/youtube';
import styles from './SingleQuestionPage.module.css';

const API_URL = 'http://localhost:3001/api/questions';

const SingleQuestionPage = () => {
    const { id } = useParams();
    const [question, setQuestion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [showExplanation, setShowExplanation] = useState(false);
    const [showVideo, setShowVideo] = useState(false);

    useEffect(() => {
        setLoading(true);
        setShowExplanation(false);
        setShowVideo(false);
        setIsSubmitted(false);
        setSelectedOption(null);

        axios.get(`${API_URL}/${id}`)
            .then(res => {
                setQuestion(res.data);
                // This will trigger MathJax to re-render any new LaTeX content
                if (window.MathJax) {
                    window.MathJax.typeset();
                }
            })
            .catch(err => console.error("Failed to fetch question", err))
            .finally(() => setLoading(false));
    }, [id]);

    const handleOptionSelect = (index) => {
        if (!isSubmitted) {
            setSelectedOption(index);
        }
    };

    const handleSubmit = () => {
        if (selectedOption === null) {
            alert('Please select an option first.');
            return;
        }
        setIsSubmitted(true);
    };
    
    if (loading) return <div className={styles.loading}>Loading Question...</div>;
    if (!question) return <div className={styles.loading}>Question not found or could not be loaded.</div>;

    const isCorrect = question.options[selectedOption]?.isCorrect;

    return (
        <div className={styles.container}>
            <div className={styles.questionHeader}>
                <span>{question.exam} | {question.subject} | {question.year}</span>
            </div>
            
            <div className={styles.questionBody} dangerouslySetInnerHTML={{ __html: question.questionText }}></div>
            {question.questionImageURL && <img src={question.questionImageURL} alt="Question" className={styles.mainImage} />}

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
                            <div dangerouslySetInnerHTML={{ __html: option.text || '' }}></div>
                            {option.imageURL && <img src={option.imageURL} alt={`Option ${index + 1}`} className={styles.optionImage} />}
                        </button>
                    );
                })}
            </div>
            
            {!isSubmitted && (
                <button onClick={handleSubmit} className={styles.submitBtn} disabled={selectedOption === null}>Check Answer</button>
            )}

            {isSubmitted && (
                <div className={styles.feedback}>
                    <p className={isCorrect ? styles.correctText : styles.incorrectText}>
                        {isCorrect ? '✅ Correct Answer!' : '❌ Incorrect. The correct answer is highlighted in green.'}
                    </p>
                    <div className={styles.buttonGroup}>
                        <button onClick={() => setShowExplanation(!showExplanation)} className={styles.explanationBtn}>
                            {showExplanation ? 'Hide' : 'Show'} Explanation
                        </button>
                        {question.videoURL && (
                             <button onClick={() => setShowVideo(!showVideo)} className={styles.explanationBtn}>
                                {showVideo ? 'Hide' : 'Show'} Video
                            </button>
                        )}
                    </div>
                </div>
            )}

            {showExplanation && (
                <div className={styles.explanationBox}>
                    <h3>Explanation</h3>
                    {question.explanationText && <div dangerouslySetInnerHTML={{ __html: question.explanationText }}></div>}
                    {question.explanationImageURL && <img src={question.explanationImageURL} alt="Explanation" className={styles.mainImage} />}
                </div>
            )}
            
            {showVideo && question.videoURL && (
                <div className={styles.explanationBox}>
                    <h3>Video Explanation</h3>
                    <div className={styles.playerContainer}>
                        <ReactPlayer 
                            url={question.videoURL} 
                            width="100%" 
                            height="100%" 
                            controls={true}
                            className={styles.reactPlayer}
                        />
                    </div>
                </div>
            )}
             <div className={styles.reportSection}>
                <Link to={`/report-issue/${id}`}>Report an issue with this question</Link>
            </div>
        </div>
    );
};

export default SingleQuestionPage;