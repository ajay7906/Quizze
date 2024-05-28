import React, { useEffect, useState } from 'react';
import QuestionCard from '../../components/questioncard/QuestionCard';
import styles from './QuestionPage.module.css';
import { getDetailsQuestions } from '../../api/quizApi'
import { useLocation, useParams } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
const questionsData = [
    { question: 'Q.1 Question place holder for analysis ?', attempts: 60, correct: 38, incorrect: 22 },
    { question: 'Q.1 Question place holder for analysis ?', attempts: 60, correct: 38, incorrect: 22 },
    { question: 'Q.1 Question place holder for analysis ?', attempts: 60, correct: 38, incorrect: 22 },
];

const QuestionPage = () => {
    const [questionDetails, setQuestionDetails] = useState()
    const location = useLocation();
    const { quizId } = useParams();
    const { impressions,  createdAt, title    } = location.state ||  {}
    console.log(impressions, createdAt, title);
    const getAllQuestionDetails = async () => {
        try {
            const response = await getDetailsQuestions(quizId)
            setQuestionDetails(response);
         

        } catch (error) {
            console.log(error);

        }

    }
    console.log(questionDetails);

    useEffect(() => {
        getAllQuestionDetails()

    }, [])
    return (
        <div className={styles.container}>
            <div className={styles.questionanlysis}>
                <h1 className={styles.title}>{title} Question Analysis</h1>
                <div className={styles.metaData}>
                    <span>Created on: {createdAt} <br />Impressions: {impressions} </span>
                    {/* <span>Impressions: 667</span> */}
                </div>
            </div>
            <div className={styles.numberOfQuestion}>
                {questionDetails?.map((data, index) => (
                    <QuestionCard
                        key={index}
                        question={data.question}
                        attempts={data?.correctAttempts + data?.wrongAttempts }
                        correct={data?.correctAttempts}
                        incorrect={data?.wrongAttempts}
                    />
                ))}
            </div>
        </div>
    );
};

export default QuestionPage;
