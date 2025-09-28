import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import styles from './PracticeSession.module.css';
import { RotatingLines } from 'react-loader-spinner';

const PracticeSession = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { quizData, isPractice } = location.state || {};

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeSpent, setTimeSpent] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);

  useEffect(() => {
    if (!quizData) {
      navigate('/practice');
      return;
    }

    // Start timer
    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [quizData, navigate]);

  const handleAnswerSelect = (questionId, optionIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    if (Object.keys(answers).length < quizData.questions.length) {
      toast.warning('Please answer all questions before submitting');
      return;
    }

    setIsSubmitting(true);
    try {
      const answersArray = Object.entries(answers).map(([questionId, selectedOption]) => ({
        questionId,
        selectedOption
      }));

      const response = await fetch('http://localhost:3000/api/v1/exam/practice/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',  
          'Authorization': `Bearer ${localStorage.getItem('jwttokenuser')}`
        },
        body: JSON.stringify({
          quizId: quizData.quizId,
          answers: answersArray
        })
      });

      const data = await response.json();
      if (data.success) {
        setResults(data.data);
        setShowResults(true);
      } else {
        toast.error(data.message || 'Failed to submit answers');
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast.error('Failed to submit answers');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetry = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setTimeSpent(0);
    setShowResults(false);
    setResults(null);
  };

  const handleBackToPractice = () => {
    navigate('/practice');
  };

  if (!quizData) {
    return (
      <div className={styles.loadingContainer}>
        <RotatingLines width="100" strokeColor="#667eea" />
        <p>Loading practice session...</p>
      </div>
    );
  }

  if (showResults && results) {
    return (
      <div className={styles.resultsContainer}>
        <div className={styles.resultsCard}>
          <h1>Practice Session Complete!</h1>
          
          <div className={styles.scoreSection}>
            <div className={styles.scoreCircle}>
              <span className={styles.scoreNumber}>{results.score}%</span>
              <span className={styles.scoreLabel}>Score</span>
            </div>
            
            <div className={styles.statsGrid}>
              <div className={styles.statItem}>
                <span className={styles.statValue}>{results.correctAnswers}</span>
                <span className={styles.statLabel}>Correct</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statValue}>{results.totalQuestions - results.correctAnswers}</span>
                <span className={styles.statLabel}>Incorrect</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statValue}>{results.timeTaken}s</span>
                <span className={styles.statLabel}>Time</span>
              </div>
            </div>
          </div>

          <div className={styles.feedback}>
            <h3>Feedback</h3>
            <p>{results.feedback}</p>
          </div>

          <div className={styles.resultsActions}>
            <button onClick={handleRetry} className={styles.retryButton}>
              Try Again
            </button>
            <button onClick={handleBackToPractice} className={styles.backButton}>
              Back to Practice
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = quizData.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quizData.questions.length) * 100;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.quizInfo}>
          <h1>{quizData.title}</h1>
          <p>{quizData.subject} • {quizData.topic} • {quizData.difficulty}</p>
        </div>
        
        <div className={styles.progressInfo}>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill} 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span className={styles.questionCounter}>
            {currentQuestionIndex + 1} of {quizData.questions.length}
          </span>
        </div>
      </div>

      <div className={styles.questionCard}>
        <div className={styles.questionHeader}>
          <h2>Question {currentQuestionIndex + 1}</h2>
          <span className={styles.timer}>
            ⏱️ {Math.floor(timeSpent / 60)}:{(timeSpent % 60).toString().padStart(2, '0')}
          </span>
        </div>

        <div className={styles.questionText}>
          {currentQuestion.question}
        </div>

        <div className={styles.optionsContainer}>
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              className={`${styles.optionButton} ${
                answers[currentQuestion._id] === index ? styles.selected : ''
              }`}
              onClick={() => handleAnswerSelect(currentQuestion._id, index)}
            >
              <span className={styles.optionLetter}>
                {String.fromCharCode(65 + index)}
              </span>
              <span className={styles.optionText}>{option}</span>
            </button>
          ))}
        </div>

        <div className={styles.navigationButtons}>
          <button
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className={styles.navButton}
          >
            ← Previous
          </button>

          {currentQuestionIndex === quizData.questions.length - 1 ? (
            <button
              onClick={handleSubmitQuiz}
              disabled={isSubmitting || Object.keys(answers).length < quizData.questions.length}
              className={styles.submitButton}
            >
              {isSubmitting ? (
                <RotatingLines width="20" strokeColor="#fff" />
              ) : (
                'Submit Quiz'
              )}
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className={styles.navButton}
            >
              Next →
            </button>
          )}
        </div>
      </div>

      <div className={styles.answerSummary}>
        <h3>Answer Summary</h3>
        <div className={styles.answerGrid}>
          {quizData.questions.map((_, index) => (
            <div
              key={index}
              className={`${styles.answerIndicator} ${
                answers[quizData.questions[index]._id] !== undefined ? styles.answered : ''
              } ${index === currentQuestionIndex ? styles.current : ''}`}
              onClick={() => setCurrentQuestionIndex(index)}
            >
              {index + 1}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PracticeSession;
