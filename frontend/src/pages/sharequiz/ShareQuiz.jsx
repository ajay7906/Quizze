// src/components/QuestionCard.jsx
import React, { useState, useEffect } from 'react';
import styles from './ShareQuiz.module.css';
import { getShareQuestions, questionRightWronchk } from '../../api/quizApi';
import { useParams } from 'react-router-dom';


const ShareQuiz = ({ questionNumber, totalQuestions, questionText, options, initialTimer, onNext }) => {
    const [selectedOption, setSelectedOption] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [timer, setTimer] = useState(initialTimer);
    const [currentPage, setCurrentPage] = useState(1);
    const  [rightAns, setRightAns] = useState(0);
    const  [wrongAns, setWrongAns] = useState(0);
    const quizId = '664c53c3a1ff95f9b87bef1f';

    useEffect(() => {
        if (timer > 0) {
            const timerId = setInterval(() => setTimer(timer - 1), 1000);
            return () => clearInterval(timerId);
        }
    }, [timer]);

    const fetchQuestion = async (page) => {
        try {
            const response = await getShareQuestions(quizId, page)
           // console.log(currentQuestion);
            setCurrentQuestion(response[0]);
        } catch (error) {
            console.error('Error fetching question:', error);
        }
    };

    //check right wrong check
    const rightWrongCheck = async ()=>{
        try {
            const response = await questionRightWronchk(currentQuestion._id, page)

            
        } catch (error) {
            console.error('Error fetching question:', error);
            
        }
    }

    const handleOptionClick = (index, value) => {
        setSelectedOption(index);
        if (value) {
            setRightAns(1)
            
        } else {
            setWrongAns(1)
        }
    };

    const handleNextClick = () => {
        setCurrentPage((prevPage) => prevPage + 1);
    };
    useEffect(() => {
        fetchQuestion(currentPage);

    }, [currentPage]);
    console.log(currentQuestion?._id);
    return (
        <>
            {
               
                <div className={styles.card}>
                    <div className={styles.cardContent}>
                        <div className={styles.header}>
                            <span className={styles.questionNumber}>
                                {String(questionNumber).padStart(2, '0')}/{String(totalQuestions).padStart(2, '0')}
                            </span>
                            <span className={styles.timer}>{String(timer).padStart(2, '0')}s</span>
                        </div>
                        <div className={styles.questionText}>
                            {currentQuestion?.question}
                            {/* { questionText } */}
                        </div>
                        <div className={styles.options}>
                            {currentQuestion?.options?.map((option, index) => (
                                <button
                                    key={index}
                                    className={`${styles.option} ${selectedOption === index ? styles.selected : ''}`}
                                    onClick={() => handleOptionClick(index, option.rightans)}
                                >
                                    {option.text}
                                </button>
                            ))}
                        </div>
                        <button className={styles.nextButton} onClick={handleNextClick}>Next</button>
                    </div>
                </div>
            }
        </>
    );
};

export default ShareQuiz;
