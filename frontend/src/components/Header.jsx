import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { ChevronDown, Menu, X, Phone, Mail } from 'lucide-react';
import { FaInstagram, FaFacebook, FaYoutube, FaLinkedin } from 'react-icons/fa';
import styles from './Header.module.css';
import logo from '/maarulalogo.png';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => setMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  // Re-usable NavLink component for mobile to close menu on click
  const MobileNavLink = ({ to, children }) => (
    <NavLink to={to} onClick={closeMobileMenu}>{children}</NavLink>
  );

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      {/* Top Bar */}
      <div className={styles.topBar}>
        <div className={styles.topBarContent}>
          <div className={styles.contactInfo}>
            <a href="tel:+919935965550"><Phone size={14} /> +91 99359 65550</a>
            <a href="mailto:contact@maarula.in"><Mail size={14} /> contact@maarula.in</a>
          </div>
          <div className={styles.socialIcons}>
             <a href="https://www.instagram.com/maarula.classes" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FaInstagram /></a>
            <a href="https://www.facebook.com/classes.maarula" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FaFacebook /></a>
            <a href="https://www.youtube.com/c/MAARULACLASSES" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><FaYoutube /></a>
            <a href="https://www.linkedin.com/company/maarulaclasses" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><FaLinkedin /></a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className={styles.mainHeader}>
        <Link to="/" className={styles.logoContainer}>
          <img src={logo} alt="Maarula Classes Logo" className={styles.logo} />
        </Link>
        <nav className={styles.desktopNav}>
            <NavLink to="/" className={({ isActive }) => isActive ? styles.active : ''}>Home</NavLink>
            <a href="https://maarulaclasses.classx.co.in/new-courses" target="_blank" rel="noopener noreferrer">Courses</a>
            <a href="https://maarulaclasses.classx.co.in/test-series" target="_blank" rel="noopener noreferrer">Test Series</a>
            
            <div className={styles.dropdown}>
                <button className={styles.dropdownToggle}>Resources <ChevronDown size={16} /></button>
                <div className={styles.dropdownMenu}>
                    <Link to="/questions">Previous Year Papers</Link>
                    <a href="https://maarulaclasses.classx.co.in/test-series" target="_blank" rel="noopener noreferrer">Free Mock Tests</a>
                    <a href="https://www.youtube.com/watch?v=3euFpXs0Gw8&list=PLs12jm23mjmRKwObLwWBwSgr4TSpwZytM" target="_blank" rel="noopener noreferrer">Strategy Videos</a>
                    <a href="https://maarula.in/resources/" target="_blank" rel="noopener noreferrer">Syllabus</a>
                </div>
            </div>

            <div className={styles.dropdown}>
                <button className={styles.dropdownToggle}>Updates <ChevronDown size={16} /></button>
                <div className={styles.dropdownMenu}>
                    <Link to="/articles">Latest updates</Link>
                    <a href="https://www.maarula.in/exam-updates" target="_blank" rel="noopener noreferrer">Exam Updates</a>
                </div>
            </div>

            <div className={styles.dropdown}>
                <button className={styles.dropdownToggle}>About Us <ChevronDown size={16} /></button>
                <div className={styles.dropdownMenu}>
                    <a href="https://www.maarula.in/about" target="_blank" rel="noopener noreferrer">About Us</a>
                    <a href="https://www.maarula.in/faculty" target="_blank" rel="noopener noreferrer">Faculty</a>
                    <a href="https://www.maarula.in/gallery" target="_blank" rel="noopener noreferrer">Gallery</a>
                </div>
            </div>
            <a href="https://www.maarula.in/contact-us" target="_blank" rel="noopener noreferrer">Contact Us</a>
        </nav>
        <div className={styles.headerActions}>
          <a href="https://maarulaclasses.classx.co.in/" target="_blank" rel="noopener noreferrer" className={styles.loginButton}>Login</a>
          <button className={styles.hamburger} onClick={toggleMobileMenu} aria-label="Toggle menu">
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`${styles.mobileMenuOverlay} ${isMobileMenuOpen ? styles.isOpen : ''}`}>
          <nav className={styles.mobileNav}>
            <MobileNavLink to="/">Home</MobileNavLink>
            <a href="https://maarulaclasses.classx.co.in/new-courses" target="_blank" rel="noopener noreferrer" onClick={closeMobileMenu}>Courses</a>
            <MobileNavLink to="/articles">Important Updates</MobileNavLink>
            <MobileNavLink to="/questions">PYQs</MobileNavLink>
            <a href="https://www.maarula.in/about" target="_blank" rel="noopener noreferrer" onClick={closeMobileMenu}>About Us</a>
            <a href="https://www.maarula.in/contact-us" target="_blank" rel="noopener noreferrer" onClick={closeMobileMenu}>Contact Us</a>
          </nav>
        </div>
    </header>
  );
};

export default Header;