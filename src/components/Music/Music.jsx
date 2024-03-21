import React, { useState, useEffect } from "react";
import styles from "./Music.module.css";
import SearchBar from "../SearchBar/SearchBar";
import { BeatLoader } from 'react-spinners';
import Modal from 'react-modal';
import Sidebar from "../Sidebar/Sidebar";
import ReactPaginate from 'react-paginate';
import ReactGA from 'react-ga';
import { useNavigate } from "react-router-dom";

function Music() {
    const [songs, setSongs] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentSong, setCurrentSong] = useState(null);
    const [selectedGenre, setSelectedGenre] = useState('All');
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState("Select Month");
    const [currentPage, setCurrentPage] = useState(0);
    const [date, setDate] = useState(new Date());
    const [showAllSongs, setShowAllSongs] = useState(false);

    const navigate = useNavigate();
    const songsPerPage = 20;

    const resetData = () => {
        setDate(new Date());
        setSelectedMonth('Select Month');
        setSelectedGenre('All');
        setShowAllSongs(true);
        handleDateSelect(null);
        setCurrentPage(0);
    }

    const strapiBaseUrl = import.meta.env.VITE_STRAPI_BASE_URL;

    const showShowAllButton = selectedGenre !== 'All' || date !== new Date() || selectedMonth !== 'Select Month';


    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            background: '#181818',
            display: 'grid',
            color: '#fff'
        },
    };

    useEffect(() => {
        const userRole = localStorage.getItem('userRole');

        if (userRole === 'idkyet') {
            navigate('/access-denied');
            return;
        }

        setLoading(true);
        fetch(`${strapiBaseUrl}/api/songs?populate=image&sort[0]=createdAt:desc`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(response => response.json())
            .then(data => {
                const songsData = data.data.map(item => ({
                    id: item.id,
                    ...item.attributes,
                    Date: item.attributes.Date && item.attributes.Date.split('/').reverse().join('-') // Convert MM/DD/YYYY to YYYY-MM-DD
                }))

                console.log('songs data:', songsData);

                setSongs(songsData);
                setLoading(false);
                // console.log('songs data:', songsData);
            })

            .catch(error => {
                console.error('Error fetching songs:', error);
                setLoading(false);
            });
    }, []);




    const openModal = (song) => {
        setCurrentSong(song);
        setIsModalOpen(true);
    };

    const extractSrcFromIframe = (iframeString) => {
        const matches = iframeString.match(/src="([^"]+)"/);
        return matches ? decodeURIComponent(matches[1]) : '';
    };

    const handleGenreClick = (genre) => {
        setSelectedGenre(genre);
        setCurrentPage(0);
    };

    const genres = ['All', 'Afro House', 'Deep House', 'Nu Disco', 'Soulful House', 'Soul-Funk-Disco', 'House'];

    const handleDateSelect = (date) => {
        if (!date) {
            setSelectedDate("");
            return;
        }
        const localDate = new Date(date.setHours(0, 0, 0, 0));
        const offset = localDate.getTimezoneOffset();
        const adjustedDate = new Date(localDate.getTime() - (offset * 60 * 1000));
        const formattedDate = adjustedDate.toISOString().split('T')[0];
        setSelectedDate(formattedDate);
        setCurrentPage(0);
    };


    const parseMonthYear = (monthYearString) => {
        if (!monthYearString || monthYearString === "Select Month") {
            return { month: null, year: null };
        }

        const [monthName, year] = monthYearString.split(" ");
        const month = new Date(`${monthName} 1, 2020`).getMonth() + 1;
        return { month, year: parseInt(year) };
    };


    const { month: selectedMonthNum, year: selectedYear } = parseMonthYear(selectedMonth);


    const filteredSongs = songs.filter(song => {
        const searchTermLower = searchTerm.toLowerCase();
        const songNameMatches = song.Name.toLowerCase().includes(searchTermLower);

        // Adjust genre matching to only apply if there's no search term provided.
        let genreMatches = true; // Default to true to allow all genres if no genre is specifically selected or if a search term is provided.
        if (selectedGenre !== 'All' && !searchTermLower) { // Apply genre filter only if it's not "All" and there's no search term.
            genreMatches = song.genre?.toLowerCase() === selectedGenre.toLowerCase() ||
                           song.multigenre?.some(genre => genre.toLowerCase() === selectedGenre.toLowerCase());
        }

        // Prepare date-related variables for filtering based on specific date or month/year.
        const createdAtDate = new Date(song.Date);
        const songDateFormatted = createdAtDate.toISOString().split('T')[0];
        let dateSpecificMatches = true; // Assume true; adjust below.
        if (selectedDate) {
            dateSpecificMatches = songDateFormatted === new Date(selectedDate).toISOString().split('T')[0];
        } else if (selectedMonthNum) {
            const songMonth = createdAtDate.getMonth() + 1; // Adjust for zero-based index.
            const songYear = createdAtDate.getFullYear();
            dateSpecificMatches = songMonth === selectedMonthNum && songYear === selectedYear;
        }

        // Combine the filters.
        return songNameMatches && genreMatches && dateSpecificMatches;
    });


    // Pagination

    const pageCount = Math.ceil(filteredSongs.length / songsPerPage);
    const currentSongs = filteredSongs.slice(currentPage * songsPerPage, (currentPage + 1) * songsPerPage);

    const handlePageClick = (event) => {
        setCurrentPage(event.selected);
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // Optional: for smooth scrolling
        });
    };

    const handleDownloadClick = (songName) => {
        ReactGA.event({
            category: 'Music',
            action: 'Download Click',
            label: songName
        });
    };


    return (
        <div className={styles.mainContent}>
            <div className={styles.genreFilter}>
                <p style={{ fontSize: '22px', marginTop: '13px' }}>Filters:</p>
                {showShowAllButton && (
                    <button className={styles.resetBtn} onClick={resetData}>
                        Show All
                    </button>
                )}
                <div className={styles.genres}>
                    {genres.map((genre, index) => (
                        genre !== 'All' && (
                            <button
                                key={index}
                                className={`${selectedGenre === genre ? styles.selectedGenreButton : ''}`}
                                onClick={() => handleGenreClick(genre)}
                            >
                                {genre}
                            </button>
                        )
                    ))}
                </div>
            </div>
            <div className={styles.searchBar}>
                <h2>Relaxmash Music</h2>
                <SearchBar setSearchTerm={setSearchTerm} />
            </div>
            <div className={styles.reverse}>
                <Sidebar
                    className={styles.sidebar}
                    songsList={songs}
                    openModal={openModal}
                    strapiBaseUrl={strapiBaseUrl}
                    onDateSelect={handleDateSelect}
                    selectedMonth={selectedMonth}
                    setSelectedMonth={setSelectedMonth}
                    setSelectedGenre={setSelectedGenre}
                    selectedGenre={selectedGenre}
                    setCurrentPage={setCurrentPage}
                // createdAtSong={createdAtSong}
                />
                {loading ? (
                    <BeatLoader color="orange" />
                ) : selectedGenre !== 'All' || selectedDate && selectedDate ?
                    // Render for specific genre selection
                    currentSongs.map((song) => (
                        <div key={song.id} className={styles.filteredSongItem}>
                            <h3 className={styles.genreName}>{song.Name}</h3>
                            <div className={styles.genreDiv}>
                                <img src={`${strapiBaseUrl}${song.image.data.attributes.url}`} alt={song.Name} className={styles.genreImg} />
                                {
                            song.iframe || song.iframe === '' ? (
                                <iframe
                                    src={extractSrcFromIframe(song.iframe)}
                                    width="1000px"
                                    height="300px"
                                    frameBorder="0"
                                    title={`Song ${song.id}`}
                                    allowFullScreen
                                ></iframe>
                            ) : song.specialtext ? (
                                <div>
                                    <div>
                                    {/* <img src={`${strapiBaseUrl}${song.image.data.attributes.url}`} alt="Collection Cover" style={{ width: '200px', height: '200px' }} /> */}
                                    {/* <button className={styles.dwnBtn} onClick={() => handleDownloadClick()}>
                                        <a href={song.preview} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: '#fff' }}>Preview</a>
                                    </button> */}
                                    </div>
                                    {song.specialtext.split('\n').map((line, index) => (
                                        <p style={{color: '#fff'}} key={index}>{line}</p> // Each song title on a new line
                                    ))}
                                </div>

                            ) : null
                        }
                            </div>
                            <button className={styles.dwnBtn} onClick={() => handleDownloadClick(song.Name)}>
                                <img src="/dwn.svg" alt="Download Icon" style={{ marginRight: '5px' }} />
                                <a href={song.download} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: '#fff' }}>Download</a>
                            </button>
                        </div>
                    ))
                    : (
                        // Original content rendering when no specific genre is selected
                        <>
                            <div className={styles.musicGrid}>
                                {currentSongs.length > 0 ? (
                                    currentSongs.map((song, index) => (
                                        <div key={song.id || index} className={styles.musicItem} onClick={() => openModal(song)}>
                                            <img src={`${strapiBaseUrl}${song.image.data.attributes.url}`} alt={song.Name} className={styles.songImage} />
                                            <p className={styles.songName}>{song.Name}</p>
                                            <p className={styles.songDate}>Genre: {song.multigenre ? song.multigenre.join(', ') : song.genre}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p style={{ color: '#fff' }}>No songs found.</p>
                                )}
                            </div>

                        </>
                    )}
            </div>
            <ReactPaginate
                previousLabel={"←"}
                nextLabel={"→"}
                pageCount={pageCount}
                onPageChange={handlePageClick}
                containerClassName={styles.pagination}
                previousLinkClassName={styles.paginationLink}
                nextLinkClassName={styles.paginationLink}
                disabledClassName={styles.paginationLinkDisabled}
                activeClassName={styles.paginationLinkActive}
                forcePage={currentPage}
            />

            <Modal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                contentLabel={`Song ${currentSong ? currentSong.id : ''}`}
                style={customStyles}
            >
                {currentSong && (
                    <>
                        <p className={styles.currSong}>{currentSong.Name}</p>
                        <p className={styles.songName}>Release date: {currentSong.Date}</p>
                        {
                            currentSong.iframe || currentSong.iframe === '' ? (
                                <iframe
                                    src={extractSrcFromIframe(currentSong.iframe)}
                                    width="1000px"
                                    height="300px"
                                    frameBorder="0"
                                    title={`Song ${currentSong.id}`}
                                    allowFullScreen
                                ></iframe>
                            ) : currentSong.specialtext ? (
                                <div>
                                    <div style={{display: 'flex', flexDirection: 'row', gap: '40px'}}>
                                    <img src={`${strapiBaseUrl}${currentSong.image.data.attributes.url}`} alt="Collection Cover" style={{ width: '200px', height: '200px' }} />
                                    <div>
                                    {currentSong.specialtext.split('\n').map((line, index) => (
                                        <p key={index}>{line}</p> // Each song title on a new line
                                    ))}
                                    </div>
                                    </div>
                                    <button className={styles.dwnBtn} onClick={() => handleDownloadClick()}>
                                        <a href={currentSong.preview} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: '#fff' }}>Preview</a>
                                    </button>
                                </div>

                            ) : null
                        }
                        {localStorage.getItem('userRole') !== 'guest' ? (
                            <button className={styles.dwnBtn} onClick={() => handleDownloadClick()}>
                                <img src="/dwn.svg" alt="Download Icon" style={{ marginRight: '8px', marginTop: '-3px' }} />
                                <a href={currentSong.download} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: '#fff' }}>Download song</a>
                            </button>
                        ) : (
                            <p style={{ color: '#fff' }}>You are not an active member.</p>
                        )}
                    </>
                )}
                <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}>X</button>
            </Modal>
        </div>
    );

}

export default Music;
