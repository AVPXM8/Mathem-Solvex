import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './HomePage.module.css';

// Array of the images you want to display in the slider
const promoImages = [
    '/nimcet-2025-banner.jpg',
    '/success-stories.jpg'
];

const HomePage = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    // This effect handles the auto-scrolling functionality
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prevSlide) => 
                prevSlide === promoImages.length - 1 ? 0 : prevSlide + 1
            );
        }, 5000); // Change slide every 5 seconds

        return () => clearInterval(timer); // Cleanup the timer
    }, []);

    return (
        <>
            <div className={styles.hero}>
                <h1>Welcome to the Maarula Classes Question Bank</h1>
                <p>Your one-stop destination for NIMCET, CUET PG, and JEE previous year questions and solutions.</p>
                <div className={styles.buttonContainer}>
                    <Link to="/questions?exam=NIMCET" className={styles.ctaButton}>Browse NIMCET Questions</Link>
                    <Link to="/questions?exam=CUET PG" className={styles.ctaButton}>Browse CUET PG Questions</Link>
                </div>
            </div>

            {/*  This is the new Image Slider Section  */}
            <div className={styles.sliderContainer}>
                <div className={styles.sliderWrapper} style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                    {promoImages.map((imgSrc, index) => (
                        <div className={styles.slide} key={index}>
                            <img src={imgSrc} alt={`Promotion ${index + 1}`} />
                        </div>
                    ))}
                </div>
                <div className={styles.dotsContainer}>
                    {promoImages.map((_, index) => (
                        <button 
                            key={index}
                            className={`${styles.dot} ${currentSlide === index ? styles.activeDot : ''}`}
                            onClick={() => setCurrentSlide(index)}
                        ></button>
                    ))}
                </div>
            </div>
        </>
    );
};

export default HomePage;
