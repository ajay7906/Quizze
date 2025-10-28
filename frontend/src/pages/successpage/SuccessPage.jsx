





import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import TrophyImage from '../../assets/sucess.png';

// Import your API functions
import { likeQuiz, shareQuiz } from '../../api/quizApi'; // You'll need to create these

const SuccessPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { score, totalQuestions, typeChecker, quizId, quizTitle } = location.state || {};
    
    // States for like functionality
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [isLikeLoading, setIsLikeLoading] = useState(false);
    
    // States for share functionality
    const [showShareModal, setShowShareModal] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const [shareUrl, setShareUrl] = useState('');

    // Calculate percentage and performance message
    const percentage = totalQuestions ? Math.round((score / totalQuestions) * 100) : 0;
    
    // Generate share URL
    useEffect(() => {
        if (quizId) {
            const currentUrl = window.location.origin;
            setShareUrl(`${currentUrl}/quiz/${quizId}`);
        }
    }, [quizId]);

    // Fetch initial like status and count (you might want to add this to your API)
    useEffect(() => {
        // You can fetch initial like status here
        // Example: fetchQuizLikes(quizId).then(data => {...})
    }, [quizId]);

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

    // Like functionality
    const handleLike = async () => {
        if (isLikeLoading || !quizId) return;
        
        setIsLikeLoading(true);
        try {
            const response = await likeQuiz(quizId, !isLiked);
            if (response.success) {
                setIsLiked(!isLiked);
                setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
            }
        } catch (error) {
            console.error('Error liking quiz:', error);
        } finally {
            setIsLikeLoading(false);
        }
    };

    // Share functionality
    const handleShare = async (platform = 'copy') => {
        const shareText = `I scored ${percentage}% on "${quizTitle || 'this quiz'}!" Can you beat my score? 🚀`;
        
        switch (platform) {
            case 'copy':
                try {
                    await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
                    setIsCopied(true);
                    setTimeout(() => setIsCopied(false), 2000);
                } catch (err) {
                    // Fallback for older browsers
                    const textArea = document.createElement('textarea');
                    textArea.value = `${shareText} ${shareUrl}`;
                    document.body.appendChild(textArea);
                    textArea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textArea);
                    setIsCopied(true);
                    setTimeout(() => setIsCopied(false), 2000);
                }
                break;

            case 'twitter':
                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
                break;

            case 'whatsapp':
                window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`, '_blank');
                break;

            case 'facebook':
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`, '_blank');
                break;

            case 'linkedin':
                window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank');
                break;

            default:
                break;
        }
        
        // Track share event if you have analytics
        try {
            await shareQuiz(quizId, platform);
        } catch (error) {
            console.error('Error tracking share:', error);
        }
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
            
            {/* Share Modal */}
            {showShareModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl p-6 max-w-md w-full"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-gray-800">Share this quiz</h3>
                            <button
                                onClick={() => setShowShareModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>
                        
                        <div className="space-y-4">
                            {/* Copy Link */}
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={shareUrl}
                                    readOnly
                                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                />
                                <button
                                    onClick={() => handleShare('copy')}
                                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                                        isCopied 
                                            ? 'bg-green-500 text-white' 
                                            : 'bg-blue-500 text-white hover:bg-blue-600'
                                    }`}
                                >
                                    {isCopied ? 'Copied!' : 'Copy'}
                                </button>
                            </div>
                            
                            {/* Social Share Buttons */}
                            <div className="grid grid-cols-4 gap-3">
                                <button
                                    onClick={() => handleShare('twitter')}
                                    className="flex flex-col items-center p-3 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-colors"
                                >
                                    <span className="text-lg">🐦</span>
                                    <span className="text-xs mt-1">Twitter</span>
                                </button>
                                
                                <button
                                    onClick={() => handleShare('whatsapp')}
                                    className="flex flex-col items-center p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                                >
                                    <span className="text-lg">💬</span>
                                    <span className="text-xs mt-1">WhatsApp</span>
                                </button>
                                
                                <button
                                    onClick={() => handleShare('facebook')}
                                    className="flex flex-col items-center p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    <span className="text-lg">👤</span>
                                    <span className="text-xs mt-1">Facebook</span>
                                </button>
                                
                                <button
                                    onClick={() => handleShare('linkedin')}
                                    className="flex flex-col items-center p-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
                                >
                                    <span className="text-lg">💼</span>
                                    <span className="text-xs mt-1">LinkedIn</span>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
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
                            
                            {/* Like Button for Poll */}
                            <div className="mt-6 flex justify-center items-center gap-4">
                                <button
                                    onClick={handleLike}
                                    disabled={isLikeLoading}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                                        isLiked 
                                            ? 'bg-red-500 text-white shadow-lg' 
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    } ${isLikeLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    <span className="text-lg">{isLiked ? '❤️' : '🤍'}</span>
                                    <span>Like</span>
                                    {likeCount > 0 && (
                                        <span className="text-sm">({likeCount})</span>
                                    )}
                                </button>
                            </div>
                            
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
                            
                            {/* Like Button */}
                            <div className="mb-6 flex justify-center">
                                <button
                                    onClick={handleLike}
                                    disabled={isLikeLoading}
                                    className={`flex items-center gap-3 px-6 py-3 rounded-full transition-all duration-300 transform hover:scale-105 ${
                                        isLiked 
                                            ? 'bg-red-500 text-white shadow-lg' 
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    } ${isLikeLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    <span className="text-xl">{isLiked ? '❤️' : '🤍'}</span>
                                    <span className="font-semibold">
                                        {isLiked ? 'Liked' : 'Like this quiz'}
                                    </span>
                                    {likeCount > 0 && (
                                        <span className="bg-white bg-opacity-20 px-2 py-1 rounded-full text-sm">
                                            {likeCount}
                                        </span>
                                    )}
                                </button>
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
                                    <button 
                                        onClick={() => setShowShareModal(true)}
                                        className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                                    >
                                        Share Score
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
