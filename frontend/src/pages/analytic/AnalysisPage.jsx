


import React, { useContext, useEffect, useState } from 'react';
import styles from './AnalysisPage.module.css';
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
import { RotatingLines } from 'react-loader-spinner'; // Import the spinner

const AnalysisPage = () => {
  const [isLoading, setIsLoading] = useState(true); // State to manage loading
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
      // delete quiz
      await deleteQuiz(quizToDelete);
      setQuizData(quizData.filter(quiz => quiz._id !== quizToDelete));
      setIsDeleteModal(false);
    } catch (error) {
      console.error('Failed to delete quiz:', error);
    }
  };

  const closeShareLinkModal = ()=>{
    setShowFinalLink(false)
    closeModal()
  }

  const handleCloseModal = () => {
    setIsDeleteModal(false);
  };

  // generate link function
  const generateShareLink = (quizId) => {
    const shareLink = `https://quizze-nine.vercel.app/sharequiz/${quizId}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareLink);
      console.log('Link copied to clipboard: ', shareLink);
      toast.success("Copied Successfully");
    } else {
      window.open(shareLink, '_blank');
    }
  };

  const fetchQuizData = async () => {
    try {
      // fetch quiz data
      const response = await quizDetails();
      setQuizData(response.quizzes);

      // Preload all quiz questions data
      const questionsData = {};
      for (const quiz of response.quizzes) {
        const quizQuestions = await getDetailsQuestions(quiz._id);
        questionsData[quiz._id] = quizQuestions;
      }
      setQuizQuestions(questionsData);

    } catch (error) {
      console.error('Error fetching quizzes:', error);
    } finally {
      setIsLoading(false); // Set loading to false when data is fetched
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
      // update quiz function
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
    <ToastContainer toastClassName={styles.customToast}/>
      {isLoading ? (
        <div className={styles.loaderContainer}>
          <RotatingLines width="100" visible={true} />
        </div>
      ) : (
        <div className={styles.container}>
          <h1 className={styles.title}>Quiz Analysis</h1>
          {quizData && quizData.length > 0 ? (
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead className={styles.tableheading}>
                  <tr>
                    <th>S.No</th>
                    <th>Quiz Name</th>
                    <th>Created on</th>
                    <th>Impression</th>
                    <th></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {quizData.map((quiz, index) => (
                    <tr key={quiz._id}>
                      <td>{index + 1}</td>
                      <td>{quiz.title}</td>
                      <td>{quiz.createdAt}</td>
                      <td>{quiz.impressions >= 1000 ? (quiz.impressions / 1000).toFixed(1) + 'K' : quiz.impressions}</td>
                      <td className={styles.actionBtn}>
                        <button className={styles.editButton}><img onClick={() => handleEditClick(quiz)} src={EditBtn} alt="Edit" /></button>
                        <button className={styles.deleteButton}><img onClick={() => handleDeleteClick(quiz._id)} src={DeletBtn} alt="Delete" /></button>
                        <button className={styles.shareButton}><img src={ShareBtn} onClick={() => generateShareLink(quiz._id)} alt="Share" /></button>
                      </td>
                      <td><Link to={`/questiondetails/${quiz._id}`} state={{ impressions: quiz.impressions, createdAt: quiz.createdAt, title: quiz.title }} className={styles.analysisLink}>Question Wise Analysis</Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className={styles.NoBookMark}>
              <p>Quiz not found</p>
              <img src={NoData} alt="" />
            </div>
          )}
        
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



