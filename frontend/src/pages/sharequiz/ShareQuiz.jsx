// src/components/QuestionCard.jsx
import React, { useState, useEffect } from 'react';
import styles from './ShareQuiz.module.css';
import { empressionUpdates, getShareQuestions, questionRightWronchk } from '../../api/quizApi';
import { useNavigate, useParams } from 'react-router-dom';


const ShareQuiz = ({ questionNumber, totalQuestions, questionText, options, initialTimer, onNext }) => {
    const [selectedOption, setSelectedOption] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [timer, setTimer] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [lengthOfQuestion, setLengthOfQuestion] = useState(0);
    const [rightAns, setRightAns] = useState(0);
    const [wrongAns, setWrongAns] = useState(null);
    const navigate = useNavigate();
    //const quizId = '664c53c3a1ff95f9b87bef1f';
    const { quizId } = useParams();
    console.log(quizId);


    const fetchQuestion = async (page) => {
        try {
            const response = await getShareQuestions(quizId, page)
            // console.log(currentQuestion);
            setCurrentQuestion(response[0]);
            setTimer(response[0]?.timer || 0);
        } catch (error) {
            console.error('Error fetching question:', error);
        }
    };

    //check right wrong check
    const rightWrongCheck = async (rightAnsSelect, index) => {
        setSelectedOption(index);
        if (rightAnsSelect) {
            setRightAns((prev) => prev + 1);
        } else {
            setWrongAns(1);
        }
        try {

            const response = await questionRightWronchk(currentQuestion._id, rightAnsSelect)
            console.log(response);

        } catch (error) {
            console.error('Error fetching question:', error);

        }
    }
    //update empression
    const updateEmpression = async () => {
        try {
            const response = await empressionUpdates(quizId)
            console.log(response);
            //  console.log('hi', response?.questions?.length);
            setLengthOfQuestion(response?.questions?.length)
            console.log(lengthOfQuestion);
        } catch (error) {
            console.error('Error fetching question:', error);
        }
    };


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
        setSelectedOption(null)

    };

    const handleSubmit = () => {
        const score = rightAns;  // Calculate the score
        const totalQuestions = lengthOfQuestion;

        navigate('/successpage', { state: { score, totalQuestions } });  // Navigate to the success page with score data
    };
    useEffect(() => {
        fetchQuestion(currentPage);

    }, [currentPage]);
    useEffect(() => {
        updateEmpression()
    }, [])
    console.log(currentQuestion);
    console.log(lengthOfQuestion);

    useEffect(() => {
        if (timer > 0) {
            const timerId = setInterval(() => setTimer((prev) => prev - 1), 1000);
            return () => clearInterval(timerId);
        } else if (timer === 0 && lengthOfQuestion !== currentPage) {
            console.log(timer);
            handleNextClick();
        }
        //    else if(timer===0 && lengthOfQuestion == currentPage){
        //     handleSubmit();
        //    }
    }, [timer]);
    console.log(lengthOfQuestion == currentPage);
    return (
        <>
            {

                <div className={styles.card}>
                    <div className={styles.cardContent}>
                        <div className={styles.header}>
                            <span className={styles.questionNumber}>
                                0{currentPage}/0{lengthOfQuestion}
                            </span>
                            {timer === 0 ? <></> : <><span className={styles.timer}>00:{timer}s</span></>}
                        </div>
                        <div className={styles.questionText}>
                            {currentQuestion?.question}
                            {/* { questionText } */}
                        </div>
                        <div className={styles.options}>
                            {currentQuestion?.options?.map((option, index) => (
                                option?.text && option?.imageURL ?




                                    <>
                                        <div className={`${styles.imagesAndText} ${selectedOption === index ? styles.isActive : ''}`}
                                            onClick={() => rightWrongCheck(option.rightans, index)}>
                                            <p>{option?.text}</p>
                                            <img src={option.imageURL} alt="" />

                                        </div>
                                    </> :

                                    <>
                                        <button
                                            key={index}
                                            className={`${styles.option} ${selectedOption === index ? styles.isActive : ''}`}
                                            onClick={() => rightWrongCheck(option.rightans, index)}
                                        >
                                            {/* {option.text} */}
                                            {/* <img key={index} className={styles.images} src={option.imageURL} alt="" /> */}
                                            {option?.text && <p>{option.text}</p>}
                                            {option?.imageURL && <img src={option.imageURL} alt="option" className={styles.images} />}
                                        </button>




                                        {/* // <img key={index}  className={`${styles.images} ${selectedOption === index ? styles.isActive : ''}`} src={option.imageURL} alt="" /> */}
                                    </>

                            )
                            )}
                        </div>
                        {
                            currentPage == lengthOfQuestion ?
                                <>
                                    <button className={styles.nextButton} onClick={handleSubmit}>Submit</button>
                                </>
                                :
                                <>
                                    <button className={styles.nextButton} onClick={handleNextClick}>Next</button>
                                </>
                        }
                    </div>
                </div>
            }
        </>
    );
};

export default ShareQuiz;
