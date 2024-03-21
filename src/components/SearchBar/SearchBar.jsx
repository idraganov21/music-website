// SearchBar.jsx
import React from 'react';
import styles from './SearchBar.module.css';

function SearchBar({ setSearchTerm }) {
  // Removed the local state declaration

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);

  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    // The search logic will be handled in the parent component
  };

  return (
    <div className={styles.searchContainer}>
      <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
        <input
          type="text"
          placeholder="Search for..."
          onChange={handleSearchChange}
          className={styles.searchInput}
        />
        <button type="submit" className={styles.searchButton}>
          <div className={styles.searchIcon}>
            <img src="/public/search.svg" alt="Logo" />
          </div>
        </button>
      </form>
    </div>
  );
}

export default SearchBar;


