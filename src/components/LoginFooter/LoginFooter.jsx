import { Link } from 'react-router-dom';
import styles from './LoginFooter.module.css';

function LoginFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.padding}>
        <div className={styles.footerContent}>
          {/* <div className={styles.footerNav}>
            <Link to="/home" className={styles.button}>Home</Link>
            <Link to="/music" className={styles.button}>Forum</Link>
            <Link to="/music-updates" className={styles.button}>Podcast</Link>
            <Link to="/forum" className={styles.button}>Login</Link>
            <Link to="/podcast" className={styles.button}>Podcast</Link>
            <Link to="/contacts" className={styles.button}>Contacts us</Link>
          </div> */}
        </div>
      </div>
      <div className={styles.footerBottom}>
        © {new Date().getFullYear()} Relaxmash Music | All rights reserved
      </div>

    </footer>
  );
}

export default LoginFooter;
