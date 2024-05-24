import React, { useEffect, useState } from 'react';
import styles from './AnalysisPage.module.css';
import { deleteQuiz, quizDetails } from '../../api/quizApi';
import ShareBtn from '../../assets/share.png';
import EditBtn from '../../assets/edit.png';
import { Link } from 'react-router-dom'
import DeletBtn from '../../assets/delete.png'
import { toast } from 'react-toastify';
import ConfirmModal from '../../components/confirmdeletmodal/ConfirmModal';
const AnalysisPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState(null);
  const [quizData, setQuizData] = useState();

  const handleDeleteClick = (quizId) => {
    setQuizToDelete(quizId);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    // Handle the delete action here
    try {
      await deleteQuiz(quizToDelete);
      setQuizData(quizData.filter(quiz => quiz._id !== quizToDelete));
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to delete quiz:', error);
    }
    console.log('Item deleted');
    setIsModalOpen(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  //gererate share link

  const generateShareLink = (quizId) => {

    const shareLink = `http://localhost:5173/sharequiz/${quizId}`;


    if (navigator.clipboard) {
      const link = navigator.clipboard.writeText(shareLink);
      toast.success("Copy Successfully");

    } else {
      window.open(shareLink, '_blank');
    }
  };


  //fetch data 
  const fetchQuizData = async () => {
    try {
      const responce = await quizDetails();
      console.log(responce.quizzes);
      setQuizData(responce.quizzes)
      console.log(quizData);
    } catch (error) {
      return error
    }
  }
  const data = [
    { id: 1, name: 'Quiz 1', date: '01 Sep, 2023', impressions: '345' },
    { id: 2, name: 'Quiz 2', date: '04 Sep, 2023', impressions: '667' },
    { id: 3, name: 'Quiz 3', date: '06 Sep, 2023', impressions: '1.6K' },
    { id: 4, name: 'Quiz 4', date: '09 Sep, 2023', impressions: '789' },
    { id: 5, name: 'Quiz 5', date: '11 Sep, 2023', impressions: '995' },
    { id: 6, name: 'Quiz 6', date: '13 Sep, 2023', impressions: '2.5K' },
    { id: 7, name: 'Quiz 7', date: '14 Sep, 2023', impressions: '231' },
    { id: 8, name: 'Quiz 8', date: '17 Sep, 2023', impressions: '1.3K' },
  ];
  useEffect(() => {
    fetchQuizData()

  }, [])
  return (
    <>
      {
        quizData !== null ?
          <div className={styles.container}>
            <h1 className={styles.title}>Quiz Analysis</h1>
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead className={styles.tableheading}>
                  <tr >
                    <th>S.No</th>
                    <th>Quiz Name</th>
                    <th>Created on</th>
                    <th>Impression</th>
                    <th></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {quizData?.map((quiz, index) => (
                    <tr key={quiz._id}>
                      <td>{index + 1}</td>
                      <td>{quiz?.title}</td>
                      <td>{quiz?.createdAt}</td>
                      <td>{quiz?.impressions}</td>
                      <td className={styles.actionBtn}>
                        <button className={styles.editButton}><img src={EditBtn} alt="" /></button>
                        <button className={styles.deleteButton}><img onClick={() => handleDeleteClick(quiz._id)} src={DeletBtn} alt="" /></button>
                        <button className={styles.shareButton}><img src={ShareBtn} onClick={() => generateShareLink(quiz._id)} alt="" /></button>
                      </td>
                      {/* <td><a href="#" className={styles.analysisLink}>Question Wise Analysis</a></td> */}
                      <td><Link to={`/questiondetails/${quiz._id}`} className={styles.analysisLink}>Question Wise Analysis</Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div> :
          <>
            <h1>Data not found</h1>
          </>
      }
      {
        isModalOpen &&
        <ConfirmModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onConfirm={handleConfirmDelete}
        />
      }
    </>
  );
};

export default AnalysisPage;
