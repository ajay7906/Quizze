// import React from 'react';
// import styles from './Dashboard.module.css';

// const Dashboard = () => {
//   return (
//     <div className={styles.dashboard}>
//       <aside className={styles.sidebar}>
//         <div className={styles.logo}>QUIZZIE</div>
//         <nav>
//           <ul>
//             <li className={styles.active}>Dashboard</li>
//             <li>Analytics</li>
//             <li>Create Quiz</li>
//           </ul>
//         </nav>
//         <div className={styles.logout}>LOGOUT</div>
//       </aside>
//       <main className={styles.mainContent}>
//         <div className={styles.stats}>
//           <div className={styles.statCard}>
//             <span className={styles.statNumber} style={{ color: 'orange' }}>12</span>
//             <span>Quiz Created</span>
//           </div>
//           <div className={styles.statCard}>
//             <span className={styles.statNumber} style={{ color: 'green' }}>110</span>
//             <span>questions Created</span>
//           </div>
//           <div className={styles.statCard}>
//             <span className={styles.statNumber} style={{ color: 'blue' }}>1.4K</span>
//             <span>Total Impressions</span>
//           </div>
//         </div>
//         <div className={styles.trendingQuizzes}>
//           <h2>Trending Quizzes</h2>
//           <div className={styles.quizzes}>
//             {Array(12).fill().map((_, index) => (
//               <div key={index} className={styles.quizCard}>
//                 <span>Quiz 1</span>
//                 <span className={styles.quizDetails}>
//                   <span className={styles.quizScore}>667</span>
//                   <span>Created on: 04 Sep, 2023</span>
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default Dashboard;




import React from 'react';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  return (
    <main className={styles.mainContent}>
      <div className={styles.stats}>
        <div className={styles.statCard}>
          <span className={styles.statNumber} style={{ color: 'orange' }}>12 </span>
          <span>Quiz Created</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statNumber} style={{ color: 'green' }}>110</span>
          <span>questions Created</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statNumber} style={{ color: 'blue' }}>1.4K</span>
          <span>Total Impressions</span>
        </div>
      </div>
      <div className={styles.trendingQuizzes}>
        <h2>Trending Quizzes</h2>
        <div className={styles.quizzes}>
          {Array(12).fill().map((_, index) => (
            <div key={index} className={styles.quizCard}>
              <span>Quiz 1</span>
              <span className={styles.quizDetails}>
                <span className={styles.quizScore}>667</span>
                <span>Created on: 04 Sep, 2023</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
