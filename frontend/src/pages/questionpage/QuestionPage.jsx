


// import React, { useEffect, useState } from 'react';
// import QuestionCard from '../../components/questioncard/QuestionCard';
// import styles from './QuestionPage.module.css';
// import { getDetailsQuestions } from '../../api/quizApi';
// import { useLocation, useParams } from 'react-router-dom';
// import { RotatingLines } from 'react-loader-spinner'; // Import the spinner

// const QuestionPage = () => {
//     const [questionDetails, setQuestionDetails] = useState(null);
//     const [isLoading, setIsLoading] = useState(true); // State to manage loading
//     const location = useLocation();
//     const { quizId } = useParams();
//     const { impressions, createdAt, title } = location.state || {};

//     const getAllQuestionDetails = async () => {
//         try {
//             // Fetch question details
//             const response = await getDetailsQuestions(quizId);
//             setQuestionDetails(response);
//         } catch (error) {
//             console.log(error);
//         } finally {
//             setIsLoading(false); // Set loading to false when data is fetched
//         }
//     };

//     useEffect(() => {
//         getAllQuestionDetails();
//     }, []);

//     return (
//         <div className={styles.container}>
//             <div className={styles.questionanlysis}>
//                 <h1 className={styles.title}>{title} Question Analysis</h1>
//                 <div className={styles.metaData}>
//                     <span>Created on: {createdAt} <br />Impressions: {impressions} </span>
//                 </div>
//             </div>
//             <div className={styles.numberOfQuestion}>
//                 {isLoading ? (
//                     <div className={styles.loaderContainer}>
//                         <RotatingLines width="100" visible={true} />
//                     </div>
//                 ) : (
//                     questionDetails?.map((data, index) => (
//                         <QuestionCard
//                             key={index}
//                             index={index}
//                             question={data.question}
//                             attempts={data?.correctAttempts + data?.wrongAttempts}
//                             correct={data?.correctAttempts}
//                             incorrect={data?.wrongAttempts}
//                         />
//                     ))
//                 )}
//             </div>
//         </div>
//     );
// };

// export default QuestionPage;






import React, { useEffect, useState } from 'react';
import QuestionCard from '../../components/questioncard/QuestionCard';
import { getDetailsQuestions } from '../../api/quizApi';
import { useLocation, useParams } from 'react-router-dom';
import { RotatingLines } from 'react-loader-spinner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const QuestionPage = () => {
    const [questionDetails, setQuestionDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();
    const { quizId } = useParams();
    const { impressions, createdAt, title } = location.state || {};

    const getAllQuestionDetails = async () => {
        try {
            const response = await getDetailsQuestions(quizId);
            setQuestionDetails(response);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getAllQuestionDetails();
    }, []);

    // Prepare data for overall performance chart
    const chartData = questionDetails?.map((question, index) => ({
        name: `Q${index + 1}`,
        correct: question.correctAttempts,
        incorrect: question.wrongAttempts,
        accuracy: question.correctAttempts + question.wrongAttempts > 0 
            ? (question.correctAttempts / (question.correctAttempts + question.wrongAttempts) * 100).toFixed(1)
            : 0
    }));

    // Calculate overall stats
    const overallStats = questionDetails ? {
        totalQuestions: questionDetails.length,
        totalAttempts: questionDetails.reduce((sum, q) => sum + q.correctAttempts + q.wrongAttempts, 0),
        totalCorrect: questionDetails.reduce((sum, q) => sum + q.correctAttempts, 0),
        totalIncorrect: questionDetails.reduce((sum, q) => sum + q.wrongAttempts, 0),
        overallAccuracy: questionDetails.reduce((sum, q) => sum + q.correctAttempts, 0) / 
                         questionDetails.reduce((sum, q) => sum + q.correctAttempts + q.wrongAttempts, 0) * 100 || 0
    } : null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl lg:text-4xl font-bold text-blue-600 mb-2">
                                {title} - Question Analysis
                            </h1>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                <div className="flex items-center bg-blue-50 px-3 py-1 rounded-full">
                                    <span className="font-medium">Created: {createdAt}</span>
                                </div>
                                <div className="flex items-center bg-green-50 px-3 py-1 rounded-full">
                                    <span className="font-medium">Impressions: {impressions}</span>
                                </div>
                            </div>
                        </div>
                        
                        {/* Overall Stats */}
                        {overallStats && (
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                                <div className="bg-blue-100 rounded-lg p-3 text-center">
                                    <div className="text-2xl font-bold text-blue-700">{overallStats.totalQuestions}</div>
                                    <div className="text-xs font-medium text-blue-900">Questions</div>
                                </div>
                                <div className="bg-purple-100 rounded-lg p-3 text-center">
                                    <div className="text-2xl font-bold text-purple-700">{overallStats.totalAttempts}</div>
                                    <div className="text-xs font-medium text-purple-900">Total Attempts</div>
                                </div>
                                <div className="bg-green-100 rounded-lg p-3 text-center">
                                    <div className="text-2xl font-bold text-green-700">{overallStats.totalCorrect}</div>
                                    <div className="text-xs font-medium text-green-900">Correct</div>
                                </div>
                                <div className="bg-red-100 rounded-lg p-3 text-center">
                                    <div className="text-2xl font-bold text-red-700">{overallStats.totalIncorrect}</div>
                                    <div className="text-xs font-medium text-red-900">Incorrect</div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Overall Accuracy */}
                    {overallStats && (
                        <div className="mt-6 p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white">
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-semibold">Overall Accuracy</span>
                                <span className="text-xl font-bold">{overallStats.overallAccuracy.toFixed(1)}%</span>
                            </div>
                            <div className="w-full bg-blue-400 rounded-full h-3">
                                <div 
                                    className="h-3 rounded-full bg-white transition-all duration-1000 ease-out"
                                    style={{ width: `${overallStats.overallAccuracy}%` }}
                                ></div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Performance Chart */}
                {chartData && chartData.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Performance Overview</h2>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip 
                                        formatter={(value, name) => {
                                            if (name === 'accuracy') return [`${value}%`, 'Accuracy'];
                                            return [value, name === 'correct' ? 'Correct' : 'Incorrect'];
                                        }}
                                    />
                                    <Legend />
                                    <Bar dataKey="correct" name="Correct Answers" fill="#10B981" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="incorrect" name="Incorrect Answers" fill="#EF4444" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}

                {/* Questions List */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Detailed Question Analysis</h2>
                    
                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="text-center">
                                <RotatingLines width="80" strokeColor="#3B82F6" visible={true} />
                                <p className="mt-4 text-gray-600 font-medium">Loading question analysis...</p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-blue-50">
                            {questionDetails?.map((data, index) => (
                                <QuestionCard
                                    key={index}
                                    index={index}
                                    question={data.question}
                                    attempts={data?.correctAttempts + data?.wrongAttempts}
                                    correct={data?.correctAttempts}
                                    incorrect={data?.wrongAttempts}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuestionPage;