import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Sidebar.module.css';

const Sidebar = () => {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}><h2>QUIZZIE</h2></div>
      <nav className={styles.sidebarnav}>
        <ul>
          <li>
            <Link to="/" className={styles.link} activeClassName={styles.active}>Dashboard</Link>
          </li>
          <li>
            <Link to="/analytics" className={styles.link} activeClassName={styles.active}>Analytics</Link>
          </li>
          <li>
            <Link to="/create-quiz" className={styles.link} activeClassName={styles.active}>Create Quiz</Link>
          </li>
        </ul>
      </nav>
      <div className={styles.logout}>LOGOUT</div>
    </aside>
  );
};

export default Sidebar;
