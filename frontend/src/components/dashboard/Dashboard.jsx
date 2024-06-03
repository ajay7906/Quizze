
import React, { useEffect, useState } from 'react';
import styles from './Dashboard.module.css';
import EmpressionImg from '../../assets/eye.png';
import { fetchDashboardStats, fetchTrendingQuizzes } from '../../api/quizApi';
import { formatNumber } from '../../utils/formatNumber';
import { RotatingLines } from 'react-loader-spinner';
import NoDataImg from '../../assets/NoNmae.png'

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [trendingQuizzes, setTrendingQuizzes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);



  const fetchData = async () => {
    try {
      //fetch dashboard stats total impression, total quiz etc
      const statsData = await fetchDashboardStats();
      setStats(statsData);
     //fetch trending data on impresssion is greater than 10
      const trendingData = await fetchTrendingQuizzes();
      setTrendingQuizzes(trendingData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false); // Set loading to false when data is fetched
    }
  };

  useEffect(() => {
    

    fetchData();
  }, []);

  return (
    <main className={styles.mainContent}>
      {isLoading ? (
        <div className={styles.loaderContainer}>
          <RotatingLines width="100" visible={true} />
        </div>
      ) : (
        <>
          <div className={styles.stats}>
            <div className={styles.statCard} style={{ color: '#FF5D01' }}>
              <h2 className={styles.statNumber}>{stats && formatNumber(stats.totalQuizzes)} <span>Quiz</span></h2>
              <span> Created</span>
            </div>
            <div className={styles.statCard} style={{ color: '#60B84B' }}>
              <h2 className={styles.statNumber}>{stats && formatNumber(stats.totalQuestions)} <span>questions</span></h2>
              <span> Created</span>
            </div>
            <div className={styles.statCard} style={{ color: '#5076FF' }}>
              <h2 className={styles.statNumber}>{stats && formatNumber(stats.totalImpressions)} <span>Total</span></h2>
              <span> Impressions</span>
            </div>
          </div>
          <div className={styles.trendingQuizzes}>
            <h2 className={styles.trendinghtag}>Trending Quizzes</h2>
            <div className={styles.quizzes}>
              {trendingQuizzes.length > 0 ? (
                trendingQuizzes.map((quiz, index) => (
                  <div key={index} className={styles.quizCard}>
                    <div className={styles.quizName}>
                      <h2>{quiz.title}</h2>
                      <p>{quiz.impressions >= 1000 ? (quiz.impressions / 1000).toFixed(1) + 'K' : quiz.impressions} <img src={EmpressionImg} alt="" /></p>
                    </div>
                    <div className={styles.createdTime}>
                      <span>Created on: {quiz.createdAt}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.noData}>
                  <img src={NoDataImg} alt="" />
                  <h2>No Quiz Available</h2>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </main>
  );
};

export default Dashboard;

