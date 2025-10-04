


import React, { useState, useEffect } from "react";
import { empressionUpdates, getShareQuestions, questionRightWronchk, updateQuizStatus } from "../../api/quizApi";
import { useNavigate, useParams } from "react-router-dom";
import { RotatingLines } from "react-loader-spinner";

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
  const [isOptionSelected, setIsOptionSelected] = useState(false);

  const navigate = useNavigate();
  const { quizId } = useParams();

  // Fetch question
  const fetchQuestion = async (page) => {
    setLoading(true);
    setIsOptionSelected(false);
    try {
      const response = await getShareQuestions(quizId, page);
      setCurrentQuestion(response[0]);
      setTimer(response[0]?.timer || 0);
    } catch (error) {
      console.error("Error fetching question:", error);
    } finally {
      setLoading(false);
    }
  };

  // Check right/wrong
  const rightWrongCheck = async (rightAnsSelect, index) => {
    setSelectedOption(index);
    setIsOptionSelected(true);
    
    if (rightAnsSelect) setRightAns((prev) => prev + 1);
    else setWrongAns((prev) => prev + 1);

    try {
      await questionRightWronchk(currentQuestion._id, rightAnsSelect);
    } catch (error) {
      console.error("Error checking answer:", error);
    }
  };

  // Impression update
  const updateEmpression = async () => {
    try {
      const response = await empressionUpdates(quizId);
      setTypeChecker(response?.type);
      setLengthOfQuestion(response?.questions?.length || 0);
    } catch (error) {
      console.error("Error updating impression:", error);
    }
  };

  const handleNextClick = () => {
    if (!loading && isOptionSelected) {
      setCurrentPage((prev) => prev + 1);
      setSelectedOption(null);
      setIsOptionSelected(false);
    }
  };

  const handleSubmit =  async () => {
      try{

        const score = rightAns;
        const totalQuestions = lengthOfQuestion;

        const response = await updateQuizStatus(quizId, 'completed');
        if(response.status){
          navigate("/successpage", { state: { score, totalQuestions, typeChecker } });
        }
      }catch(error){
        console.error('Error updating quiz status:', error);
      }
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
    } else if (timer === 0 && lengthOfQuestion === currentPage) {
      handleSubmit();
    }
  }, [timer]);

  // Timer color based on remaining time
  const getTimerColor = () => {
    if (!timer) return "bg-gray-100 text-gray-700";
    if (timer > 10) return "bg-green-100 text-green-700";
    if (timer > 5) return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700 animate-pulse";
  };

  // Progress calculation
  const progress = (currentPage / lengthOfQuestion) * 100;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 p-4">
      <div className="w-full max-w-3xl bg-white/90 backdrop-blur-lg shadow-2xl rounded-3xl p-6 sm:p-8 transition-all duration-300 hover:shadow-2xl">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">
              Question {currentPage} of {lengthOfQuestion}
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

        {/* Header with Timer */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <h1 className="text-xl font-bold text-gray-800">Quiz Time</h1>
</div>
          {timer > 0 && (
            <div className={`px-4 py-2 rounded-full font-bold text-lg transition-all duration-300 ${getTimerColor()}`}>
              00:{timer < 10 ? `0${timer}` : timer}s
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col justify-center items-center h-64 space-y-4">
            <RotatingLines width="80" strokeColor="#6366f1" visible={true} />
            <p className="text-gray-600 font-medium">Loading question...</p>
          </div>
        ) : (
          <>
            {/* Question Card */}
            <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-100 rounded-2xl p-6 mb-8 shadow-sm">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 leading-tight">
                {currentQuestion?.question}
              </h2>
            </div>

            {/* Options Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {currentQuestion?.optionType === "textAndImageURL"
                ? currentQuestion?.optionsTextAndImg?.map((option, index) => (
                    <div
                      key={index}
                      onClick={() => !loading && rightWrongCheck(option.rightans, index)}
                      className={`flex flex-col items-center justify-center border-2 rounded-2xl cursor-pointer p-5 transition-all duration-300 transform
                        ${selectedOption === index
                          ? "border-indigo-500 bg-indigo-50 shadow-lg scale-[1.02] ring-2 ring-indigo-200"
                          : "border-gray-200 bg-white hover:border-indigo-300 hover:shadow-md hover:scale-[1.01]"
                        }
                        ${loading ? "opacity-50 cursor-not-allowed" : ""}
                      `}
                    >
                      {option.imageURL && (
                        <img
                          src={option.imageURL}
                          alt="Option visual"
                          className="w-28 h-28 object-cover rounded-xl shadow-sm mb-3"
                        />
                      )}
                      <p className={`text-lg font-semibold text-center ${selectedOption === index ? "text-indigo-700" : "text-gray-700"}`}>
                        {option.text}
                      </p>
                    </div>
                  ))
                : currentQuestion?.options?.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => !loading && rightWrongCheck(option.rightans, index)}
                      disabled={loading}
                      className={`flex items-center justify-start border-2 rounded-xl p-5 font-medium transition-all duration-300 transform text-left
                        ${selectedOption === index
                          ? "border-indigo-500 bg-indigo-50 shadow-lg scale-[1.02] ring-2 ring-indigo-200"
                          : "border-gray-200 bg-white hover:border-indigo-300 hover:shadow-md hover:scale-[1.01]"
                        }
                        ${loading ? "opacity-50 cursor-not-allowed" : ""}
                      `}
                    >
                      {option?.imageURL ? (
                        <img
                          src={option.imageURL}
                          alt="Option"
                          className="w-full h-40 object-cover rounded-lg"
                        />
                      ) : (
                        <span className={`text-lg font-medium ${selectedOption === index ? "text-indigo-700" : "text-gray-700"}`}>
                          {option.text}
                        </span>
                      )}
                    </button>
                  ))}
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center pt-6 border-t border-gray-200">
              <div className="text-sm text-gray-600 font-medium">
                {isOptionSelected ? "✓ Option selected" : "Select an option to continue"}
              </div>
              
              {currentPage === lengthOfQuestion ? (
                <button
                  onClick={handleSubmit}
                  disabled={loading || !isOptionSelected}
                  className={`px-8 py-3 rounded-xl font-semibold text-white transition-all duration-300 transform active:scale-95
                    ${!isOptionSelected || loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl"
                    }`}
                >
                  Submit Quiz
                </button>
              ) : (
                <button
                  onClick={handleNextClick}
                  disabled={loading || !isOptionSelected}
                  className={`px-8 py-3 rounded-xl font-semibold text-white transition-all duration-300 transform active:scale-95
                    ${!isOptionSelected || loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl"
                    }`}
                >
                  Next Question →
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