 
// src/components/PublicLayout.jsx - FINAL VERSION

import React, { useState } from 'react';
import { Outlet, Link, NavLink } from 'react-router-dom';
import styles from './PublicLayout.module.css';

const PublicLayout = () => {
    // State to manage the mobile menu (open/closed)
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className={styles.pageContainer}>
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <Link to="/" className={styles.logoContainer}>
                        <img src="/maarulalogo.png" alt="Maarula Classes Logo" className={styles.logo} width="50" height="50" />
                        <div className={styles.title}>
                            <h1>Maarula Classes</h1>
                            <p>Question Bank & PYQs</p>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className={styles.navLinks}>
                        <NavLink to="/" className={({ isActive }) => isActive ? styles.active : ''}>Home</NavLink>
                        <NavLink to="/questions?exam=NIMCET" className={({ isActive }) => isActive ? styles.active : ''}>NIMCET</NavLink>
                        <NavLink to="/questions?exam=CUET PG" className={({ isActive }) => isActive ? styles.active : ''}>CUET PG</NavLink>
                        <a href="https://maarulaclasses.classx.co.in/new-courses" target="_blank" rel="noopener noreferrer">Our Courses</a>
                    </nav>

                    <div className={styles.headerActions}>
                        {/* The main login button */}
                        <a href="https://maarulaclasses.classx.co.in/" target="_blank" rel="noopener noreferrer" className={styles.loginButton}>
                            Login
                        </a>
                        {/* Hamburger menu button for mobile */}
                        <button className={styles.hamburger} onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            ☰
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation Menu - only shows when isMenuOpen is true */}
                {isMenuOpen && (
                    <nav className={styles.mobileNav}>
                        <NavLink to="/" onClick={() => setIsMenuOpen(false)}>Home</NavLink>
                        <NavLink to="/questions?exam=NIMCET" onClick={() => setIsMenuOpen(false)}>NIMCET</NavLink>
                        <NavLink to="/questions?exam=CUET PG" onClick={() => setIsMenuOpen(false)}>CUET PG</NavLink>
                        <a href="https://maarulaclasses.classx.co.in/new-courses" target="_blank" rel="noopener noreferrer">Our Courses</a>
                    </nav>
                )}
            </header>
            
            <main className={styles.mainContent}>
                <Outlet />
            </main>
            
            {/* Better footer */}
            <footer className={styles.footer}>
                <div className={styles.footerGrid}>
                    <div className={styles.footerColumn}>
                        <h4>About Maarula Classes</h4>
                        <p>The most trusted platform for NIMCET, CUET PG, and other MCA Entrance preparation, helping thousands of students achieve their dreams.</p>
                    </div>
                    <div className={styles.footerColumn}>
                        <h4>Quick Links</h4>
                        <Link to="/questions?exam=NIMCET">NIMCET Questions</Link>
                        <Link to="/questions?exam=CUET PG">CUET PG Questions</Link>
                        <a href="https://maarulaclasses.classx.co.in/new-courses" target="_blank" rel="noopener noreferrer">Join Our Courses</a>
                    </div>
                    <div className={styles.footerColumn}>
    <h4>Connect With Us</h4>
    <a href="https://www.youtube.com/c/maarulaclasses" target="_blank" rel="noopener noreferrer"><i className="fab fa-youtube"></i> YouTube</a>
    <a href="https://www.instagram.com/maarula_classes/" target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram"></i> Instagram</a>
    <a href="https://t.me/maarulaclasses" target="_blank" rel="noopener noreferrer"><i className="fab fa-telegram"></i> Telegram</a>
</div>
                    <div className={styles.footerColumn}>
                        <h4>Download Our App</h4>
                        <a href="https://play.google.com/store/apps/details?id=com.maarula.classes&pcampaignid=web_share" target="_blank" rel="noopener noreferrer" className={styles.appLink}>
                            <img src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" alt="Get it on Google Play" />
                        </a>
                    </div>
                </div>
                <div className={styles.footerBottom}>
                    &copy; {new Date().getFullYear()} Maarula Classes. All Rights Reserved.
                </div>
            </footer>
        </div>
    );
};

export default PublicLayout;