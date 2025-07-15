import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom'; // <--- STEP 1: ADD THIS IMPORT
import styles from './HomePage.module.css';

// Import Data and Components
import { students } from '../data/students'; 
import StudentCard from '../components/StudentCard';
import SuccessCarousel from '../components/SuccessCarousel';

const examTabs = ['All', ...new Set(students.map(s => s.exam))];

const HomePage = () => {
  const [activeTab, setActiveTab] = useState('All');

  const filteredStudents = useMemo(() => {
    if (activeTab === 'All') return students;
    return students.filter(student => student.exam === activeTab);
  }, [activeTab]);

  return (
    <div className={styles.homePage}>
      <SuccessCarousel />

      <section className={styles.resultsSection}>
        {/* ... (This section remains the same) ... */}
        <h2 className={styles.sectionTitle}>Meet Our 2025 Stars</h2>
        <div className={styles.tabsContainer}>
          {examTabs.map(tab => (
            <button
              key={tab}
              className={`${styles.tabButton} ${activeTab === tab ? styles.activeTab : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className={styles.resultsGrid}>
          {filteredStudents.map(student => (
            <StudentCard key={student.id} student={student} />
          ))}
        </div>
      </section>

      {/* SECTION 3: CALL TO ACTION HUB - NOW CORRECTED */}
      <section className={styles.ctaHub}>
        <h2 className={styles.sectionTitle}>The Tools Behind The Toppers</h2>
        <p className={styles.ctaText}>
          Our success is built on a foundation of strategic practice. Access our comprehensive question bank with detailed, expert-verified solutions and prepare with the confidence of a champion.
        </p>
        <div className={styles.ctaButtonContainer}>
          {/* STEP 2: CHANGE <a> TO <Link> AND href TO to */}
          <Link to="/questions?exam=NIMCET" className={styles.ctaButton}>
            <strong>Explore NIMCET Bank</strong>
            <span>10+ years of topic-wise papers</span>
          </Link>
          <Link to="/questions?exam=CUET-PG" className={styles.ctaButton}>
            <strong>Access CUET-PG Bank</strong>
            <span>Master concepts with detailed solutions</span>
          </Link>
        </div>
      </section>

      {/* ... (The features section remains the same) ... */}
       <section className={styles.featuresSection}>
         <h2 className={styles.sectionTitle}>Why Maarula Classes?</h2>
         <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
               <h3>Expert Solutions</h3>
               <p>Accurate, in-depth solutions crafted by experienced faculty, not by AI.</p>
            </div>
            <div className={styles.featureCard}>
               <h3>Strategic Organization</h3>
               <p>Target weak areas with questions organized by year, topic, and difficulty.</p>
            </div>
            <div className={styles.featureCard}>
               <h3>Real Exam Simulation</h3>
               <p>Practice with a platform that mimics the format and pressure of the real exam.</p>
            </div>
         </div>
      </section>
    </div>
  );
};

export default HomePage;