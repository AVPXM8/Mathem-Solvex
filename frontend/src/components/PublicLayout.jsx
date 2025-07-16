import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header'; // Import the new Header
import Footer from './Footer'; // Import the new Footer
import styles from './PublicLayout.module.css';

const PublicLayout = () => {
  return (
    <div className={styles.pageContainer}>
      <Header />
      <main className={styles.mainContent}>
        <Outlet /> {/* This renders your HomePage, etc. */}
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;