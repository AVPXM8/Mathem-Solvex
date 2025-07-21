import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header'; 
import Footer from './Footer'; 
import FloatingSocialBar from './FloatingSocialBar';
import styles from './PublicLayout.module.css';

const PublicLayout = () => {
  return (
    <div className={styles.pageContainer}>
      <Header />
      <main className={styles.mainContent}>
        <Outlet /> {/* This renders your HomePage, etc. */}
      </main>
      <Footer />
      <FloatingSocialBar />
    </div>
  );
};

export default PublicLayout;