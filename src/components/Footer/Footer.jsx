import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';
import LogoutSVG from '/logout.svg';
import Log2SVG from '/log2.svg';
import BackToTopSVG from '/toparrow.svg';


function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  return (
    <footer className={styles.footer}>
      <div className={styles.padding}>
        <div className={styles.footerContent}>
          <div className={styles.footerNav}>
            <Link to="/home" className={styles.button}>Home</Link>
            <Link to="/music" className={styles.button}>Music</Link>
            {/* <Link to="/music-updates" className={styles.button}>Music Updates</Link> */}
            <Link to="/forum" className={styles.button}>Forum</Link>
            <Link to="/podcast" className={styles.button}>Podcast</Link>
            <Link to="/contacts" className={styles.button}>Contacts</Link>
            <div className={styles.iconContainer}>
              <div className={styles.verticalLine}></div>
              <img src={LogoutSVG} alt="Logout" className={styles.icon} />
              <img src={Log2SVG} alt="Log2" className={styles.icon} />
            </div>
          </div>
          <div className={styles.footerIcons}>
            <div className={styles.backToTop} onClick={scrollToTop}>
              <img src={BackToTopSVG} alt="Back to Top" className={styles.icon} />
              Back to Top
            </div>
          </div>
        </div>
      </div>
      <div className={styles.footerBottom}>
        © {new Date().getFullYear()} Relaxmash Music | All rights reserved
      </div>

    </footer>
  );
}

export default Footer;
