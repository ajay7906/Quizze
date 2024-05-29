



import React, { useState, useEffect } from 'react';
import styles from './Quizpopone.module.css';

import { toast } from 'react-toastify';

const QuizPopupOne = ({ onCancel, onContinue, quizToEdit }) => {
  const [quizName, setQuizName] = useState('');
  const [quizType, setQuizType] = useState('');
  const [activeButton, setActiveButton] = useState('');

  useEffect(() => {
    console.log(quizToEdit);
    if (quizToEdit) {
      setQuizName(quizToEdit.title || '');
      setQuizType(quizToEdit.type || '');
      setActiveButton(quizToEdit.type || '');
    }
  }, [quizToEdit]);

  const handleContinue = () => {
    if (quizName === '' || quizType === '') {
      toast.error('Please add all the fields');
    } else {
      onContinue(quizName, quizType);
    }
  };
  console.log(quizType);
  const handleQuizTypeClick = (type) => {
    setQuizType(type);
    setActiveButton(type);
  };

  return (
    <>
      <div className={styles.formContainer}>
        <form>
          <div className={styles.formGroup}>
            <input
              type="text"
              id="quizName"
              name="quizName"
              placeholder="Quiz name"
              value={quizName}
              onChange={(e) => setQuizName(e.target.value)}
            />
          </div>
          <div className={styles.formGroupType}>
            <label>Quiz Type</label>
            <button
              type="button"
              className={`${styles.quizTypeButton} ${activeButton === 'Q&A' ? styles.isActive : ''}`}
              onClick={() => handleQuizTypeClick('Q&A')}
            >
              Q & A
            </button>
            <button
              type="button"
              className={`${styles.quizTypeButton} ${activeButton === 'Poll Type' ? styles.isActive : ''}`}
              onClick={() => handleQuizTypeClick('Poll Type')}
            >
              Poll Type
            </button>
          </div>
          <div className={styles.buttonGroup}>
            <button type="button" className={styles.cancelButton} onClick={onCancel}>
              Cancel
            </button>
            <button type="button" className={styles.continueButton} onClick={handleContinue}>
              Continue
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default QuizPopupOne;
