import React from 'react';
import Slider from 'react-slick';
import { summaryBanners } from '/src/data/students';

// Import slick-carousel styles
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

import styles from './SuccessCarousel.module.css';

const SuccessCarousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true
  };

  return (
    <div className={styles.carouselContainer}>
      <Slider {...settings}>
        {summaryBanners.map(banner => (
          <div key={banner.id}>
            <img src={banner.imageUrl} alt={banner.altText} className={styles.bannerImage} />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default SuccessCarousel;