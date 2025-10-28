

import React, { useState, useEffect, useCallback } from "react";
import { 
  empressionUpdates, 
  getShareQuestions, 
  questionRightWronchk, 
  updateQuizStatus ,
  updateAssignmentStatus
} from "../../api/quizApi";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { RotatingLines } from "react-loader-spinner";

const ShareQuiz = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [timer, setTimer] = useState(30); // Default to 30 seconds
  const [currentPage, setCurrentPage] = useState(1);
  const [lengthOfQuestion, setLengthOfQuestion] = useState(0);
  const [rightAns, setRightAns] = useState(0);
  const [typeChecker, setTypeChecker] = useState("");
  const [wrongAns, setWrongAns] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isOptionSelected, setIsOptionSelected] = useState(false);
  const [quizData, setQuizData] = useState(null);
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [timeUp, setTimeUp] = useState(false); // New state to track when time is up

  const navigate = useNavigate();
  const { quizId } = useParams();
  const query = new URLSearchParams(useLocation().search);
  const assignmentId = query.get("assignmentId");

  // Memoized fetch function
  const fetchQuestion = useCallback(async (page) => {
    if (!quizId) return;
    
    setLoading(true);
    setIsOptionSelected(false);
    setSelectedOption(null);
    setTimeUp(false); // Reset timeUp state when fetching new question
    
    try {
      const response = await getShareQuestions(quizId, page, 1);
      if (response && response.length > 0) {
        setCurrentQuestion(response[0]);
        // Reset timer for each question - use quiz timeLimit or default
        const questionTime = quizData?.timeLimit || 30;
        setTimer(questionTime);
        
        // Mark quiz as started when first question loads
        if (!isQuizStarted) {
          setIsQuizStarted(true);
        }
      }
    } catch (error) {
      console.error("Error fetching question:", error);
    } finally {
      setLoading(false);
    }
  }, [quizId, quizData, isQuizStarted]);

  // Check right/wrong answer
  const rightWrongCheck = async (rightAnsSelect, index) => {
    if (loading || isOptionSelected || timeUp) return;
    
    setSelectedOption(index);
    setIsOptionSelected(true);
    
    // Update scores
    if (rightAnsSelect) {
      setRightAns(prev => prev + 1);
    } else {
      setWrongAns(prev => prev + 1);
    }

    // Send to backend
    try {
      if (currentQuestion?._id) {
        await questionRightWronchk(currentQuestion._id, rightAnsSelect);
      }
    } catch (error) {
      console.error("Error checking answer:", error);
    }
  };

  // Auto-submit when time is up
  const handleTimeUp = useCallback(async () => {
    if (timeUp || loading) return;
    
    setTimeUp(true);
    setIsOptionSelected(true);
    
    // Mark the question as wrong when time runs out (no selection)
    setWrongAns(prev => prev + 1);
    
    // Send to backend that time ran out (no answer selected)
    try {
      if (currentQuestion?._id) {
        await questionRightWronchk(currentQuestion._id, false);
      }
    } catch (error) {
      console.error("Error submitting time-up answer:", error);
    }
    
    // Auto-proceed to next question or submit quiz
    setTimeout(() => {
      if (currentPage < lengthOfQuestion) {
        setCurrentPage(prev => prev + 1);
      } else {
        handleSubmit();
      }
    }, 1500); // Show time-up state for 1.5 seconds before proceeding
  }, [timeUp, loading, currentQuestion, currentPage, lengthOfQuestion]);

  // Fetch quiz data and impressions
  const updateEmpression = useCallback(async () => {
    try {
      const response = await empressionUpdates(quizId);
      setTypeChecker(response?.type);
      setLengthOfQuestion(response?.questions?.length || 0);
      setQuizData(response);
      
      // Set initial timer based on quiz data
      if (response?.timeLimit) {
        setTimer(response.timeLimit);
      }
    } catch (error) {
      console.error("Error updating impression:", error);
    }
  }, [quizId]);

  const handleNextClick = useCallback(() => {
    if (!loading && isOptionSelected && currentPage < lengthOfQuestion) {
      setCurrentPage(prev => prev + 1);
    }
  }, [loading, isOptionSelected, currentPage, lengthOfQuestion]);

  const handleSubmit = async () => {
    try {
      const score = lengthOfQuestion > 0 ? (rightAns / lengthOfQuestion) * 100 : 0;
      const totalQuestions = lengthOfQuestion;

      const response = await updateQuizStatus(quizId, 'completed');
      // If accessed via assignment, update assignment status too
      const updateAssignment = await updateAssignmentStatus(assignmentId, 'completed');
      if (response.status && updateAssignment.status) {
        navigate("/successpage", { 
          state: { 
            score: Math.round(score),
            totalQuestions, 
            rightAnswers: rightAns,
            wrongAnswers: wrongAns,
            typeChecker,
            quizTitle: quizData?.title 
          } 
        });
      }
    } catch (error) {
      console.error('Error updating quiz status:', error);
    }
  };

  // FIXED: Timer logic - only count down when quiz is active and question is loaded
  useEffect(() => {
    let timerId;
    
    if (isQuizStarted && timer > 0 && currentQuestion && !loading && !timeUp) {
      timerId = setTimeout(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else if (timer === 0 && currentQuestion && isQuizStarted && !timeUp) {
      // Time's up - auto submit the current question
      handleTimeUp();
    }
    
    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, [timer, isQuizStarted, currentQuestion, loading, timeUp, handleTimeUp]);

  // Fetch question when page changes
  useEffect(() => {
    if (currentPage <= lengthOfQuestion && lengthOfQuestion > 0) {
      fetchQuestion(currentPage);
    }
  }, [currentPage, lengthOfQuestion, fetchQuestion]);

  // Initial data load
  useEffect(() => {
    if (quizId) {
      updateEmpression();
    }
  }, [quizId, updateEmpression]);

  // Timer color based on remaining time
  const getTimerColor = () => {
    if (timeUp) return "bg-red-100 text-red-700 animate-pulse";
    if (!timer || !quizData?.timeLimit) return "bg-gray-100 text-gray-700";
    
    const timePercentage = (timer / quizData.timeLimit) * 100;
    
    if (timePercentage > 50) return "bg-green-100 text-green-700";
    if (timePercentage > 25) return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700 animate-pulse";
  };

  // Progress calculation
  const progress = lengthOfQuestion > 0 ? (currentPage / lengthOfQuestion) * 100 : 0;

  // Calculate score for display
  const currentScore = lengthOfQuestion > 0 ? Math.round((rightAns / lengthOfQuestion) * 100) : 0;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 p-4">
      <div className="w-full max-w-3xl bg-white/90 backdrop-blur-lg shadow-2xl rounded-3xl p-6 sm:p-8 transition-all duration-300">
        {/* Header with Quiz Info */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {quizData?.title || "Quiz"}
          </h1>
          <p className="text-gray-600">
            {quizData?.subject} • {quizData?.topic} • {quizData?.difficulty}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">
              Question {currentPage} of {lengthOfQuestion}
            </span>
            <span className="text-sm font-medium text-gray-600">
              Score: {currentScore}%
            </span>
            <span className="text-sm font-medium text-gray-600">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2.5 rounded-full transition-all duration-500 ease-out" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Timer Section */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-600">
              Correct: {rightAns} | Wrong: {wrongAns}
            </span>
          </div>
          
          {isQuizStarted && (
            <div className={`px-4 py-2 rounded-full font-bold text-lg transition-all duration-300 ${getTimerColor()}`}>
              {timeUp ? "Time's Up! ⏰" : `00:${timer < 10 ? `0${timer}` : timer}s`}
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col justify-center items-center h-64 space-y-4">
            <RotatingLines width="80" strokeColor="#6366f1" visible={true} />
            <p className="text-gray-600 font-medium">Loading question...</p>
          </div>
        ) : timeUp ? (
          <div className="flex flex-col justify-center items-center h-64 space-y-4">
            <RotatingLines width="80" strokeColor="#6366f1" visible={true} />
            <p className="text-gray-600 font-medium">Time's up! Moving to next question...</p>
          </div>
        ) : currentQuestion ? (
          <>
            {/* Question Card */}
            <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-100 rounded-2xl p-6 mb-8 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {currentQuestion.questionType}
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  {currentQuestion.marks || 1} point{currentQuestion.marks !== 1 ? 's' : ''}
                </span>
              </div>
              
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 leading-tight mb-4">
                {currentQuestion.question}
              </h2>
              
              {currentQuestion.explanation && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Hint:</strong> {currentQuestion.explanation}
                  </p>
                </div>
              )}
            </div>

            {/* Options Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {currentQuestion.options?.map((option, index) => (
                <button
                  key={option._id || index}
                  onClick={() => rightWrongCheck(option.rightans, index)}
                  disabled={loading || isOptionSelected || timeUp}
                  className={`flex items-center justify-start border-2 rounded-xl p-5 font-medium transition-all duration-300 transform text-left
                    ${selectedOption === index
                      ? option.rightans
                        ? "border-green-500 bg-green-50 shadow-lg scale-[1.02] ring-2 ring-green-200"
                        : "border-red-500 bg-red-50 shadow-lg scale-[1.02] ring-2 ring-red-200"
                      : "border-gray-200 bg-white hover:border-indigo-300 hover:shadow-md hover:scale-[1.01]"
                    }
                    ${(loading || timeUp) ? "opacity-50 cursor-not-allowed" : ""}
                  `}
                >
                  {option?.imageURL ? (
                    <div className="flex flex-col items-center w-full">
                      <img
                        src={option.imageURL}
                        alt="Option"
                        className="w-full h-32 object-cover rounded-lg mb-2"
                      />
                      <span className="text-lg font-medium">
                        {option.text}
                      </span>
                    </div>
                  ) : (
                    <span className="text-lg font-medium">
                      {option.text}
                    </span>
                  )}
                  
                  {isOptionSelected && selectedOption === index && (
                    <span className="ml-auto text-sm font-semibold">
                      {option.rightans ? "✓ Correct" : "✗ Wrong"}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center pt-6 border-t border-gray-200">
              <div className="text-sm text-gray-600 font-medium">
                {timeUp
                  ? "⏰ Time's up! No answer selected."
                  : isOptionSelected 
                    ? selectedOption !== null && currentQuestion.options?.[selectedOption]?.rightans
                      ? "✓ Correct answer!"
                      : "✗ Wrong answer!"
                    : "Select an option to continue"
                }
              </div>
              
              {currentPage === lengthOfQuestion ? (
                <button
                  onClick={handleSubmit}
                  disabled={loading || !isOptionSelected || timeUp}
                  className={`px-8 py-3 rounded-xl font-semibold text-white transition-all duration-300 transform
                    ${!isOptionSelected || loading || timeUp
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl"
                    }`}
                >
                  Submit Quiz
                </button>
              ) : (
                <button
                  onClick={handleNextClick}
                  disabled={loading || !isOptionSelected || timeUp}
                  className={`px-8 py-3 rounded-xl font-semibold text-white transition-all duration-300 transform
                    ${!isOptionSelected || loading || timeUp
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl"
                    }`}
                >
                  Next Question →
                </button>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No questions available.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShareQuiz;