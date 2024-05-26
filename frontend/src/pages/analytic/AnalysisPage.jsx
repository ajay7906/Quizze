// import React, { useContext, useEffect, useState } from 'react';
// import styles from './AnalysisPage.module.css';
// import { deleteQuiz, quizDetails } from '../../api/quizApi';
// import ShareBtn from '../../assets/share.png';
// import EditBtn from '../../assets/edit.png';
// import { Link } from 'react-router-dom'
// import DeletBtn from '../../assets/delete.png'
// import { toast } from 'react-toastify';
// import ConfirmModal from '../../components/confirmdeletmodal/ConfirmModal';
// import AuthContext from '../../context/AuthContext';
// import Modal from '../../components/modal/Modal';
// import QuizPopupOne from '../../components/quizpopupone/QuizPopupOne';
// const AnalysisPage = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [quizToDelete, setQuizToDelete] = useState(null);
//   const [quizData, setQuizData] = useState();
//   const { quizData: contextQuizData } = useContext(AuthContext);
//   const [quizToEdit, setQuizToEdit] = useState(null); 
//   const [showFirstPopup, setShowFirstPopup] = useState(false);
//   const [showSecondPopup, setShowSecondPopup] = useState(false);
//   const [showFinalLink, setShowFinalLink] = useState(false)


//   const closeModal = () => {
//     setIsModalOpen(false);
//     setShowFirstPopup(false);
//     setShowSecondPopup(false);


//   };

//   const handleDeleteClick = (quizId) => {
//     setQuizToDelete(quizId);
//     setIsModalOpen(true);
//   };

//   const handleConfirmDelete = async () => {
//     // Handle the delete action here
//     try {
//       await deleteQuiz(quizToDelete);
//       setQuizData(quizData.filter(quiz => quiz._id !== quizToDelete));
//       setIsModalOpen(false);
//     } catch (error) {
//       console.error('Failed to delete quiz:', error);
//     }
//     console.log('Item deleted');
//     setIsModalOpen(false);
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//   };

//   //gererate share link

//   const generateShareLink = (quizId) => {

//     const shareLink = `http://localhost:5173/sharequiz/${quizId}`;


//     if (navigator.clipboard) {
//       const link = navigator.clipboard.writeText(shareLink);
//       toast.success("Copy Successfully");

//     } else {
//       window.open(shareLink, '_blank');
//     }
//   };


//   //fetch data 
//   const fetchQuizData = async () => {
//     try {
//       const responce = await quizDetails();
//       console.log(responce.quizzes);
//       setQuizData(responce.quizzes)
//       console.log(quizData);
//     } catch (error) {
//       return error
//     }
//   }
//   const handleEditClick = (quiz) => {
//     console.log(quiz);
//     setQuizToEdit(quiz);
//     setShowFirstPopup(true);
//   };

//   useEffect(() => {
//     fetchQuizData()

//   }, [contextQuizData])

//   useEffect(() => {
//     setQuizData(contextQuizData);
//   }, [contextQuizData]);
//   return (
//     <>
//       {
//         quizData !== null ?
//           <div className={styles.container}>
//             <h1 className={styles.title}>Quiz Analysis</h1>
//             <div className={styles.tableContainer}>
//               <table className={styles.table}>
//                 <thead className={styles.tableheading}>
//                   <tr >
//                     <th>S.No</th>
//                     <th>Quiz Name</th>
//                     <th>Created on</th>
//                     <th>Impression</th>
//                     <th></th>
//                     <th></th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {quizData?.map((quiz, index) => (
//                     <tr key={quiz._id}>
//                       <td>{index + 1}</td>
//                       <td>{quiz?.title}</td>
//                       <td>{quiz?.createdAt}</td>
//                       <td>{quiz?.impressions}</td>
//                       <td className={styles.actionBtn}>
//                         <button className={styles.editButton}><img onClick={() => handleEditClick(quiz)} src={EditBtn} alt="" /></button>
//                         <button className={styles.deleteButton}><img onClick={() => handleDeleteClick(quiz._id)} src={DeletBtn} alt="" /></button>
//                         <button className={styles.shareButton}><img src={ShareBtn} onClick={() => generateShareLink(quiz._id)} alt="" /></button>
//                       </td>
//                       {/* <td><a href="#" className={styles.analysisLink}>Question Wise Analysis</a></td> */}
//                       <td><Link to={`/questiondetails/${quiz._id}`} className={styles.analysisLink}>Question Wise Analysis</Link></td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div> :
//           <>
//             <h1>Data not found</h1>
//           </>
//       }
//       {
//         isModalOpen &&
//         <ConfirmModal
//           isOpen={isModalOpen}
//           onClose={handleCloseModal}
//           onConfirm={handleConfirmDelete}
//         />
//       }

//       {isModalOpen && (
//         <ConfirmModal
//           isOpen={isModalOpen}
//           onClose={handleCloseModal}
//           onConfirm={handleConfirmDelete}
//         />
//       )}
//       {showFirstPopup && (
//         <Modal isOpen={showFirstPopup} onClose={() => setShowFirstPopup(false)}>
//           <QuizPopupOne quiz={quizToEdit} onCancel={() => setShowFirstPopup(false)} />
//         </Modal>
//       )}
//        {showSecondPopup && (
//         <Modal isOpen={showFirstPopup} onClose={() => setShowSecondPopup(false)}>
//           <QuizPopupOne quiz={quizToEdit} onCancel={() => setShowSecondPopup(false)} />
//         </Modal>
//       )}
//     </>
//   );
// };

// export default AnalysisPage;
















import React, { useContext, useEffect, useState } from 'react';
import styles from './AnalysisPage.module.css';
import { deleteQuiz, getDetailsQuestions, quizDetails, updateQuiz } from '../../api/quizApi'; // Ensure you have an updateQuiz function in your API
import ShareBtn from '../../assets/share.png';
import EditBtn from '../../assets/edit.png';
import { Link } from 'react-router-dom';
import DeletBtn from '../../assets/delete.png';
import { toast } from 'react-toastify';
import ConfirmModal from '../../components/confirmdeletmodal/ConfirmModal';
import AuthContext from '../../context/AuthContext';
import Modal from '../../components/modal/Modal';
import QuizPopupOne from '../../components/quizpopupone/QuizPopupOne';
import QuizPopupTwo from '../../components/quizpopuptwo/QuizPopupTwo';
import ShareModal from '../../components/sharemodal/ShareModal';

const AnalysisPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState(null);
  const [quizData, setQuizData] = useState([]);
  const { quizData: contextQuizData } = useContext(AuthContext);
  const [quizToEdit, setQuizToEdit] = useState(null);
  const [showFirstPopup, setShowFirstPopup] = useState(false);
  const [showSecondPopup, setShowSecondPopup] = useState(false);
  const [showFinalLink, setShowFinalLink] = useState(false);
  const [sendUrlLink, setSendUrlLink] = useState('');
  const [quizQuestions, setQuizQuestions] = useState();
  const [isDeleteModal, setIsDeleteModal] = useState(false);


  const openModal = () => {
    setIsModalOpen(true);
    setShowFirstPopup(true);
    setShowSecondPopup(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setShowFirstPopup(false);
    setShowSecondPopup(false);
    setShowFinalLink(false);
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
    } catch (error) {
      console.error('Failed to delete quiz:', error);
    }
  };

  const handleCloseModal = () => {
    setIsDeleteModal(false);
  };

  const generateShareLink = (quizId) => {
    const shareLink = `http://localhost:5173/sharequiz/${quizId}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareLink);
      toast.success("Copied Successfully");
    } else {
      window.open(shareLink, '_blank');
    }
  };

  const fetchQuizData = async () => {
    try {
      const response = await quizDetails();
      setQuizData(response.quizzes);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    }
  };


  const fetchQuizQuestions = async (quizId) => {
   
    try {
      const response = await getDetailsQuestions(quizId);
      console.log(response);
      setQuizQuestions(response)
    } catch (error) {
      console.error('Error fetching quiz questions:', error);
      return [];
    }
  };
  console.log(quizToEdit);
  const handleEditClick =  (quiz) => {
    setQuizToEdit(quiz);
    // const questions = await fetchQuizQuestions(quiz._id);
    fetchQuizQuestions(quiz._id)
    setShowFirstPopup(true);
   
   
  };

  const handleContinue = (name, type) => {
    setShowFirstPopup(false);
    setShowSecondPopup(true);
    setQuizToEdit(prevQuiz => ({
      ...prevQuiz,
      title: name,
      type: type
    }));
  };

  const handleUpdateQuiz = async (questions) => {
    console.log('Kuch Nahi');
    try {
      const updatedQuiz = {
        ...quizToEdit,
        questions,
      };
      const result = await updateQuiz(quizToEdit._id, updatedQuiz);
      setQuizData(quizData.map(quiz => (quiz._id === quizToEdit._id ? updatedQuiz : quiz)));
      setSendUrlLink(`http://localhost:5173/sharequiz/${result._id}`);
      setShowFinalLink(true);
      setShowSecondPopup(false);
      toast.success('Quiz updated successfully!');
    } catch (error) {
      console.error('Error updating quiz:', error);
      toast.error('Failed to update quiz.');
    }
  };



  const closeShareLinkModal = () => {
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
      {quizData && quizData.length > 0 ? (
        <div className={styles.container}>
          <h1 className={styles.title}>Quiz Analysis</h1>
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
                    <td>{quiz.impressions}</td>
                    <td className={styles.actionBtn}>
                      <button className={styles.editButton}><img onClick={() => { handleEditClick(quiz); openModal() }} src={EditBtn} alt="Edit" /></button>
                      <button className={styles.deleteButton}><img onClick={() => handleDeleteClick(quiz._id)} src={DeletBtn} alt="Delete" /></button>
                      <button className={styles.shareButton}><img src={ShareBtn} onClick={() => generateShareLink(quiz._id)} alt="Share" /></button>
                    </td>
                    <td><Link to={`/questiondetails/${quiz._id}`} className={styles.analysisLink}>Question Wise Analysis</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <h1>Data not found</h1>
      )}
      {isDeleteModal && (
        <ConfirmModal
          isOpen={isDeleteModal}
          onClose={handleCloseModal}
          onConfirm={handleConfirmDelete}
        />
      )}
      {/* {showFirstPopup && (
        <Modal isOpen={showFirstPopup} onClose={() => setShowFirstPopup(false)}>
          <QuizPopupOne
            quiz={quizToEdit}
            onCancel={() => setShowFirstPopup(false)}
            onContinue={(name, type) => handleContinue(name, type)}
          />
        </Modal>
      )}
      {showSecondPopup && (
        <Modal isOpen={showSecondPopup} onClose={() => setShowSecondPopup(false)}>
          <QuizPopupTwo
            quiz={quizToEdit}
            onCancel={() => setShowSecondPopup(false)}
            onUpdate={handleUpdateQuiz}
          />
        </Modal>
      )} */}

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {showFirstPopup && <QuizPopupOne onCancel={closeModal}
          onContinue={(name, type) => handleContinue(name, type)}
          quizToEdit={quizToEdit}
        />}

        {showSecondPopup && <QuizPopupTwo
          handleUpdateQuiz={handleUpdateQuiz}
          onClose={closeModal}
          quizQuestions={quizQuestions}
        />}

      </Modal>



      {showFinalLink && (
        <ShareModal
          isOpen={showFinalLink}
          onClose={closeShareLinkModal}
          shareLink={sendUrlLink}
        />
      )}
    </>
  );
};

export default AnalysisPage;

