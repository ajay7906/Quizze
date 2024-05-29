// import React, { useEffect, useState } from 'react';
// import QuestionCard from '../../components/questioncard/QuestionCard';
// import styles from './QuestionPage.module.css';
// import { getDetailsQuestions } from '../../api/quizApi'
// import { useLocation, useParams } from 'react-router-dom';



// const QuestionPage = () => {
//     const [questionDetails, setQuestionDetails] = useState()
//     const location = useLocation();
//     const { quizId } = useParams();
//     const { impressions,  createdAt, title    } = location.state ||  {}
//     console.log(impressions, createdAt, title);
//     const getAllQuestionDetails = async () => {
//         try {
//             //question details
//             const response = await getDetailsQuestions(quizId)
//             setQuestionDetails(response);
         

//         } catch (error) {
//             console.log(error);

//         }

//     }
//     console.log(questionDetails);

//     useEffect(() => {
//         getAllQuestionDetails()

//     }, [])
//     return (
//         <div className={styles.container}>
//             <div className={styles.questionanlysis}>
//                 <h1 className={styles.title}>{title} Question Analysis</h1>
//                 <div className={styles.metaData}>
//                     <span>Created on: {createdAt} <br />Impressions: {impressions} </span>
//                     {/* <span>Impressions: 667</span> */}
//                 </div>
//             </div>
//             <div className={styles.numberOfQuestion}>
//                 {questionDetails?.map((data, index) => (
//                     <QuestionCard
//                         key={index}
//                         question={data.question}
//                         attempts={data?.correctAttempts + data?.wrongAttempts }
//                         correct={data?.correctAttempts}
//                         incorrect={data?.wrongAttempts}
//                     />
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default QuestionPage;





import React, { useEffect, useState } from 'react';
import QuestionCard from '../../components/questioncard/QuestionCard';
import styles from './QuestionPage.module.css';
import { getDetailsQuestions } from '../../api/quizApi';
import { useLocation, useParams } from 'react-router-dom';
import { RotatingLines } from 'react-loader-spinner'; // Import the spinner

const QuestionPage = () => {
    const [questionDetails, setQuestionDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // State to manage loading
    const location = useLocation();
    const { quizId } = useParams();
    const { impressions, createdAt, title } = location.state || {};

    const getAllQuestionDetails = async () => {
        try {
            // Fetch question details
            const response = await getDetailsQuestions(quizId);
            setQuestionDetails(response);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false); // Set loading to false when data is fetched
        }
    };

    useEffect(() => {
        getAllQuestionDetails();
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.questionanlysis}>
                <h1 className={styles.title}>{title} Question Analysis</h1>
                <div className={styles.metaData}>
                    <span>Created on: {createdAt} <br />Impressions: {impressions} </span>
                </div>
            </div>
            <div className={styles.numberOfQuestion}>
                {isLoading ? (
                    <div className={styles.loaderContainer}>
                        <RotatingLines width="100" visible={true} />
                    </div>
                ) : (
                    questionDetails?.map((data, index) => (
                        <QuestionCard
                            key={index}
                            index={index}
                            question={data.question}
                            attempts={data?.correctAttempts + data?.wrongAttempts}
                            correct={data?.correctAttempts}
                            incorrect={data?.wrongAttempts}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default QuestionPage;

