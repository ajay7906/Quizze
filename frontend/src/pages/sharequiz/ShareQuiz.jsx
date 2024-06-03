


import React, { useState, useEffect } from 'react';
import styles from './ShareQuiz.module.css';
import { empressionUpdates, getShareQuestions, questionRightWronchk } from '../../api/quizApi';
import { useNavigate, useParams } from 'react-router-dom';
import { RotatingLines } from 'react-loader-spinner';

const ShareQuiz = () => {
    const [selectedOption, setSelectedOption] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [timer, setTimer] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [lengthOfQuestion, setLengthOfQuestion] = useState(0);
    const [rightAns, setRightAns] = useState(0);
    const [typeChecker, setTypeChecker] = useState();
    const [wrongAns, setWrongAns] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { quizId } = useParams();

    const fetchQuestion = async (page) => {
        setLoading(true);
        try {
            //fetch question of share
            const response = await getShareQuestions(quizId, page);
            setCurrentQuestion(response[0]);
            setTimer(response[0]?.timer || 0);
        } catch (error) {
            console.error('Error fetching question:', error);
        } finally {
            setLoading(false);
        }
    };


    //check right and wrong
    const rightWrongCheck = async (rightAnsSelect, index) => {
        setSelectedOption(index);
        if (rightAnsSelect) {
            console.log(rightAnsSelect);
            console.log('right ans');
            setRightAns((prev) => prev + 1);
        } else {
            setWrongAns((prev) => prev + 1);
        }
        try {
            const response = await questionRightWronchk(currentQuestion._id, rightAnsSelect);
            console.log(response);
        } catch (error) {
            console.error('Error checking answer:', error);
        }
    };
    
    //update empression 
    const updateEmpression = async () => {
        try {
            const response = await empressionUpdates(quizId);
            setTypeChecker(response?.type);
            setLengthOfQuestion(response?.questions?.length || 0);
        } catch (error) {
            console.error('Error updating impression:', error);
        }
    };

    const handleNextClick = () => {
        if (!loading) {
            setCurrentPage((prevPage) => prevPage + 1);
            setSelectedOption(null);
        }
    };

    const handleSubmit = () => {
        const score = rightAns;
        const totalQuestions = lengthOfQuestion;
        navigate('/successpage', { state: { score, totalQuestions, typeChecker } });
    };

    useEffect(() => {
        fetchQuestion(currentPage);
    }, [currentPage]);

    useEffect(() => {
        updateEmpression();
    }, []);

    useEffect(() => {
        if (timer > 0) {
            const timerId = setInterval(() => setTimer((prev) => prev - 1), 1000);
            return () => clearInterval(timerId);
        } else if (timer === 0 && lengthOfQuestion > currentPage) {
            handleNextClick();
        }
        else if(timer===0 && lengthOfQuestion===currentPage){
            handleSubmit()
        }
    }, [timer]);

    return (
        <div className={styles.card}>
            <div className={styles.cardContent}>
                {loading ? (
                    <div className={styles.loading}><RotatingLines width="100" visible={true} /></div>
                ) : (
                    <>
                        <div className={styles.header}>
                            <span className={styles.questionNumber}>
                                {currentPage}/{lengthOfQuestion}
                            </span>
                            {timer === 0 ? null : <span className={styles.timer}>00:{timer}s</span>}
                        </div>
                        <div className={styles.questionText}>
                            {currentQuestion?.question}
                        </div>
                        <div className={styles.options}>
                            {currentQuestion?.optionType === 'textAndImageURL'
                                ? currentQuestion?.optionsTextAndImg?.map((option, index) => (
                                    <div
                                        key={index}
                                        className={`${styles.imagesAndText} ${selectedOption === index ? styles.isActive : ''}`}
                                        onClick={() => rightWrongCheck(option.rightans, index)}
                                    >
                                        <p>{option?.text}</p>
                                        <img src={option.imageURL} alt="" />
                                    </div>
                                ))
                                : currentQuestion?.options?.map((option, index) => (
                                    <React.Fragment key={index}>
                                        {option?.text && (
                                            <button
                                                className={`${styles.option} ${selectedOption === index ? styles.isActive : ''}`}
                                                onClick={() => rightWrongCheck(option.rightans, index)}
                                                disabled={loading}
                                            >
                                               <p> {option.text}</p>
                                            </button>
                                        )}
                                        {option?.imageURL && (
                                            <button
                                                className={`${styles.optionImg} ${selectedOption === index ? styles.isActive : ''}`}
                                                onClick={() => rightWrongCheck(option.rightans, index)}
                                                disabled={loading}
                                            >
                                                <img src={option.imageURL} alt="option" className={styles.images} />
                                            </button>
                                        )}
                                    </React.Fragment>
                                ))
                            }
                        </div>
                        <div className={styles.nextButtonDiv}>
                            {currentPage === lengthOfQuestion ? (
                                <button className={styles.nextButton} onClick={handleSubmit} disabled={loading}>
                                    Submit
                                </button>
                            ) : (
                                <button className={styles.nextButton} onClick={handleNextClick} disabled={loading}>
                                    Next
                                </button>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ShareQuiz;
