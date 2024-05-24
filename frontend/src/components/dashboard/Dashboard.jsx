



import React from 'react';
import styles from './Dashboard.module.css';
import EmpressionImg from '../../assets/eye.png'
const Dashboard = () => {
  return (
    <main className={styles.mainContent}>
      <div className={styles.stats}>
        <div className={styles.statCard} style={{ color: '#FF5D01' }}>
          <h2 className={styles.statNumber}  >12 <span>Quiz</span></h2>
          <span> Created</span>
        </div>
        <div className={styles.statCard} style={{ color: '#60B84B' }}>
          <h2 className={styles.statNumber} >110 <span>questions</span></h2>
          <span> Created</span>
        </div>
        <div className={styles.statCard} style={{ color: '#5076FF' }}>
          <h2 className={styles.statNumber} >1.4K <span>Total</span></h2>
          <span> Impressions</span>
        </div>
      </div>
      <div className={styles.trendingQuizzes}>
        <h2 className={styles.trendinghtag}>Trending Quizzes</h2>
        <div className={styles.quizzes}>
          {Array(9).fill().map((_, index) => (
            <div key={index} className={styles.quizCard}>
              <div className={styles.quizName}>
                <h2>Quiz 1</h2>
                <p>667  <img src={EmpressionImg} alt="" /></p>

              </div>
              <div className={styles.createdTime}>
                <span>Created on : 04 Sep, 2023</span>
              </div>
            </div>

          ))}
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
