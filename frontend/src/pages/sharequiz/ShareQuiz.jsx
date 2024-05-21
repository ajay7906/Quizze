// src/components/QuestionCard.jsx
import React, { useState, useEffect } from 'react';
import styles from './ShareQuiz.module.css';

const ShareQuiz = ({ questionNumber, totalQuestions, questionText, options, initialTimer, onNext }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [timer, setTimer] = useState(initialTimer);

  useEffect(() => {
    if (timer > 0) {
      const timerId = setInterval(() => setTimer(timer - 1), 1000);
      return () => clearInterval(timerId);
    }
  }, [timer]);

  const handleOptionClick = (index) => {
    setSelectedOption(index);
  };

  const handleNext = () => {
    onNext(selectedOption);
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardContent}>
      <div className={styles.header}>
        <span className={styles.questionNumber}>
          {String(questionNumber).padStart(2, '0')}/{String(totalQuestions).padStart(2, '0')}
        </span>
        <span className={styles.timer}>{String(timer).padStart(2, '0')}s</span>
      </div>
      <div className={styles.questionText}>
        {questionText}
      </div>
      <div className={styles.options}>
        {options.map((option, index) => (
          <button
            key={index}
            className={`${styles.option} ${selectedOption === index ? styles.selected : ''}`}
            onClick={() => handleOptionClick(index)}
          >
            {option}
          </button>
        ))}
      </div>
      <button className={styles.nextButton} onClick={handleNext}>Next</button>
      </div>
    </div>
  );
};

export default ShareQuiz;
