


import React from 'react';
import { useLocation } from 'react-router-dom';
import styles from './SuccessPage.module.css';
import TrophyImage from '../../assets/sucess.png'; // Adjust the path according to your project structure

const SuccessPage = () => {
    const location = useLocation();
    const { score, totalQuestions, typeChecker } = location.state || {};
    console.log(typeChecker, score, totalQuestions);

    return (
        <div className={styles.containerLayout}>
            <div className={styles.container}>
                {typeChecker === 'Poll Type' ? (
                    <p className={styles.pollTypeMessage}>Thank you for participating in the Poll</p>
                ) : (
                    <>
                        <h1>Congrats Quiz is completed</h1>
                        <img src={TrophyImage} alt="Trophy" className={styles.trophy} />
                        <div className={styles.scoreContainer}>
                            <span>Your Score is</span>
                            <span className={styles.score}>
                                {score}/{totalQuestions}
                            </span>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default SuccessPage;

