import React from 'react';
import styles from './QuestionCard.module.css';

const QuestionCard = ({ question, attempts, correct, incorrect, index }) => {
  return (
    <div className={styles.card}>
      <div className={styles.question}>Q.{index+1} {question}</div>
      <div className={styles.stats}>
        <div className={styles.stat}>
          <p className={styles.number}>{attempts}</p>
          <p className={styles.label}>people Attempted the question</p>
        </div>
        <div className={styles.stat}>
          <p className={styles.number}>{correct}</p>
          <p className={styles.label}>people Answered Correctly</p>
        </div>
        <div className={styles.stat}>
          <p className={styles.number}>{incorrect}</p>
          <p className={styles.label}>people Answered Incorrectly</p>
        </div>
      </div>
      <hr  className={styles.hrLine}/>
    </div>
  );
};

export default QuestionCard;
