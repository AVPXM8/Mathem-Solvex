import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// Add FaGooglePlay to this import line
import { FaYoutube, FaInstagram, FaTelegram, FaWhatsapp, FaFacebook, FaLinkedin, FaGooglePlay } from 'react-icons/fa';
import { ArrowUp } from 'lucide-react';
import styles from './Footer.module.css';

// Back to Top Button Component (no changes needed here)
const BackToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) setIsVisible(true);
      else setIsVisible(false);
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  return (
    <button
      className={`${styles.backToTopButton} ${isVisible ? styles.showButton : ''}`}
      onClick={scrollToTop}
      aria-label="Go to top"
    >
      <ArrowUp size={24} />
    </button>
  );
};


const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerTop}>
        <img src="https://res.cloudinary.com/dwmj6up6j/image/upload/f_auto,q_auto,w_100/v1752683439/maarulalogo_lywhdo.png" alt="Maarula Classes Logo" className={styles.footerLogo} />
        <h3 className={styles.footerTitle}>MAARULA CLASSES</h3>
        <p className={styles.footerSubtitle}>MCA Entrance Coaching</p>
        <div className={styles.socials}>
            <span>Follow Us On Social Media</span>
            <div className={styles.socialIcons}>
              <a href="https://www.facebook.com/maarulaclasses.kanpur/" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FaFacebook /></a>
              <a href="https://www.instagram.com/maarula_classes/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FaInstagram /></a>
              <a href="YOUR_YOUTUBE_LINK" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><FaYoutube /></a>
              <a href="https://www.linkedin.com/company/maarula-classes" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><FaLinkedin /></a>
            </div>
        </div>
      </div>
      
      {/* Link Grid - No changes needed here */}
      <div className={styles.footerGrid}>
        {/* ... all your footer columns ... */}
        <div className={styles.footerColumn}>
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/articles">Blog</Link></li>
            <li><a href="https://www.maarul.in/about-us" target="_blank" rel="noopener noreferrer">About</a></li>
            <li><a href="https://www.maarul.in/contact-us" target="_blank" rel="noopener noreferrer">Contact Us</a></li>
            <li><a href="https://www.maarul.in/our-instructors" target="_blank" rel="noopener noreferrer">Faculty</a></li>
          </ul>
        </div>
        <div className={styles.footerColumn}>
          <h4>Exams</h4>
          <ul>
            <li><Link to="/questions?exam=NIMCET">NIMCET</Link></li>
            <li><Link to="/questions?exam=CUET-PG">CUET PG</Link></li>
            <li><a href="https://www.maarul.in/vitmee" target="_blank" rel="noopener noreferrer">VITMEE</a></li>
            <li><a href="https://www.maarul.in/jamia" target="_blank" rel="noopener noreferrer">JAMIA</a></li>
            <li><a href="https://www.maarul.in/mah-cet" target="_blank" rel="noopener noreferrer">MAH-CET</a></li>
          </ul>
        </div>
        <div className={styles.footerColumn}>
          <h4>Free Resources</h4>
          <ul>
            <li><Link to="/questions">Previous Year Papers</Link></li>
            <li><a href="https://www.maarul.in/mock-tests" target="_blank" rel="noopener noreferrer">Free Mock Tests</a></li>
            <li><a href="https://www.youtube.com/c/maarulaclasses" target="_blank" rel="noopener noreferrer">Strategy Videos</a></li>
            <li><a href="https://www.maarul.in/preparation-tips" target="_blank" rel="noopener noreferrer">Preparation tips</a></li>
            <li><a href="https://www.maarul.in/syllabus" target="_blank" rel="noopener noreferrer">Syllabus</a></li>
          </ul>
        </div>
        <div className={styles.footerColumn}>
          <h4>Our Courses</h4>
          <ul>
            <li><a href="https://maarulaclasses.classx.co.in/new-courses" target="_blank" rel="noopener noreferrer">Live Classes</a></li>
            <li><a href="https://maarulaclasses.classx.co.in/new-courses" target="_blank" rel="noopener noreferrer">Recorded Lectures</a></li>
            <li><a href="https://maarulaclasses.classx.co.in/new-courses" target="_blank" rel="noopener noreferrer">Test Series</a></li>
            <li><a href="https://maarulaclasses.classx.co.in/new-courses" target="_blank" rel="noopener noreferrer">Sectional Quiz</a></li>
            <li><a href="https://maarulaclasses.classx.co.in/new-courses" target="_blank" rel="noopener noreferrer">Comprehensive Notes</a></li>
          </ul>
        </div>
      </div>
      
      {/* App Download Section - THIS SECTION IS UPDATED */}
      <div className={styles.appDownloadSection}>
        <div className={styles.appCta}>
            <h4>Download Maarula Mathem App</h4>
            <p>For Seamless learning experience</p>
            <a href="https://play.google.com/store/apps/details?id=com.maarula.classes" target="_blank" rel="noopener noreferrer" className={styles.playStoreButton}>
              <FaGooglePlay size={24} />
              <span>Google Play</span>
            </a>
        </div>
      </div>
      
      <div className={styles.footerBottom}>
        <p>© {new Date().getFullYear()} Maarula Classes. All Rights Reserved.</p>
      </div>
      
      {/* Floating Action Buttons */}
      <a href="https://wa.me/919554548576" target="_blank" rel="noopener noreferrer" className={styles.whatsappFloat} aria-label="WhatsApp">
        <FaWhatsapp />
      </a>
      <BackToTopButton />
    </footer>
  );
};

export default Footer;