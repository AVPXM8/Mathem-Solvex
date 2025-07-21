import React, { useState } from 'react';
import { FaWhatsapp, FaTelegram, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { Share2, X } from 'lucide-react';
import styles from './FloatingSocialBar.module.css';

const socialLinks = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/maarula-classes',
    icon: <FaLinkedin />,
    className: styles.linkedin
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/maarula_classes/',
    icon: <FaInstagram />,
    className: styles.instagram
  },
  {
    label: 'Telegram',
    href: 'https://t.me/maarulaclasses',
    icon: <FaTelegram />,
    className: styles.telegram
  },
  {
    label: 'WhatsApp',
    href: 'https://wa.me/919554548576',
    icon: <FaWhatsapp />,
    className: styles.whatsapp
  }
];

const FloatingSocialBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.container}>
      <div className={`${styles.socialLinkList} ${isOpen ? styles.open : ''}`}>
        {socialLinks.map(link => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.label}
            className={`${styles.socialLink} ${link.className}`}
          >
            {link.icon}
          </a>
        ))}
      </div>
      <button 
        className={`${styles.toggleButton} ${isOpen ? styles.closeButton : ''}`} 
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Hide' : 'Show social links'}
      >
        {isOpen ? <X size={28} /> : <Share2 size={28} />}
      </button>
    </div>
  );
};

export default FloatingSocialBar;