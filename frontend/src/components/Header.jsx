import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { ChevronDown, Menu, X } from 'lucide-react';
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

  const navLinks = (
    <>
      <NavLink to="/" className={({ isActive }) => isActive ? styles.active : ''}>Home</NavLink>
      <NavLink to="/questions?exam=NIMCET">NIMCET</NavLink>
      <NavLink to="/questions?exam=CUET-PG">CUET PG</NavLink>
      <div className={styles.dropdown}>
        <button className={styles.dropdownToggle}>
          More <ChevronDown size={16} />
        </button>
        <div className={styles.dropdownMenu}>
          <a href="https://www.maarul.in/about-us" target="_blank" rel="noopener noreferrer">About Us</a>
          <a href="https://maarulaclasses.classx.co.in/new-courses" target="_blank" rel="noopener noreferrer">Our Courses</a>
          <NavLink to="/articles">Articles</NavLink>
        </div>
      </div>
      <a href="https://www.maarul.in/contact-us" target="_blank" rel="noopener noreferrer">Contact</a>
    </>
  );

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.headerContent}>
        <Link to="/" className={styles.logoContainer}>
          <img src={logo} alt="Maarula Classes Logo" className={styles.logo} />
          <div className={styles.title}>
            <h1>Maarula Classes</h1>
            <p>Question Bank</p>
          </div>
        </Link>

        <nav className={styles.desktopNav}>{navLinks}</nav>

        <div className={styles.headerActions}>
          <a href="https://maarulaclasses.classx.co.in/" target="_blank" rel="noopener noreferrer" className={styles.loginButton}>
            Login
          </a>
          <button className={styles.hamburger} onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <nav className={styles.mobileNav} onClick={toggleMobileMenu}>
          {navLinks}
        </nav>
      )}
    </header>
  );
};

export default Header;