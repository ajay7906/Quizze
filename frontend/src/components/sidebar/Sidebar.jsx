



// import React, { useContext, useState } from 'react';
// import { Link, NavLink, useNavigate } from 'react-router-dom';
// import styles from './Sidebar.module.css';
// import QuizPopupOne from '../quizpopupone/QuizPopupOne';
// import QuizPopupTwo from '../quizpopuptwo/QuizPopupTwo';
// import Modal from '../modal/Modal';
// import { createQuiz } from '../../api/quizApi';
// import ShareModal from '../sharemodal/ShareModal';
// import AuthContext from '../../context/AuthContext';

// const Sidebar = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [showFirstPopup, setShowFirstPopup] = useState(false);
//   const [showSecondPopup, setShowSecondPopup] = useState(false);
//   const [showFinalLink, setShowFinalLink] = useState(false)
//   const [quizName, setQuizName] = useState('');
//   const [quizType, setQuizType] = useState('');
//   const [quizQuestions, setQuizQuestions] = useState([]);
//   const [sendUrlLink, setSendUrlLink]  = useState()
//   const { logout ,addQuiz } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const openModal = () => {
//     setIsModalOpen(true);
//     setShowFirstPopup(true);
//     setShowSecondPopup(false);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setShowFirstPopup(false);
//     setShowSecondPopup(false);
//     setQuizName('');
//     setQuizType(' ');
//     setQuizQuestions([]);
    
//   };
//   const closeShareLinkModal = ()=>{
//     setShowFinalLink(false)
//     closeModal()
//   }

//   const handleContinue = (name, type) => {
//     setShowFirstPopup(false);
//     setShowSecondPopup(true);setQuizName(name);
//     setQuizType(type);
//   };

  
//   const handleCreateQuiz = async (questions) => {
//     const quizData = {
//       title: quizName,
//       type: quizType,
//       questions,
//     };

//     try {
//       //create quiz 
//       const result = await createQuiz(quizData);
      
    
//       setSendUrlLink(`https://quizze-nine.vercel.app/sharequiz/${result?._id}`)
//       setShowFinalLink(true)
//       addQuiz(result);
      
    
//     } catch (error) {
//       console.error('Error creating quiz:', error);
//     }
//   };


//   const handleLogout = () => {
    
//     logout()
//     navigate('/register'); // Navigate to the login page
//   };


//   return (
//     <>
//       <aside className={styles.sidebar}>
//         <div className={styles.logo}><h2>QUIZZIE</h2></div>
//         <nav className={styles.sidebarnav}>
//           <ul>
//             <li>
            
//               <NavLink 
//                 to="/" 
//                 className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}
//               >
//                 Dashboard
//               </NavLink> 


//             </li>
//             <li>
           
//               <NavLink 
//                 to="/analytics" 
//                 className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}
//               >
//                 Analytics
//               </NavLink>
//             </li>
//             <li>
//               <NavLink 
//                 to="/practice" 
//                 className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}
//               >
//                 Practice with AI
//               </NavLink>
//             </li>
//             <li>
//               <NavLink className={styles.link} onClick={openModal} activeClassName={styles.active}>Create Quiz</NavLink>
//             </li>
//           </ul>
//         </nav>
//         <div className={styles.logout} onClick={handleLogout}>LOGOUT</div>

//         <Modal isOpen={isModalOpen} onClose={closeModal}>
//           {showFirstPopup && <QuizPopupOne onCancel={closeModal}
//            onContinue={(name, type) => handleContinue(name, type)}
//             />}

//           {showSecondPopup && <QuizPopupTwo onSubmit={handleCreateQuiz} quizType={quizType} onClose={closeModal} />}
         
//         </Modal>
      
//       </aside>
//       {showFinalLink && <ShareModal 
//        closeShareLinkModal={closeShareLinkModal} 
//        onClose={closeModal}
//        sendUrlLink={sendUrlLink}/>}

//     </>
//   );
// };

// export default Sidebar;







import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

const Sidebar = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout()
    navigate('/register');
  };

  return (
    <>
      <aside className="w-72 bg-white p-6 shadow-lg flex flex-col justify-between h-screen border-r border-gray-200">
        {/* Logo Section */}
        <div className="flex flex-col items-center">
          <h2 className="font-jomhuria text-7xl text-gray-800 mb-2">QUIZZIE</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full mb-8"></div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 w-full">
          <ul className="space-y-6">
            <li>
              <NavLink 
                to="/" 
                className={({ isActive }) => 
                  `flex items-center p-3 rounded-xl transition-all duration-200 font-medium text-lg
                  ${isActive 
                    ? 'bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 shadow-md border border-purple-200' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'}`
                }
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/analytics" 
                className={({ isActive }) => 
                  `flex items-center p-3 rounded-xl transition-all duration-200 font-medium text-lg
                  ${isActive 
                    ? 'bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 shadow-md border border-purple-200' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'}`
                }
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Analytics
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/practice" 
                className={({ isActive }) => 
                  `flex items-center p-3 rounded-xl transition-all duration-200 font-medium text-lg
                  ${isActive 
                    ? 'bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 shadow-md border border-purple-200' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'}`
                }
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Practice with AI
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/create-quiz" 
                className={({ isActive }) => 
                  `flex items-center p-3 rounded-xl transition-all duration-200 font-medium text-lg
                  ${isActive 
                    ? 'bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 shadow-md border border-purple-200' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'}`
                }
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Quiz
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* Logout Section */}
        <div className="pt-6 border-t border-gray-300 mt-auto">
          <button 
            onClick={handleLogout}
            className="flex items-center justify-center w-full p-3 text-gray-700 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-200 hover:text-red-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            LOGOUT
          </button>
        </div>

      </aside>
    </>
  );
};

export default Sidebar;