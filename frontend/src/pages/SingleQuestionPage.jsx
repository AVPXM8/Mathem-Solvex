import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import ReactPlayer from 'react-player/youtube';
import useMathJax from '../hooks/useMathJax'; // Import our custom hook
import MathPreview from '../components/MathPreview';

import styles from './SingleQuestionPage.module.css';

const SingleQuestionPage = () => {
    const { id } = useParams();
    const [question, setQuestion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [showExplanation, setShowExplanation] = useState(false);
    const [showVideo, setShowVideo] = useState(false);

    // This hook will now automatically handle MathJax rendering whenever the 'question' data changes
    useMathJax([question]);

    useEffect(() => {
        setLoading(true);
        // Reset all states when a new question is loaded for a clean slate
        setShowExplanation(false);
        setShowVideo(false);
        setIsSubmitted(false);
        setSelectedOption(null);

        api.get(`/questions/${id}`)
            .then(res => {
                setQuestion(res.data);
            })
            .catch(err => {
                console.error("Failed to fetch question", err);
                setQuestion(null); // Set to null on error
            })
            .finally(() => {
                setLoading(false);
            });
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
            <div className={styles.questionCard}>
                <div className={styles.questionHeader}>
                    <span>{question.exam} | {question.subject} | {question.year}</span>
                </div>
                
                {/* <div className={styles.questionBody} dangerouslySetInnerHTML={{ __html: question.questionText }}></div> */}
                <MathPreview latexString={question.questionText} className={styles.questionBody} />

                {question.questionImageURL && <img src={question.questionImageURL} alt="Question illustration" className={styles.mainImage} />}

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
                                {/* <div className={styles.optionContent} dangerouslySetInnerHTML={{ __html: option.text || '' }}></div> */}
                                <MathPreview latexString={option.text || ''} className={styles.optionContent} />

                                {option.imageURL && <img src={option.imageURL} alt={`Option ${index + 1}`} className={styles.optionImage} />}
                            </button>
                        );
                    })}
                </div>
                
                {!isSubmitted && (
                    <div className={styles.submitContainer}>
                        <button onClick={handleSubmit} className={styles.submitBtn} disabled={selectedOption === null}>Check Answer</button>
                    </div>
                )}
            </div>

            {isSubmitted && (
                <div className={styles.feedbackCard}>
                    <p className={isCorrect ? styles.correctText : styles.incorrectText}>
                        {isCorrect ? '✅ Correct Answer! Well done.' : '❌ Incorrect. The correct answer is highlighted in green.'}
                    </p>
                    <div className={styles.buttonGroup}>
                        <button onClick={() => setShowExplanation(!showExplanation)} className={styles.explanationBtn}>
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
                <div className={styles.explanationBox}>
                    <h3>Explanation</h3>
                    {/* {question.explanationText ? <div dangerouslySetInnerHTML={{ __html: question.explanationText }}></div> : <p>No text explanation available.</p>} */}
                    {question.explanationText ? (
  <MathPreview latexString={question.explanationText} />
) : (
  <p>No text explanation available.</p>
)}

                    {question.explanationImageURL && <img src={question.explanationImageURL} alt="Explanation diagram" className={styles.mainImage} />}
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