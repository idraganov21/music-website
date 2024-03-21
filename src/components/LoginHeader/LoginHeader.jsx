import React from 'react';
import { Link } from 'react-router-dom';
import styles from './LoginHeader.module.css';

function LoginHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.logoMobile}>
      <Link to="/login"><button className={styles.button} style={{ fontSize: '10px' }}>RelaxMash Music</button></Link>
        {/* <img src="/public/Logos.svg" style={{ width: '80px' }} alt="Logo" /> */}
        <Link to="/login"><button className={styles.button} style={{ fontSize: '12px' }}>Login</button></Link>
      </div>
      <div className={styles.navigation}>
      <nav className={styles.navLeft}>
        {/* First three page links */}
        <Link to="/login"><button className={styles.button}>RelaxMash Music</button></Link>
        <Link to="/login"><button className={styles.button}>Forum</button></Link>
        <Link to="/login"><button className={styles.button}>Podcast</button></Link>
      </nav>

      <div className={styles.logo}>
        <img src="/public/Logos.svg" alt="Logo" />
      </div>

      <nav className={styles.navRight}>
        {/* Last three page links */}
        <Link to="/login"><button className={styles.button}>Login</button></Link>
        <Link to="/login"><button className={styles.button}>Contacts</button></Link>
        {/* <div className={styles.iconContainer}>
            <div className={styles.verticalLine}></div>
            <Link to="/profile" className={styles.iconLink}>
              <img src="/logout.svg" alt="Logout" className={styles.icon} />
            </Link>
            <Link to="/login" className={styles.iconLink}>
              <img src="/log2.svg" alt="Log2" className={styles.icon} />
            </Link>
          </div> */}
      </nav>
      </div>
    </header>
  );
}

export default LoginHeader;