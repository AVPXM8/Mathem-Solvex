import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
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

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Maarula Classes Question Bank",
    "url": "https://questions.maarula.in/",
  };

  return (
    <div className={styles.homePage}>
      <Helmet>
        <title>Maarula Classes: #1 NIMCET Coaching in India</title>
        <meta name="description" content="Discover why Maarula Classes is ranked as India's #1 NIMCET coaching institute. Access expert-led courses, a comprehensive question bank, and join thousands of successful students from across the country." />
        <meta name="keywords" content="NIMCET coaching, #1 NIMCET coaching, NIMCET coaching in India, CUET PG question bank, MCA entrance exam, Maarula Classes" />
        <link rel="canonical" href="https://questions.maarula.in/" />
        <script type="application/ld+json">{JSON.stringify(websiteSchema)}</script>
      </Helmet>

      {/* Section 1: Top Carousel */}
      <SuccessCarousel />

      {/* Section 2: Student Results (MOVED UP) */}
      <section className={styles.resultsSection}>
        <h1 className={styles.sectionTitle}>Meet Our 2025 Stars</h1>
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

      {/* Section 3: Call to Action Hub */}
      <section className={styles.ctaHub}>
        <h2 className={styles.sectionTitle}>The Tools Behind The Toppers</h2>
        <p className={styles.ctaText}>
          Our success is built on a foundation of strategic practice. Access our comprehensive question bank with detailed, expert-verified solutions and prepare with the confidence of a champion.
        </p>
        <div className={styles.ctaButtonContainer}>
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

      {/* Section 4: Key Features */}
      <section className={styles.featuresSection}>
       <h2 className={styles.sectionTitle}>Why Maarula Classes?</h2>
       <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
             <h3>Expert Faculty</h3>
             <p>Maarula classes has experienced faculty for every individual subject and specialized in the subject that they will teach you.</p>
          </div>
          <div className={styles.featureCard}>
             <h3>Strategic Organization</h3>
             <p>We target weak areas with questions organized by year, topic, and difficulty, helping students progress from basic to advanced levels.</p>
          </div>
          <div className={styles.featureCard}>
             <h3>Real Exam Experience</h3>
             <p>Our test series provides a platform with the same format as the real exam, allowing you to build confidence and mastery before test day.</p>
          </div>
       </div>
      </section>

      {/* Section 5: Introduction/About Text (MOVED TO THE END) */}
      <section className={styles.introSection}>
        <h2 className={styles.mainTitle}>India's #1 NIMCET Coaching Institute</h2>
        <div className={styles.introParagraphs}>
            <p className={styles.introText}>
                For over a decade, Maarula Classes has been the definitive leader in <strong>MCA entrance coaching</strong>, establishing a legacy of success that positions us as the top choice for NIMCET preparation in India. Our mission is simple: to provide aspiring students from every corner of the country with the most strategic, comprehensive, and results-oriented coaching available.
            </p>
            <p className={styles.introText}>
                Led by a team of expert faculty, our unique teaching methodology, combined with India's most extensive question bank of previous year papers, ensures that our students are not just prepared, but are confident to tackle any challenge the exam throws their way. Our consistent track record, with thousands of students placed in top NITs and universities, is a testament to our unwavering commitment to quality education.
            </p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;