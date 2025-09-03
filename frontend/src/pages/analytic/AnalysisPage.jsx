


// import React, { useContext, useEffect, useState } from 'react';
// import styles from './AnalysisPage.module.css';
// import { deleteQuiz, getDetailsQuestions, quizDetails, updateQuiz } from '../../api/quizApi';
// import ShareBtn from '../../assets/share.png';
// import EditBtn from '../../assets/edit.png';
// import { Link } from 'react-router-dom';
// import DeletBtn from '../../assets/delete.png';
// import { ToastContainer, toast } from 'react-toastify';
// import ConfirmModal from '../../components/confirmdeletmodal/ConfirmModal';
// import AuthContext from '../../context/AuthContext';
// import Modal from '../../components/modal/Modal';

// import QuizPopupTwo from '../../components/quizpopuptwo/QuizPopupTwo';
// import ShareModal from '../../components/sharemodal/ShareModal';
// import NoData from '../../assets/nostory.jpg';
// import { RotatingLines } from 'react-loader-spinner'; // Import the spinner

// const AnalysisPage = () => {
//   const [isLoading, setIsLoading] = useState(true); // State to manage loading
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [quizToDelete, setQuizToDelete] = useState(null);
//   const [quizData, setQuizData] = useState([]);
//   const { quizData: contextQuizData } = useContext(AuthContext);
//   const [quizToEdit, setQuizToEdit] = useState(null);
//   const [showSecondPopup, setShowSecondPopup] = useState(false);
//   const [showFinalLink, setShowFinalLink] = useState(false);
//   const [sendUrlLink, setSendUrlLink] = useState('');
//   const [quizQuestions, setQuizQuestions] = useState({});
//   const [isDeleteModal, setIsDeleteModal] = useState(false);

//   const openModal = () => {
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setShowSecondPopup(false);
//     setQuizToEdit(null);
//   };

//   const handleDeleteClick = (quizId) => {
//     setQuizToDelete(quizId);
//     setIsDeleteModal(true);
//   };

//   const handleConfirmDelete = async () => {
//     try {
//       // delete quiz
//       await deleteQuiz(quizToDelete);
//       setQuizData(quizData.filter(quiz => quiz._id !== quizToDelete));
//       setIsDeleteModal(false);
//     } catch (error) {
//       console.error('Failed to delete quiz:', error);
//     }
//   };

//   const closeShareLinkModal = ()=>{
//     setShowFinalLink(false)
//     closeModal()
//   }

//   const handleCloseModal = () => {
//     setIsDeleteModal(false);
//   };

//   // generate link function
//   const generateShareLink = (quizId) => {
//     const shareLink = `https://quizze-nine.vercel.app/sharequiz/${quizId}`;
//     if (navigator.clipboard) {
//       navigator.clipboard.writeText(shareLink);
//       console.log('Link copied to clipboard: ', shareLink);
//       toast.success("Copied Successfully");
//     } else {
//       window.open(shareLink, '_blank');
//     }
//   };

//   const fetchQuizData = async () => {
//     try {
//       // fetch quiz data
//       const response = await quizDetails();
//       setQuizData(response.quizzes);

//       // Preload all quiz questions data
//       const questionsData = {};
//       for (const quiz of response.quizzes) {
//         const quizQuestions = await getDetailsQuestions(quiz._id);
//         questionsData[quiz._id] = quizQuestions;
//       }
//       setQuizQuestions(questionsData);

//     } catch (error) {
//       console.error('Error fetching quizzes:', error);
//     } finally {
//       setIsLoading(false); // Set loading to false when data is fetched
//     }
//   };

//   const handleEditClick = (quiz) => {
//     setQuizToEdit({
//       ...quiz,
//       questions: quizQuestions[quiz._id]
//     });
//     setShowSecondPopup(true);
//     openModal();
//   };

//   const handleUpdateQuiz = async (questions) => {
//     try {
//       const updatedQuiz = {
//         ...quizToEdit,
//         questions,
//       };
//       // update quiz function
//       const result = await updateQuiz(quizToEdit._id, updatedQuiz);
//       setQuizData(quizData.map(quiz => (quiz._id === quizToEdit._id ? updatedQuiz : quiz)));
//       setSendUrlLink(`https://quizze-nine.vercel.app/sharequiz/${result._id}`);
      
//       setShowSecondPopup(false);
//       setShowFinalLink(true);
//       closeModal();
//       toast.success('Quiz updated successfully!');
//     } catch (error) {
//       console.error('Error updating quiz:', error);
//       toast.error('Failed to update quiz.');
//     }
//   };

//   const onClose = () => {
//     setShowFinalLink(false);
//   };

//   useEffect(() => {
//     fetchQuizData();
//   }, [contextQuizData]);

//   useEffect(() => {
//     setQuizData(contextQuizData);
//   }, [contextQuizData]);

//   return (
//     <>
//     <ToastContainer toastClassName={styles.customToast}/>
//       {isLoading ? (
//         <div className={styles.loaderContainer}>
//           <RotatingLines width="100" visible={true} />
//         </div>
//       ) : (
//         <div className={styles.container}>
//           <h1 className={styles.title}>Quiz Analysis</h1>
//           {quizData && quizData.length > 0 ? (
//             <div className={styles.tableContainer}>
//               <table className={styles.table}>
//                 <thead className={styles.tableheading}>
//                   <tr>
//                     <th>S.No</th>
//                     <th>Quiz Name</th>
//                     <th>Created on</th>
//                     <th>Impression</th>
//                     <th></th>
//                     <th></th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {quizData.map((quiz, index) => (
//                     <tr key={quiz._id}>
//                       <td>{index + 1}</td>
//                       <td>{quiz.title}</td>
//                       <td>{quiz.createdAt}</td>
//                       <td>{quiz.impressions >= 1000 ? (quiz.impressions / 1000).toFixed(1) + 'K' : quiz.impressions}</td>
//                       <td className={styles.actionBtn}>
//                         <button className={styles.editButton}><img onClick={() => handleEditClick(quiz)} src={EditBtn} alt="Edit" /></button>
//                         <button className={styles.deleteButton}><img onClick={() => handleDeleteClick(quiz._id)} src={DeletBtn} alt="Delete" /></button>
//                         <button className={styles.shareButton}><img src={ShareBtn} onClick={() => generateShareLink(quiz._id)} alt="Share" /></button>
//                       </td>
//                       <td><Link to={`/questiondetails/${quiz._id}`} state={{ impressions: quiz.impressions, createdAt: quiz.createdAt, title: quiz.title }} className={styles.analysisLink}>Question Wise Analysis</Link></td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <div className={styles.NoBookMark}>
//               <p>Quiz not found</p>
//               <img src={NoData} alt="" />
//             </div>
//           )}
        
//         </div>
//       )}
//       {isDeleteModal && (
//         <ConfirmModal
//           isOpen={isDeleteModal}
//           onClose={handleCloseModal}
//           onConfirm={handleConfirmDelete}
//         />
//       )}
//       <Modal isOpen={isModalOpen} onClose={closeModal}>
//         {showSecondPopup && (
//           <QuizPopupTwo
//             handleUpdateQuiz={handleUpdateQuiz}
//             onClose={closeModal}
//             quizQuestions={quizToEdit.questions}
//             quizType={quizToEdit.type}
//           />
//         )}
//       </Modal>
//       {showFinalLink && (
//         <ShareModal
//           isOpen={showFinalLink}
//           onClose={onClose}
//           closeShareLinkModal={closeShareLinkModal}
//           shareLink={sendUrlLink}
//         />
//       )}
//     </>
//   );
// };

// export default AnalysisPage;































import React, { useContext, useEffect, useState } from 'react';
import { deleteQuiz, getDetailsQuestions, quizDetails, updateQuiz } from '../../api/quizApi';
import ShareBtn from '../../assets/share.png';
import EditBtn from '../../assets/edit.png';
import { Link } from 'react-router-dom';
import DeletBtn from '../../assets/delete.png';
import { ToastContainer, toast } from 'react-toastify';
import ConfirmModal from '../../components/confirmdeletmodal/ConfirmModal';
import AuthContext from '../../context/AuthContext';
import Modal from '../../components/modal/Modal';
import QuizPopupTwo from '../../components/quizpopuptwo/QuizPopupTwo';
import ShareModal from '../../components/sharemodal/ShareModal';
import NoData from '../../assets/nostory.jpg';
import { RotatingLines } from 'react-loader-spinner';

const AnalysisPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState(null);
  const [quizData, setQuizData] = useState([]);
  const { quizData: contextQuizData } = useContext(AuthContext);
  const [quizToEdit, setQuizToEdit] = useState(null);
  const [showSecondPopup, setShowSecondPopup] = useState(false);
  const [showFinalLink, setShowFinalLink] = useState(false);
  const [sendUrlLink, setSendUrlLink] = useState('');
  const [quizQuestions, setQuizQuestions] = useState({});
  const [isDeleteModal, setIsDeleteModal] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setShowSecondPopup(false);
    setQuizToEdit(null);
  };

  const handleDeleteClick = (quizId) => {
    setQuizToDelete(quizId);
    setIsDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteQuiz(quizToDelete);
      setQuizData(quizData.filter(quiz => quiz._id !== quizToDelete));
      setIsDeleteModal(false);
      toast.success('Quiz deleted successfully!');
    } catch (error) {
      console.error('Failed to delete quiz:', error);
      toast.error('Failed to delete quiz.');
    }
  };

  const closeShareLinkModal = () => {
    setShowFinalLink(false);
    closeModal();
  };

  const handleCloseModal = () => {
    setIsDeleteModal(false);
  };

  const generateShareLink = (quizId) => {
    const shareLink = `https://quizze-nine.vercel.app/sharequiz/${quizId}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareLink);
      toast.success("Link copied to clipboard!");
    } else {
      window.open(shareLink, '_blank');
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const fetchQuizData = async () => {
    try {
      const response = await quizDetails();
      setQuizData(response.quizzes);

      const questionsData = {};
      for (const quiz of response.quizzes) {
        const quizQuestions = await getDetailsQuestions(quiz._id);
        questionsData[quiz._id] = quizQuestions;
      }
      setQuizQuestions(questionsData);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = (quiz) => {
    setQuizToEdit({
      ...quiz,
      questions: quizQuestions[quiz._id]
    });
    setShowSecondPopup(true);
    openModal();
  };

  const handleUpdateQuiz = async (questions) => {
    try {
      const updatedQuiz = {
        ...quizToEdit,
        questions,
      };
      const result = await updateQuiz(quizToEdit._id, updatedQuiz);
      setQuizData(quizData.map(quiz => (quiz._id === quizToEdit._id ? updatedQuiz : quiz)));
      setSendUrlLink(`https://quizze-nine.vercel.app/sharequiz/${result._id}`);
      
      setShowSecondPopup(false);
      setShowFinalLink(true);
      closeModal();
      toast.success('Quiz updated successfully!');
    } catch (error) {
      console.error('Error updating quiz:', error);
      toast.error('Failed to update quiz.');
    }
  };

  const onClose = () => {
    setShowFinalLink(false);
  };

  useEffect(() => {
    fetchQuizData();
  }, [contextQuizData]);

  useEffect(() => {
    setQuizData(contextQuizData);
  }, [contextQuizData]);

  return (
    <>
      <ToastContainer />
      {isLoading ? (
        <div className="flex items-center justify-center min-h-screen">
          <RotatingLines width="100" strokeColor="#3B82F6" />
        </div>
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8 pt-4">
              <h1 className="text-3xl md:text-4xl font-bold text-indigo-700">Quiz Analysis</h1>
              <p className="text-gray-600 mt-2">Manage and analyze your quiz performance</p>
            </div>

            {quizData && quizData.length > 0 ? (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-indigo-600 text-white">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider rounded-tl-xl">S.No</th>
                        <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Quiz Name</th>
                        <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Created on</th>
                        <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Impressions</th>
                        <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
                        <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider rounded-tr-xl">Analysis</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {quizData.map((quiz, index) => (
                        <tr key={quiz._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 max-w-xs truncate">{quiz.title}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(quiz.createdAt)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {quiz.impressions >= 1000 ? (quiz.impressions / 1000).toFixed(1) + 'K' : quiz.impressions}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button 
                                onClick={() => handleEditClick(quiz)}
                                className="p-2 rounded-lg bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition-colors"
                                title="Edit Quiz"
                              >
                                <img src={EditBtn} alt="Edit" className="h-4 w-4" />
                              </button>
                              <button 
                                onClick={() => handleDeleteClick(quiz._id)}
                                className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                                title="Delete Quiz"
                              >
                                <img src={DeletBtn} alt="Delete" className="h-4 w-4" />
                              </button>
                              <button 
                                onClick={() => generateShareLink(quiz._id)}
                                className="p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
                                title="Share Quiz"
                              >
                                <img src={ShareBtn} alt="Share" className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <Link 
                              to={`/questiondetails/${quiz._id}`} 
                              state={{ impressions: quiz.impressions, createdAt: quiz.createdAt, title: quiz.title }}
                              className="text-indigo-600 hover:text-indigo-800 hover:underline font-medium"
                            >
                              View Details
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl shadow-lg">
                <img src={NoData} alt="No quizzes found" className="h-56 mb-6 opacity-80" />
                <h3 className="text-2xl font-medium text-gray-700 mb-2">No Quizzes Found</h3>
                <p className="text-gray-500 text-center max-w-md">
                  You haven't created any quizzes yet. Create your first quiz to see it appear here.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
      
      {isDeleteModal && (
        <ConfirmModal
          isOpen={isDeleteModal}
          onClose={handleCloseModal}
          onConfirm={handleConfirmDelete}
        />
      )}
      
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {showSecondPopup && (
          <QuizPopupTwo
            handleUpdateQuiz={handleUpdateQuiz}
            onClose={closeModal}
            quizQuestions={quizToEdit.questions}
            quizType={quizToEdit.type}
          />
        )}
      </Modal>
      
      {showFinalLink && (
        <ShareModal
          isOpen={showFinalLink}
          onClose={onClose}
          closeShareLinkModal={closeShareLinkModal}
          shareLink={sendUrlLink}
        />
      )}
    </>
  );
};

export default AnalysisPage;
