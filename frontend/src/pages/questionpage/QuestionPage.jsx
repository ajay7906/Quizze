import React, { useEffect, useState } from 'react';
import QuestionCard from '../../components/questioncard/QuestionCard';
import styles from './QuestionPage.module.css';
import {getDetailsQuestions} from '../../api/quizApi'
import { useParams } from 'react-router-dom';

const questionsData = [
    { question: 'Q.1 Question place holder for analysis ?', attempts: 60, correct: 38, incorrect: 22 },
    { question: 'Q.1 Question place holder for analysis ?', attempts: 60, correct: 38, incorrect: 22 },
    { question: 'Q.1 Question place holder for analysis ?', attempts: 60, correct: 38, incorrect: 22 },
];

const QuestionPage = () => {
    const [questionDetails, setQuestionDetails] = useState()
    const { quizId } = useParams();
    const getAllQuestionDetails = async ()=>{
       try {
        const response = await getDetailsQuestions(quizId)
        setQuestionDetails(response);
        console.log(questionDetails);
        
       } catch (error) {
        console.log(error);
        
       }

    }

    useEffect(()=>{
        getAllQuestionDetails()

    }, [])
    return (
        <div className={styles.container}>
            <div className={styles.questionanlysis}>
                <h1 className={styles.title}>Quiz 2 Question Analysis</h1>
                <div className={styles.metaData}>
                    <span>Created on: 04 Sep, 2023 <br />Impressions: 667 </span> 
                    {/* <span>Impressions: 667</span> */}
                </div>
            </div>
            {questionsData.map((data, index) => (
                <QuestionCard
                    key={index}
                    question={data.question}
                    attempts={data.attempts}
                    correct={data.correct}
                    incorrect={data.incorrect}
                />
            ))}
        </div>
    );
};

export default QuestionPage;
