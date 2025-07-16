import React from 'react';
import { Link } from 'react-router-dom';
import { FaYoutube, FaInstagram, FaTelegram, FaWhatsapp } from 'react-icons/fa';
import { MapPin, Phone, Mail } from 'lucide-react';
import styles from './Footer.module.css';
import logo from '/maarulalogo.png';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerGrid}>
        <div className={styles.footerColumn}>
          <img src={logo} alt="Maarula Classes Logo" className={styles.footerLogo} />
          <p>India's most trusted platform for NIMCET, CUET PG, and other MCA Entrance preparation.</p>
          <div className={styles.socialIcons}>
            <a href="https://www.youtube.com/c/maarulaclasses" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><FaYoutube /></a>
            <a href="https://www.instagram.com/maarula_classes/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FaInstagram /></a>
            <a href="https://t.me/maarulaclasses" target="_blank" rel="noopener noreferrer" aria-label="Telegram"><FaTelegram /></a>
          </div>
        </div>

        <div className={styles.footerColumn}>
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/questions?exam=NIMCET">NIMCET Questions</Link></li>
            <li><Link to="/questions?exam=CUET-PG">CUET PG Questions</Link></li>
            <li><Link to="/articles">Articles</Link></li>
            <li><a href="https://maarulaclasses.classx.co.in/new-courses" target="_blank" rel="noopener noreferrer">Our Courses</a></li>
          </ul>
        </div>

        <div className={styles.footerColumn}>
          <h4>Company</h4>
          <ul>
            <li><a href="https://www.maarul.in/about-us" target="_blank" rel="noopener noreferrer">About Us</a></li>
            <li><a href="https://www.maarul.in/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy Policy</a></li>
            <li><a href="https://www.maarul.in/terms-and-conditions" target="_blank" rel="noopener noreferrer">Terms & Conditions</a></li>
            <li><a href="https://www.maarul.in/contact-us" target="_blank" rel="noopener noreferrer">Contact</a></li>
          </ul>
        </div>

        <div className={styles.footerColumn}>
          <h4>Get In Touch</h4>
          <ul className={styles.contactList}>
            <li><MapPin size={16} /><span>Kanpur, Uttar Pradesh, India</span></li>
            <li><a href="tel:05123163515"><Phone size={16} /><span>0512-3163515</span></a></li>
            <li><a href="https://wa.me/919554548576" target="_blank" rel="noopener noreferrer"><FaWhatsapp /><span>+91 95545 48576</span></a></li>
          </ul>
        </div>
      </div>
      <div className={styles.footerBottom}>
        <p>© {new Date().getFullYear()} Maarula Classes. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;