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




import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Sidebar.module.css';
import QuizPopupOne from '../quizpopupone/QuizPopupOne';
import QuizPopupTwo from '../quizpopuptwo/QuizPopupTwo';
import Modal from '../modal/Modal';
import { createQuiz } from '../../api/quizApi';

const Sidebar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFirstPopup, setShowFirstPopup] = useState(false);
  const [showSecondPopup, setShowSecondPopup] = useState(false);
  const [quizName, setQuizName] = useState('');
  const [quizType, setQuizType] = useState('');
  const [quizQuestions, setQuizQuestions] = useState([]);

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
      console.log(result);
      // handleCancel();
      closeModal()
    } catch (error) {
      console.error('Error creating quiz:', error);
    }
  };



  return (
    <>
      <aside className={styles.sidebar}>
        <div className={styles.logo}><h2>QUIZZIE</h2></div>
        <nav className={styles.sidebarnav}>
          <ul>
            <li>
              <Link to="/" className={styles.link} activeClassName={styles.active}>Dashboard</Link>
            </li>
            <li>
              <Link to="/analytics" className={styles.link} activeClassName={styles.active}>Analytics</Link>
            </li>
            <li>
              <Link className={styles.link} onClick={openModal} activeClassName={styles.active}>Create Quiz</Link>
            </li>
          </ul>
        </nav>
        <div className={styles.logout}>LOGOUT</div>

        <Modal isOpen={isModalOpen} onClose={closeModal}>
          {showFirstPopup && <QuizPopupOne onCancel={closeModal}
           onContinue={(name, type) => handleContinue(name, type)}
            />}

          {showSecondPopup && <QuizPopupTwo onSubmit={handleCreateQuiz} onClose={closeModal} />}
        </Modal>
      </aside>

    </>
  );
};

export default Sidebar;
