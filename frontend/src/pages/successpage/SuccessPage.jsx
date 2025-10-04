


// import React from 'react';
// import { useLocation } from 'react-router-dom';
// import styles from './SuccessPage.module.css';
// import TrophyImage from '../../assets/sucess.png'; // Adjust the path according to your project structure

// const SuccessPage = () => {
//     const location = useLocation();
//     const { score, totalQuestions, typeChecker } = location.state || {};
//     console.log(typeChecker, score, totalQuestions);

//     return (
//         <div className={styles.containerLayout}>
//             <div className={styles.container}>
//                 {typeChecker === 'Poll Type' ? (
//                     <p className={styles.pollTypeMessage}>Thank you for participating in the Poll</p>
//                 ) : (
//                     <>
//                         <h1>Congrats Quiz is completed</h1>
//                         <img src={TrophyImage} alt="Trophy" className={styles.trophy} />
//                         <div className={styles.scoreContainer}>
//                             <span>Your Score is</span>
//                             <span className={styles.score}>
//                                 {score}/{totalQuestions}
//                             </span>
//                         </div>
//                     </>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default SuccessPage;





import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'; // If you don't have framer-motion, I'll provide an alternative
import Confetti from 'react-confetti'; // Optional: for celebration effect
import TrophyImage from '../../assets/sucess.png';

const SuccessPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { score, totalQuestions, typeChecker } = location.state || {};
    
    // Calculate percentage and performance message
    const percentage = totalQuestions ? Math.round((score / totalQuestions) * 100) : 0;
    
    const getPerformanceMessage = () => {
        if (percentage === 100) return "Perfect! Outstanding performance! 🎉";
        if (percentage >= 80) return "Excellent! You did great! 👏";
        if (percentage >= 60) return "Good job! Well done! 👍";
        if (percentage >= 40) return "Not bad! Keep practicing! 💪";
        return "Keep learning and try again! 🌟";
    };

    const getPerformanceColor = () => {
        if (percentage >= 80) return "text-green-600";
        if (percentage >= 60) return "text-blue-600";
        if (percentage >= 40) return "text-yellow-600";
        return "text-orange-600";
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-100 flex items-center justify-center p-4">
            {/* Confetti effect for quiz completion */}
            {typeChecker !== 'Poll Type' && percentage >= 60 && (
                <Confetti
                    width={window.innerWidth}
                    height={window.innerHeight}
                    recycle={false}
                    numberOfPieces={200}
                />
            )}
            
            <div className="max-w-2xl w-full">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-8 sm:p-12 text-center"
                >
                    {typeChecker === 'Poll Type' ? (
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            {/* Poll Success */}
                            <div className="mb-6">
                                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-12 h-12 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                            
                            <h1 className="text-4xl font-bold text-gray-800 mb-4">
                                Thank You!
                            </h1>
                            <p className="text-xl text-gray-600 mb-2">
                                Your response has been recorded
                            </p>
                            <p className="text-lg text-gray-500">
                                We appreciate your participation in this poll
                            </p>
                            
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="mt-8"
                            >
                                <button
                                    onClick={() => navigate('/')}
                                    className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                                >
                                    Back to Home
                                </button>
                            </motion.div>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            {/* Quiz Success */}
                            <div className="mb-6">
                                <motion.img
                                    src={TrophyImage}
                                    alt="Trophy"
                                    className="w-32 h-32 mx-auto mb-6"
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ 
                                        type: "spring",
                                        stiffness: 260,
                                        damping: 20,
                                        delay: 0.2
                                    }}
                                />
                            </div>
                            
                            <h1 className="text-4xl font-bold text-gray-800 mb-4">
                                Congratulations! 🎉
                            </h1>
                            <p className="text-xl text-gray-600 mb-6">
                                You've successfully completed the quiz!
                            </p>
                            
                            {/* Score Display */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.8 }}
                                className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6 mb-6 border-2 border-blue-200"
                            >
                                <p className="text-lg text-gray-600 mb-2">Your Score</p>
                                <div className="flex items-baseline justify-center space-x-2 mb-3">
                                    <span className="text-5xl font-bold text-blue-600">
                                        {score}
                                    </span>
                                    <span className="text-2xl text-gray-500">/</span>
                                    <span className="text-2xl text-gray-500">{totalQuestions}</span>
                                </div>
                                <div className={`text-xl font-semibold ${getPerformanceColor()}`}>
                                    {percentage}% - {getPerformanceMessage()}
                                </div>
                            </motion.div>
                            
                            {/* Progress Bar */}
                            <div className="w-full bg-gray-200 rounded-full h-4 mb-8">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${percentage}%` }}
                                    transition={{ duration: 1.5, delay: 0.5 }}
                                    className={`h-4 rounded-full ${
                                        percentage >= 80 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                                        percentage >= 60 ? 'bg-gradient-to-r from-blue-500 to-indigo-500' :
                                        percentage >= 40 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                                        'bg-gradient-to-r from-orange-500 to-red-500'
                                    }`}
                                />
                            </div>
                            
                            {/* Action Buttons */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1 }}
                                className="flex flex-col sm:flex-row gap-4 justify-center"
                            >
                                <button
                                    onClick={() => navigate('/')}
                                    className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                                >
                                    Back to Home
                                </button>
                                <button
                                    onClick={() => window.location.reload()}
                                    className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-full font-semibold hover:border-blue-500 hover:text-blue-600 transition-all duration-300 transform hover:scale-105"
                                >
                                    Try Again
                                </button>
                            </motion.div>
                            
                            {/* Share Section */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.2 }}
                                className="mt-8 pt-6 border-t border-gray-200"
                            >
                                <p className="text-gray-600 mb-4">Challenge your friends!</p>
                                <div className="flex justify-center space-x-4">
                                    <button className="p-2 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors">
                                        <span className="text-blue-600 font-semibold">Share</span>
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </motion.div>
                
                {/* Additional Info */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    className="text-center mt-6 text-gray-500 text-sm"
                >
                    <p>Thank you for participating in our {typeChecker?.toLowerCase() || 'quiz'}</p>
                </motion.div>
            </div>
        </div>
    );
};

export default SuccessPage;