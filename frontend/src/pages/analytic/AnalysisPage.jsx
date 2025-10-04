
// import React, { useContext, useEffect, useState } from 'react';
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
// import { RotatingLines } from 'react-loader-spinner';

// const AnalysisPage = () => {
//   const [isLoading, setIsLoading] = useState(true);
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
//       await deleteQuiz(quizToDelete);
//       setQuizData(quizData.filter(quiz => quiz._id !== quizToDelete));
//       setIsDeleteModal(false);
//       toast.success('Quiz deleted successfully!');
//     } catch (error) {
//       console.error('Failed to delete quiz:', error);
//       toast.error('Failed to delete quiz.');
//     }
//   };

//   const closeShareLinkModal = () => {
//     setShowFinalLink(false);
//     closeModal();
//   };

//   const handleCloseModal = () => {
//     setIsDeleteModal(false);
//   };

//   const generateShareLink = (quizId) => {
//     const shareLink = `https://quizze-nine.vercel.app/sharequiz/${quizId}`;
//     if (navigator.clipboard) {
//       navigator.clipboard.writeText(shareLink);
//       toast.success("Link copied to clipboard!");
//     } else {
//       window.open(shareLink, '_blank');
//     }
//   };

//   const formatDate = (dateString) => {
//     const options = { year: 'numeric', month: 'short', day: 'numeric' };
//     return new Date(dateString).toLocaleDateString(undefined, options);
//   };

//   const fetchQuizData = async () => {
//     try {
//       const response = await quizDetails();
//       setQuizData(response.quizzes);

//       const questionsData = {};
//       for (const quiz of response.quizzes) {
//         const quizQuestions = await getDetailsQuestions(quiz._id);
//         questionsData[quiz._id] = quizQuestions;
//       }
//       setQuizQuestions(questionsData);
//     } catch (error) {
//       console.error('Error fetching quizzes:', error);
//     } finally {
//       setIsLoading(false);
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
//       <ToastContainer />
//       {isLoading ? (
//         <div className="flex items-center justify-center min-h-screen">
//           <RotatingLines width="100" strokeColor="#3B82F6" />
//         </div>
//       ) : (
//         <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
//           <div className="max-w-7xl mx-auto">
//             {/* Header */}
//             <div className="text-center mb-8 pt-4">
//               <h1 className="text-3xl md:text-4xl font-bold text-indigo-700">Quiz Analysis</h1>
//               <p className="text-gray-600 mt-2">Manage and analyze your quiz performance</p>
//             </div>

//             {quizData && quizData.length > 0 ? (
//               <div className="bg-white rounded-xl shadow-lg overflow-hidden">
//                 <div className="overflow-x-auto">
//                   <table className="min-w-full divide-y divide-gray-200">
//                     <thead className="bg-indigo-600 text-white">
//                       <tr>
//                         <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider rounded-tl-xl">S.No</th>
//                         <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Quiz Name</th>
//                         <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Created on</th>
//                         <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Impressions</th>
//                         <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
//                         <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider rounded-tr-xl">Analysis</th>
//                       </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-200">
//                       {quizData.map((quiz, index) => (
//                         <tr key={quiz._id} className="hover:bg-gray-50 transition-colors">
//                           <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 max-w-xs truncate">{quiz.title}</td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(quiz.createdAt)}</td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                             <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//                               {quiz.impressions >= 1000 ? (quiz.impressions / 1000).toFixed(1) + 'K' : quiz.impressions}
//                             </span>
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                             <div className="flex items-center space-x-2">
                            
//                               <button 
//                                 onClick={() => handleDeleteClick(quiz._id)}
//                                 className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
//                                 title="Delete Quiz"
//                               >
//                                 <img src={DeletBtn} alt="Delete" className="h-4 w-4" />
//                               </button>
//                               <button 
//                                 onClick={() => generateShareLink(quiz._id)}
//                                 className="p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
//                                 title="Share Quiz"
//                               >
//                                 <img src={ShareBtn} alt="Share" className="h-4 w-4" />
//                               </button>
//                             </div>
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                             <Link 
//                               to={`/questiondetails/${quiz._id}`} 
//                               state={{ impressions: quiz.impressions, createdAt: quiz.createdAt, title: quiz.title }}
//                               className="text-indigo-600 hover:text-indigo-800 hover:underline font-medium"
//                             >
//                               View Details
//                             </Link>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             ) : (
//               <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl shadow-lg">
//                 <img src={NoData} alt="No quizzes found" className="h-56 mb-6 opacity-80" />
//                 <h3 className="text-2xl font-medium text-gray-700 mb-2">No Quizzes Found</h3>
//                 <p className="text-gray-500 text-center max-w-md">
//                   You haven't created any quizzes yet. Create your first quiz to see it appear here.
//                 </p>
//               </div>
//             )}
//           </div>
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
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');

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

  // Filter and sort quizzes
  const filteredAndSortedQuizzes = quizData
    .filter(quiz => 
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'impressions_high':
          return b.impressions - a.impressions;
        case 'impressions_low':
          return a.impressions - b.impressions;
        case 'name':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

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
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
          <RotatingLines width="80" strokeColor="#3B82F6" />
          <p className="mt-4 text-gray-600 font-medium">Loading your quizzes...</p>
        </div>
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Enhanced Header */}
            <div className="text-center mb-8 pt-4">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
                Quiz Analytics
              </h1>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Track performance, manage quizzes, and gain insights into your audience engagement
              </p>
            </div>

            {/* Stats Overview */}
            {quizData.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-center">
                    <div className="p-3 bg-blue-100 rounded-lg mr-4">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-800">{quizData.length}</p>
                      <p className="text-gray-600 text-sm">Total Quizzes</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-center">
                    <div className="p-3 bg-green-100 rounded-lg mr-4">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-800">
                        {quizData.reduce((sum, quiz) => sum + quiz.impressions, 0).toLocaleString()}
                      </p>
                      <p className="text-gray-600 text-sm">Total Impressions</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-center">
                    <div className="p-3 bg-purple-100 rounded-lg mr-4">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-800">
                        {Math.round(quizData.reduce((sum, quiz) => sum + quiz.impressions, 0) / quizData.length) || 0}
                      </p>
                      <p className="text-gray-600 text-sm">Avg. Impressions</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-center">
                    <div className="p-3 bg-orange-100 rounded-lg mr-4">
                      <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-800">
                        {new Set(quizData.map(quiz => new Date(quiz.createdAt).toDateString())).size}
                      </p>
                      <p className="text-gray-600 text-sm">Active Days</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Search and Filter Bar */}
            {quizData.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                  <div className="flex-1 w-full md:max-w-md">
                    <div className="relative">
                      <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <input
                        type="text"
                        placeholder="Search quizzes by name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-4 w-full md:w-auto">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="impressions_high">Impressions: High to Low</option>
                      <option value="impressions_low">Impressions: Low to High</option>
                      <option value="name">Name: A to Z</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Quizzes Table */}
            {filteredAndSortedQuizzes.length > 0 ? (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-indigo-600 to-purple-600">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider rounded-tl-xl">#</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Quiz Name</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Created Date</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Impressions</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Actions</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider rounded-tr-xl">Analysis</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {filteredAndSortedQuizzes.map((quiz, index) => (
                        <tr key={quiz._id} className="hover:bg-gray-50 transition-colors group">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900 bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center">
                              {index + 1}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-semibold text-gray-900 max-w-xs truncate" title={quiz.title}>
                              {quiz.title}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-full">
                              {formatDate(quiz.createdAt)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                quiz.impressions >= 1000 
                                  ? 'bg-green-100 text-green-800'
                                  : quiz.impressions >= 500
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                {quiz.impressions >= 1000 ? (quiz.impressions / 1000).toFixed(1) + 'K' : quiz.impressions}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <button 
                                onClick={() => handleEditClick(quiz)}
                                className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all transform hover:scale-110 group relative"
                                title="Edit Quiz"
                              >
                                <img src={EditBtn} alt="Edit" className="h-4 w-4" />
                                <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  Edit
                                </span>
                              </button>
                              <button 
                                onClick={() => handleDeleteClick(quiz._id)}
                                className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-all transform hover:scale-110 group relative"
                                title="Delete Quiz"
                              >
                                <img src={DeletBtn} alt="Delete" className="h-4 w-4" />
                                <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  Delete
                                </span>
                              </button>
                              <button 
                                onClick={() => generateShareLink(quiz._id)}
                                className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-all transform hover:scale-110 group relative"
                                title="Share Quiz"
                              >
                                <img src={ShareBtn} alt="Share" className="h-4 w-4" />
                                <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  Share
                                </span>
                              </button>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Link 
                              to={`/questiondetails/${quiz._id}`} 
                              state={{ impressions: quiz.impressions, createdAt: quiz.createdAt, title: quiz.title }}
                              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors transform hover:scale-105"
                            >
                              View Analytics
                              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl shadow-lg border border-gray-100">
                <img src={NoData} alt="No quizzes found" className="h-48 mb-6 opacity-70" />
                <h3 className="text-2xl font-semibold text-gray-700 mb-3">No Quizzes Found</h3>
                <p className="text-gray-500 text-center max-w-md mb-6">
                  {searchTerm ? 'No quizzes match your search criteria.' : 'You haven\'t created any quizzes yet.'}
                </p>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Clear Search
                  </button>
                )}
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