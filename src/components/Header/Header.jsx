import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.module.css';

function Header({ messages }) {
  const [isMobileMenuVisible, setIsMobileMenuVisible] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuVisible(!isMobileMenuVisible);
  };

  const hasMessages = messages && messages.length > 0 && messages[0].details !== '';


  return (
    <header className={styles.header}>
      <div className={styles.navigation}>
        <div className={styles.mobileMenuIcon} onClick={toggleMobileMenu}>
          <img src="/menu.svg" alt="Menu" />
        </div>

        {isMobileMenuVisible && (
          <nav className={styles.mobileNav}>
            <Link to="/home"><button className={styles.button}>Home</button></Link>
            <Link to="/music"><button className={styles.button}>Relaxmash Music</button></Link>
            {/* <Link to="/music"><button className={styles.button}>Music Updates</button></Link> */}
            <Link to="https://relaxmashmusic.org/vanilla/"><button className={styles.button}>Forum</button></Link>
            <Link to="/podcasts"><button className={styles.button}>Podcast</button></Link>
            <Link to="/contacts"><button className={styles.button}>Contacts</button></Link>
            <Link to="/profile"><button className={styles.button}>Profile</button></Link>
          </nav>
        )}

        <nav className={styles.navLeft}>
          {/* First three page links */}
          <Link to="/home"><button className={styles.button}>Home</button></Link>
          <Link to="/music"><button className={styles.button}>Relaxmash Music</button></Link>
          {/* <Link to="/music"><button className={styles.button}>Music Updates</button></Link> */}
        </nav>

        <div className={styles.logo}>
          <a href="/home"><img className={styles.headerLogo} src="/public/Logos.svg" alt="Logo" /></a>
        </div>

        <Link to="/login" className={styles.iconLinkMobile}>
          <img src="/log2.svg" alt="Log2" className={styles.icon} />
        </Link>

        <nav className={styles.navRight}>
          {/* Last three page links */}
          <Link to="https://relaxmashmusic.org/vanilla/"><button className={styles.button}>Forum</button></Link>
          <Link to="/podcasts"><button className={styles.button}>Podcast</button></Link>
          <Link to="/contacts"><button className={styles.button}>Contacts</button></Link>
          <div className={styles.iconContainer}>
            <div className={styles.verticalLine}></div>
            <Link to="/profile" className={styles.iconLink}>
            <img src={hasMessages ? "/notification.png" : "/logout.svg"} alt="Profile" className={styles.icon} />
            </Link>
            <Link to="/homenotlogged" className={styles.iconLink}>
              <img src="/log2.svg" alt="Log2" className={styles.icon} />
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;

