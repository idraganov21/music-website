import React, { useState, useEffect } from 'react';
import styles from './Sidebar.module.css'
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';


function Sidebar({ songsList, openModal, strapiBaseUrl,setCurrentPage, createdAtSong, onDateSelect, selectedMonth, setSelectedMonth, setSelectedGenre, selectedGenre }) {
    const [date, setDate] = useState(new Date());
    const [showAllSongs, setShowAllSongs] = useState(false);
    const [songCreationDates, setSongCreationDates] = useState([]);

    const onChange = (newDate) => {
        setDate(newDate);
        setShowAllSongs(false);
        onDateSelect(newDate);
    };

    const resetData = () => {
        setDate(new Date());
        setSelectedMonth('Select Month');
        setSelectedGenre('All');
        setShowAllSongs(true);
        onDateSelect(null);
        setCurrentPage(0);
    }

    const showShowAllButton = selectedGenre !== 'All' || date !== new Date() || selectedMonth !== 'Select Month';

    const generateMonthOptions = () => {
        const months = ["Select Month"];
        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth();
        const startYear = 2023;

        for (let year = currentYear; year >= startYear; year--) {
            // Determine the start month for the loop
            let startMonth = year === currentYear ? currentMonth : 11; // Start from the current month for the current year, otherwise December

            // Special case for March
            if (year === currentYear && new Date().getDate() > 1 && currentMonth >= 2) {
                startMonth = 2; // Start from March if today is beyond March 1st and the current month is March or later
            }

            for (let month = startMonth; month >= 0; month--) {
                months.push(`${monthNames[month]} ${year}`);
            }
        }

        return months;
    };

    const monthOptions = generateMonthOptions();


    const getLastThursdayDate = () => {
        let date = new Date();
        let dayOfWeek = date.getDay();
        let daysToLastThursday = dayOfWeek >= 4 ? dayOfWeek - 4 : 7 - (4 - dayOfWeek);
        date.setDate(date.getDate() - daysToLastThursday);
        return date.toISOString().split('T')[0]; // Format to YYYY-MM-DD
    };

    const lastThursdayDate = getLastThursdayDate();
    let filteredSongs = songsList.filter(song => song.Date === lastThursdayDate);

    if (filteredSongs.length === 0) {
        // Sort songs by date and take the last 4 if no songs were uploaded last Thursday
        filteredSongs = [...songsList].sort((a, b) => new Date(b.Date) - new Date(a.Date)).slice(0, 8);
    } else {
        // Limit to 4 songs
        filteredSongs = filteredSongs.slice(0, 8);
    }


    useEffect(() => {
        const creationDates = songsList.map(song => {
            return new Date(song.Date).toDateString();
        });
        setSongCreationDates([...new Set(creationDates)]);
    }, [songsList]);

    const isDateDisabled = (date) => {
        const dateString = date.toDateString();
        return !songCreationDates.includes(dateString);
    };

    const tileClassName = ({ date, view }) => {
        if (view === 'month') {
            if (isDateDisabled(date)) {
                // Return a class for disabled dates
                return 'my-disabled-date-class'; // You need to define this class in your CSS
            }
            // Other conditions for different classes
        }
        // Default or no specific class
        return null;
    };

    const handleMonthChange = (e) => {
        setSelectedMonth(e.target.value);
        setShowAllSongs(false); // Assuming you want to restrict the view to the selected month's songs
    };


    return (
        <div className={styles.sidebar}>
            <h2>New Releases</h2>
            <div className={styles.calendarContainer}>
                <Calendar
                    onChange={onChange}
                    value={date}
                    className={styles.calendar}
                    tileDisabled={({ date, view }) => {
                        if (view === 'month') {
                            // Convert the date to a string for comparison
                            const dateString = date.toDateString();
                            // Disable date if not in songCreationDates
                            return !songCreationDates.includes(dateString);
                        }
                        return false;
                    }}
                    tileClassName={({ date: calendarDate, view }) => {
                        if (view === 'month') {
                            const dateString = calendarDate.toDateString();
                            const todayString = new Date().toDateString();
                            const isDisabled = !songCreationDates.includes(dateString);
                            const isSelectedDate = calendarDate.toDateString() === date.toDateString();
                            const isToday = dateString === todayString;

                            if (isSelectedDate && !isToday) {
                                return styles.customActiveTile; // Use this class to style the active date tile
                            } else if (songCreationDates.includes(dateString)) {
                                return styles.highlightTile;
                            } else if (isDisabled) {
                                return styles.disabledDate;
                            }
                            return styles.calendarTile;
                        }
                        return null;
                    }}
                />

                {showShowAllButton && (
                    <button className={styles.resetBtn} onClick={resetData}>
                        Show All
                    </button>
                )}
                <div className={styles.border}></div>
            </div>
            <div className={styles.archive}>
                <h2>RMM Archives</h2>
                <select
                    value={selectedMonth}
                    onChange={handleMonthChange}
                    className={styles.select}
                >
                    {monthOptions.map((month, index) => (
                        <option key={index} value={month} disabled={index === 0}>{month}</option>
                    ))}
                </select>
            </div>
            <div className={styles.border}></div>
            {selectedGenre && selectedGenre === "All" && (<div className={styles.musicItems}>
                <h2>Popular Posts</h2>
                {filteredSongs.length > 0 ? (
                    filteredSongs.map((song, index) => (
                        <div key={song.id || index} className={styles.musicItem} onClick={() => openModal(song)}>
                            <img className={styles.songsImg} src={`${strapiBaseUrl}${song.image.data.attributes.url}`} alt={song.Name} />
                            <div className={styles.musicText}>
                                <p className={styles.songName}>{song.Name}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p style={{ color: '#fff' }}>No songs found.</p>
                )}
            </div>)}
        </div>
    );
}

export default Sidebar;