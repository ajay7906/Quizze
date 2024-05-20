import React from 'react';
import styles from './AnalysisPage.module.css';

const AnalysisPage = () => {
  const data = [
    { id: 1, name: 'Quiz 1', date: '01 Sep, 2023', impressions: '345' },
    { id: 2, name: 'Quiz 2', date: '04 Sep, 2023', impressions: '667' },
    { id: 3, name: 'Quiz 3', date: '06 Sep, 2023', impressions: '1.6K' },
    { id: 4, name: 'Quiz 4', date: '09 Sep, 2023', impressions: '789' },
    { id: 5, name: 'Quiz 5', date: '11 Sep, 2023', impressions: '995' },
    { id: 6, name: 'Quiz 6', date: '13 Sep, 2023', impressions: '2.5K' },
    { id: 7, name: 'Quiz 7', date: '14 Sep, 2023', impressions: '231' },
    { id: 8, name: 'Quiz 8', date: '17 Sep, 2023', impressions: '1.3K' },
  ];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Quiz Analysis</h1>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>S.No</th>
            <th>Quiz Name</th>
            <th>Created on</th>
            <th>Impression</th>
            <th>Actions</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data.map((quiz, index) => (
            <tr key={quiz.id}>
              <td>{index + 1}</td>
              <td>{quiz.name}</td>
              <td>{quiz.date}</td>
              <td>{quiz.impressions}</td>
              <td>
                <button className={styles.editButton}>✏️</button>
                <button className={styles.deleteButton}>🗑️</button>
                <button className={styles.shareButton}>🔗</button>
              </td>
              <td><a href="#" className={styles.analysisLink}>Question Wise Analysis</a></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AnalysisPage;
