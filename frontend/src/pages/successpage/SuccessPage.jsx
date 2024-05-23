// src/components/SuccessPage.jsx
import React from 'react';
import { useLocation } from 'react-router-dom';
import styles from './SuccessPage.module.css';
import TrophyImage from '../../assets/sucess.png'; // Adjust the path according to your project structure

const SuccessPage = () => {
    const location = useLocation();
    const { score, totalQuestions } = location.state || {};

    return (
        <div className={styles.containerLayout}>
            <div className={styles.container}>
                <h1>Congrats Quiz is completed</h1>
                <img src={TrophyImage} alt="Trophy" className={styles.trophy} />
                <div className={styles.scoreContainer}>
                    <span>Your Score is</span>
                    <span className={styles.score}>
                        {score}/{totalQuestions}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default SuccessPage;
