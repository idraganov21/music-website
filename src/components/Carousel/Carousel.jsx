import React, { useState, useEffect } from 'react';
import styles from './Carousel.module.css';

function Carousel({ images }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % images.length);
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className={styles.carousel}>
      {images.map((image, index) => (
        <div
          key={index}
          className={`${styles.carouselItem} ${index === activeIndex ? styles.active : ''}`}
          style={{ backgroundImage: `url(${image.src})` }}
        >
          {image.caption && (
            <div className={styles.carouselCaption}>
              <p>{image.caption}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default Carousel;

