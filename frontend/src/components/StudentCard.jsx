import React from 'react';
import styles from './StudentCard.module.css';

const StudentCard = ({ student }) => {
  return (
    <div className={styles.card}>
      <img 
        src={student.imageUrl} 
        alt={`${student.name} - ${student.exam} ${student.year} Rank ${student.rank}`}
        loading="lazy"
        className={styles.posterImage}
      />
    </div>
  );
};

export default StudentCard;