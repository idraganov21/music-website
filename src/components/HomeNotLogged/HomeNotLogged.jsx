import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import React, { useState, useEffect } from 'react';
import styles from './HomeNotLogged.module.css';
import logo from '../../../public/Logos.svg';

function HomeNotLogged() {
    const [images, setImages] = useState([]);
    const strapiBaseUrl = import.meta.env.VITE_STRAPI_BASE_URL;

    useEffect(() => {
        const fetchImages = async () => {
            const endpoint = `${strapiBaseUrl}/api/images?populate=homeimage`;
            try {
                const response = await fetch(endpoint, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                // Extract URLs from the homeimage field
                const fetchedImages = data.data[0].attributes.homeimage.data.map(img => ({
                    url: img.attributes.url,
                    alt: img.attributes.alternativeText || `Image ${img.id}`
                }));
                setImages(fetchedImages);
            } catch (error) {
                console.error('Error fetching images:', error);
            }
        };

        fetchImages();
    }, [strapiBaseUrl]);



    return (
        <div className={styles.mainContent}>
            <div className={styles.centeredDiv}>
                <div className={styles.carousel}>
                    <div className={styles.imgBox}>
                        {images.map((image, index) => (
                            <img
                                key={index}
                                className={styles.img}
                                src={`${strapiBaseUrl}${image.url}`}
                                alt={image.alt}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomeNotLogged;