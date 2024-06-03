



import React, { useContext, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import styles from './Sidebar.module.css';
import QuizPopupOne from '../quizpopupone/QuizPopupOne';
import QuizPopupTwo from '../quizpopuptwo/QuizPopupTwo';
import Modal from '../modal/Modal';
import { createQuiz } from '../../api/quizApi';
import ShareModal from '../sharemodal/ShareModal';
import AuthContext from '../../context/AuthContext';

const Sidebar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFirstPopup, setShowFirstPopup] = useState(false);
  const [showSecondPopup, setShowSecondPopup] = useState(false);
  const [showFinalLink, setShowFinalLink] = useState(false)
  const [quizName, setQuizName] = useState('');
  const [quizType, setQuizType] = useState('');
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [sendUrlLink, setSendUrlLink]  = useState()
  const { logout ,addQuiz } = useContext(AuthContext);
  const navigate = useNavigate();

  const openModal = () => {
    setIsModalOpen(true);
    setShowFirstPopup(true);
    setShowSecondPopup(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setShowFirstPopup(false);
    setShowSecondPopup(false);
    setQuizName('');
    setQuizType(' ');
    setQuizQuestions([]);
    
  };
  const closeShareLinkModal = ()=>{
    setShowFinalLink(false)
    closeModal()
  }

  const handleContinue = (name, type) => {
    setShowFirstPopup(false);
    setShowSecondPopup(true);setQuizName(name);
    setQuizType(type);
  };

  
  const handleCreateQuiz = async (questions) => {
    const quizData = {
      title: quizName,
      type: quizType,
      questions,
    };

    try {
      //create quiz 
      const result = await createQuiz(quizData);
      
    
      setSendUrlLink(`https://quizze-nine.vercel.app/sharequiz/${result?._id}`)
      setShowFinalLink(true)
      addQuiz(result);
      
    
    } catch (error) {
      console.error('Error creating quiz:', error);
    }
  };


  const handleLogout = () => {
    
    logout()
    navigate('/register'); // Navigate to the login page
  };


  return (
    <>
      <aside className={styles.sidebar}>
        <div className={styles.logo}><h2>QUIZZIE</h2></div>
        <nav className={styles.sidebarnav}>
          <ul>
            <li>
            
              <NavLink 
                to="/" 
                className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}
              >
                Dashboard
              </NavLink> 


            </li>
            <li>
           
              <NavLink 
                to="/analytics" 
                className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}
              >
                Analytics
              </NavLink>
            </li>
            <li>
              <NavLink className={styles.link} onClick={openModal} activeClassName={styles.active}>Create Quiz</NavLink>
            </li>
          </ul>
        </nav>
        <div className={styles.logout} onClick={handleLogout}>LOGOUT</div>

        <Modal isOpen={isModalOpen} onClose={closeModal}>
          {showFirstPopup && <QuizPopupOne onCancel={closeModal}
           onContinue={(name, type) => handleContinue(name, type)}
            />}

          {showSecondPopup && <QuizPopupTwo onSubmit={handleCreateQuiz} quizType={quizType} onClose={closeModal} />}
         
        </Modal>
      
      </aside>
      {showFinalLink && <ShareModal 
       closeShareLinkModal={closeShareLinkModal} 
       onClose={closeModal}
       sendUrlLink={sendUrlLink}/>}

    </>
  );
};

export default Sidebar;
