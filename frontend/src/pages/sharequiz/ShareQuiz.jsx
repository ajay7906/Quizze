


// import React, { useState, useEffect } from 'react';
// import styles from './ShareQuiz.module.css';
// import { empressionUpdates, getShareQuestions, questionRightWronchk } from '../../api/quizApi';
// import { useNavigate, useParams } from 'react-router-dom';
// import { RotatingLines } from 'react-loader-spinner';

// const ShareQuiz = () => {
//     const [selectedOption, setSelectedOption] = useState(null);
//     const [currentQuestion, setCurrentQuestion] = useState(null);
//     const [timer, setTimer] = useState(null);
//     const [currentPage, setCurrentPage] = useState(1);
//     const [lengthOfQuestion, setLengthOfQuestion] = useState(0);
//     const [rightAns, setRightAns] = useState(0);
//     const [typeChecker, setTypeChecker] = useState();
//     const [wrongAns, setWrongAns] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const navigate = useNavigate();
//     const { quizId } = useParams();

//     const fetchQuestion = async (page) => {
//         setLoading(true);
//         try {
//             //fetch question of share
//             const response = await getShareQuestions(quizId, page);
//             setCurrentQuestion(response[0]);
//             setTimer(response[0]?.timer || 0);
//         } catch (error) {
//             console.error('Error fetching question:', error);
//         } finally {
//             setLoading(false);
//         }
//     };


//     //check right and wrong
//     const rightWrongCheck = async (rightAnsSelect, index) => {
//         setSelectedOption(index);
//         if (rightAnsSelect) {
//             console.log(rightAnsSelect);
//             console.log('right ans');
//             setRightAns((prev) => prev + 1);
//         } else {
//             setWrongAns((prev) => prev + 1);
//         }
//         try {
//             const response = await questionRightWronchk(currentQuestion._id, rightAnsSelect);
//             console.log(response);
//         } catch (error) {
//             console.error('Error checking answer:', error);
//         }
//     };
    
//     //update empression 
//     const updateEmpression = async () => {
//         try {
//             const response = await empressionUpdates(quizId);
//             setTypeChecker(response?.type);
//             setLengthOfQuestion(response?.questions?.length || 0);
//         } catch (error) {
//             console.error('Error updating impression:', error);
//         }
//     };

//     const handleNextClick = () => {
//         if (!loading) {
//             setCurrentPage((prevPage) => prevPage + 1);
//             setSelectedOption(null);
//         }
//     };

//     const handleSubmit = () => {
//         const score = rightAns;
//         const totalQuestions = lengthOfQuestion;
//         navigate('/successpage', { state: { score, totalQuestions, typeChecker } });
//     };

//     useEffect(() => {
//         fetchQuestion(currentPage);
//     }, [currentPage]);

//     useEffect(() => {
//         updateEmpression();
//     }, []);

//     useEffect(() => {
//         if (timer > 0) {
//             const timerId = setInterval(() => setTimer((prev) => prev - 1), 1000);
//             return () => clearInterval(timerId);
//         } else if (timer === 0 && lengthOfQuestion > currentPage) {
//             handleNextClick();
//         }
//         else if(timer===0 && lengthOfQuestion===currentPage){
//             handleSubmit()
//         }
//     }, [timer]);

//     return (
//         <div className={styles.card}>
//             <div className={styles.cardContent}>
//                 {loading ? (
//                     <div className={styles.loading}><RotatingLines width="100" visible={true} /></div>
//                 ) : (
//                     <>
//                         <div className={styles.header}>
//                             <span className={styles.questionNumber}>
//                                 {currentPage}/{lengthOfQuestion}
//                             </span>
//                             {timer === 0 ? null : <span className={styles.timer}>00:{timer}s</span>}
//                         </div>
//                         <div className={styles.questionText}>
//                             {currentQuestion?.question}
//                         </div>
//                         <div className={styles.options}>
//                             {currentQuestion?.optionType === 'textAndImageURL'
//                                 ? currentQuestion?.optionsTextAndImg?.map((option, index) => (
//                                     <div
//                                         key={index}
//                                         className={`${styles.imagesAndText} ${selectedOption === index ? styles.isActive : ''}`}
//                                         onClick={() => rightWrongCheck(option.rightans, index)}
//                                     >
//                                         <p>{option?.text}</p>
//                                         <img src={option.imageURL} alt="" />
//                                     </div>
//                                 ))
//                                 : currentQuestion?.options?.map((option, index) => (
//                                     <React.Fragment key={index}>
//                                         {option?.text && (
//                                             <button
//                                                 className={`${styles.option} ${selectedOption === index ? styles.isActive : ''}`}
//                                                 onClick={() => rightWrongCheck(option.rightans, index)}
//                                                 disabled={loading}
//                                             >
//                                                <p> {option.text}</p>
//                                             </button>
//                                         )}
//                                         {option?.imageURL && (
//                                             <button
//                                                 className={`${styles.optionImg} ${selectedOption === index ? styles.isActive : ''}`}
//                                                 onClick={() => rightWrongCheck(option.rightans, index)}
//                                                 disabled={loading}
//                                             >
//                                                 <img src={option.imageURL} alt="option" className={styles.images} />
//                                             </button>
//                                         )}
//                                     </React.Fragment>
//                                 ))
//                             }
//                         </div>
//                         <div className={styles.nextButtonDiv}>
//                             {currentPage === lengthOfQuestion ? (
//                                 <button className={styles.nextButton} onClick={handleSubmit} disabled={loading}>
//                                     Submit
//                                 </button>
//                             ) : (
//                                 <button className={styles.nextButton} onClick={handleNextClick} disabled={loading}>
//                                     Next
//                                 </button>
//                             )}
//                         </div>
//                     </>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default ShareQuiz;


































import React, { useState, useEffect } from "react";
import { empressionUpdates, getShareQuestions, questionRightWronchk } from "../../api/quizApi";
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

  const navigate = useNavigate();
  const { quizId } = useParams();

  // Fetch question
  const fetchQuestion = async (page) => {
    setLoading(true);
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
    if (!loading) {
      setCurrentPage((prev) => prev + 1);
      setSelectedOption(null);
    }
  };

  const handleSubmit = () => {
    const score = rightAns;
    const totalQuestions = lengthOfQuestion;
    navigate("/successpage", { state: { score, totalQuestions, typeChecker } });
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

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4">
      <div className="w-full max-w-2xl bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl p-6 sm:p-8 transition-transform transform hover:scale-[1.01] duration-200">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <RotatingLines width="100" visible={true} strokeColor="#6366f1" />
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <span className="text-lg font-semibold text-gray-600">
                Question {currentPage}/{lengthOfQuestion}
              </span>
              {timer > 0 && (
                <span className="px-4 py-1 bg-indigo-100 text-indigo-700 rounded-full font-medium">
                  00:{timer}s
                </span>
              )}
            </div>

            {/* Question */}
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">
              {currentQuestion?.question}
            </h2>

            {/* Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {currentQuestion?.optionType === "textAndImageURL"
                ? currentQuestion?.optionsTextAndImg?.map((option, index) => (
                    <div
                      key={index}
                      onClick={() => rightWrongCheck(option.rightans, index)}
                      className={`flex flex-col items-center justify-center border rounded-xl cursor-pointer p-4 transition-all duration-200 
                        ${
                          selectedOption === index
                            ? "bg-indigo-500 text-white shadow-lg scale-[1.02]"
                            : "bg-white hover:bg-indigo-50 border-gray-200"
                        }`}
                    >
                      <p className="text-base font-medium mb-2">{option.text}</p>
                      <img
                        src={option.imageURL}
                        alt=""
                        className="w-24 h-24 object-cover rounded-lg shadow-sm"
                      />
                    </div>
                  ))
                : currentQuestion?.options?.map((option, index) => (
                    <React.Fragment key={index}>
                      {option?.text && (
                        <button
                          onClick={() => rightWrongCheck(option.rightans, index)}
                          disabled={loading}
                          className={`w-full text-left p-4 border rounded-xl font-medium transition-all duration-200
                            ${
                              selectedOption === index
                                ? "bg-indigo-500 text-white shadow-md scale-[1.02]"
                                : "bg-white hover:bg-indigo-50 border-gray-200 text-gray-800"
                            }`}
                        >
                          {option.text}
                        </button>
                      )}
                      {option?.imageURL && (
                        <button
                          onClick={() => rightWrongCheck(option.rightans, index)}
                          disabled={loading}
                          className={`w-full border rounded-xl p-3 transition-all duration-200 
                            ${
                              selectedOption === index
                                ? "bg-indigo-500 shadow-md scale-[1.02]"
                                : "bg-white hover:bg-indigo-50 border-gray-200"
                            }`}
                        >
                          <img
                            src={option.imageURL}
                            alt="option"
                            className="w-full h-36 object-cover rounded-lg"
                          />
                        </button>
                      )}
                    </React.Fragment>
                  ))}
            </div>

            {/* Next / Submit Button */}
            <div className="flex justify-end mt-8">
              {currentPage === lengthOfQuestion ? (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-6 py-3 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600 active:scale-95 transition-all"
                >
                  Submit
                </button>
              ) : (
                <button
                  onClick={handleNextClick}
                  disabled={loading}
                  className="px-6 py-3 rounded-lg bg-indigo-500 text-white font-semibold hover:bg-indigo-600 active:scale-95 transition-all"
                >
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

