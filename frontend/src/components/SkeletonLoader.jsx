import React from 'react';
import styles from './SkeletonLoader.module.css';

// This component represents a single, grayed-out question card.
const QuestionCardSkeleton = () => (
    <div className={styles.questionCard}>
        <div className={styles.tags}>
            <div className={`${styles.skeleton} ${styles.tag}`}></div>
            <div className={`${styles.skeleton} ${styles.tag}`}></div>
        </div>
        <div className={`${styles.skeleton} ${styles.text}`}></div>
        <div className={`${styles.skeleton} ${styles.text_short}`}></div>
        <div className={`${styles.skeleton} ${styles.viewLink}`}></div>
    </div>
);

// This component shows a list of several skeleton cards.
const QuestionListSkeleton = ({ count = 3 }) => {
    return (
        <div className={styles.questionList}>
            {Array.from({ length: count }).map((_, index) => (
                <QuestionCardSkeleton key={index} />
            ))}
        </div>
    );
};

export { QuestionListSkeleton };
