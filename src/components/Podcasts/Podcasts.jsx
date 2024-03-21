import React, { useState, useEffect } from "react";
import styles from "./Podcasts.module.css";
import SearchBar from "../SearchBar/SearchBar";
import { BeatLoader } from 'react-spinners';

function Podcasts() {
    const [podcasts, setPodcasts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const strapiToken = import.meta.env.VITE_STRAPI_TOKEN;
    const strapiBaseUrl = import.meta.env.VITE_STRAPI_BASE_URL;

    useEffect(() => {
        setLoading(true); // Start loading
        fetch(`${strapiBaseUrl}/api/podcasts?sort[0]=createdAt:desc`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
            })
            .then(response => response.json())
            .then(data => {
                const podcastsData = data.data.map(item => ({
                    id: item.id,
                    ...item.attributes
                }));
                setPodcasts(podcastsData);
                setLoading(false); // Stop loading after data is fetched
            })
            .catch(error => {
                console.log('Error fetching podcasts:', error);
                setLoading(false); // Stop loading on error
            });
    }, []);

    const filteredPodcasts = podcasts.filter(
        (podcast) =>
            podcast.name &&
            podcast.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const extractSrcFromIframe = (iframeString) => {
        const matches = iframeString.match(/src="([^"]+)"/);
        return matches ? matches[1] : '';
    };

    return (
        <div className={styles.mainContent}>
            <div className={styles.searchBar}>
                <h2>Podcasts</h2>
                <SearchBar setSearchTerm={setSearchTerm} />
            </div>
            {loading ? (
                <BeatLoader color="orange" />
            ) : (
                <div className={styles.podcasts}>
                    {filteredPodcasts.map((podcast, index) => (
                        <div key={podcast.id || index} className={styles.podcastItem}>
                            <iframe
                                src={extractSrcFromIframe(podcast.iframe)}
                                width="1100px"
                                height="120px"
                                frameBorder="0"
                                title={`Podcast ${index}`}
                                allowFullScreen
                            ></iframe>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Podcasts;
