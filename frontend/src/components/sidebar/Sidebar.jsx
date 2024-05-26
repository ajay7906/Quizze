// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import styles from './Sidebar.module.css';
// import QuizPopupOne from '../quizpopupone/QuizPopupOne';
// import QuizPopupTwo from '../quizpopuptwo/QuizPopupTwo';
// import Modal from '../modal/Modal';

// const Sidebar = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [secondPopups, setSecondPopups] = useState(false)
//   const openModal = () => setIsModalOpen(true);
//   const closeModal = () => setIsModalOpen(false);
//   const continueButton = ()=>{
//     setIsModalOpen(false)
//     setSecondPopups(true)
//   }
//   return (
//     <>
//     <aside className={styles.sidebar}>
//       <div className={styles.logo}><h2>QUIZZIE</h2></div>
//       <nav className={styles.sidebarnav}>
//         <ul>
//           <li>
//             <Link to="/" className={styles.link} activeClassName={styles.active}>Dashboard</Link>
//           </li>
//           <li>
//             <Link to="/analytics" className={styles.link} activeClassName={styles.active}>Analytics</Link>
//           </li>
//           <li>
//             <Link  className={styles.link} onClick={openModal} activeClassName={styles.active}>Create Quiz</Link>
//           </li>
//         </ul>
//       </nav>
//       <div className={styles.logout}>LOGOUT</div>
//       {/* {showFirstPopup && <QuizPopupOne onContinue={handleContinueClick} />} */}
//       <Modal isOpen={isModalOpen} onClose={closeModal}>
//           <QuizPopupOne onCancel={closeModal} onContinue={continueButton} />
//           {secondPopups && <QuizPopupTwo />}
//         </Modal>

//     </aside>

//     </>
//   );
// };

// export default Sidebar;




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
      const result = await createQuiz(quizData);
      console.log('Quiz created successfully:', quizData);
      //const baseUrlLink = `http://localhost:5173/sharequiz/${result?._id}`
      setSendUrlLink(`http://localhost:5173/sharequiz/${result?._id}`)
      setShowFinalLink(true)
      addQuiz(result);
      console.log(result);
      // handleCancel();
      closeModal()
    } catch (error) {
      console.error('Error creating quiz:', error);
    }
  };


  const handleLogout = () => {
    // localStorage.removeItem('jwttokenuser'); // Remove the token from local storage
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
              {/* <NavLink to="/" className={styles.link} activeClassName={styles.active}>Dashboard</NavLink> */}
              <NavLink 
                to="/" 
                className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}
              >
                Dashboard
              </NavLink> 


            </li>
            <li>
              {/* <NavLink to="/analytics" className={styles.link} activeClassName={styles.active}>Analytics</NavLink> */}
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
      {showFinalLink && <ShareModal closeShareLinkModal={closeShareLinkModal} sendUrlLink={sendUrlLink}/>}

    </>
  );
};

export default Sidebar;
